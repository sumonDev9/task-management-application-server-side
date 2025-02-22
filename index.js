const express = require('express');
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qqfyy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const taskCollection = client.db('taskHive').collection('task')
   
    // add task
    app.post('/tasks', async(req, res) => {
      const newTask = req.body;
      const result = await taskCollection.insertOne(newTask);
      res.send(result);
    })

    // all task
    app.get('/tasks', async(req, res) => {
      const result = await taskCollection.find().toArray();
      res.send(result)
    })

    // 
    app.get('/tasks/:email', async(req, res) => {
      const email = req.params.email;
      // console.log(email)
      const query = { userEmail: email};
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    })

    app.patch('/tasks/:id', async (req, res) => {
      const { id } = req.params;
      const { category } = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: { category },
      };
      const result = await taskCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.put('/tasks/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updatedTasks = req.body;
      const tasks = {
        $set: {
          title: updatedTasks.title,
          description: updatedTasks.description,
          category: updatedTasks.category
        }
      }
      const result = await taskCollection.updateOne(filter, tasks, options);
      res.send(result);
    })

    // task
    app.delete('/tasks/:id', async(req, res) => {
      const id = req.params.id;
      const qurey = {_id: new ObjectId(id)}
      const result = await taskCollection.deleteOne(qurey);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('task management application server is runing')
  })
  
  app.listen(port, () => {
    console.log(`task management application server is runing  on port ${port}`)
  })