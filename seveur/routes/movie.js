const express = require('express')
const router = express.Router()
const { verifyToken } = require('../controllers/verifyToken')
const {
  isAuthenticated,
  sendComment,
  getComment,
  getVideo,
  viewMovie,
  isDownload,
} = require('../controllers/scraper')

router.post('/isAuthenticated', verifyToken, isAuthenticated)
router.post('/sendComment', verifyToken, sendComment)
router.post('/getComment', verifyToken, getComment)
router.get('/getVideo/:id', getVideo)
router.post('/viewMovie', verifyToken, viewMovie)
router.post('/isDownload', verifyToken, isDownload)
module.exports = router
