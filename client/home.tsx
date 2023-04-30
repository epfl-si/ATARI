import * as React from 'react'

import { Base } from '@epfl/epfl-sti-react-library'
import { StateEnum, LoginButton, IfOIDCState } from '@epfl-si/react-appauth'
import Links from './components/Links'
import { Accounts } from 'meteor/accounts-base'
import { useTracker } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import '../imports/types/UserInfo'
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function Home() {
  return (
    <BrowserRouter>
      <Base useReactLinks asideMenuItems={[{
      "heading": "Mock Main Section",
      "menus": [
        {
          "anchor": "Public",
          "link": "/public"
        },
        {
          "anchor": "Authenticated",
          "link": "/authenticated"
        },
        {
          "anchor": "Belongs to group : react-starter-kit_acces_lecture",
          "link": "/react-starter-kit_acces_lecture"
        },
        {
          "anchor": "Belongs to role : nameOfTherole",
          "link": "/nameOfTherole"
        },
      ]
    }]}>

        
        <LoginButton inProgressLabel={ <>⏳</> }/>
        <WelcomeUser/>
              <Routes>
                <Route path="/" >
                      <Route index element={<>Bonjour, veuillez cliquer sur le menu de gauche</>}/>
                    <Route path="authenticated">
                      <Route index element={<Links/>} />
                    </Route>
                </Route>
              </Routes>
      </Base>
    </BrowserRouter>
  )
}

const WelcomeUser: React.FC = () => {
  const user = useTracker(() => Meteor.user())
  
  return <IfOIDCState is={StateEnum.LoggedIn}>
    {user ? `Hello, ${user.given_name} ${user.family_name}!` : `Hello! For some reason you are logged into OIDC, but not on Meteor.` }
  </IfOIDCState>
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
