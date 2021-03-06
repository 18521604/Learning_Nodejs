const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        // const token = req.header('Authorization').replace('Bearer ', '')
        const token = req.headers["x-access-token"];

        const decode = jwt.verify(token, 'mycourse')
        const user = await User.findOne({ _id: decode._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (err) {
        res.status(401).send({ error: 'Please authenticate!', err })
    }
}

module.exports = auth