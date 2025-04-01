import React from 'react'

const Search = ({searchValue, setSearchValue}) => {
  return (
    <div className='search text-white'>
        <div>
            <img src="/public/search.svg" alt="search.svg" />
            <input type="text"
            placeholder='Search from thousands of movies'
            value = {searchValue} 
            onChange = {(e)=>setSearchValue(e.target.value)}  />
        </div>
    </div>
  )
}

export default Search