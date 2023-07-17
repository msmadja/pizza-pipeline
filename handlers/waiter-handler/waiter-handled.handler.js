const amqp = require('amqplib');
require('dotenv').config()
const RABBITMQ_CONNECTIONSTRING = process.env.RABBITMQ_CONNECTIONSTRING || "amqp://localhost:5672";
const HANDLER_NAME = "waiter.handled";

async function handler() { 
    try {
        const endTime = new Date();
        console.time(HANDLER_NAME);
        connection = await amqp.connect(RABBITMQ_CONNECTIONSTRING);
        channel    = await connection.createChannel()
        await channel.assertQueue(HANDLER_NAME);
        
        channel.consume(HANDLER_NAME, async data => {

            console.log(`${HANDLER_NAME} received:`, data.content.toString());

             /*
            * Pizza is on the way to the customer
            */
            await new Promise(r => setTimeout(r, 10000));
            await channel.sendToQueue("order.completed", Buffer.from(JSON.stringify(data.content.toString())));

            let finalOrder = JSON.parse(data.connect.toString());
            finalOrder  = {...finalOrder, endTime};

            console.log('final order', finalOrder);

            channel.ack(data);
            console.timeEnd(HANDLER_NAME);
        })
    } catch (error) {
        console.log(error);
    }
    
}


handler();
console.log("waiter-handler is running");