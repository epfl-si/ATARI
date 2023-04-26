import * as React from 'react'

import { Base } from '@epfl/epfl-sti-react-library'
import { OIDCContext, StateEnum, LoginButton, IfOIDCState, LoggedInUser } from '@epfl-si/react-appauth'
import Links from './components/Links'
import { Accounts } from 'meteor/accounts-base'

export default function Home() {
  return (
    <Base asideMenuItems={[]}>
      <OIDCContext authServerUrl = { 'http://localhost:8080/realms/react-starter-kit/' }
                      client = { { clientId: "react-starter-kit",
                                   redirectUri: "http://localhost:3000/" } }
                                   onNewToken={ ( token ) => oidcLogin(token) }
                                   onLogout={ () => Accounts.logout() }>
      <LoginButton inProgressLabel={ <>⏳</> }/>
      <IfOIDCState is={ StateEnum.LoggedIn }>
        <p>Hello, <LoggedInUser field="preferred_username" />!</p>
      </IfOIDCState>
      <Links/>
    </OIDCContext>
    </Base>
  )
}

const oidcLogin = (token: string) => {
  Accounts.callLoginMethod({
  methodArguments: [
    {
      oidcToken: token,
    },
  ],
  userCallback: serverSideError => {
      if (serverSideError) {
        // Only happens when the OIDC login has succeeded but then the Meteor server fails to validate it somehow.
        const { error, reason, details, message } = serverSideError
        alert(`Error ${error} on the server\n\nreason: ${reason}\ndetails: ${details}\n message: ${details}\n`)
      }
    },
  });
}

(window as any).attack = function() {
  Accounts.callLoginMethod({
    methodArguments: [
      {
        oidcToken: "H@XX",
      },
    ],
    userCallback: serverSideError => {
      if (serverSideError) {
        alert("Attack failed! Drats")
      } else {
        alert("Attack successful! We are now known as " + JSON.stringify(Meteor.user()))
      }
    }  
  })
}
