const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const userModel = require('../model/userModel')
const crypto = require('crypto')

require('dotenv').config()

const handleLogin = asyncHandler(async (req, res) => {

    const { username, password } = req.body

    if (!username || !password) return res.status(400).json({ "message": "username or password missing!!" }) // 400 means bad request

    const foundMatch = await userModel.findOne({"username": username})

    if (!foundMatch) return res.sendStatus(401) //unauthorized

    const hashedPwd = crypto.pbkdf2Sync(password, process.env.PASSWORD_SALT, 10, 64, 'sha512').toString('hex')

    if (foundMatch.password === hashedPwd) {
        const roles = Object.values(foundMatch.roles)
        const accessToken = jwt.sign(
            {
                "userInfo": {
                    "username": foundMatch.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30m' }
        )
        const refreshToken = jwt.sign(
            { "username": foundMatch.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )

        foundMatch.refreshToken = refreshToken
        const result = await foundMatch.save()
        console.log(result);

        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
        res.json({ accessToken, username: foundMatch.username, userId: foundMatch._id })
    } else {
        res.sendStatus(401).json({message: "Invalid Password"})
    }

})

module.exports = handleLogin