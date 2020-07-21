import React, { useState, useEffect, Fragment } from 'react'
import NavbarHeader from '../navbar/Navbar'
import { Row, Col, Container, Image } from 'react-bootstrap'
import { readProfile, readImage } from '../../api/user'
import './Profile.css'
// import queryString from 'query-string'
import { lang } from '../../api/auth'

const GuestProfile = ({ location }) => {
  const [values, setValues] = useState({
    pseudo: '',
    firstName: '',
    lastName: '',
    path: '',
  })
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    lang()
      .then((data) => {
        setLanguage(data.Language)
      })
      .catch((err) => console.log(err))
  }, [language])

  // useEffect(() => {
  //    const v = queryString.parse(location.search)
  // const data = await readGuestProfile(v.uuid);
  // if (data.err) {
  //     console.log(data.err)
  // } else {
  //     setValues({...data})
  // }
  // }, [location])

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
                <Image
                  className="profile-header-img"
                  src={
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSIYgLrhXnXEzM46_zfFdhFMsBObxy9bMCAyA&usqp=CAU'
                  }
                  roundedCircle
                />
              </div>
            </Row>
            <Row className="pt-4 row-infos">
              <Col>
                <Row className="mb-4 pt-3 pb-3 Row">
                  <Col className="pt-4 row-infos">
                    <h2>userName: wafa200</h2>
                    <h2>lastName : Meddah</h2>
                    <h2>FirsName : wafae</h2>
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
