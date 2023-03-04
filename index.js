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
    const usersAccCollection = client.db("BravoBank").collection("usersAcc");
    const usersCardsCollection = client.db("BravoBank").collection("userCards");
    const userLoansCollection = client.db("BravoBank").collection("userLoans");

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
      console.log(result);
      res.send(result);
    });

    // get Users
    app.get("/allUsers", async (req, res) => {
      const query = {};
      const users = await usersCollection.find(query).toArray();
      res.send(users);
    });

    app.delete("/allUsers/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    // Data storing for the requested accounts
    app.post("/requestedUsers", async (req, res) => {
      const reqUsers = req.body;
      console.log(reqUsers);
      const result = await usersAccCollection.insertOne(reqUsers);
      res.send(result);
    });


    // Dashboard userRequest
    app.get("/userAccounts", async (req, res) => {
      // const email = req.query.email;
      const query = {};
      const result = await usersAccCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/singleAccDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await usersAccCollection.findOne(query);
      res.send(result);
    });

    app.put('/userStatusUpdate/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          status: 'success'
        }
      }
      const result = await usersAccCollection.updateOne(filter, updateDoc, option);
      res.send(result)
    })

    app.delete("/requestedUsersDelete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersAccCollection.deleteOne(query);
      res.send(result);
    });

    // user profile account
    app.get("/userAccount", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await usersAccCollection.find(query).toArray();
      res.send(result);
    });
    // single account details
    app.get("/myAccounts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersAccCollection.find(query).toArray();
      res.send(result);
    });

    //Card Request
    app.post('/cardsReq', async (req, res) => {
      const query = req.body;
      const result = await usersCardsCollection.insertOne(query);

      const id = req.body.accNum;
      const filter = { _id: new ObjectId(id) }
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          cards: 'pending'
        }
      }
      const result2 = await usersAccCollection.updateOne(filter, updateDoc, option);
      res.send(result);
    })

    // dashboard card request
    app.get('/dashCardReq', async (req, res) => {
      const query = {}
      const result = await usersCardsCollection.find(query).toArray();
      res.send(result);
    })

    // dashboard card Delete
    app.delete('/dashCardDelete', async (req, res) => {
      const query = req.body;

      const accNum = query.accNum;
      const filter = { _id: new ObjectId(accNum) }
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          cards: ''
        }
      }
      const result2 = await usersAccCollection.updateOne(filter, updateDoc, option);

      const id = query.id;
      const match = { _id: new ObjectId(id) }
      const result = await usersCardsCollection.deleteOne(match)
      res.send(result);
    })


    // dashboard debit card Update
    app.put('/dashCardDebit', async (req, res) => {
      const query = req.body;

      const accNum = query.accNum;
      const filter = { _id: new ObjectId(accNum) }
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          cards: 'https://i.ibb.co/LJcpPtv/Dedit-Card.png',
          cardStatus: 'success'
        }
      }
      const result2 = await usersAccCollection.updateOne(filter, updateDoc, option);

      const id = query.id;
      const match = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updateDocs = {
        $set: {
          status: 'success'
        }
      }
      const result = await usersCardsCollection.updateOne(match, updateDocs, options);

      res.send(result);
    })

    // dashboard credit card Update
    app.put('/dashCardCredit', async (req, res) => {
      const query = req.body;

      const accNum = query.accNum;
      const filter = { _id: new ObjectId(accNum) }
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          cards: 'https://i.ibb.co/JpvNJWM/BaboCard.png',
          cardStatus: 'success'
        }
      }
      const result2 = await usersAccCollection.updateOne(filter, updateDoc, option);

      const id = query.id;
      const match = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updateDocs = {
        $set: {
          status: 'success'
        }
      }
      const result = await usersCardsCollection.updateOne(match, updateDocs, options);

      res.send(result);
    })

    app.post('/loanReq', async (req, res) => {
      const loanData = req.body;
      console.log(loanData);
      const result = await userLoansCollection.insertOne(loanData);
      console.log(result);
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