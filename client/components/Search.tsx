import React from 'react'
import Virtualize from './Virtualize';

function consoleLog() {
  console.log("Only one person left in the list, let's load this person's infos")
  console.log();
  
}

function Search() {
  const digestUsers = [
            {"_id":"1","first_name":"Conway","last_name":"Holehouse","email":"cbeglin0@tinypic.com","sciper":"903495","phone_number":"2918797598","gaspar":"Beglin"},
            {"_id":"2","first_name":"Gwenette","last_name":"McGilmartin","email":"gnusche1@phpbb.com","sciper":"279918","phone_number":"9874031671","gaspar":"Nusche"},
            {"_id":"3","first_name":"Devy","last_name":"Juste","email":"dclemencet2@imdb.com","sciper":"84365","phone_number":"7150067919","gaspar":"Clemencet"},
            {"_id":"4","first_name":"Cherida","last_name":"McGilleghole","email":"ctraut3@goo.gl","sciper":"857826","phone_number":"7322116871","gaspar":"Traut"},
            {"_id":"5","first_name":"Dunc","last_name":"Beere","email":"dcampagne4@nyu.edu","sciper":"574607","phone_number":"4928081122","gaspar":"Campagne"},
            {"_id":"6","first_name":"Viviyan","last_name":"Mertgen","email":"voliva5@webeden.co.uk","sciper":"349407","phone_number":"5383677410","gaspar":"Oliva"},
            {"_id":"7","first_name":"Thorsten","last_name":"Inderwick","email":"tpiolli6@edublogs.org","sciper":"370842","phone_number":"5358774430","gaspar":"Piolli"},
            {"_id":"8","first_name":"Hilliard","last_name":"Boocock","email":"hburford7@webmd.com","sciper":"607640","phone_number":"4890691823","gaspar":"Burford"},
            {"_id":"9","first_name":"Merwyn","last_name":"Innerstone","email":"mcollick8@networkadvertising.org","sciper":"952657","phone_number":"5127920951","gaspar":"Collick"},
            {"_id":"10","first_name":"Saba","last_name":"Bernardoux","email":"slammertz9@nsw.gov.au","sciper":"80236","phone_number":"6673984279","gaspar":"Lammertz"}
          ]
  return (
    <>
      <Virtualize OPTIONS={digestUsers} handleOneLastResult={()=>consoleLog()}/>
    </>
  )
}

export default Search
