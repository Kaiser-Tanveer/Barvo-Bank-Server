const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tl2ww1y.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.use(cors());
app.use(express.json());

function run() {
  try {
    // Collections
    const accountTypesCollection = client
      .db("BravoBank")
      .collection("accountTypes");
    const accountsCollection = client.db("BravoBank").collection("accounts");
    const cardTypesCollection = client.db("BravoBank").collection("cardTypes");
    const cardsCollection = client.db("BravoBank").collection("cards");
    const loanTypesCollection = client.db("BravoBank").collection("loanTypes");
    const loansCollection = client.db("BravoBank").collection("loans");
    const usersCollection = client.db("BravoBank").collection("users");
    const requestedUsersCollection = client.db("BravoBank").collection("requestedUsers");

    // APIs
    app.get("/accountsTypes", async (req, res) => {
      const query = {};
      const result = await accountTypesCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/accounts/:accountType", async (req, res) => {
      const accountType = req.params.accountType;
      const query = { accountType: accountType };
      const result = await accountsCollection.findOne(query);
      res.send(result);
    });

    app.get("/cardsTypes", async (req, res) => {
      const query = {};
      const result = await cardTypesCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/cards/:cardType", async (req, res) => {
      const cardType = req.params.cardType;
      const query = { cardType: cardType };
      const result = await cardsCollection.findOne(query);
      res.send(result);
    });

    app.get("/loansTypes", async (req, res) => {
      const query = {};
      const result = await loanTypesCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/loans/:loanType", async (req, res) => {
      const loanType = req.params.loanType;
      const query = { loanType: loanType };
      const result = await loansCollection.findOne(query);
      res.send(result);
    });
    // add Users
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // get Users
    app.get("/users", async (req, res) => {
      const query = {};
      const cursor = await usersCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    // Data storing for the requested accounts 
    app.post("/requestedUsers", async (req, res) => {
      const reqUsers = req.body;
      const result = await requestedUsersCollection.insertOne(reqUsers);
      res.send(result);
    });

    // Dashboard userRequest
    app.get("/requestedUsers", async (req, res) => {
      const reqUsers = req.body;
      const result = await requestedUsersCollection.find(reqUsers).toArray();
      res.send(result);
    });

    app.delete('/requestedUsersDelete/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await requestedUsersCollection.deleteOne(query);
      res.send(result);
  })


  } catch (error) {
    console.log(error);
  }
}
run();

app.get("/", (req, res) => {
  res.send("Bravo-6 is running...");
});

app.listen(port, async (req, res) => {
  console.log(`Bravo-Bank is running on ${port}`);
});
