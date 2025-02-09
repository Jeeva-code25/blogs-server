const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const {format} = require('date-fns')
const {v4: uuid} = require('uuid')

const logEvents = async (message, filename) => {
    const dateTime = `${format(new Date(), 'dd-MM-yyyy\tHH:mm:ss')}`
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`

    try {

        if(!fs.existsSync(path.join(__dirname,'..','logs'))){
            await fsPromises.mkdir("logs")
        }

        await fsPromises.appendFile(path.join(__dirname,'..','logs', `${filename}.log`),logItem)
        console.log(logItem);
        

    } catch (err) {
        console.error(err);
    }
}

module.exports = logEvents