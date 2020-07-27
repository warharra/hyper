const error = require('./error')
const pool = require('../db')
const utils = require('../utility/utils')
const _ = require('lodash')
const chalk = require('chalk')
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const fs = require('fs')
const request = require('request')
const { title } = require('process')
const { hash } = require('bcrypt')
var https = require('https')
var torrentStream = require('torrent-stream')

exports.isAuthenticated = (req, res) => {
  return res.json({ auth: true })
}

exports.sendComment = (req, res) => {
  const { movie_id, comment } = req.body.data
  console.log('sendComment')
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
  console.log('getComment')
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

exports.viewMovie = (req, res) => {
  const id = req.body.id
  let view = 0
  console.log('viewMovie')
  pool.getConnection((err, connection) => {
    if (err) {
      error.handleError(res, err, 'Internal error', 500, connection)
    } else {
      connection.query(
        `SELECT * FROM movies WHERE IdFilm= ?`,
        [id],
        (err, result) => {
          if (err) {
            error.handleError(res, err, 'Internal error', 500, connection)
          } else if (result !== undefined && result.length > 0) {
            connection.query(
              `SELECT * FROM view WHERE Uuid_user= ? AND IdFilm = ?`,
              [req.userUuid, id],
              (err, result) => {
                if (err) {
                  error.handleError(res, err, 'Internal error', 500, connection)
                } else if (result !== undefined && result.length > 0) {
                  view = 2
                  connection.release
                  return res.json(view)
                } else {
                  view = 1
                  console.log('**********************************888')
                  connection.release
                  return res.json(view)
                }
              },
            )
          } else {
            connection.release
            return res.json(view)
          }
        },
      )
    }
  })
}
exports.isDownload = (req, res) => {
  const { title, id, torrents } = req.body.data
  let hash = torrents[1].hash
  console.log(url)
  let file = __dirname + `/../movie/`

  var engine = torrentStream('magnet:?xt=urn:btih:' + hash, { path: file })

  engine.on('ready', function () {
    console.log(engine.files)
    engine.files.forEach(function (file) {
      var stream = file.createReadStream()
    })
  })

  pool.getConnection((err, connection) => {
    if (err) {
      error.handleError(res, err, 'Internal error', 500, connection)
    } else {
      connection.query(
        `SELECT * FROM movies WHERE NameMovie= ?`,
        [title],
        (err, result) => {
          if (err) {
            error.handleError(res, err, 'Internal error', 500, connection)
          } else if (result[0] === undefined || result[0].length < 0) {
            connection.query(
              `INSERT INTO movies(NameMovie, pathMovie, IdFilm, dateMovie) VALUES (?,?,?,NOW()); INSERT INTO  view (NameMovieView, Uuid_user ) VALUES(?, ?)`,
              [title, file, id, title, req.userUuid],

              (err, result) => {
                if (err) {
                  error.handleError(res, err, 'Internal error', 500, connection)
                } else {
                  connection.release
                  return res.json('insert movie ok')
                }
              },
            )
          } else {
            connection.query(
              `UPDATE movies SET dateMovie = NOW() WHERE NameMovie = ?`,
              [title],
              (err, result) => {
                if (err) {
                  error.handleError(res, err, 'Internal error', 500, connection)
                } else {
                  connection.release
                  return res.json('update date ok')
                }
              },
            )
          }
        },
      )
    }
  })
}

exports.getVideo = (req, res) => {
  console.log('GETVIDEO')
  var id_film = req.params.id
  let T = id_film.replace(/ /g, '.')
  let TT = T.replace('(', '')
  let name = TT.replace(')', '')
  console.log(name)
  let path =
    __dirname +
    `/../movie/${id_film} [720p] [BluRay] [YTS.MX]/${name}.720p.BluRay.x264.AAC-[YTS.MX].mp4`
  fs.stat(path, (err, stat) => {
    if (err) return res.status(500).send('internal error')
    const fileSize = stat.size
    const range = req.headers.range
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      if (start >= fileSize) {
        res
          .status(416)
          .send('Requested range not satisfiable\n' + start + ' >= ' + fileSize)
        return
      }
      const chunksize = end - start + 1
      const file = fs.createReadStream(path, { start, end })
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(206, head)
      file.pipe(res)
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(200, head)
      fs.createReadStream(path).pipe(res)
    }
  })
}
