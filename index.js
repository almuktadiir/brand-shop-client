const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const brands = require('./brand.json');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
console.log(process.env);

//middleware
app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://addBrand:k5hNUnbS38rg63Wh@cluster0.iawgzs5.mongodb.net/?retryWrites=true&w=majority";

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
    // Send a ping to confirm a successful connection

    const database = client.db("brandsDB");
    const userCollection = database.collection("brands");

    app.get('/products',async (req, res)=>{
        const cursor = userCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    app.post('/addproduct', async(req, res)=>{
        const product = req.body;
        const result = await userCollection.insertOne(product);
        res.send(result)
    })



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// brands category
app.get('/brand', (req, res)=>{
    res.send(brands);
})

app.get('/', (req, res)=> {
    res.send('fashion server is running');
})

app.listen(port, (req, res)=>{
    console.log(`fashion server is running on : ${port}`);
})