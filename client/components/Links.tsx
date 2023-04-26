import React from 'react'
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import { LinksCollection } from '../../imports/api/links';


function Links() {
  const isLoading = useSubscribe('links');
  const links = useFind(() => LinksCollection.find({}));
  return (
    isLoading() ? <>⌛</> : <div>{JSON.stringify(links)}</div>
  )
}

export default Links
