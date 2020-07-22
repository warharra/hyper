import React, { useState, Fragment, useEffect } from 'react'
import './ProfilePicture.css'
import { Row, Container, Image } from 'react-bootstrap'
import { uploadProfileImage, readImage } from '../../api/user'
import { notificationAlert } from '../functions/notification'

const GuestProfilePicture = ({ guestUuid }) => {
  const [values, setValues] = useState({
    uploading: false,
    formData: new FormData(),
    err: '',
    msg: '',
  })

  const [base64Image, setBase64Image] = useState('')

  useEffect(() => {
    readImage(guestUuid)
      .then((data) => {
        if (!data || data.err) {
          return
        }
        setBase64Image(data.image)
      })
      .catch((err) => console.log(err))
  }, [base64Image])

  const handleChange = (event) => {
    const value = event.target.files[0]
    const jwt = JSON.parse(localStorage.getItem('jwt'))
    if (value !== undefined) {
      values.formData.set('photo', value)
      values.formData.set('userUuid', jwt.user._id)
      uploadProfileImage(values.formData)
        .then((data) => {
          if (data.err) {
            setValues({ ...values, err: data.err })
          } else {
            notificationAlert(
              'Image de profil enregistrée.',
              'success',
              'bottom-center',
            )

            setValues({ ...values, msg: data.msg })
            setBase64Image(data.image)
          }
        })
        .catch((err) => console.log(err))
    }
  }

  const handleImage = () => {
    if (base64Image) {
      return (
        <div style={{ position: 'relative' }}>
          <label htmlFor="single" className="imgProfile mb-0">
            <Image
              className="profile-header-img"
              src={'data:image/png;base64, ' + base64Image}
              roundedCircle
            />
          </label>
        </div>
      )
    } else {
      return (
        <label htmlFor="single" className="mb-0">
          <Image
            className="profile-header-img"
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
    <Fragment>
      <Container>
        <Row style={{ justifyContent: 'center' }}>
          <div className="profile-header-container">
            <div>
              {handleImage()}
              <input
                style={{ display: 'none' }}
                type="file"
                name="file"
                id="single"
                onChange={handleChange}
              />
            </div>
          </div>
        </Row>
      </Container>
    </Fragment>
  )
}

export default GuestProfilePicture
