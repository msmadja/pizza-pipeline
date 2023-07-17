const amqp = require('amqplib');
require('dotenv').config();
const RABBITMQ_CONNECTIONSTRING = process.env.RABBITMQ_CONNECTIONSTRING || "amqp://localhost:5672";
const HANDLER_NAME = "order.received";


async function handler() { 
    try {
        console.time(HANDLER_NAME);
        const connection = await amqp.connect(RABBITMQ_CONNECTIONSTRING);
        const channel    = await connection.createChannel()
        await channel.assertQueue(HANDLER_NAME);
        
        channel.consume(HANDLER_NAME, async data => {

            console.log(`${HANDLER_NAME}: recieved`, data.content.toString());

            /** 
             * Prepare dough
             */
            await new Promise(r => setTimeout(r, 7000));
            await channel.sendToQueue("dough.handled", Buffer.from(JSON.stringify(data.content.toString())));

            channel.ack(data);
            console.timeEnd(HANDLER_NAME);
        })
    } catch (error) {
        console.log(error);
    }
    
}


handler();
console.log(`${HANDLER_NAME} is running`);