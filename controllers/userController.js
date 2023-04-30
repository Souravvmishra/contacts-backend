const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Error } = require('mongoose');
const User = require('../models/userModel')


// @desc :  Register a user
// @route :  POST /api/users/register
// @access :  public

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
        res.status(400).json({ message: "All fields are mandatory" })
        return
    }

    const userAvailable = await User.findOne({ email })
    if (userAvailable) {
        res.status(400).json({ message: "User already registered" })
        return
    }

    const hashedPassword = await bcrypt.hash(password, 1)
    const user = await User.create({
        username,
        email,
        password: hashedPassword
    })

    if (user) {
        res.status(201).json({ _id: user._id, email: user.email })
    } else {
        res.status(400).json({ message: "User data not valid" })
        return
    }
})




// @desc :  Login user
// @route :  POST /api/users/login
// @access :  public
// function to login user using jwt
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory")

    }
    const user = await User.findOne({ email })
    // compare password
    if (user && (await bcrypt.compare(password.toString() , user.password.toString()))) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user._id
            },

        },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '150m' })

        res.status(200).json({ accessToken })
    } else {
        res.status(401)
        throw new Error("email or password is not valid")
    }
    })




// @desc :  Get Current user
// @route :  GET /api/users/current
// @access :  private

// function to get current user
const getCurrentUser = asyncHandler(async (req, res) => {
    res.json(req.user)
})



module.exports = { registerUser, loginUser, getCurrentUser }