import React, { useState } from 'react'
import { signup } from '../../api/auth'
import {
  verifValidated,
  verifValidatedPassword,
  verifImage,
} from '../functions/utils'
import './Signup.css'
import { notificationAlert } from '../functions/notification'

import { Row, Col, Image } from 'react-bootstrap'
const Signup = () => {
  const [values, setValues] = useState({
    email: '',
    pseudo: '',
    firstName: '',
    lastName: '',
    password: '',
    uploading: false,
    base64Image: '',
    err: '',
    msg: '',
  })

  const getBase64 = (file) => {
    if (!file) return
    else {
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const picture = reader.result
        if (!picture.match(/^(data:image\/)[A-Za-z0-9+/=]/)) {
          // const errors = []
          // errors.push('Image format not valid')
          // setValues
          return
        } else setValues({ ...values, base64Image: picture })
      }
    }
  }

  const uploadImage = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    if (file !== undefined) {
      getBase64(file)
    }
  }

  const handleChange = (name) => (event) => {
    const tmp = {
      ...values,
      [name]: event.target.value,
    }
    setValues(tmp)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const verif = verifValidated(values, 'en')
    const verifPassword = verifValidatedPassword(values.password, 'en')
    const validImage = verifImage(values.base64Image)

    let error = ''
    if (
      verif.err !== null ||
      verifPassword.err !== null ||
      validImage.err !== null
    ) {
      if (verifPassword.err !== null) error = verifPassword.err
      else if (verif.err !== null) error = verif.err
      else if (validImage.err !== null) error = validImage.err

      notificationAlert(error, 'danger', 'bottom-center')
    } else {
      signup({
        email: values.email,
        pseudo: values.pseudo,
        firstName: values.firstName,
        lastName: values.lastName,
        password: values.password,
        base64Image: values.base64Image,
      })
        .then((data) => {
          if (!data) {
            notificationAlert('Server down', 'danger', 'bottom-center')
            return
          } else if (data.err) {
            notificationAlert(data.err, 'danger', 'bottom-center')
          } else {
            notificationAlert(data.msg, 'success', 'bottom-center')
            setValues({
              ...values,
              pseudo: '',
              firstName: '',
              lastName: '',
              password: '',
              emailConfirm: values.email,
              email: '',
              base64Image: '',
            })
          }
        })
        .catch((err) => console.log(values.err))
    }
  }

  const handleImage = () => {
    if (values.base64Image) {
      return (
        <div style={{ position: 'relative' }}>
          <label htmlFor="single" className="imgProfile mb-0">
            <Image
              className="imgSignup"
              src={values.base64Image}
              roundedCircle
            />
          </label>
        </div>
      )
    } else {
      return (
        <label htmlFor="single" className="mb-0">
          <Image
            className="imgSignup"
            src={
              'https://png.pngtree.com/png-vector/20190805/ourlarge/pngtree-account-avatar-user-abstract-circle-background-flat-color-icon-png-image_1650938.jpg'
            }
            roundedCircle
          />
        </label>
      )
    }
  }

  return (
    <div className="signup">
      <form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <div className="profile-header-container">
              <div>
                {handleImage()}
                <input
                  style={{ display: 'none' }}
                  type="file"
                  name="file"
                  id="single"
                  onChange={uploadImage}
                />
              </div>
            </div>
          </Col>
          <Col>
            <div className="form-group">
              <label>FirstName</label>
              <input
                onChange={handleChange('firstName')}
                type="text"
                className="form-control"
                value={values.firstName}
                required
                autoComplete="on"
              />
            </div>
            <div className="form-group">
              <label>LastName</label>
              <input
                onChange={handleChange('lastName')}
                type="text"
                className="form-control"
                value={values.lastName}
                required
                autoComplete="on"
              />
            </div>
          </Col>
        </Row>
        <div className="form-group">
          <label>UserName</label>
          <input
            onChange={handleChange('pseudo')}
            type="text"
            className="form-control"
            value={values.pseudo}
            required
            autoComplete="on"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            onChange={handleChange('email')}
            type="email"
            className="form-control"
            value={values.email}
            required
            autoComplete="on"
          />
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
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary  mt-5 btn-block text-uppercase signup-btn"
        >
          Sign up
        </button>
      </form>
    </div>
  )
}

export default Signup
