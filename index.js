const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
// Middleware
app.use(cors())
app.use(express.json())
// console.log(process.env.COFFEE_DB)
// console.log(process.env.COFFEE_PASS)
const uri = `mongodb+srv://${process.env.COFFEE_DB}:${process.env.COFFEE_PASS}@cluster0.clbkfrr.mongodb.net/?retryWrites=true&w=majority`;

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
    /* Our Work Start Here */
    const coffeeCollection = client.db("coffeeDB").collection("coffee");
    //Add Coffee
    app.post('/coffee', async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee)
      const result = await coffeeCollection.insertOne(newCoffee)
      res.send(result)
    })
    // Read all Coffee
    app.get('/coffee', async(req, res)=>{
      const coffees =  coffeeCollection.find()
      const result = await coffees.toArray()
      res.send(result)
    })
    // read a  coffee
    app.get('/coffee/:id', async(req, res)=>{
      const id = req.params.id;
      console.log(id)
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.findOne(query)
      res.send(result)
    })
    // update a  coffee
    app.put('/coffee/:id', async(req, res)=>{
      const id = req.params.id;
      const coffee = req.body;
      // console.log(id)
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updatedCoffee = {
        $set:{
          name:coffee.name,
          quantity: coffee.quantity,
          supplier: coffee.supplier,
          taste: coffee.taste,
          category: coffee.category,
          details: coffee.details,
          photo: coffee.photo
        }
      }
      const result = await coffeeCollection.updateOne(filter, updatedCoffee, options)
      res.send(result)
    })
    // Delete a  coffee
    app.delete('/coffee/:id', async(req, res)=>{
      const id = req.params.id;
      console.log(id)
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(query)
      res.send(result)
    })


    /* Our Work End hereen */
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
    /* For Running server always */
  }
}
run().catch(console.dir);
//Default
app.get('/', (req, res) => {
  res.send('Coffee server is running!')
})
app.listen(port, () => {
  console.log(`Coffee server is listening on port ${port}`)
})

