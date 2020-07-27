import { API } from '../config'

// export const getSearchResults = (searchTerm) => {
//   let jwt = JSON.parse(localStorage.getItem('jwt'))
//   return fetch(`${API}/searchMovie/${searchTerm}`, {
//     method: 'GET',
//     headers: {
//       Accept: 'application/json',
//       Authorization: `Bearer ${jwt.token}`,
//       'Content-Type': 'application/json',
//     },
//   })
//     .then((res) => res.json())
//     .catch((err) => console.log(err))
// }
// export const movie = () => {
//   const searchTerm = 'star was'
//   getSearchResults(searchTerm).then(showResults)
// }

// // function getSearchResults(searchTerm) {
// //   return fetch(`${BASE_URL}search/${searchTerm}`).then((res) => res.json())
// // }

// export const showResults = (results) => {
//   console.log(results)
// }
export const sendComment = (data) => {
  console.log(data)
  let jwt = JSON.parse(localStorage.getItem('jwt'))
  return fetch(`${API}/sendComment`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${jwt.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err))
}

export const getComment = (movie_id) => {
  let jwt = JSON.parse(localStorage.getItem('jwt'))
  return fetch(`${API}/getComment`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${jwt.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ movie_id }),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err))
}

export const isDownload = (data) => {
  let jwt = JSON.parse(localStorage.getItem('jwt'))
  return fetch(`${API}/isDownload`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${jwt.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err))
}

export const viewMovie = (id) => {
  console.log(id)
  let jwt = JSON.parse(localStorage.getItem('jwt'))
  return fetch(`${API}/viewMovie`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${jwt.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err))
}
