import React from 'react'
import { useParams } from 'react-router-dom'
import { UserDetails } from './UserDetails'
import { Person } from '/imports/api/persons'
import { useQueryPerson } from '/imports/ui/use-hooks'
import { SearchBar } from './SearchBar'
import { LoadingSpinner } from './LoadingSpinner'

/**
 * The home search widget, comprising a search bar and an area for
 * displaying one (1) search result.
 *
 * Reads and writes SCIPER number from / to the browser URL bar.
 */
export function SearchPerson () {
  const { sciper } = useParams();
  const [selectedUser, setSelectedUser] = React.useState<Person>();

  const personFromUrl = useQueryPerson(sciper, "personAPI");
  if (sciper && personFromUrl.isLoading()) return <LoadingSpinner/>;

  const showingUser = selectedUser || personFromUrl.person;

  return <div className='container-full'>
           <div
             style={{
               width:'100%',
               marginTop:'80px',
               marginBottom:'80px',
               height:'56px',
             }}>
             <SearchBar
               onSingleSearchResult={ function(person) {
                 setSelectedUser(person);
               } }
               onSearchResultSelected={ function(person) {
                 window.history.pushState({ id:"100" }, "Page", `/${person.id}`);
                 setSelectedUser(person);
               } }
               initialText={personFromUrl?.person?.display}
             />
           </div>
           { showingUser ? <UserDetails person={showingUser}/> : <></> }
         </div>;
}
