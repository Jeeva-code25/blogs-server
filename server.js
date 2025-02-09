require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')
const app = express()

const logEvents = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const router = require('./routes/root')
const db_connect = require('./config/db_connect')
const verifyJWT = require('./middleware/verifyJWT')

const PORT = process.env.PORT || 3500

app.use((req, res, next) => {
    const message = `${req.method}\t${req.headers.origin}\t${req.path}`
    logEvents(message, "serverLog")
    next()
})

app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser())
app.use(express.json())

app.use(cors(require('./config/corsOptions')))

db_connect()

app.use('^/$|index(.html)?', router) //root
app.use('/users/register', require('./routes/register'))
app.use('/users/login', require('./routes/login'))
app.use(verifyJWT)
app.use('/blogs', require('./routes/restApi/blog')) //restapi blogs



app.all('*', (req, res) => {
    res.status(404);
    if(req.accepts('.html')){
        res.sendFile(path.join(__dirname,'views','404.html'))
    } else if(req.accepts('.json')){
        res.json({"message": "json not found"})
    } else {
        res.text("text not found")
    } 
})


app.use(errorHandler)

mongoose.connection.on('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, (err) => {
        if(err) console.log(err);
        console.log(`Server is running on ${PORT}`)
    })
});
