import React from 'react'
import { OIDCContext, StateEnum, LoginButton, IfOIDCState, LoggedInUser, useOpenIDConnectContext } from '@epfl-si/react-appauth'
import Home from './home';
import * as settings from '../settings.json';

function App() {
  return (
    <OIDCContext
      authServerUrl={settings.client.loginUri ? settings.client.loginUri : 'https://satosaaas.epfl.ch'}
      debug={!!process.env.ATARI_DEBUG}
      client={{ 
        clientId: settings.client.clientId ? settings.client.clientId : 'ATARI', // use "react-starter-kit" for local development with keycloak
        scope: "openid profile tequila",
        redirectUri: settings.client.redirectUri ? settings.client.redirectUri : 'https://atari.epfl.ch'
      }}
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
