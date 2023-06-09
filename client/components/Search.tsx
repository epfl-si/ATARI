import React from 'react'
import Virtualize from './Virtualize';
import UserDetails from './UserDetails';
import { DigestUser, DigestUsersCollection } from '../../imports/api/DigestUser';
import { useSubscribe, useFind, useTracker } from 'meteor/react-meteor-data';
import LoadingSpinner from './LoadingSpinner'

function Search() {
  function consoleLog(user) {
    console.log("Only one person left in the list, let's load this person's infos")
    console.log('User', user);
    setSearchUser(user as DigestUser)
  }
  const isLoading = useSubscribe('digestusers');
  const [searchUser, setSearchUser] = React.useState<DigestUser | undefined>(undefined)
  let digestUsers = useTracker(() => DigestUsersCollection.find().fetch())
  if (digestUsers[0]) delete digestUsers[0]._id
  let digestUsersArray = digestUsers[0] ? Object.values(digestUsers[0]) : undefined
  let realDigestUsersArray = digestUsersArray ? Object.values(digestUsersArray) : undefined
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
          {digestUsers[0] !== undefined ? <Virtualize OPTIONS={digestUsersArray as DigestUser[]} handleOneLastResult={(e, user)=>consoleLog(e)}/> : <LoadingSpinner/>}
        </div>
        {searchUser === undefined ? <></> : <UserDetails user={searchUser}/>}
      </div>
    </>
  )
}

export default Search

