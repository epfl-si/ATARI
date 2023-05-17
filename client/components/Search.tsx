import React from 'react'
import Virtualize from './Virtualize';
import UserDetails from './UserDetails';
import { DigestUser } from '../../imports/api/DigestUser';
import { digestUsers } from './search-mock-data';

function Search() {
  function consoleLog(user) {
    console.log("Only one person left in the list, let's load this person's infos")
    console.log('User', user);
    setSearchUser(user as DigestUser)
  }
  const [searchUser, setSearchUser] = React.useState<DigestUser | undefined>(undefined)
  return (
    <>
    <div className='container-full' >
        <Virtualize OPTIONS={digestUsers} handleOneLastResult={(e, user)=>consoleLog(e)}/>
        {searchUser === undefined ? <></> : <UserDetails user={searchUser}/>}
    </div>
    </>
  )
}

export default Search
