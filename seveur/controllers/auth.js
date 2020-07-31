const pool = require('../db')
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const transporter = require('../utility/mail')
const template = require('../utility/template/mail')
const uuidv4 = require('uuid/v4')
const error = require('./error')
const fs = require('fs')

const generateJwt = (userUuid) => {
  return jwt.sign({ _id: userUuid }, process.env.JWT_SECRET, {
    expiresIn: 86400, // expires in 24 hours
  })
}

exports.signup = (req, res) => {
  const { email, pseudo, password, firstName, lastName, base64Image } = req.body
  let uuid = ''

  function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
    var response = {}
    if (matches.length !== 3) {
      return res.json({
        err: 'Invalid input string',
      })
    }
    response.type = matches[1]
    response.data = new Buffer(matches[2], 'base64')
    return response
  }
  if (!fs.existsSync(__dirname + `/../images/${pseudo}`)) {
    fs.mkdirSync(__dirname + `/../images/${pseudo}`)
  }
  var imageTypeRegularExpression = /\/(.*?)$/
  var imageBuffer = decodeBase64Image(base64Image)
  var imageTypeDetected = imageBuffer.type.match(imageTypeRegularExpression)
  var Path =
    __dirname +
    `/../images/${pseudo}/` +
    'photoProfile' +
    '.' +
    imageTypeDetected[1]
  try {
    require('fs').writeFile(Path, imageBuffer.data, function () {
      console.log(
        'DEBUG - feed:message: Saved to disk image attached by user:',
        Path,
      )
    })
  } catch (error) {
    console.log(error)
  }
  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({
        err: 'Internal Error',
      })
    }
    connection.query(
      'SELECT * FROM User WHERE Email = ?; SELECT * FROM User WHERE Username = ?',
      [[email], [pseudo]],
      (err, result) => {
        const userUuid = uuidv4()
        if (err) {
          error.handleError(res, err, 'Internal error', 500, connection)
        } else if (result[0].length > 0) {
          error.handleError(
            res,
            err,
            ' This email already has an associated account.',
            409,
            connection,
          )
        } else if (result[1].length > 0) {
          error.handleError(
            res,
            err,
            'This nickname is not available.',
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
                  error.handleError(res, err, 'Internal error', 500, connection)
                } else {
                  connection.query(
                    'INSERT INTO User (Uuid, Email, Password, UserName, FirstName, LastName, ImageProfile) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [userUuid, email, hash, pseudo, firstName, lastName, Path],
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
                        return res.json({
                          msg: `Success`,
                        })
                      }
                    },
                  )
                }
              })
            }
          })
        }
      },
    )
  })
}

exports.signin = async (req, res) => {
  const { pseudo, password } = req.body
  console.log(req.body)
  console.log(pseudo)
  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({
        err: 'Internal error - Db down',
      })
    } else {
      connection.query(
        'SELECT UserId, Language, UserName, Password, Uuid FROM User WHERE UserName = ?',
        [pseudo],
        async (err, result) => {
          if (err) {
            error.handleError(res, err, 'Internal error', 500, connection)
          } else if (!result[0]) {
            error.handleError(
              res,
              err,
              'This userName does not correspond to any account. Please create an account',
              400,
              connection,
            )
          } else if (result.length === 1) {
            const userUuid = result[0].Uuid
            const lg = result[0].Language
            try {
              const match = await bcrypt.compare(
                password,
                result[0].Password.toString(),
              )
              if (match) {
                const token = generateJwt(userUuid)
                connection.release()
                return res.json({
                  token: token,
                  user: {
                    _id: userUuid,
                    _pseudo: pseudo,
                  },
                  msg: 'successful authentication',
                })
              } else {
                connection.release()
                return res.status(401).json({
                  token: null,
                  err: 'The password entered is incorrect.',
                })
              }
            } catch (err) {
              error.handleError(res, err, 'Internal error', 500, connection)
            }
          } else {
            // duplicate data
            error.handleError(res, err, 'Internal error', 500, connection)
          }
        },
      )
    }
  })
}

exports.forgotPassword = (req, res) => {
  const { email } = req.body
  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({
        err: 'Internal error - Db down',
      })
    } else {
      connection.query(
        'SELECT * FROM User WHERE  Email = ?',
        [email],
        (err, result) => {
          if (err) {
            error.handleError(res, err, 'Internal error', 500, connection)
          } else if (result.length === 0) {
            error.handleError(
              res,
              err,
              'The specified email does not exist',
              400,
              connection,
            )
          } else {
            const UserId = result[0].UserId
            uuid = uuidv4()
            const mailOptions = {
              from: process.env.NODEMAILER_USER,
              to: email, //email
              subject: template.templateMailForgotPasswordHeader,
              html: template.templateMailForgotPasswordgBody(
                result[0].UserName,
                'http://localhost:3000/recoverPassword/?uuid=' + uuid,
              ),
            }
            transporter.sendMail(mailOptions)
            connection.query(
              'SELECT * FROM `recover_password` WHERE UserId = ?',
              [UserId],
              (err, result) => {
                if (err) {
                  error.handleError(res, err, 'Internal error', 500, connection)
                } else if (result.length > 0) {
                  connection.query(
                    'UPDATE `recover_password` SET Uuid = ? WHERE UserId = ?',
                    [uuid, UserId],
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
                        res.json({
                          msg: `An email has been sent to ${email} in order to reset your passwor.`,
                        })
                        connection.release()
                      }
                    },
                  )
                }
              },
            )
          }
        },
      )
    }
  })
}

exports.recoverPassword = (req, res) => {
  const { email, password, uuid } = req.body
  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({
        err: 'Internal error - Db down',
      })
    } else {
      connection.query(
        'SELECT * FROM User INNER JOIN recover_password ON User.UserId = recover_password.UserId WHERE recover_password.Uuid = ? AND User.Email = ?',
        [uuid, email],
        (err, result) => {
          if (err) {
            error.handleError(res, err, 'Internal error', 500, connection)
          } else if (result.length === 0) {
            error.handleError(
              res,
              err,
              'Unauthorized transaction',
              400,
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
                  } else {
                    connection.query(
                      'UPDATE `User` SET `Password`=? WHERE `UserId`= ? AND`Email`= ?',
                      [hash, [result[0].UserId], email],
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
                          connection.query(
                            'DELETE FROM `recover_password` WHERE `Uuid` = ?',
                            [uuid],
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
                                return res.json({
                                  msg: 'Your password has been changed',
                                })
                              }
                            },
                          )
                        }
                      },
                    )
                  }
                })
              }
            })
          }
        },
      )
    }
  })
}
exports.logout = (req, res) => {
  const { userUuid } = req.body

  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({
        err: 'Internal error - Db down',
      })
    } else {
      connection.query(
        'UPDATE `User` SET `LastConnection`= NOW() WHERE `Uuid`= ?',
        [userUuid],
        (err, result) => {
          if (err) {
            error.handleError(res, err, 'Internal error', 500, connection)
          } else {
            connection.release()
            return res.json({
              msg: 'Deconnexion réussie',
            })
          }
        },
      )
    }
  })
}

exports.lang = (req, res) => {
  const { userUuid } = req.body
  console.log(userUuid)
  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({
        err: 'Internal error - Db down',
      })
    } else {
      connection.query(
        'SELECT Language FROM User WHERE `Uuid` = ?',
        [userUuid],
        (err, result) => {
          if (err) {
            error.handleError(res, err, 'Internal error', 500, connection)
          } else {
            const lg = result[0].Language
            connection.release()
            return res.json({
              Language: lg,
            })
          }
        },
      )
    }
  })
}
