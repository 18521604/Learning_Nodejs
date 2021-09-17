const express = require('express')
const cors = require('cors')

require('./db/mongoose')
const userRouter = require('./router/user')
const taskRouter = require('./router/task')
const app = express()
const port = process.env.PORT || 8000

var corsOptions ={
    origin: '*'
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next()
})
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log('Server is up on port', port)
})

// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {
//     const task = await Task.findById('612b21990e437fcde5909cdf')
//     await task.populate('owner')
//     console.log(task.owner)

//     const user = await User.findById('612a49b2b4243a2cc0287d39')
//     await user.populate('tasks')
//     console.log(user.tasks)
// }

// main()