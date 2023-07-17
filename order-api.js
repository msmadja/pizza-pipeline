const express = require("express");
const amqp = require("amqplib");
require('dotenv').config()
const app = express();
const PORT = process.env.PORT || 4001;
const RABBITMQ_CONNECTIONSTRING = process.env.RABBITMQ_CONNECTIONSTRING || "amqp://localhost:5672";
const SERVICE_NAME = "order-api";
app.use(express.json());
        


app.post("/", (req, res) => {
    res.send("Welcome to service!")
});

app.post("/orders", async (req, res) => {

const {orders} = req.body;
    
try {
   
   const startTime = new Date();
   console.time(SERVICE_NAME);
   const connection = await amqp.connect(RABBITMQ_CONNECTIONSTRING);
   const channel    = await connection.createChannel();
  
   /**
    * Start prepare orders
    */
   await Promise.all((orders.map((v) => 
   channel.sendToQueue("order.received", Buffer.from(JSON.stringify({v, startTime: startTime}))))));

    await channel.close();
    await connection.close();

    console.timeEnd(SERVICE_NAME);
    res.status(204).send();
    
   }
   catch (e) { 
    throw e;
   }

    res.status(204);
    
});

app.listen(PORT, () => console.log(`Server ${SERVICE_NAME} running at port ` + PORT));