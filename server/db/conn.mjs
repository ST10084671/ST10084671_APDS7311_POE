import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

//const variable = process.env.Mongo_Conn
//console.log(variable);

const client = new MongoClient("mongodb+srv://AmmarahKader:Password1234@cluster0.bfuawr1.mongodb.net/");
let conn;
try {
  conn = await client.connect();
  console.log('mongoDB is CONNECTED!!! :)');
} catch(e) {
  console.error(e);
}

let db = client.db("apds");

export default db;