import React, { Fragment } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

const Sort = ({ setSortMovies }) => {
  return (
    <Fragment>
      <DropdownButton
        id="dropdown-basic-button"
        title="
        sort by"
        variant="info"
        className="style-menu px-4 py-4 my-3 mt-1 "
      >
        <Dropdown.Item
          value="1"
          onClick={setSortMovies({ sort: 'minimum_rating=9' })}
        >
          order by desc
        </Dropdown.Item>
        <Dropdown.Item
          value="1"
          onClick={setSortMovies({ sort: 'order_by=asc' })}
        >
          order by asc
        </Dropdown.Item>
        <Dropdown.Item
          value="2"
          onClick={setSortMovies({ sort: 'sort_by=rating' })}
        >
          Sort by rating
        </Dropdown.Item>
        <Dropdown.Item
          value="3"
          onClick={setSortMovies({ sort: 'sort_by=year' })}
        >
          Sort by year
        </Dropdown.Item>
        <Dropdown.Item
          value="4"
          onClick={setSortMovies({ sort: 'sort_by=date_added' })}
        >
          Sort by date added
        </Dropdown.Item>
      </DropdownButton>
    </Fragment>
  )
}
export default Sort
