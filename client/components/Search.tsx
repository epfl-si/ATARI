import React from 'react'
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import { DigestUsersCollection } from '../../imports/api/DigestUser';
import Autocomplete from '@mui/material/Autocomplete';
import Virtualize from './Virtualize';

function Search() {
  const isLoading = useSubscribe('digestusers');
  const digestUsers = useFind(() => DigestUsersCollection.find({}));
  const firstnames = digestUsers.map(x=> x.first_name)
  console.log("firstnames", firstnames);
  
  return (
    <>
      {/* <Virtualize OPTIONS={firstnames}/> */}
      {isLoading() ? <>⌛</> : <div>{JSON.stringify(firstnames)}</div>}
    </>
  )
}

export default Search
