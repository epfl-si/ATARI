import React from 'react'
import { OIDCContext, StateEnum, LoginButton, IfOIDCState, LoggedInUser, useOpenIDConnectContext } from '@epfl-si/react-appauth'
import Home from './home';
import * as settings from '../settings.json';

function App() {
  let loginUrl;
  if(process.env.ATARI_ENVIRONMENT) {
    loginUrl = "http://localhost:8080/realms/react-starter-kit/";
  } else {
    loginUrl = "https://tkgi-satosa.epfl.ch";
  }
  return (
    <OIDCContext
      authServerUrl={loginUrl}
      debug={!!process.env.ATARI_ENVIRONMENT}
      client={{ 
        clientId: process.env.ATARI_ENVIRONMENT ? "react-starter-kit" : settings.client.clientId,
        scope: process.env.ATARI_ENVIRONMENT ? "" : "openid profile tequila",
        redirectUri: process.env.ATARI_ENVIRONMENT ? "" : settings.client.redirectUri
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
