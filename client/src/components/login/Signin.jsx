import React, { useState } from 'react'
import { signin, passport } from '../../api/auth'
import { Redirect } from 'react-router-dom'
import './Signin.css'
import { notificationAlert } from '../functions/notification'

const Signin = ({ forgotPassword }) => {
  const [values, setValues] = useState({
    pseudo: '',
    password: '',
    redirect: false,
  })

  const handleChange = (name) => (event) => {
    const tmp = { ...values, [name]: event.target.value }
    setValues(tmp)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    signin({
      pseudo: values.pseudo,
      password: values.password,
    })
      .then((data) => {
        if (!data) {
          notificationAlert('Server down', 'danger', 'bottom-center')
          return
        } else if (data.err) {
          notificationAlert(data.err, 'danger', 'bottom-center')
        } else {
          if (typeof window !== 'undefined') {
            localStorage.setItem('jwt', JSON.stringify(data))
          } else {
            console.error('Failed to save in local storage')
          }
          setValues({ ...values, redirect: true })
        }
      })
      .catch((err) => console.log(err))
  }

  const redirectUser = () => {
    if (values.redirect) {
      return <Redirect to="/movie" />
    }
  }

  return (
    <div className="signin">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>UserName</label>
          <input
            onChange={handleChange('pseudo')}
            type="text"
            className="form-control"
            value={values.pseudo}
            autoComplete="on"
            required
          ></input>
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            onChange={handleChange('password')}
            type="password"
            className="form-control"
            value={values.password}
            required
            autoComplete="on"
          ></input>
        </div>
        <button
          type="submit"
          className="btn btn-primary  mt-5  btn-block text-uppercase signin-btn"
        >
          Log in
        </button>
        <button
          className="btn btn-link btn-block mt-4"
          onClick={forgotPassword}
        >
          Forgot password ?
        </button>
        <div>
          -----------------------------------Or login
          with-----------------------------------
        </div>
        {redirectUser()}
      </form>
      <div className="oAuth_section">
        <button
          className="oAuthButton"
          id="google"
          onClick={() =>
            (window.location = 'http://localhost:9000/auth/google/callback')
          }
        >
          <img
            style={{ paddingTop: '5px' }}
            width={44}
            height={43}
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Google_Chrome_icon_%282011%29.svg/1024px-Google_Chrome_icon_%282011%29.svg.png"
            alt="42"
          />
        </button>
        <button
          className="oAuthButton"
          id="42"
          onClick={() =>
            (window.location = 'http://localhost:9000/auth/42/callback')
          }
        >
          <img
            style={{ paddingTop: '7px' }}
            width={41}
            height={43}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRt9gckaXPjo4iCLf_EJwCkvF0Tvmu7jUryLF0AN8QVdUYLKMgx&usqp=CAU"
            alt="42"
          />
        </button>
        {/* </a> */}
      </div>
    </div>
  )
}

export default Signin
