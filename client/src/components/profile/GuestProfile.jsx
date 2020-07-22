import React, { useState, useEffect, Fragment } from 'react'
import NavbarHeader from '../navbar/Navbar'
import { Row, Col, Container, Image } from 'react-bootstrap'
import GuestProfilePicture from './GuestProfilePicture'
import './Profile.css'
import queryString from 'query-string'
import { readGuestProfile } from '../../api/user'
import { notificationAlert } from '../functions/notification'
import { useParams, Redirect } from 'react-router-dom'

const GuestProfile = ({ location }) => {
  const [values, setValues] = useState({
    pseudo: '',
    firstName: '',
    lastName: '',
    language: '',
  })
  let { id } = useParams()

  useEffect(() => {
    readGuestProfile(id)
      .then((data) => {
        console.log(data)
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

  return (
    <Fragment>
      <NavbarHeader />
      <Container>
        <Row className="main-row-container">
          <Col md={10} className="pl-5">
            <Row
              className="mt-5 mb-1 row-picture"
              style={{ justifyContent: 'center' }}
            >
              <div className="profile-header-container">
                <GuestProfilePicture iguestUuid={id} />
              </div>
            </Row>
            <Row className="pt-4 row-infos">
              <Col>
                <Row className="mb-4 pt-3 pb-3 Row">
                  <Col className="pt-4 row-infos">
                    <h2>
                      {values.language === 'fr' ? 'Pseudo :' : 'userName:'}{' '}
                      {values.pseudo}
                    </h2>
                    <h2>
                      {values.language === 'fr' ? 'Nom :' : 'LastName:'}{' '}
                      {values.firstName}
                    </h2>
                    <h2>
                      {values.language === 'fr' ? 'Prenom :' : 'FirstName:'}{' '}
                      {values.lastName}
                    </h2>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </Fragment>
  )
}
export default GuestProfile
