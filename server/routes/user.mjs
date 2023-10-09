import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ExpressBrute  from "express-brute";

const router = express.Router();

var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);

//help you get a list of records
router.get("/", async(req, res) =>{
    let collection = await db.collection("apds");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});


  
// sign up.
router.post("/", async (req, res) => {
  const password = bcrypt.hash(req.body.password,10)
    let newDocument = {
      name: req.body.name,
      password: (await password).toString()
    };
    let collection = await db.collection("apds");
    let result = await collection.insertOne(newDocument);
    console.log(password);
    res.send(result).status(204);
});
  
// This section will help you update a record by id.
  router.patch("/:id", async (req, res) => {
    const query = { _id: new ObjectId(req.params.id) };
    const updates =  {
      $set: {
        name: req.body.name,
        password: req.body.password
      }
    };
  
    let collection = await db.collection("apds");
    let result = await collection.updateOne(query, updates);
  
    res.send(result).status(200);
});
  
// This section will help you delete a record
router.delete("/:id", async (req, res) => {
    const query = { _id: new ObjectId(req.params.id) };
  
    const collection = db.collection("apds");
    let result = await collection.deleteOne(query);
  
    res.send(result).status(200);
});
  
//signup
router.post("/login",bruteforce.prevent, async (req, res) => {
    const { name, password } = req.body;
  
    try {
      const collection = await db.collection("apds");
      const user = await collection.findOne({ name });
  
      if (!user) {
        return res.status(401).json({ message: "Authentication failed" });
      }
  
      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ message: "Authentication failed" });
      }
  
      // Authentication successful
      res.status(200).json({ message: "Authentication successful" });
      const token = jwt.sign({username:req.body.username, password  : req.body.password},"this_secret_should_be_longer_than_it_is",{expiresIn:"1h"})
      console.log("your new token is", token)
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  
  export default router;