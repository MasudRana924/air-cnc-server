const express = require('express')
const { MongoClient} = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000
// middleware 
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hrpwo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

    try {
        await client.connect()
        console.log('database connected')
         const database = client.db('hotelRes')
        const usersCollection = database.collection('users')
        const applyCollection = database.collection('apply')

        // users section 
         app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result)
        })
        // apply section 
        app.post('/postapply', async (req, res) => {
            const apply = req.body;
            const result = await applyCollection.insertOne(apply);
            res.json(result)
        })
        app.get('/myapply', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const cursor = applyCollection.find(query)
            const apply = await cursor.toArray()
            res.send(apply)

        })
    }

    finally {

    }
}
run().catch(console.dir)
app.get('/', (req, res) => {
    res.send('hotelres is running under server')
})
app.listen(port, () => {
    console.log("server is running on", port)
})