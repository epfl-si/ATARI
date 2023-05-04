import React from 'react'
import Virtualize from './Virtualize';

function Search() {
  const list = ["Toto Le Poto", "Tutu La Tortue", "Paul Le Poulpe", "Gigi La Girafe"]
  return (
    <>
      <Virtualize OPTIONS={list}/>
    </>
  )
}

export default Search
