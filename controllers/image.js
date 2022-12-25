

const handleImage = (req, res, db) => {
    db('users').where("id", req.body.id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0].entries))
    .catch(error => res.status(404).json({"message": "No such user."}));
}

module.exports = {
    handleImage: handleImage
}
