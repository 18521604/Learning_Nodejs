console.log("Client javascript site")

const weatherForm = document.querySelector('form')
const searchContent = document.querySelector('input')
const messageLocation = document.querySelector('#message-location')
const messageForecast = document.querySelector('#message-forecast')

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const location = searchContent.value

    messageLocation.textContent = 'Loading...'
    messageForecast.textContent = ''
    fetch(`http://localhost:3000/weather?address=${location}`)
        .then((res) => res.json())
        .then(data => {
            if (data.errorMessage) {
                messageLocation.textContent = data.errorMessage
            } else {
                messageLocation.textContent = data.address
                messageForecast.textContent = `In ${data.forecastData.location} now, the temperature is ${data.forecastData.temperature} degree. There is a ${data.forecastData.precip_mm}mm rain`
            }
        })
        .catch(err => console.log(err))
})