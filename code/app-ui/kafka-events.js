// Created by: Jason Dudash
// https://github.com/dudash
//
// (C) 2019
// Released under the terms of Apache-2.0 License
//
// The events module is to make it easy to publish a Kafka events
// in the app-ui service. This object will create a connection
// to the Kafka broker and the sendPayload function does the rest.
// Note: we aren't enforcing any type in the data format (JSON not Avro).
//
// https://www.npmjs.com/package/kafka-node#kafkaclient
//
var kafka = require('kafka-node'),
uuid = require('uuid');
var client, producer, isReady;
const USER_PAYLOAD_TOPIC = 'microservicesdemo.tracking.user-level';
const SERVICE_PAYLOAD_TOPIC = 'microservicesdemo.tracking.service-level';

const init = () => {
    if (producer) {
        console.log('not recreating the Kafka producer, it already exists');
        return;
    } else { console.log('creating the Kafka producer'); }
    isReady = false;
    client = new kafka.KafkaClient({kafkaHost: process.env.KAFKA_HOST || '127.0.0.1:9092'});
    producer = new kafka.HighLevelProducer(client);
    producer.on('ready', function() {
        console.log('Kafka is connected and producer is ready.');
        isReady = true;
    });
    producer.on('error', function(error) {
        console.error('Kafka producer error:' + error);
    });
}

const sender = {
    sendUserPayload: ({ type, userId, sessionId, data }, callback = () => {}) => {
        if (!isReady) { return callback(new Error(`Kafka not ready yet...`)); }
        if (!userId) { return callback(new Error(`missing userId`)); }
        const event = {
            id: uuid.v4(),
            timestamp: Date.now(),
            type: type,
            userId: userId,
            sessionId: sessionId,
            data: data
        };
        const buffer = new Buffer.from(JSON.stringify(event));
        const payloads = [
            {
                topic: USER_PAYLOAD_TOPIC,
                messages: buffer,
                attributes: 1 /* Use GZip compression for the payloads */
            }
        ];
        producer.send(payloads, callback);
        //console.log('Kafka user payload sent');
    },
    sendServicePayload: ({ type, data }, callback = () => {}) => {
        if (!isReady) { return callback(new Error(`Kafka not ready yet...`)); }
        const event = {
            id: uuid.v4(),
            timestamp: Date.now(),
            type: type,
            data: data
        };
        const buffer = new Buffer.from(JSON.stringify(event));
        const payloads = [
            {
                topic: SERVICE_PAYLOAD_TOPIC,
                messages: buffer,
                attributes: 1 /* Use GZip compression for the payloads */
            }
        ];
        producer.send(payloads, callback);
        //console.log('Kafka service payload sent');
    }
};

module.exports = {
    init, 
    sender
};
