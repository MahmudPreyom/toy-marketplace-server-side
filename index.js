const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jbesanj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const toyPlanetCollection = client.db('toysPlanet').collection('allCarToys');



    app.get('/allCarToys', async(req, res ) => { 
        let query = {};
        if(req.query?.sellerEmail){
            query = {sellerEmail: req.query.sellerEmail}
        }
        const result = await toyPlanetCollection.find(query).toArray();
        res.send(result)
    })

   app.get('/allCarToys/:id', async(req,res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id)}
    const result = await toyPlanetCollection.findOne(query)
    res.send(result)
   }) 

    app.post('/allCarToys', async(req, res) => {
        const newToys = req.body;
        const result = await toyPlanetCollection.insertOne(newToys)
        res.send(result)
    })

    app.delete('/allCarToys/:id', async(req,res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await toyPlanetCollection.deleteOne(query);
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('toyPlanet server is running')
})
app.listen(port, () => {
    console.log(`toyPlanet server is running on port : ${port}`);
})