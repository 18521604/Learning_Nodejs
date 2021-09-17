const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const address = process.argv[2]

if (!address) {
    console.log("Please provide an address!")
} else {
    geocode(address, (error, { name, location }) => {
        if (error) {
            return console.log('Error', error)
        }
        forecast(name, (error, forecastData) => {
            if (error) {
                return console.log('Error', error)
            }
            console.log(location)
            console.log('Data', forecastData)
        })
    })
}
