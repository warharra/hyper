const error = require('../controllers/error')
const pool = require('../db')
const _ = require('lodash')

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
