const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
const ObjectId = require("mongodb").ObjectId;
app.use(cors());
app.use(express.json());
const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://mydbuser1:1kXtScL3DOQAZ1Vl@cluster0.wsejt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("practiceDB");
    const userCollection = database.collection("users");
    // post API
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = userCollection.insertOne(newUser);
      res.json(result);
    });
    // get specific data form API
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.json(result);
    });
    // get API
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });
    // delete User form API
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.json(result);
    });
    // update user API
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email,
          password: updatedUser.password,
          photoUrl: updatedUser.photoUrl,
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.json(result);
      // console.log("updating user", id);
      // res.send("updating bot dating ");
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
