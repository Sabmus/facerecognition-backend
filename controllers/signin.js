
const handleSignin = (req, res, db, bcrypt) => {

    if (!req.body.email) {
        res.status(400).json({"message": "Invalid credentials."});
    }

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
}

module.exports = {
    handleSignin: handleSignin
}
