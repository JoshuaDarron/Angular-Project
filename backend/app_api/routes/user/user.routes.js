const express = require('express')

const router = express.Router()

const userCtrl = require('../../controllers/user/user.ctrl')


router.post('/signup', userCtrl.createUser)
router.post('/login', userCtrl.getUser)


module.exports = router
