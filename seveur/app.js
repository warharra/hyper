require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const chalk = require('chalk')
const passport = require('passport')
var FortyTwoStrategy = require('passport-42').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy

//app
const app = express()
const http = require('http').createServer(app)
var User = {}
//import routes
const authRoutes = require('./routes/auth')
const movieRoutes = require('./routes/movie')
const userRoutes = require('./routes/user')
const pool = require('./db')
const error = require('./controllers/error')

//middlewares
app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.json())

//routes middlewares
app.use('/api', authRoutes)
app.use('/api', movieRoutes)
app.use('/api', userRoutes)

passport.serializeUser((user, cb) => {
  cb(null, user)
})

passport.deserializeUser((user, cb) => {
  cb(null, user)
})

passport.use(
  new GoogleStrategy(
    {
      clientID:
        '621024674981-r11gercjdv0b22nejofm3om64hh2bifg.apps.googleusercontent.com',
      clientSecret: 'xHpox7DueTpHuOpT4sj72Vwj',
      callbackURL: 'http://localhost:9000/auth/google/callback',
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log(profile)
      // User.findOrCreate({ fortytwoId: profile.id }, function (err, user) {
      User = { ...profile }
      const generateJwt = jwt.sign({ _id: userUuidd }, process.env.JWT_SECRET, {
        xpiresIn: 86400,
      })
      return cb(err, profile, generateJwt)
      // })
    },
  ),
)

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
)
app.get(
  '/auth/google/callback',
  passport.authenticate('google', (req, res) => {
    res.redirect('/')
  }),
)

passport.use(
  new FortyTwoStrategy(
    {
      clientID:
        'ccaae51de870948d512c9091a785490ef0dd1e86d1a3c262dcb27e66d505ec55',
      clientSecret:
        'f44a86c7273f9c5f8a5e56a3e7348b728a4031d15db21c52c3d03d66e9ad1fc9',
      callbackURL: 'http://localhost:9000/auth/42/callback',
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log(profile)
      // User.findOrCreate({ fortytwoId: profile.id }, function (err, user) {
      User = { ...profile }
      const generateJwt = jwt.sign({ _id: userUuidd }, process.env.JWT_SECRET, {
        xpiresIn: 86400,
      })
      return cb(err, profile, generateJwt)
      // })
    },
  ),
)

app.get('/auth/42', passport.authenticate('42'))
app.get(
  '/auth/42/callback',
  passport.authenticate('42', (req, res) => {
    res.redirect('/movie')
  }),
)
app.get('/user', (req, res) => {
  console.log('getting user data')
  res.send(user)
})

const port = process.env.PORT || 9000
http.listen(port, () => {
  console.log(chalk.blue(`App listen on port ${port}`))
})
