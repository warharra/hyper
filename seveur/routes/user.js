const express = require('express')
const router = express.Router()

const { verifyToken } = require('../controllers/verifyToken')
const {
  uploadProfileImage,
  readImage,
  readProfile,
  updateProfile,
} = require('../controllers/user')

const {
  createUploadDirectory,
  // deletePreviousImage,
  checkDatabaseStatus,
} = require('../middlewares/users')

const { updateProfileValidator } = require('../validator')

router.post(
  '/profile/updateProfile',
  verifyToken,
  updateProfileValidator,
  updateProfile,
)
router.post(
  '/profile/uploadProfileImage',
  verifyToken,
  checkDatabaseStatus,
  createUploadDirectory,
  // deletePreviousImage,
  uploadProfileImage,
)

router.post('/profile/readImage', verifyToken, readImage)
router.post('/profile/readProfile', verifyToken, readProfile)

module.exports = router
