import React from "react"
import { useParams } from "react-router-dom"
import { useQueryPerson } from '/imports/ui/use-hooks'
import { Container } from "@mui/material"
import { LoadingSpinner } from './LoadingSpinner'

export function CheckLDAP() {
  const { sciper } = useParams();
  const { isLoading, person } = useQueryPerson(sciper, 'personLdap', 'personScoldap');

  if (isLoading()) return <LoadingSpinner/>;
  if (! person) return <>No results.</>;

  return (
    <Container>
      <h1>CheckLDAP</h1>
      <h2>Info from ldap.epfl.ch</h2>
      <ul>
        { dumpLDAPStruct(person.ldap) }
      </ul>
      <h2>User homedir info</h2>
      <ul>
        { dumpLDAPStruct(person.automap) }
      </ul>
      <h2>Info from scoldap.epfl.ch</h2>
      <ul>
        { dumpLDAPStruct(person.scoldap) }
      </ul>
    </Container>
  );
}

function dumpLDAPStruct (obj) {
  if (obj === undefined) return <></>;
  return Object.entries(obj).map(([key,val]) => (
    Array.isArray(val) ? (
      <li key={key}>
        <strong>{key}</strong>
        <ul>
          {val.map(element => <li key={element}>{element}</li>)}
        </ul>
      </li>
    ) :
      typeof(val) === "string" ? (
        <li key={key}><strong>{key}</strong>: {val}</li>
      ) : <></>
  ))
}
