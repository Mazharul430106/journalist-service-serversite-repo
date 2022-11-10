const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qm6ghoc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        const serviceCollection = client.db('journalistService').collection('services');
        const reviewCollection = client.db('journalistService').collection('reviews');


        // stored service data in database.
        app.post('/services', async (req, res)=> {
            const service = req.body;
            const result = await serviceCollection.insertOne(service)
            res.send(result);
        })


        // get all service data from database 
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        // get three service data from database 
         app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        })

        // find one service data in all services from database
        app.get('/services/:id', async (req, res)=> {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        // post reviews data form database 
        app.post('/reviews', async (req, res)=>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        // get reviews data from database 
        app.get('/reviews', async (req, res)=> {
            let query = {};
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        // update reviews data from database .
        // app.patch('/reviews/:id', async(req, res)=>{
        //     const id = req.params.id;
        //     const query = {_id: ObjectId(id)};
        //     const updateDoc = {
        //         $set:{

        //         }
        //     }
        //     const result = await reviewCollection.updateOne(query, updateDoc);
        // })






        // delete review form database.
        app.delete('/reviews/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })


    }
    finally {

    }
}

run().catch(err => console.log(err));


app.get('/', (req, res) => {
    res.send('Jornalist Server is Running !')
})

app.listen(port, () => {
    console.log(`Jornalist Server is Running on port ${port}`)
})