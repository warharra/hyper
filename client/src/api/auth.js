import { API } from '../config'

export const isAuthenticated = () => {
  let jwt = JSON.parse(localStorage.getItem('jwt'))
  console.log(jwt.token)
  return fetch(`${API}/isAuthenticated`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + jwt.token,
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err))
}
export const logout = () => {
  let jwt = JSON.parse(localStorage.getItem('jwt'))
  let userUuid = jwt.user._id
  return fetch(`${API}/logout`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + jwt.token,
    },
    body: JSON.stringify({ userUuid }),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err))
}

export const signup = (data) => {
  return fetch(`http://localhost:9000/api/signup`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err))
}

export const signin = (data) => {
  console.log(data)
  return fetch(`${API}/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err))
}

export const forgotPassword = (data) => {
  return fetch(`${API}/forgotPassword`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err))
}
export const recoverPassword = (data) => {
  return fetch(`${API}/recoverPassword`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err))
}

export const verifyAccount = (uuid, signal) => {
  return fetch(`${API}/verifyAccount`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uuid: uuid }),
    signal: signal,
  })
    .then((res) => res.json())
    .catch((err) => console.log(err))
}

export const lang = () => {
  let jwt = JSON.parse(localStorage.getItem('jwt'))
  let userUuid = jwt.user._id
  return fetch(`${API}/lang`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${jwt.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userUuid }),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err))
}
