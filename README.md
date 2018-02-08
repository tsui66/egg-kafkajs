# egg-kafkajs

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-kafkajs.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-kafkajs
[download-image]: https://img.shields.io/npm/dm/egg-kafkajs.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-kafkajs

<!--
Description here.
-->

[kafka-node](https://github.com/SOHU-Co/kafka-node) plugin for Egg.js.

> NOTE: This plugin just for integrate kafka-node into Egg.js, more documentation please visit https://github.com/SOHU-Co/kafka-node.

## Install

```bash
$ npm i egg-kafkajs --save
```
or

```bash
$ yarn add egg-kafkajs
```

## Usage

```js
// {app_root}/config/plugin.js
exports.kafkajs = {
  enable: true,
  package: 'egg-kafkajs',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
config.kafkajs = {
    host: '127.0.0.1:2181',
    sub: [
      {
        groupId: 'consumer-groupId',
        topics: [ 'topic1', 'topic2' ],
        topic1: [ 'key1', 'key2' ],
        topic2: [ 'key3', 'key4' ],
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
```

## Structure

```
egg-project
├── package.json
├── app.js (optional)
├── app
|   ├── router.js
│   ├── controller
│   |   └── home.js
│   ├── service (optional)
│   |   └── user.js
│   |   └── response_time.js
│   └── kafka (optional)  --------> like `controller, service...`
│       ├── topic (optional)  -------> topic name of kafka
│            └── key_comsumer.js(optional)  ------> `key` is the key of topic
├── config
|   ├── plugin.js
|   ├── config.default.js
│   ├── config.prod.js
|   ├── config.test.js (optional)
|   ├── config.local.js (optional)
|   └── config.unittest.js (optional)
```


## Example

see [test/fixtures/apps/kafkajs-test/](test/fixtures/apps/kafkajs-test) for more detail.

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
