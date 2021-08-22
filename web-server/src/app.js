const express = require('express')
const path = require('path')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather app',
        name: 'David Tuan'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About ME',
        name: 'David Tuan'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help page',
        name: 'David Tuan'
    })
})

app.get('/weather', (req, res) => {
    let address = req.query.address
    if (!address) {
        return res.send({
            errorMessage: 'You must provide a address'
        })
    }

    geocode(req.query.address, (err, { name, location } = {}) => {
        if (err) {
            return res.send({
                errorMessage: err
            })
        } else {
            forecast(name, (err, forecastData) => {
                if (err) {
                    return res.send({
                        errorMessage: err
                    })
                } else {
                    return res.send({
                        address: location,
                        forecastData,
                    })
                }
            })
        }
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 404,
        errorMessage: 'Help artical not found',
        name: 'David Tuan'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 404,
        errorMessage: 'Page not found',
        name: 'David Tuan'
    })
})

app.listen(3000, () => {
    console.log("Server is up on port 3000")
})