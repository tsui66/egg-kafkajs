'use strict';

module.exports = appInfo => {
  const config = {};

  config.keys = appInfo.name;
  config.kafkajs = {
    host: '127.0.0.1:2181',
    sub: [
      {
        groupId: 'consumer-topic',
        topics: [
  
        ],
      },
    ],
    pub:
      {
        key: 'test',
        topics: [],
        // Configuration for when to consider a message as acknowledged, default 1
        requireAcks: 1,
        // The amount of time in milliseconds to wait for all acks before considered, default 100ms
        ackTimeoutMs: 1000,
        // Partitioner type (default = 0, random = 1, cyclic = 2, keyed = 3, custom = 4), default 0
        partitionerType: 2,
        partition: 0,
        attributes: 0,
      },
  };

  return config;
}