'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    // 区分不同业务的key
    const key = 'test';
    let m_time =  Date.now();
    const options = {
      env: 'development',
      requestId: this.config.keys + ':' + key + '@' + m_time,
      sysCode: process.env.sysCode || 'usercenter',
      requestType: key,
      requestFlag: '0',
      timestamp: m_time.toString(),
      param: {},
      partition: 0,
      attributes: 0,
      payload: new Buffer(JSON.stringify({
        title: 'test',
        content: 'just a panic',
      })),
    };
    const data = {};
    for (const field of this.config.kafkajs.avroSchema.fields) {
      data[field.name] = options[field.name] || null;
    }
    const buffer = this.ctx.helper.binaryEncode(data);
    const msg = [ this.ctx.kafka.Message('topic1', 'test', buffer)];

    const result = await this.ctx.kafka.send(msg);
    this.ctx.status = 200;
  }
}

module.exports = HomeController;
