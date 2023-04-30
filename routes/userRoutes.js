const express = require('express')
const { registerUser, loginUser, getCurrentUser } = require('../controllers/userController')
const validateToken = require('../middlewares/validateTokenHandler')

const router = express.Router()

router.post('/register', registerUser)

router.post('/login', loginUser)

router.get('/current', validateToken,  getCurrentUser)


module.exports = router