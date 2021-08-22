const request = require('request')

//Address -> Lat/long -> Weather
const geocode = (address, callback) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?proximity=-74.70850,40.78375&access_token=pk.eyJ1IjoidGhhbmh0dWFuMjAwMGRwIiwiYSI6ImNrc2Z1NnlwNDE4bWUybnAydjRkNTkxOGMifQ.UTx1BRGJn0RxfwJOV5ZXYg`

    request({ url, json: true }, (error, response) => {
        if (error) {
            callback('Unable to connect to Map service', undefined)
        } else if (response.body.features.length === 0) {
            callback('Unable to find the location. Try search again!', undefined)
        } else {
            callback(undefined, {
                longitude: response.body.features[0].center[0],
                latitude: response.body.features[0].center[1],
                location: response.body.features[0].place_name,
                name: response.body.features[0].text,
            })
        }
    })
}

module.exports = geocode