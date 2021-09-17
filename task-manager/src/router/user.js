const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = express.Router()
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        await user.generateAuthToken()
        res.status(201).send({
            status: 'success',
            data: user
        })
    } catch (err) {
        res.status(400).send({
            status: 'fail',
            message: err
        })
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({
            status: 'success',
            data: user,
            token
        })
    } catch (err) {
        res.status(400).send({
            status: 'fail',
            message: err.toString()
        })
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()

        res.send({
            status: 'success'
        })
    } catch (err) {
        res.status(500).send({
            status: 'fail',
            message: err
        })
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send({
            status: 'success'
        })
    } catch (err) {
        res.status(500).send({
            status: 'fail',
            message: err.toString()
        })
    }
})

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send({
            status: 'success',
            data: users
        })
    } catch (err) {
        res.status(500).send({
            status: 'fail',
            message: err
        })
    }
})

router.get('/users/me', auth, async (req, res) => {
    try {
        res.send({
            status: 'success',
            data: req.user
        })
    } catch (err) {
        res.status(500).send({
            status: 'fail',
            message: err
        })
    }
})

router.patch('/users/me', auth, async (req, res) => {
    //Avoid update properties don't have in user's properties
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({
            status: 'fail',
            message: 'Invalid updates!'
        })
    }

    //Following updating
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send({
            status: 'success',
            data: req.user
        })
    } catch (err) {
        res.status(400).send({
            status: 'fail',
            message: err
        })
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send({
            status: 'success',
            data: req.user
        })
    } catch (err) {
        res.status(400).send({
            status: 'fail',
            message: err
        })
    }
})

module.exports = router