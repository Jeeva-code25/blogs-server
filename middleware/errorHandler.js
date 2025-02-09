const logEvents = require("./logEvents")

const errorHandler = (err, req, res, next) => {
    const message = `${err.name}\t${err.message}\t`
    res.status(500).send(err.message)
    logEvents(message, "errorLog")
    next()
}

module.exports = errorHandler