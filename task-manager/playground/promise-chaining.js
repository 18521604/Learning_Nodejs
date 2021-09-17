require('../src/db/mongoose')
const Task = require('../src/models/task')

//Promise function
// Task.findByIdAndRemove('61260419132dccffea9264e3').then((task) => {
//     console.log(task)
//     return Task.count({})
// }).then((count) => {
//     console.log(count)
// }).catch((err) => {
//     console.log(err)
// })


//Syntax: Async/await
const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed: false })
    return count
}

deleteTaskAndCount('6127052eae966008b483dd09').then((result) => {
    console.log(result)
}).catch((err) => {
    console.log(err)
})