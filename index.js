const express = require('express')
const { MongoClient } = require('mongodb');
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
        const bookingsCollection = database.collection('bookings')
        const reviewsCollection = database.collection('reviews')
        // users section 
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result)
        })
        app.get('/usersemail', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            console.log(query)
            const cursor = usersCollection.find(query)
            const users = await cursor.toArray()
            res.send(users)

        })
        app.put('/updateuser', async (req, res) => {
            const email = req.query.email
            const updatedUser = req.body
            const filter = { email: email };
            const option = { upsert: true }
            const updateDoc = {
                $set: {
                    displayName: updatedUser.name,
                    phoneno: updatedUser.phone,
                    adddress: updatedUser.address,
                    image:updatedUser.image
                }
            }
            const result = await usersCollection.updateOne(filter, updateDoc, true)
            res.json(result)


        })

        // Bookings section
        app.post('/bookings', async (req, res) => {
            const bookings = req.body;
            const result = await bookingsCollection.insertOne(bookings);
            res.json(result)
        })
        app.get('/mybookings', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const cursor = bookingsCollection.find(query)
            const orders = await cursor.toArray()
            res.send(orders)

        })
        app.delete('/mybookings/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await bookingsCollection.deleteOne(query)
            res.json(result)
        })

          //   reviews 
        //    post api 
        app.post('/reviews', async (req, res) => {
            const newReview = req.body
            const result = await reviewsCollection.insertOne(newReview)
            res.json(result)
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