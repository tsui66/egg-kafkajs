'use strict';

const assert = require('assert');

module.exports = app => {
  return function(topic, key, messages, timestamp) {
    assert(topic, '[egg-kafkajs] no topic specify');
    const now = timestamp || Date.now();
     return {
      topic,
      messages, // multi messages should be a array, single message can be just a string or a KeyedMessage instance
      key, // only needed when using keyed partitioner
      partition: app.config.partition, // default 0
      attributes: app.config.attributes, // default: 0
      timestamp: now, // <-- defaults to Date.now() (only available with kafka v0.10 and KafkaClient only)
   };
  };
};