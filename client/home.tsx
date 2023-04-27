import * as React from 'react'

import { Base } from '@epfl/epfl-sti-react-library'
import { OIDCContext, StateEnum, LoginButton, IfOIDCState, LoggedInUser } from '@epfl-si/react-appauth'
import Links from './components/Links'
import { Accounts } from 'meteor/accounts-base'
import { useTracker } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import '../imports/types/UserInfo'

export default function Home() {
  return (
    <Base asideMenuItems={[]}>
      <OIDCContext authServerUrl = { 'http://localhost:8080/realms/react-starter-kit/' }
                      client = { { clientId: "react-starter-kit",
                                   redirectUri: "http://localhost:3000/" } }
                                   onNewToken={ ( token ) => oidcLogin(token) }
                                   onLogout={ () => Accounts.logout() }>
      <LoginButton inProgressLabel={ <>⏳</> }/>
      <WelcomeUser/>
      <Links/>
    </OIDCContext>
    </Base>
  )
}

const WelcomeUser: React.FC = () => {
  const user = useTracker(() => Meteor.user())
  
  return <IfOIDCState is={StateEnum.LoggedIn}>
    {user ? `Hello, ${user.given_name} ${user.family_name}!` : `Hello! For some reason you are logged into OIDC, but not on Meteor.` }
  </IfOIDCState>
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
