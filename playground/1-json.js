const fs = require('fs');

const dataBuffer = fs.readFileSync('1-json.json')
const data = dataBuffer.toString();
const myInfo = JSON.parse(data)

myInfo.name = "Lại là Tuấn"
myInfo.age = 20

const myInfoJSON = JSON.stringify(myInfo)
fs.writeFileSync('1-json.json', myInfoJSON)