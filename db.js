
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const Admin = require('./Schema/Admin');
const Voter = require('./Schema/voter');
const Project  = require('./Schema/project');

const uri = "mongodb+srv://febinjohn725:<VPoWCbifmCaOoW9R>@cluster0.psavxgy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

    await mongoose.connection.db.createCollection('admins', Admin);
    await mongoose.connection.db.createCollection('voters', Voter);
    await mongoose.connection.db.createCollection('projects', Project);
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
