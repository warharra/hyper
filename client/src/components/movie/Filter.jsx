import React, { Fragment, useState, useEffect } from 'react'
import Select from 'react-select'
import '../navbar/Navbar.css'
import { Col, Form, Button } from 'react-bootstrap'
import Slider, { createSliderWithTooltip, Range } from 'rc-slider'
import 'rc-slider/assets/index.css'
import { notificationAlert } from '../functions/notification'
import { lang } from '../../api/auth'

const SliderWithTooltip = createSliderWithTooltip(Slider.Range)

const Filter = ({ setSortMovies }) => {
  const [filter, setfilter] = useState({
    date: [1990, 2020],
    score: 0,
  })

  const [language, setLanguage] = useState('en')

  useEffect(() => {
    lang()
      .then((data) => {
        setLanguage(data.Language)
      })
      .catch((err) => console.log(err))
  }, [])

  const handleChange = (name, i) => (event) => {
    let b = event[0]
    setfilter({
      ...filter,
      [name]: b,
    })
  }

  return (
    <Fragment>
      <Form
        style={{
          backgroundColor: '#fff',
          fontWeight: 'bold',
          color: '#808080',
        }}
      >
        <Form.Row className="px-4 py-4">
          <Form.Group as={Col}>
            <Form.Label>Date</Form.Label>
            <SliderWithTooltip
              min={1990}
              max={2020}
              value={[filter.date[0], filter.date[1]]}
              onChange={handleChange('date')}
              marks={{ 1990: '1990', 2020: '2020' }}
            />
          </Form.Group>
        </Form.Row>

        <Form.Row className="px-4 py-4">
          <Form.Group as={Col}>
            <Form.Label>Score</Form.Label>
            <Range
              min={0}
              max={10}
              value={[filter.score, 10]}
              onChange={handleChange('score')}
              marks={{ 0: '0', 10: '10' }}
              // tipFormatter={(v) => `${v}`}
            />
          </Form.Group>
        </Form.Row>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={setSortMovies({ sort: 'minimum_rating=' + filter.score })}
            className="text-uppercase mx-4 mb-4"
            variant="outline-info"
            style={{ letterSpacing: '1px', fontWeight: 'bold' }}
          >
            Valider
          </Button>
        </div>
      </Form>
    </Fragment>
  )
}
export default Filter
