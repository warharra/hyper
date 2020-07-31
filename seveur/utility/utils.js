const error = require('../controllers/error')
const pool = require('../db')
const _ = require('lodash')
const uuidv4 = require('uuid/v4')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.getUserName = (userUuid) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        error.handleError(res, err, 'Internal error', 500, connection)
      } else {
        connection.query(
          `SELECT UserName FROM user  WHERE Uuid = ?;`,
          [userUuid],
          (err, result) => {
            if (err) {
              reject('Internal Error')
            } else {
              connection.release
              resolve(result)
            }
          },
        )
      }
    })
  })
}

exports.getUserInfos = (userUuid) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        error.handleError(res, err, 'Internal error', 500, connection)
      } else {
        connection.query(
          `SELECT * FROM user WHERE Uuid= ?`,
          [userUuid],
          (err, result) => {
            connection.release()
            if (err) {
              reject('Internal Error')
            } else {
              resolve(result)
            }
          },
        )
      }
    })
  })
}
const generateJwt = (userUuid) => {
  return jwt.sign({ _id: userUuid }, process.env.JWT_SECRET, {
    expiresIn: 86400, // expires in 24 hours
  })
}
exports.getUserOuth = (userName) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        error.handleError(res, err, 'Internal error', 500, connection)
      } else {
        connection.query(
          `SELECT * FROM user WHERE userName= ? `,
          [userName],
          (err, result) => {
            connection.release()
            if (err) {
              reject('Internal Error')
            } else if (result[0] === undefined || result[0].length === 0) {
              resolve('user not find')
            } else {
              const userUuid = result[0].Uuid
              const pseudo = userName
              const token = generateJwt(result[0].userUuid)
              console.log('token:', token)
              resolve({
                token: token,
                user: {
                  _id: userUuid,
                  _pseudo: pseudo,
                },
                msg: 'successful authentication',
              })
            }
          },
        )
      }
    })
  })
}
exports.setUserOuth = (email, userName, firstName, lastName, photos) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        error.handleError(res, err, 'Internal error', 500, connection)
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            error.handleError(res, err, 'Internal error', 500, connection)
          } else {
            bcrypt.hash('Matcha123.', salt, (err, hash) => {
              if (err) {
                error.handleError(res, err, 'Internal error', 500, connection)
              } else {
                const userUuid = uuidv4()
                connection.query(
                  'INSERT INTO User (Uuid, Email, Password, UserName, FirstName, LastName, ImageProfile) VALUES (?, ?, ?, ?, ?, ?, ?)',
                  [
                    userUuid,
                    email,
                    hash,
                    userName,
                    firstName,
                    lastName,
                    photos,
                  ],
                  (err, result) => {
                    connection.release()
                    if (err) {
                      reject('Internal Error')
                    } else {
                      resolve(`success`)
                    }
                  },
                )
              }
            })
          }
        })
      }
    })
  })
}
