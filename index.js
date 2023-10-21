const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const brands = require('./brand.json');
// console.log(process.env);

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iawgzs5.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);

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
    // await client.connect();
    // Send a ping to confirm a successful connection

    const database = client.db("brandsDB");
    const userCollection = database.collection("brands");

    const cartCollection = client.db("brandsDB").collection("cart");

    // cart collection 
    app.get('/cartproducts', async (req, res)=> {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/cartproducts',async (req, res)=> {
        const product = req.body;
        const result = await cartCollection.insertOne(product);
        res.send(result);
    })

    app.delete('/cartproducts/:id', async(req, res)=> {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await cartCollection.deleteOne(query);
      res.send(result)
    })

    // user collection - add product
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

    app.put('/products/:id', async(req, res)=>{
      const id = req.params.id;
      const updateValue = req.body;
      const filter = {_id : new ObjectId(id)};
      const options = {upsert: true};
      const updateProduct = {
        $set: {
          name: updateValue.productName, 
          brand: updateValue.brand,
          imageURL: updateValue.imageURL, 
          productType: updateValue.productType, 
          price: updateValue.price, 
          rating: updateValue.rating, 
          description: updateValue.description
        }
      }
      const result = await userCollection.updateOne(filter, updateProduct, options);
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