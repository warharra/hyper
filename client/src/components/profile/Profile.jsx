import React, { useState, useEffect, Fragment } from 'react'
import NavbarHeader from '../navbar/Navbar'
import ProfilePicture from './ProfilePicture'
import { Row, Col, Form, Button, Container } from 'react-bootstrap'
import { updateProfile, readProfile, readImage } from '../../api/user'
import './Profile.css'
import queryString from 'query-string'
import { verifValidated, verifValidatedPassword } from '../functions/utils'
import { notificationAlert } from '../functions/notification'

const Profile = ({ location }) => {
  const [values, setValues] = useState({
    email: '',
    pseudo: '',
    firstName: '',
    lastName: '',
    password: '',
    language: '',
  })

  const [imagesChild, setImagesChild] = useState({
    profileImage: false,
  })
  const [] = useState(0)

  useEffect(() => {
    console.log('useEffect de profile')
    const v = queryString.parse(location.search)
    readProfile(v.uuid)
      .then((data) => {
        if (data.err) {
          notificationAlert(data.err, 'danger', 'bottom-center')
        } else {
          setValues({
            ...data,
          })
        }
      })
      .catch((err) => console.log(err))
  }, [location])

  const handleChange = (name) => (event) => {
    let value = ''
    value = event.target.value
    setValues({ ...values, [name]: value })
  }

  const handleSubmit = async (event) => {
    let error = ''
    const verif = verifValidated(values, values.language)
    const verifPassword = verifValidatedPassword(
      values.password,
      values.language,
    )

    if (verif.err !== null || verifPassword.err !== null) {
      if (verifPassword.err != null) error = verifPassword.err
      else error = verif.err
      notificationAlert(error, 'danger', 'bottom-center')
    } else {
      updateProfile({
        email: values.email,
        pseudo: values.pseudo,
        firstName: values.firstName,
        lastName: values.lastName,
        password: values.password,
        language: values.language,
      })
        .then((data) => {
          if (data.err) {
            notificationAlert(data.err, 'danger', 'bottom-center')
          } else {
            notificationAlert(
              'Votre profil a été mis à jour.',
              'success',
              'bottom-center',
            )
          }
        })
        .catch((err) => console.log(err))
    }
  }

  const imageProfileSet = (value) => {
    setImagesChild({ ...imagesChild, profileImage: value })
  }

  return (
    <Fragment>
      <NavbarHeader />
      <Container>
        <Row className="main-row-container">
          <Col md={10} className="pl-5">
            <Row className="mt-5 mb-1 row-picture">
              <ProfilePicture
                imageProfileSet={(value) => imageProfileSet(value)}
              />
            </Row>
            <Row className="pt-4 row-infos">
              <Col>
                <Row className="mb-4 pt-3 pb-3 Row">
                  <Col>
                    <Form>
                      <Form.Row>
                        <Form.Group as={Col} md="6">
                          <Form.Label>
                            {values.language === 'en' ? 'lastName' : 'Nom'}
                          </Form.Label>
                          <Form.Control
                            value={values.lastName}
                            type="text"
                            placeholder="lastName"
                            onChange={handleChange('lastName')}
                          ></Form.Control>
                        </Form.Group>
                        <Form.Group as={Col} md="6">
                          <Form.Label>
                            {values.language === 'en' ? 'firstName' : 'Prenon'}
                          </Form.Label>
                          <Form.Control
                            value={values.firstName}
                            type="text"
                            placeholder="FirstName"
                            onChange={handleChange('firstName')}
                          ></Form.Control>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group as={Col} md="6">
                          <Form.Label>
                            {values.language === 'en' ? 'UserName' : 'Pseudo'}
                          </Form.Label>
                          <Form.Control
                            value={values.pseudo}
                            type="text"
                            placeholder="UserName"
                            onChange={handleChange('pseudo')}
                          ></Form.Control>
                        </Form.Group>
                        <Form.Group as={Col} md="6">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            value={values.email}
                            type="email"
                            placeholder="Email"
                            onChange={handleChange('email')}
                          ></Form.Control>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group as={Col} md="6">
                          <Form.Label>
                            {values.language === 'en'
                              ? 'password'
                              : 'Mot de passe'}
                          </Form.Label>
                          <Form.Control
                            // value={values.password}
                            type="password"
                            placeholder="password"
                            onChange={handleChange('password')}
                          ></Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} md="6">
                          <Form.Label>
                            {values.language === 'en' ? 'language' : 'Langues'}
                          </Form.Label>
                          <Form.Control
                            as="select"
                            value={values.language}
                            onChange={handleChange('language')}
                          >
                            <option value="en">
                              {' '}
                              {values.language === 'en'
                                ? 'English'
                                : 'Anglais'}{' '}
                            </option>
                            <option value="fr">
                              {' '}
                              {values.language === 'en'
                                ? 'French'
                                : 'Francais'}{' '}
                            </option>
                          </Form.Control>
                        </Form.Group>
                      </Form.Row>
                    </Form>
                  </Col>
                </Row>

                <Button
                  onClick={() => handleSubmit(values)}
                  className=" mb-5 btn-primary  btn-block text-uppercase profile-btn"
                >
                  {values.language === 'en' ? 'Validate' : 'Valider'}
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </Fragment>
  )
}
export default Profile
