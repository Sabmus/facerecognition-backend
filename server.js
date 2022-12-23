const express = require("express");
const cors = require('cors')
const bcrypt = require('bcryptjs');
const knex = require('knex')

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
const HOST = '0.0.0.0';
const saltRounds = 10;

const app = express();
// Middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors())


app.get("/", (req, res) => {
    res.json(db.users);
});

// Log a User In
app.post("/signin", (req, res) => {
    db('users').where({
        email: req.body.email  // unique in db
    })
    .then(data => {
        const userData = {
            id: data[0].id, 
            username: data[0].username,
            email: data[0].email,
            entries: data[0].entries,
            joined: data[0].joined
        }
        bcrypt.compare(req.body.password, data[0].hashedpassword, (err, result) => {
            result ? res.json(userData) : res.status(400).json({"message": "Invalid credentials."})
        });
    })
    .catch(error => {
        res.json({"message": "Invalid credentials."});
    });
});

// Register a User
app.post("/register", (req, res) => {
    const { username, email, password, passwordConfirm } = req.body;

    if (password !== passwordConfirm) {
        res.json({"message": "Password must match."});
    } else {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            db('users').insert([
                {
                    username: username,
                    email: email,
                    hashedpassword: hash,
                    joined: new Date()
                }
            ], ["id", "username", "email", "entries", "joined"])
            .then(data => res.json(data[0]))
            .catch(error => res.status(400).json({"message": "Unable to register."}));
        });
    }

});

// Get user profile TBD
app.get("/profile/:id", (req, res) => {
    const { id } = req.params;
    const user = db.users.filter(user => user.id === Number(id));
    user.length > 0 ? res.json(user[0]) : res.status(404).json({"message": "No such user."});
});

// Process an Image
app.put("/image", (req, res) => {
    db('users').where("id", req.body.id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0].entries))
    .catch(error => {
        res.status(404).json({"message": "No such user."});
    });
});


app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});
