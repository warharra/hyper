import React, { useState, Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './CardPicture.css'
import { Image } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

// import { readImage } from "../../api/user";

const CardPicture = ({ movie }) => {
  const [base64Image, setBase64Image] = useState('')

  const handleImage = () => {
    return (
      <div>
        <label htmlFor="single" className="imgProfile mb-0">
          <Image
            className="movie-img"
            src={movie.medium_cover_image}
            alt={movie.title}
          />
        </label>
      </div>
    )
  }

  return (
    <Fragment>
      <Link
        to={`/player/${movie.id}`}
        style={{
          color: 'grey',
          fontWeight: '500',
          textDecoration: 'none',
        }}
      >
        <div className="profile-header-container">
          <div>
            {handleImage()}
            <div className="rank-label-container">
              <span className="label label-default rank-label">
                {movie.rating}
                <FontAwesomeIcon
                  icon={faStar}
                  className="ml-2 popularity-icon"
                />
              </span>
            </div>
            <div className="pt-1">
              <div style={{ fontWeight: '600' }} className="pt-1">
                {movie.title.substr(0, 18)}
              </div>
              <p>{movie.year}</p>
              {/* <h3 className="g">{movie.genres[0]}</h3> */}
            </div>
          </div>
        </div>
      </Link>
    </Fragment>
  )
}

export default CardPicture
