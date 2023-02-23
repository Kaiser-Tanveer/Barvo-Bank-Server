const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

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
    const accountTypesCollection = client.db("BravoBank").collection("accountTypes");
    const accountsCollection = client.db("BravoBank").collection("accounts");
    const cardTypesCollection = client.db("BravoBank").collection("cardTypes");
    const cardsCollection = client.db("BravoBank").collection("cards");
    const loanTypesCollection = client.db("BravoBank").collection("loanTypes");
    const loansCollection = client.db("BravoBank").collection("loans");

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
