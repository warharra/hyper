import React, { Fragment } from 'react'
import { useParams, Redirect } from 'react-router-dom'

const Auth42 = () => {
  let { id } = useParams()
  let { token } = useParams()
  let { pseudo } = useParams()
  let data = {
    token: token,
    user: {
      _id: id,
      _pseudo: pseudo,
    },
    msg: 'successful authentication',
  }

  localStorage.setItem('jwt', JSON.stringify(data))

  return (
    <Fragment>
      <Redirect to="/movie" />
    </Fragment>
  )
}

export default Auth42
