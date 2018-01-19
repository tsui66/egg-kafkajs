'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const Promise = require('bluebird');
const EventEmitter = require('events');
const awaitEvent = require('await-event');
const kafkaLogging = require('kafka-node/logging');
const { Producer, ConsumerGroup } = require('kafka-node');

const Message = require('./lib/message');
const Client = require('./lib/client');


module.exports = app => {
  const logger = app.getLogger('kafkaLogger');
  kafkaLogging.setLoggerProvider(logger);

  const { sub, pub } = app.config.kafkajs;
  const consumerMap = new Map();
  const topic2Subscription = new Map();

  const kafkaClient = Client(app.config.kafkajs.host);
  let appReady = false;

  app.ready(() => {
    appReady = true;
  });

  const heartEvent = new EventEmitter();
  heartEvent.await = awaitEvent;

  function errorHandler(err) {
    // 应用启动前避免错误输出到标准输出
    if (appReady) {
      app.coreLogger.error(err);
    } else {
      app.coreLogger.warn(err);
    }
  }

  for (const options of sub) {
    const topics = options.topics || [];
    let defaultOptions = {
      host: app.config.kafkajs.host,  // zookeeper host omit if connecting directly to broker (see kafkaHost below)
      // kafkaHost: 'broker:9092', // connect directly to kafka broker (instantiates a KafkaClient)
      // zk : kafkaClient,   // put client zk settings if you need them (see Client)
      // batch: undefined, // put client batch settings if you need them (see Client)
      // ssl: true, // optional (defaults to false) or tls options hash
      groupId: options.groupId,
      sessionTimeout: 15000,
      // An array of partition assignment protocols ordered by preference.
      // 'roundrobin' or 'range' string for built ins (see below to pass in custom assignment protocol)
      protocol: ['roundrobin'],

      // Offsets to use for new groups other options could be 'earliest' or 'none' (none will emit an error if no offsets were saved)
      // equivalent to Java client's auto.offset.reset
      fromOffset: 'latest', // default

      // how to recover from OutOfRangeOffset error (where save offset is past server retention) accepts same value as fromOffset
      outOfRangeOffset: 'earliest', // default
      migrateHLC: false,    // for details please see Migration section below
      migrateRolling: true,
      encoding: 'buffer', //trans binary data
      keyEncoding: 'utf8'
    };
    const consumer = new ConsumerGroup(defaultOptions, topics);

    consumer.on('error', errorHandler);
    consumer.on('connect', () => {
      heartEvent.emit(`${options.groupId}.consumerConnected`);
    });

    app.beforeStart(function* () {
      yield heartEvent.await(`${options.groupId}.consumerConnected`);
      app.coreLogger.info('[egg-kafkajs] consumer: %s is ready', options.groupId);
    });
    app.beforeClose(function* () {
      consumer.close(true, function (error) {
        app.coreLogger.info('[egg-kafkajs] consumer: %s is closed', options.groupId);
      });
    });

    for (let topic of topics) {
      const filepath = path.join(app.config.baseDir, 'app/kafka', topic + '_consumer.js');
      if (!fs.existsSync(filepath)) {
        app.coreLogger.warn('[egg-kafkajs] CANNOT find the subscription logic in file:`%s` for topic=%s', filepath, topic);
        continue;
      } else {
        const Subscriber = require(filepath);
        topic2Subscription.set(topic, Subscriber);
      }
    }

    consumer.on('message', function (message) {
      let { topic, key } = message;
      const filepath = path.join(app.config.baseDir, 'app/kafka', topic + '_consume.js');

      if (!fs.existsSync(filepath)) {
        app.coreLogger.warn('[egg-kafkajs] CANNOT find the subscription logic in file:`%s` for topic=%s', filepath, topic);
      }
      const Subscriber = topic2Subscription.get(topic);

      const ctx = app.createAnonymousContext();
      const subscriber = new Subscriber(ctx);
      subscriber.subscribe(message);
    });
  }

  const ProducerPrototype = new Producer(kafkaClient);
  const  producer = Promise.promisifyAll(ProducerPrototype);

  producer.onAsync('ready').then(function() {
    heartEvent.emit('producerConnected');
  });  
  producer.onAsync('error', errorHandler);

  app.beforeStart(function* () {
    app.coreLogger.info('[egg-kafkajs] starting...');
    yield heartEvent.await('producerConnected');
    app.coreLogger.info('[egg-kafkajs] producer: %s is ready', 'producer');
  });

  app.kafka = {
    consumerMap,
    Message: Message(app),
    async send(msg) {
      return await producer.sendAsync(msg);
    },
  };
};
