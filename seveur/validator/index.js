var lang = 'en'
var errChamps =
  lang === 'fr'
    ? 'tout les champs doivent être remplis'
    : 'all fields must be completed'
var errEmail = lang === 'fr' ? "L'email n'est pas valide" : 'Email is not valid'
var errPass =
  lang === 'fr'
    ? 'Le mot de passe doit contenir plus de 5 caractères, avoir au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial ( &#($_);.+!- )'
    : 'The password must contain more than 5 characters, have at least one lowercase letter, one capital letter, one number and one special character (& # ($ _);. +! -)'
var errPseudo =
  lang === 'fr' ? "Le pseudo n'est pas valide" : 'UserName is not valid'
var errLenght =
  lang === 'fr'
    ? 'Erreur de Longueur des valeurs min-max'
    : 'The main fields must be more than 3 and less than 20 characters'

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

exports.userSignupValidator = (req, res, next) => {
  // check if variable is undefined
  if (
    typeof req.body.email === 'undefined' ||
    typeof req.body.pseudo === 'undefined' ||
    typeof req.body.firstName === 'undefined' ||
    typeof req.body.lastName === 'undefined' ||
    typeof req.body.password === 'undefined'
  ) {
    return res.status(400).json({
      err: errChamps,
    })
  }

  //check if variable is null
  if (
    req.body.email === null ||
    req.body.pseudo === null ||
    req.body.firstName === null ||
    req.body.lastName === null ||
    req.body.password === null
  ) {
    return res.status(400).json({
      err: errChamps,
    })
  }

  // check if email is valid
  const rgxEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (!rgxEmail.test(String(req.body.email).toLowerCase())) {
    return res.status(400).json({
      err: errEmail,
    })
  }

  // check if password is valid
  const regexPwd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[&#($_);.+!-])[0-9a-zA-Z&#($_);.+!-]{6,}$/
  if (!regexPwd.test(String(req.body.password))) {
    return res.status(400).json({
      err: errPass,
    })
  }

  //check if pseudo is valid (letter , number, certains special chars)

  const regexPseudo = /^[0-9a-zA-Z&#($_);.+!-]{1,}$/
  if (!regexPseudo.test(String(req.body.pseudo))) {
    return res.status(400).json({
      err: errPseudo,
    })
  }

  // check length of variable
  req.body.firstName = escapeHtml(req.body.firstName)
  req.body.lastName = escapeHtml(req.body.lastName)

  if (
    req.body.email.length > 255 ||
    req.body.pseudo.length > 40 ||
    req.body.password.length > 30 ||
    req.body.firstName.length > 255 ||
    req.body.firstName.length < 3 ||
    req.body.lastName.length > 255 ||
    req.body.lastName.length < 3
  ) {
    return res.status(400).json({
      err: errLenght,
    })
  }

  next()
}

exports.userSigninValidator = (req, res, next) => {
  if (
    typeof req.body.pseudo === 'undefined' ||
    typeof req.body.password === 'undefined' ||
    req.body.pseudo === null ||
    req.body.password === null ||
    req.body.pseudo.trim().length === 0 ||
    req.body.password.trim().length === 0
  ) {
    return res.status(400).json({
      err: errChamps,
    })
  }

  next()
}

// TODO middleware check email --> forgot password

// TODO middleware check email and pasword --> recoverPassword
exports.forgotPasswordValidator = (req, res, next) => {
  if (
    typeof req.body.email === 'undefined' ||
    req.body.email === null ||
    req.body.email.trim().length === 0
  ) {
    return res.status(400).json({
      err: errChamps,
    })
  }
  const rgxEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (!rgxEmail.test(String(req.body.email).toLowerCase())) {
    return res.status(400).json({
      err: errEmail,
    })
  }
  next()
}
exports.recoverPasswordValidator = (req, res, next) => {
  if (
    typeof req.body.email === 'undefined' ||
    typeof req.body.password === 'undefined' ||
    req.body.email === null ||
    req.body.password === null ||
    req.body.email.trim().length === 0 ||
    req.body.password.trim().length === 0 ||
    req.body.password.length > 30
  ) {
    return res.status(400).json({
      err: errChamps,
    })
  }

  const rgxEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (!rgxEmail.test(String(req.body.email).toLowerCase())) {
    return res.status(400).json({
      err: errEmail,
    })
  }
  // check if password is valid
  const regexPwd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[&#($_);.+!-])[0-9a-zA-Z&#($_);.+!-]{6,}$/
  if (!regexPwd.test(String(req.body.password))) {
    return res.status(400).json({
      err: errPass,
    })
  }

  next()
}

exports.updateProfileValidator = (req, res, next) => {
  lang = req.lang
  // console.log(req.)
  // check if variable is undefined
  if (
    typeof req.body.email === 'undefined' ||
    typeof req.body.pseudo === 'undefined' ||
    typeof req.body.firstName === 'undefined' ||
    typeof req.body.lastName === 'undefined' ||
    typeof req.body.password === 'undefined'
  ) {
    return res.status(400).json({
      err: errChamps,
    })
  }
  // check if password is valid
  const regexPwd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[&#($_);.+!-])[0-9a-zA-Z&#($_);.+!-]{6,}$/
  if (!regexPwd.test(String(req.body.password))) {
    return res.status(400).json({
      err: errPass,
    })
  }

  const rgxEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (!rgxEmail.test(String(req.body.email).toLowerCase())) {
    return res.status(400).json({
      err: errEmail,
    })
  }

  //check if pseudo is valid (letter , number, certains special chars)

  const regexPseudo = /^[0-9a-zA-Z&#($_);.+!-]{1,}$/
  if (!regexPseudo.test(String(req.body.pseudo))) {
    return res.status(400).json({
      err: errPseudo,
    })
  }

  // check length of variable
  req.body.firstName = escapeHtml(req.body.firstName)
  req.body.lastName = escapeHtml(req.body.lastName)

  if (
    req.body.email.length > 255 ||
    req.body.pseudo.length > 40 ||
    req.body.firstName.length > 255 ||
    req.body.firstName.length < 3 ||
    req.body.lastName.length > 255 ||
    req.body.lastName.length < 3
  ) {
    return res.status(400).json({
      err: errLenght,
    })
  }

  next()
}
