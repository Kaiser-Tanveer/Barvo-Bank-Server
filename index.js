const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@bravo.9rdyqfd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

app.use(cors());
app.use(express.json());


function run(){
    try {
        const AccountsCollection = client.db('Bravo-Bank').collection('Accounts');

        
    } catch (error) {
        console.log(error)
    }
}
run();

app.get('/', (req, res) => {
    res.send('Bravo-6 is running...')
})

app.listen(port, async (req, res) => {
    console.log(`Bravo-Bank is running on ${port}`);
});