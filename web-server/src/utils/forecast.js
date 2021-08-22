const request = require('request')

const forecast = (address, callback) => {
    const url = `https://api.weatherapi.com/v1/current.json?key=e414877a7b2b4ea189262053211708&q=${encodeURIComponent(address)}&aqi=yes`

    request({ url, json: true }, (error, response) => {
        if (error) {
            callback('Unable to connect to weather service', undefined)
        } else if (response.body.error) {
            callback('Unable to find location. Try search again!', undefined)
        } else {
            callback(undefined, {
                location: response.body.location.name,
                temperature: response.body.current.temp_c,
                precip_mm: response.body.current.precip_mm
            })
        }
    })
}

module.exports = forecast