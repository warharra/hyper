import React, { useState, useEffect, Fragment } from 'react'
import NavbarHeader from '../navbar/Navbar'
import './Movie.css'
import { notificationAlert } from '../functions/notification'
import { Row, Col, Container, Button, FormControl, Form } from 'react-bootstrap'
import Sort from './Sort'
import Filter from './Filter'
// import { lang } from '../../api/auth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSearch,
  faArrowAltCircleDown,
} from '@fortawesome/free-solid-svg-icons'
import CustomSpinner from '../auth/Spinner'
import CardPicture from './CardPicture'
import './CardPicture.css'
import axios from 'axios'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'

// const API_KEY = '4b267219'

const withData = (data) => {
  return {
    error: false,
    data,
  }
}

const fetchMovieList = async (sort) => {
  try {
    let { data: res } = await axios.get(
      // `https://yts.mx/api/v2/list_movies.json?title={title_id}`,
      `https://yts.mx/api/v2/list_movies.json?${sort}`,
    )
    if (
      res.data.movies === null ||
      res.data.movies === undefined ||
      res.data.movies === ''
    ) {
      return withData({ error: true })
    }

    return withData(res.data.movies)
  } catch (error) {
    return withData({ error: true })
  }
}

const Movie = () => {
  const [movies, setMovies] = useState([])
  const [language, setLanguage] = useState('en')
  const [search, setSearch] = useState([''])
  const [isLoading, setIsLoading] = useState(true)
  const [sort, setSort] = useState('quality=3D')
  const [genre, setGenre] = useState('')
  const [filter, setfilter] = useState({
    genre: [
      { value: 'comedy', label: 'Comedy' },
      { value: 'romance', label: 'Romance' },
      { value: 'drama', label: 'Drama' },
      { value: 'animation', label: 'Animation' },
      { value: 'sci-Fi', label: 'Sci-fi' },
      { value: 'horror', label: 'Horror' },
      { value: 'action', label: 'Action' },
      { value: 'crime', label: 'Crime' },
    ],
  })
  const animatedComponents = makeAnimated()
  useEffect(() => {
    ;(async () => {
      const { data, error } = await fetchMovieList(sort)
      if (error) {
        return notificationAlert('err fetch', 'danger', 'bottom-center')
      }
      if (genre !== 1) setMovies((movies) => [...movies, ...data])
      else setMovies([...data])
    })()
  }, [sort])

  // useEffect(() => {
  //   lang()
  //     .then((data) => {
  //       setLanguage(data.Language)
  //     })
  //     .catch((err) => console.log(err))
  // }, [language])

  // useEffect(() => {
  //   const promises = search.map((series) => {
  //     return fetch(
  //       `https://api.themoviedb.org/3/trending/movie/week?api_key=a0fed9f8f084654ffed3332d86a8f059`,
  //     ).then((res) => res.json())
  //   })
  //   // console.log(promises)
  //   setSwitsh(1)
  //   Promise.all(promises).then((movie) => {
  //     setMovies(movie.map((movie) => movie.results))
  //   })
  // }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    ;(async () => {
      const { data, error } = await fetchMovieList('query_term=' + search)
      if (error) {
        return notificationAlert('err fetch', 'danger', 'bottom-center')
      }
      setMovies([...data])
    })()
  }

  // const handleSubmit = (e) => {
  //   const promises = search.map((series) => {
  //     return fetch(
  //       `http://www.omdbapi.com/?s=${encodeURIComponent(
  //         series,
  //       )}&apikey=${API_KEY}&page=1`,
  //     ).then((res) => res.json())
  //   })
  //   setSwitsh(0)
  //   console.log(promises)
  //   Promise.all(promises).then((movie) => {
  //     // setMovies({
  //     //   ...movies,
  //     //   title: movie.Title,
  //     //   year: movie.Year,
  //     //   medium_cover_image: movie.Poster,
  //     // })
  //     setMovies(movie.map((movie) => movie.Search))
  //   })
  // }

  // const card = () => {
  //   console.log(movies)
  //   return movies.flat(2).map((movie, i) => {
  //     return (
  //       <div id={'card-' + i} className="styleCard py-3   " key={i}>
  //         <CardPicture
  //           title={
  //             switsh === 1 ? movie.original_title.substr(0, 25) : movie.Title
  //           }
  //           year={switsh === 1 ? movie.release_date : movie.Year}
  //           img={
  //             switsh === 1
  //               ? `http://image.tmdb.org/t/p/w300/` + movie.poster_path
  //               : movie.Poster
  //           }
  //         />
  //       </div>
  //     )
  //   })
  // }
  const setSortMovies = (sortMovies) => (event) => {
    ;(async () => {
      const { data, error } = await fetchMovieList(sortMovies.sort)
      if (error) {
        return notificationAlert('err fetch', 'danger', 'bottom-center')
      }
      setMovies([...data])
    })()
  }

  const loadMovies = () => {
    return (
      <div>
        <Button
          onClick={() => setSort('quality=2160p')}
          className="text-uppercase mb-4 center-block "
          variant="outline-info"
          style={{
            width: '50%',
            letterSpacing: '1px',
            fontWeight: 'bold',
            marginLeft: '10%',
          }}
        >
          <FontAwesomeIcon icon={faArrowAltCircleDown} className="fa-lg " />
          <i> Show more movies </i>
        </Button>
      </div>
    )
  }

  const card = () => {
    return movies.map((movie, i) => {
      return (
        <div id={'card-' + i} className="styleCard py-3" key={i}>
          <CardPicture movie={movie} />
        </div>
      )
    })
  }

  const handlechange = (event) => {
    setSearch([event.target.value])
  }
  const handleChangeGenre = (genre) => {
    setGenre(1)
    setSort('genre=' + genre.value)
  }
  const MyComponent = () => (
    <Select
      placeholder="Genre"
      closeMenuOnSelect={false}
      onChange={handleChangeGenre}
      components={animatedComponents}
      options={filter.genre}
    />
  )

  return (
    <Fragment>
      <NavbarHeader />
      <Container
        fluid
        className="mt-3"
        style={{ color: '#545454', position: 'relative' }}
      >
        <Row>
          <Col md={3}>
            <Sort setSortMovies={(sortMovies) => setSortMovies(sortMovies)} />
            <Form.Row className="px-4 pt-4">
              <Form.Group as={Col}>{MyComponent()}</Form.Group>
            </Form.Row>
            <Filter setSortMovies={(sortMovies) => setSortMovies(sortMovies)} />
          </Col>
          <Col>
            <Form inline className="style-menu mt-3 mt-1 px-3">
              <FormControl
                value={search}
                onChange={handlechange}
                // onKeyUp={(e) => (e.key === 'Enter' ? handleSubmit(e) : '')}
                type="text"
                placeholder="Search"
                className="search px-3 py-3 my-4 "
              />
              <Button variant="secondary" onClick={handleSubmit}>
                <FontAwesomeIcon icon={faSearch} className="fa-search fa-lg" />
              </Button>
            </Form>
            <Row className=" my-4" style={{ justifyContent: 'center' }}>
              {movies.length === 0 ? <CustomSpinner /> : card()}
            </Row>
            <div>{loadMovies()} </div>
          </Col>
        </Row>
      </Container>
    </Fragment>
  )
}

export default Movie
