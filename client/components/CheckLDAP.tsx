import React, { useEffect } from "react";
import { Meteor } from "meteor/meteor";
import { Container } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";


function CheckLDAP() {
  const { sciper } = useParams();
  const [user, setUser] = useState({});
  const [scoLDAP, setScoLDAP] = useState({});
  const [homeDir, setHomeDir] = useState({});

  useEffect(() => {
    Meteor.call('checkLDAP.user', sciper, function(err, res) {
      if(err) {
        console.log(err)
      } else {
        setUser(res[0]);
      }
    })
    Meteor.call('scoLDAP.user', sciper, function(err, res) {
      if(err) {
        console.log(err)
      } else {
        setScoLDAP(res[0]);
      }
    })
  }, [])

  useEffect(() => {
    if(user.uid !== undefined) {
      Meteor.call('homedir.user', user.uid[0], function(err, res) {
        if(err) {
          console.log(err)
        } else {
          setHomeDir(res[0]);
        }
      })
    }
  }, [user])

  return (
    <Container>
      <h1>CheckLDAP</h1>
      <h2>Info from ldap.epfl.ch</h2>
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
      <h2>User homedir info</h2>
      <ul>
        {
            Object.entries(homeDir).map(([key,val]) => (
              typeof(homeDir[key]) == 'object' ? (
                <li key={key}>
                  <strong>{key}</strong>
                  <ul>
                    {homeDir[key].map(element => <li key={element}>{element}</li>)}
                  </ul>
                </li>
              ) : (
                <li key={key}><strong>{key}</strong>: {homeDir[key]}</li>
              )
            ))
        }
      </ul>
      <h2>Info from scoldap.epfl.ch</h2>
      <ul>
        {
            Object.entries(scoLDAP).map(([key,val]) => (
              typeof(scoLDAP[key]) == 'object' ? (
                <li key={key}>
                  <strong>{key}</strong>
                  <ul>
                    {scoLDAP[key].map(element => <li key={element}>{element}</li>)}
                  </ul>
                </li>
              ) : (
                <li key={key}><strong>{key}</strong>: {scoLDAP[key]}</li>
              )
            ))
        }
      </ul>
    </Container>
  );
}

export default CheckLDAP;
