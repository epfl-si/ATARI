import React from 'react'
import { UserDetails } from './UserDetails';
import { Person } from '/imports/api/persons';
import { useParams } from 'react-router-dom';
import SearchBar from './SearchBar';

function Search() {
  const { sciper } = useParams();
  const [searchUser, setSearchUser] = React.useState<Person | undefined>(undefined)
  return (
    <>
      <div className='container-full'>
        <div 
          style={{
            width:'100%',
            marginTop:'80px',
            marginBottom:'80px',
            height:'56px',
          }}>
          <SearchBar handleOneLastResult={(e, user)=>setSearchUser(e as Person)} sciper={sciper} />
        </div>
        {searchUser === undefined ? <></> : <UserDetails person={searchUser}/>}
      </div>
    </>
  )
}

export default Search

