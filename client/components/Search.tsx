import React from 'react'
import Virtualize from './Virtualize';

function consoleLog(){
  console.log("Only one person left in the list, let's load this person's infos")
}

function Search() {
  const list = ["Toto Le Poto", "Tutu La Tortue", "Paul Le Poulpe", "Gigi La Girafe"]
  return (
    <>
      <Virtualize OPTIONS={list} handleOneLastResult={()=>consoleLog()}/>
    </>
  )
}

export default Search
