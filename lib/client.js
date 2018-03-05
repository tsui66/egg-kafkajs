'use strict';

const kafka = require('kafka-node');

/**
 * Kafka Client
 * @param {string} connectionString: Zookeeper connection string, default localhost:2181/
 * @param {Object} clientId: This is a user-supplied identifier for the client application, default kafka-node-client
 * @param {Object} zkOptions: Object, Zookeeper options, see node-zookeeper-client
 * @param {Object} noAckBatchOptions: Object, when requireAcks is disabled on Producer side we can define the batch properties, 'noAckBatchSize' in bytes and 'noAckBatchAge' in milliseconds. The default value is { noAckBatchSize: null, noAckBatchAge: null } and it acts as if there was no batch
 * @param {Object} sslOptions: Object, options to be passed to the tls broker sockets, ex. { rejectUnauthorized: false } (Kafka +0.9)
 * @return {Object} kafka Client instance
 */
module.exports = function(...args) {
  return new kafka.KafkaClient(...args);
};
