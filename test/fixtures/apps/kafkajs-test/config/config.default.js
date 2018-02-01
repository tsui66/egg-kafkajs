'use strict';

/**
 * egg-kafkajs default config
 * @member Config#kafkajs
 * @property {String} SOME_KEY - some description
 */
exports.keys = '_lssfsfsfs';
exports.kafkajs = {
  host: '10.160.6.222:12181',
  encoding: 'buffer', // trans binary data
  keyEncoding: 'utf8',
  sub: [
    {
      groupId: 'consumer-topic1',
      topics: [
        'topic1',
      ],
      'topic1-KEYS': [
        'key1'
      ]
    },
  ],
  pub:
  {
    topics: [
      'topic1',
    ],
    partition: 0,
    attributes: 0,
  },
  env: 'development',
  avroSchema: {
    namespace: 'com.ecarx.protocol.model',
    type: 'record',
    name: 'S2sMessage',
    fields: [
        { name: 'env', type: 'string', doc: "环境变量,如:'development', 'testing', 'staging', 'production'" },
        { name: 'requestId', type: 'string', doc: '请求唯一标识' },
        { name: 'sysCode', type: 'string', doc: '发送方系统代码' },
        { name: 'requestType', type: 'string', doc: '请求操作类型' },
        { name: 'requestFlag', type: 'string', doc: '消息类型，0：请求，1：回复，2：ack' },
        { name: 'timestamp', type: 'string', doc: '请求操作时间' },
        { name: 'param', type: [{ type: 'map', values: 'string' }, 'null' ], doc: '系统级别扩展参数' },
        { name: 'payload', type: 'bytes', doc: '业务数据' },
    ],
  },
};
