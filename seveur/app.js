require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const chalk = require('chalk')
const passport = require('passport')

const GoogleStrategy = require('passport-google-oauth20').Strategy
const utils = require('./utility/utils')
const jwt = require('jsonwebtoken')
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
app.use(passport.initialize())
app.use(passport.session())
var FortyTwoStrategy = require('passport-42').Strategy

passport.serializeUser((user, cb) => {
  console.log('______________________-----')
  console.log(user)
  cb(null, user)
})
passport.deserializeUser((user, cb) => {
  console.log(user)
  cb(null, user)
})
passport.use(
  new GoogleStrategy(
    {
      clientID:
        '1056953163850-jkbpdrgdjpeg423bf75s1g6mdfj0ccjl.apps.googleusercontent.com',
      clientSecret: 'H6cYsFmuPejl30Aa1sTM16Lv',
      callbackURL: 'http://localhost:9000/auth/google/callback',
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, cb) => {
      let result = await utils.getUserOuth(profile.displayName)
      console.log('result:', result)
      if (result === 'user not find') {
        let register = await utils.setUserOuth(
          profile.emails[0].value,
          profile.displayName,
          profile.name.givenName,
          profile.name.familyName,
          profile.photos[0].value,
        )
        if (register === `success`) {
          result = await utils.getUserOuth(profile.displayName)
        }
      }
      return cb(null, result)
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
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/login',
  }),
  function (req, res) {
    console.log('connected')
    // Successful authentication, redirect home
    res.redirect(
      `http://localhost:3000/auth/42/callback/${req.user.user._id}/${req.user.token}/${req.user.user._pseudo}`,
    )
  },
)

passport.use(
  new FortyTwoStrategy(
    {
      clientID:
        'ccaae51de870948d512c9091a785490ef0dd1e86d1a3c262dcb27e66d505ec55',
      clientSecret:
        'f44a86c7273f9c5f8a5e56a3e7348b728a4031d15db21c52c3d03d66e9ad1fc9',
      callbackURL: 'http://localhost:9000/auth/42/callback',
      profileFields: {
        id: function (obj) {
          return String(obj.id)
        },
        username: 'login',
        displayName: 'displayname',
        'name.familyName': 'last_name',
        'name.givenName': 'first_name',
        profileUrl: 'url',
        'emails.0.value': 'email',
        'phoneNumbers.0.value': 'phone',
        'photos.0.value': 'image_url',
      },
    },
    async (req, accessToken, refreshToken, profile, done) => {
      console.log(profile.username)
      console.log('profile: ', profile)
      let result = await utils.getUserOuth(profile.username)
      console.log('result :', result)
      if (result === 'user not find') {
        let register = await utils.setUserOuth(
          profile.emails[0].value,
          profile.username,
          profile.name.givenName,
          profile.name.familyName,
          profile.photos[0].value,
        )
        if (register === `success`) {
          result = await utils.getUserOuth(profile.username)
        }
      }
      console.log('(((((((((((((((((((((((((((((((')
      console.log(result)
      return done(null, result)
    },
  ),
)
app.get('/auth/42', () => {
  passport.authenticate('42')
})

app.get(
  '/auth/42/callback',
  passport.authenticate('42', {
    failureRedirect: 'http://localhost:3000/login',
  }),
  function (req, res) {
    console.log('req.user')
    // Successful authentication, redirect home
    res.redirect(
      `http://localhost:3000/auth/42/callback/${req.user.user._id}/${req.user.token}/${req.user.user._pseudo}`,
    )
  },
)

const port = process.env.PORT || 9000
http.listen(port, () => {
  console.log(chalk.blue(`App listen on port ${port}`))
})
