const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send({
            status: 'success',
            task
        })
    } catch (err) {
        res.status(400).send({
            status: 'fail',
            message: err
        })
    }
})

//GET /task?completed=true
//GET /task?limit=10&skip=10
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const typeQueries = Object.keys(req.query)
    if (req.query) {
        typeQueries.forEach(typeQuery => {
            match[typeQuery] = req.query[typeQuery]
            console.log(typeQuery)
        });
    }
    try {
        //Resolved way 1
        // await req.user.populate({
        //     path: 'tasks',
        //     match,
        //     options: {
        //         limit: parseInt(req.query.limit)     //Error: limit, skip, sort is non-negative
        //         skip: parseInt(req.query.skip)
        //     }
        // })
        // res.send(req.user.tasks)

        //Resolved way 2
        const tasks = await Task.find({
            owner: req.user._id,
            ...match
        })

        res.send({
            status: 'success',
            tasks
        })
    } catch (err) {
        res.status(500).send({
            status: 'fail',
            message: err
        })
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send({
                status: 'fail',
                message: 'Ghi chú không tồn tại'
            })
        }
        res.send({
            status: 'success',
            task
        })
    } catch (err) {
        res.status(500).send({
            status: 'fail',
            message: err
        })
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({
            status: 'fail',
            message: 'Cập nhật không thành công!'
        })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            return res.status(404).send({
                status: 'fail',
                message: 'Không thể cập nhật ghi chú không tồn tại!'
            })
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.send({
            status: 'success',
            task
        })
    } catch (err) {
        res.status(400).send({
            status: 'fail',
            message: err
        })
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id })
        if (!task) {
            return res.status(404).send({
                status: 'fail',
                message: 'Không thể xoá ghi chú không tồn tại'
            })
        }
        res.send({
            status: 'success',
            task
        })
    } catch (err) {
        res.status(400).send({
            status: 'fail',
            message: err
        })
    }
})

module.exports = router