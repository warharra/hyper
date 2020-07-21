const templateMailForgotPasswordHeader = 'Réinitialiser votre mot de passe'
const templateMailForgotPasswordgBody = (pseudo, email) => {
  return `<div style="border: 4px solid #fad5c0; border-radius: 3px; padding: 10px"><h1>Hypertube</h1><h4>Changer mot de passe</h4><p>Bonjour <span style="color: #fad5c0">${pseudo}</span><p/><p>Afin de réinitialiser votre mot de passe, veuillez cliquer sur le lien ci-dessous.</p><a href="${email}">${email}</a><div style="text-align: center"><img src="cid:logo"></div><hr/><p><i>Hypertube - 2020. 42 project</i></p></div>`
}

module.exports = {
  templateMailForgotPasswordHeader,
  templateMailForgotPasswordgBody,
}
