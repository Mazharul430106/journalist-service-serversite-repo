const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qm6ghoc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async ()=>{
    try{
        const serviceCollection = client.db('journalistService').collection('services');

        // get three service data from database 
        app.get('/services', async (req, res)=>{
            const query = {};
            const cursor = serviceCollection.find(query).limit(3);
            const services = await cursor.toArray();
            res.send(services);
        })

        
        // get all service data from database 
        app.get('/services', async (req, res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })


    }
    finally{

    }
}

run().catch(err=> console.log(err));


app.get('/', (req, res) => {
  res.send('Jornalist Server is Running !')
})

app.listen(port, () => {
  console.log(`Jornalist Server is Running on port ${port}`)
})