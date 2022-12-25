const express = require("express");
const cors = require('cors')
const bcrypt = require('bcryptjs');
const knex = require('knex');

const signin = require("./controllers/signin");
const register = require("./controllers/register");
const image = require("./controllers/image");
const faceRecognition = require("./controllers/faceRecognition");


// Database
const db = knex({
    client: 'pg',
    connection: {
      host : 'facerecognition_server-postgres-1',
      port : 5432,
      user : 'postgres',
      password : 'secret',
      database : 'facereco'
    }
  });


// Constants
const PORT = 8080;
// const HOST = '0.0.0.0';
const saltRounds = 10;

const app = express();

// Middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors())


app.get("/", (req, res) => {
    res.json({"message": "Hello World!"});
});

// Log a User In
app.post("/signin", (req, res) => { signin.handleSignin(req, res, db, bcrypt) });

// Register a User
app.post("/register", (req, res) => { register.handleRegister(req, res, db, bcrypt, saltRounds) });

// Get user profile TBD
app.get("/profile/:id", (req, res) => {
    res.json({"message": "TBD"});
});

// Process an Image
app.put("/image", (req, res) => { image.handleImage(req, res, db) });

// recognize faces
app.post("/face-recognition", (req, res) => { faceRecognition.handlFaceRecognition(req, res) });


app.listen(PORT, () => {
    console.log(`Running on port: ${PORT}`);
});
