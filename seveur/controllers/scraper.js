const error = require('./error')
const pool = require('../db')
const utils = require('../utility/utils')
const _ = require('lodash')
const chalk = require('chalk')
const fetch = require('node-fetch')
const cheerio = require('cheerio')

exports.isAuthenticated = (req, res) => {
  return res.json({ auth: true })
}

exports.sendComment = (req, res) => {
  const { movie_id, comment } = req.body.data
  pool.getConnection((err, connection) => {
    if (err) {
      error.handleError(res, err, 'Internal error', 500, connection)
    } else {
      connection.query(
        `SELECT UserName FROM user WHERE Uuid= ?`,
        [req.userUuid],
        (err, result) => {
          if (err) {
            error.handleError(res, err, 'Internal error', 500, connection)
          } else {
            console.log(result)
            connection.query(
              `INSERT INTO comment(userName, movie_id, comment) VALUES (?, ?, ?)`,
              [result[0].UserName, movie_id, comment],
              (err, result) => {
                if (err) {
                  error.handleError(res, err, 'Internal error', 500, connection)
                } else {
                  connection.release
                  return res.json({ msg: 'comment save' })
                }
              },
            )
          }
        },
      )
    }
  })
}

exports.getComment = (req, res) => {
  const { movie_id } = req.body
  pool.getConnection((err, connection) => {
    if (err) {
      error.handleError(res, err, 'Internal error', 500, connection)
    } else {
      connection.query(
        `SELECT comment, UserName FROM comment WHERE movie_id= ?`,
        [movie_id],
        (err, result) => {
          if (err) {
            error.handleError(res, err, 'Internal error', 500, connection)
          } else {
            let tabComment = result.map((e) => {
              return {
                userName: e.UserName,
                comment: e.comment,
              }
            })
            console.log(tabComment)
            connection.release
            return res.json(tabComment)
          }
        },
      )
    }
  })
}
