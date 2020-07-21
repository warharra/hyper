const formidable = require('formidable')
const fs = require('fs')
const pool = require('../db')
const error = require('../controllers/error')
const utils = require('../utility/utils')
const _ = require('lodash')

exports.checkDatabaseStatus = (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({
        err: 'Internal Error',
      })
    } else {
      connection.release()
      next()
    }
  })
}
exports.createUploadDirectory = (req, res, next) => {
  let form = new formidable.IncomingForm()
  const types = ['png', 'jpeg', 'gif', 'svg']
  let newName = ''
  let err = ''

  form.parse(req, (err, fields, files) => {
    if (newName === null) {
      return res.status(500).json({
        err: 'Internal error : key file is not valid',
      })
    }
    req.files = files
    next()
  })
  form.on('fileBegin', (name, file) => {
    if (!fs.existsSync(__dirname + '/../images')) {
      fs.mkdirSync(__dirname + '/../images')
    }
    if (!fs.existsSync(__dirname + `/../images/${req.userName}`)) {
      fs.mkdirSync(__dirname + `/../images/${req.userName}`)
    }
    format = file.type.split('/')
    if (types.indexOf(format[1]) !== -1) {
      switch (name) {
        case 'photo':
          newName = 'imageProfile'
          break

        default:
          newName = null
      }
      file.name = newName + '.' + file.type.split('/')[1]
      file.path = __dirname + `/../images/${req.userName}/` + file.name
    }
  })
}

// exports.deletePreviousImage = (req, res, next) => {
//   pool.getConnection((err, connection) => {
//     if (err) {
//       return res.status(500).json({
//         err: 'Internal Error',
//       })
//     }
//     connection.query(
//       'SELECT `ImageProfile` FROM User WHERE Uuid= ?',
//       [req.userUuid],
//       (err, result) => {
//         if (err) {
//           error.handleError(res, err, 'Intenal error', 500, connection)
//         } else {
//           if (result[0].ImageProfile !== null) {
//             fs.unlink(result[0].ImageProfile, (err) => {
//               if (err) {
//                 error.handleError(res, err, 'Internal error', 500, connection)
//               }
//             })
//           }
//           // connection.release()
//           next()
//         }
//       },
//     )
//   })
// }
