
const handleRegister = (req, res, db, bcrypt, saltRounds) => {
    const { username, email, password, passwordConfirm } = req.body;

    if (password !== passwordConfirm) {
        res.status(400).json({"message": "Password must match."});
    } else if (!username || !email || !password || !passwordConfirm) {
        res.status(400).json({"message": "All fields are required."});
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
}

module.exports = {
    handleRegister: handleRegister
}
