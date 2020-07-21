const express = require('express')
const router = express.Router()
const {
  signup,
  signin,
  forgotPassword,
  recoverPassword,
  logout,
  lang,
} = require('../controllers/auth')

const {
  userSignupValidator,
  userSigninValidator,
  recoverPasswordValidator,
  forgotPasswordValidator,
} = require('../validator')
const { verifyToken } = require('../controllers/verifyToken')

router.post('/signup', userSignupValidator, signup)
router.post('/signin', userSigninValidator, signin)

router.post('/logout', verifyToken, logout)
router.post('/forgotPassword', forgotPasswordValidator, forgotPassword)
router.post('/recoverPassword', recoverPasswordValidator, recoverPassword)
router.post('/verifyToken', verifyToken)
router.post('/lang', lang)

module.exports = router
