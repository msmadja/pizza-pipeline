const amqp = require('amqplib');
require('dotenv').config();
const RABBITMQ_CONNECTIONSTRING = process.env.RABBITMQ_CONNECTIONSTRING || "amqp://localhost:5672";
const HANDLER_NAME = "toppings.handled";


async function handler() { 
    try {
        console.time(HANDLER_NAME);
        connection = await amqp.connect(RABBITMQ_CONNECTIONSTRING);
        channel    = await connection.createChannel()
        await channel.assertQueue(HANDLER_NAME);
        
        channel.consume(HANDLER_NAME, async data => {

            console.log(`${HANDLER_NAME} received:`, data.content.toString());

            /*
            * Prepare pizza to the oven
            */
            await new Promise(r => setTimeout(r, 10000));
            await channel.sendToQueue("oven.handled", Buffer.from(JSON.stringify(data.content.toString())));

            channel.ack(data);
            console.timeEnd(HANDLER_NAME);
        })
    } catch (error) {
        console.log(error);
    }
    
}


handler();
console.log(`${HANDLER_NAME} is running`);