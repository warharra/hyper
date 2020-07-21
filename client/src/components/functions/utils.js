var lang = 'en'
console.log(lang)
var errChamps =
  lang === 'fr'
    ? 'tout les champs doivent être remplis'
    : 'all fields must be completed'
var errEmail = lang === 'fr' ? "L'email n'est pas valide" : 'Email is not valid'
var errPass =
  lang === 'fr'
    ? 'Le mot de passe doit contenir plus de 5 caractères, avoir au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial ( &#($_);.+!- )'
    : 'The password must contain more than 5 characters, have at least one lowercase letter, one capital letter, one number and one special character (& # ($ _);. +! -)'
var errLenght =
  lang === 'fr'
    ? 'Les champs principaux doivent faire plus de 3 et moins de 20 caractères'
    : 'The main fields must be more than 3 and less than 20 characters'

export const verifValidatedPassword = (password, language) => {
  lang = language

  let rgxpassword = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[&#($_);.+\-!])/

  if (password === '' || password === null || password === undefined) {
    return { err: errChamps }
  } else if (password.length < 6 || password.length > 30) {
    return {
      err: errPass,
    }
  } else if (!rgxpassword.test(password)) {
    return {
      err: errPass,
    }
  }
  return {
    err: null,
  }
}

export const verifValidatedEmail = (email, language) => {
  lang = language
  let rgxmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (email === '' || email === null || email === undefined) {
    return { err: errChamps }
  } else if (!rgxmail.test(email)) {
    return { err: errEmail }
  }
  return {
    err: null,
  }
}
export const verifImage = (image) => {
  if (image === null || image === undefined || image === '') {
    return {
      err: errChamps,
    }
  } else
    return {
      err: null,
    }
}

export const verifValidated = (values) => {
  let lenFirstName = values.firstName.trim().length
  let lenLastName = values.lastName.trim().length
  let lenPseudo = values.pseudo.trim().length
  // const verifPassword = verifValidatedPassword(values.password);
  const verifEmail = verifValidatedEmail(values.email)

  if (verifEmail !== null) {
    if (verifEmail.err !== null) {
      return { err: errEmail }
    } else if (
      lenFirstName < 3 ||
      lenFirstName > 20 ||
      lenLastName < 3 ||
      lenLastName > 20 ||
      lenPseudo < 3 ||
      lenPseudo > 20
    ) {
      return {
        err: errLenght,
      }
    }
  }
  return {
    err: null,
  }
}
