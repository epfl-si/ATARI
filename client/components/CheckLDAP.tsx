import React, { useEffect } from "react";
import { Meteor } from "meteor/meteor";
import { Container } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";


function CheckLDAP() {
  const { sciper } = useParams();
  const [user, setUser] = useState({});

  useEffect(() => {
    Meteor.call('checkLDAP.user', sciper, function(err, res) {
      if(err) {
        console.log(err)
      } else {
        setUser(res[0]);
      }
    })
  }, [])


  return (
    <Container>
      <h1>LDAP</h1>
      <ul>
        {
            Object.entries(user).map(([key,val]) => (
              typeof(user[key]) == 'object' ? (
                <li key={key}>
                  <strong>{key}</strong>
                  <ul>
                    {user[key].map(element => <li key={element}>{element}</li>)}
                  </ul>
                </li>
              ) : (
                <li key={key}><strong>{key}</strong>: {user[key]}</li>
              )
            ))
        }
      </ul>
    </Container>
  );
}

export default CheckLDAP;
