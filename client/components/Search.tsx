import React from 'react'
import UserDetails from './UserDetails';
import { DigestUser } from '../../imports/api/DigestUser';
import { useParams } from 'react-router-dom';
import SearchBar from './SearchBar';

function Search() {
  function consoleLog(user) {
    setSearchUser(user as DigestUser)
  }
  const { sciper } = useParams();
  const [searchUser, setSearchUser] = React.useState<DigestUser | undefined>(undefined)
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
          <SearchBar handleOneLastResult={(e, user)=>setSearchUser(e as DigestUser)} sciper={sciper} />
        </div>
        {searchUser === undefined ? <></> : <UserDetails user={searchUser}/>}
      </div>
    </>
  )
}

export default Search

