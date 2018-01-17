'use strict';

const assert = require('assert');
const avsc = require('avsc');

module.exports = {
  binaryEncode(data) {
    assert(this.config.kafkajs.avroSchema, 'undefined kafka avroSchema');
    const avro = avsc.Type.forSchema(this.config.kafkajs.avroSchema);
    return avro.toBuffer(data);
  },
  binaryDecode(buffer) {
    assert(this.config.kafkajs.avroSchema, 'undefined kafka avroSchema');
    const avro = avsc.Type.forSchema(this.config.kafkajs.avroSchema);
    return avro.fromBuffer(buffer);
  },
};
