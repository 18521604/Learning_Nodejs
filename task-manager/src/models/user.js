const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Task = require('./task')
const userSchema = require('../schema/userSchema')

//Function help populate tasks from _id of user
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

//below function is called automatically. This means toJSON() is called by stringify(), which is called automaically when response data in endpoint
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this

    const token = jwt.sign({ _id: user._id.toString() }, 'mycourse')

    user.tokens = user.tokens.concat({ token })
    user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw 'Bạn đã nhập sai mật khẩu hoặc tài khoản'
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw 'Bạn đã nhập sai mật khẩu hoặc tài khoản'
    }

    return user
}

//Hash password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

//Delete user's tasks when the user is deleted
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User