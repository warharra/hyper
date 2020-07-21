import React, { useEffect, useState } from 'react'
import { Navbar, NavDropdown, Nav } from 'react-bootstrap'
import './Navbar.css'
import { logout, lang } from '../../api/auth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs } from '@fortawesome/free-solid-svg-icons'

const NavbarHeader = () => {
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    lang()
      .then((data) => {
        setLanguage(data.Language)
      })
      .catch((err) => console.log(err))
  }, [])

  const handleLogout = () => {
    if (typeof window != 'undefined') {
      if (localStorage.getItem('jwt')) {
        logout()
          .then((data) => {
            localStorage.removeItem('jwt')
          })
          .catch((err) => console.log(err))
      }
    }
  }

  return (
    <Navbar variant="dark" expand="md" className="navbar-main">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="navbar-container">
          <Nav.Link href="/movie">
            <span className="navbar-tab">
              {' '}
              <h4>Hypertube</h4>{' '}
            </span>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
      <Navbar.Collapse className="justify-content-end">
        <Nav className="navbar-container">
          <NavDropdown
            className="mt-1"
            title={<FontAwesomeIcon icon={faCogs} className="fa-cogs fa-lg" />}
            id="basic-nav-dropdown"
            alignRight
          >
            <NavDropdown.Item href="/profile" className="drop">
              {language === 'en' ? 'Profile' : 'Profil'}
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item
              href="/login"
              onClick={handleLogout}
              className="drop"
            >
              {language === 'en' ? 'Logout' : 'Déconnexion'}
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}
export default NavbarHeader
