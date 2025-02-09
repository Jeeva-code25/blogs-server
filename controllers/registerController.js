const asyncHandler = require('express-async-handler')
const userModel  = require('../model/userModel')
const crypto = require('crypto')

const handleRegister = asyncHandler(async(req, res) => {
    const {username, password} = req.body

    if (!username || !password) return res.status(400).json({"message": "username or password missing!!"}) // 400 means bad request

    const duplicate = await userModel.findOne({"username": username}).exec()


    if(duplicate) return res.sendStatus(409); //409 conflict error 

    try {
        
        const hashedPwd = crypto.pbkdf2Sync(password, process.env.PASSWORD_SALT, 10, 64, 'sha512').toString('hex')
        const newUser = {
            "username": username,
            "password": hashedPwd
        }

        const result = await userModel.create(newUser)

        console.log(result);
        
        res.status(201).json(`created usernme: ${result.username} password: ${result.password} `)

    } catch (err) {
        res.status(500).json({"error": err.message})
    }
})

module.exports = handleRegister