import React from 'react'
import { OIDCContext, StateEnum, LoginButton, IfOIDCState, LoggedInUser, useOpenIDConnectContext } from '@epfl-si/react-appauth'
import Home from './home';
import * as settings from '../settings.json';

function App() {
  let loginUrl;
  loginUrl = process.env.ATARI_LOGIN_URL ? process.env.ATARI_LOGIN_URL : 'https://satosaaas.epfl.ch'
  console.log("Env", process.env.ATARI_ENVIRONMENT)
  console.log("Auth", loginUrl)

  return (
    <OIDCContext
      authServerUrl={loginUrl}
      debug={!!process.env.ATARI_DEBUG}
      client={{ 
        clientId: process.env.ATARI_ENVIRONMENT == 'local' ? "react-starter-kit" : settings.client.clientId,
        scope: "openid profile tequila",
        redirectUri: process.env.ATARI_ENVIRONMENT == 'local' ? "" : settings.client.redirectUri
      }}
      // client={{ clientId: "react-starter-kit" }}
      onNewToken={(token) => oidcLogin(token)}
      onLogout={() => Accounts.logout()}
    >
      <Home />
    </OIDCContext>
  );
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

export default App
