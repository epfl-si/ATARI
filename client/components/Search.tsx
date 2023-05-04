import React from 'react'
import Virtualize from './Virtualize';

function Search() {
  const list = ["Element 1", "Element 2", "Element 3", "Element 4", "Element 5"]
  return (
    <>
      <Virtualize OPTIONS={list}/>
    </>
  )
}

export default Search
