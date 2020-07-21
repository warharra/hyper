const express = require('express')
const router = express.Router()
const { verifyToken } = require('../controllers/verifyToken')
const {
  isAuthenticated,
  sendComment,
  getComment,
} = require('../controllers/scraper')

router.post('/isAuthenticated', verifyToken, isAuthenticated)
router.post('/sendComment', verifyToken, sendComment)
router.post('/getComment', verifyToken, getComment)
module.exports = router
