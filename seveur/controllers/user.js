const fs = require('fs')
const error = require('./error')
const pool = require('../db')
const utils = require('../utility/utils')
const _ = require('lodash')
const path = require('path')
const bcrypt = require('bcrypt')

exports.updateProfile = (req, res) => {
  const {
    email,
    pseudo,
    firstName,
    lastName,
    userUuid,
    language,
    password,
  } = req.body
  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({
        err: 'Internal Error HERE',
      })
    } else {
      connection.query(
        'SELECT * FROM User WHERE Email = ?; SELECT * FROM User WHERE Username = ?',
        [email, pseudo],
        (err, result) => {
          if (err) {
            error.handleError(res, err, 'Internal error', 500, connection)
          } else if (result[0].length > 0 && result[0][0].Uuid !== userUuid) {
            error.handleError(
              res,
              err,
              'Cet email a déjà un compte associé.',
              409,
              connection,
            )
          } else if (result[1].length > 0 && result[1][0].Uuid !== userUuid) {
            error.handleError(
              res,
              err,
              "Ce pseudo n'est pas disponible.",
              409,
              connection,
            )
          } else {
            bcrypt.genSalt(10, (err, salt) => {
              if (err) {
                error.handleError(res, err, 'Internal error', 500, connection)
              } else {
                bcrypt.hash(password, salt, (err, hash) => {
                  if (err) {
                    error.handleError(
                      res,
                      err,
                      'Internal error',
                      500,
                      connection,
                    )
                  } else
                    connection.query(
                      'UPDATE `user` SET `Email`= ?, `UserName`= ?,`FirstName` = ?,`LastName` = ?, `Password` = ?, `Language` = ? WHERE `Uuid` = ?',
                      [
                        email,
                        pseudo,
                        firstName,
                        lastName,
                        hash,
                        language,
                        req.userUuid,
                      ],
                      (err, result) => {
                        if (err) {
                          error.handleError(
                            res,
                            err,
                            'Internal error',
                            500,
                            connection,
                          )
                        } else {
                          connection.release()
                          return res.json({ msg: 'Profil mis à jour' })
                        }
                      },
                    )
                })
              }
            })
          }
        },
      )
    }
  })
}

exports.uploadProfileImage = (req, res) => {
  let userUuid = req.userUuid
  let file = req.files.photo
  const types = ['.png', '.jpeg', '.gif', '.svg']

  if (types.indexOf(path.extname(file.name)) === -1) {
    return res.status(400).json({
      err: 'format invalide',
    })
  }
  var bitmap = fs.readFileSync(
    __dirname + `/../images/${req.userName}/` + file.name,
  )
  image64 = new Buffer.from(bitmap).toString('base64')
  pool.getConnection((err, connection) => {
    if (err) {
      error.handleError(res, err, 'Internal error', 500, connection)
    } else {
      connection.query(
        'UPDATE `user` SET `ImageProfile`= ? WHERE Uuid= ?',
        [file.path, userUuid],
        (err, result) => {
          if (err) {
            error.handleError(res, err, 'Internal error', 500, connection)
          } else {
            connection.release()
          }
        },
      )
    }
  })

  return res.json({
    image: image64,
    msg: 'Profile image upload',
  })
}

exports.readImage = (req, res) => {
  let uuid = req.userUuid
  console.log(uuid)
  let image64 = ''
  pool.getConnection((err, connection) => {
    if (err) {
      error.handleError(res, err, 'Internal error', 500, connection)
    } else {
      connection.query(
        'SELECT ImageProfile FROM User WHERE Uuid = ?',
        [uuid],
        (err, result) => {
          if (err) {
            error.handleError(res, err, 'Internal error', 500, connection)
          } else {
            connection.release()
            if (fs.existsSync(result[0].ImageProfile)) {
              const bitmap = fs.readFileSync(result[0].ImageProfile)
              image64 = new Buffer.from(bitmap).toString('base64')
              return res.json({
                image: image64,
                imageFakeProfile: null,
              })
            }
          }
        },
      )
    }
  })
}

exports.readProfile = async (req, res) => {
  console.log('readProfile')
  pool.getConnection((err, connection) => {
    if (err) {
      error.handleError(res, err, 'Internal error', 500, connection)
    } else {
      connection.query(
        `SELECT * FROM user WHERE Uuid = ?`,
        [req.userUuid],
        (err, result) => {
          if (err) {
            error.handleError(res, err, 'Intenal error', 500, connection)
          } else {
            connection.release()
            return res.json({
              email: result[0].Email,
              pseudo: result[0].UserName,
              firstName: result[0].FirstName,
              lastName: result[0].LastName,
              language: result[0].Language,
            })
          }
        },
      )
    }
  })
}

exports.readGuestProfile = async (req, res) => {
  console.log(this.readGuestProfile)
  const uuid = req.body.guestUuid
  console.log(uuid)
  pool.getConnection((err, connection) => {
    if (err) {
      error.handleError(res, err, 'Internal error', 500, connection)
    } else {
      console.log('je rentre ici')
      connection.query(
        `SELECT * FROM user WHERE Uuid = ?`,
        [uuid],
        (err, result) => {
          if (err) {
            error.handleError(res, err, 'Intenal error', 500, connection)
          } else {
            console.log(result)
            connection.release()
            return res.json({
              pseudo: result[0].UserName,
              firstName: result[0].FirstName,
              lastName: result[0].LastName,
              language: result[0].Language,
            })
          }
        },
      )
    }
  })
}
