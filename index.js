/*---------------Importing all the packages --------------------*/
const express = require('express');
const cors = require('cors');
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();

/*---------------End of Importing all the packages --------------------*/

const app = express();

const port = process.env.PORT || 5000;

/*--------------middleware-----------------*/

app.use(cors());
app.use(express.json());

/*---------------middleware end---------------*/

/*----------------MongoDB Connection and Operations ------------------*/

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tzgvu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("tourisso");

    /*-----------All the collections--------------*/
    const packages = database.collection("packages");
    const trips = database.collection("trips");
    /*-----------End of All the collections--------------*/

    console.log("Database Connection Successful");


    /*-----------------GET API------------------*/

    app.get("/offers", async (req, res) => {
      const cursor = packages.find({});
      const result = await cursor.toArray();
      res.json(result);
    })

    app.get("/trips", async (req, res) => {
      const cursor = trips.find({});
      const result = await cursor.toArray();
      res.json(result);
    });
    // get by id

    app.get("/offers/:id", async (req, res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)}
      const result = await packages.findOne(query);
      res.json(result);
    })


    app.get("/mytrips/:email", async (req, res)=>{
      // const email = req.params.email;
      // const query = {email: email};
      const result = await trips.find({email: req.params.email}).toArray();
      console.log(result);
      res.send(result);
    })


    /*-----------------end of GET API------------------*/


  
    /*-----------------------POST API---------------------*/

        app.post("/offers", async (req, res) => {
          // console.log(req.body);
          const offer = req.body;
          const result = await packages.insertOne(offer);
          console.log(result);
          res.json(result);
        });

        app.post("/trips", async (req, res) => {
          const trip = req.body;
          const result = await trips.insertOne(trip);
          console.log(result);
          res.json(result);
        })
    /*-----------------------end of POST API---------------------*/

    /*--------------------DELETE API-----------------*/

    app.delete("/trips/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await trips.deleteOne(query);
      console.log(result);
      res.json(result);
    })
    
    /*--------------------end of DELETE API-----------------*/


  } finally {

  }
}
run().catch(console.dir);

/*-------------End ofMongoDB Connection and Operations -------------*/



/*---------------------server initialization----------------------*/

app.get("/", (req, res) => {
    res.send("Welcome to Tourisso Server");
})

app.listen(port, ()=>{
    console.log("Server is running on port", port);
});

/*---------------------------------XXXX-------------------------*/