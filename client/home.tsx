import * as React from 'react'

import { Base, Header, FooterLight } from "@epfl/epfl-sti-react-library";
import { StateEnum, LoginButton, IfOIDCState, useOpenIDConnectContext } from '@epfl-si/react-appauth'
import Search from './components/Search'
import { Accounts } from 'meteor/accounts-base'
import { useTracker, useSubscribe } from 'meteor/react-meteor-data'
import { DigestUser, DigestUsersCollection } from '../imports/api/DigestUser';
import { Meteor } from 'meteor/meteor'
import '../imports/types/UserInfo'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import EPFLHeader from './components/EPFLHeader';
import PleaseLogin from './components/PleaseLogin';
import CheckLDAP from './components/CheckLDAP';

export default function Home() {
    const isLogged = useOpenIDConnectContext().state === StateEnum.LoggedIn;
    const isLoading = useSubscribe('digestusers');
    let digestUsers = useTracker(() => DigestUsersCollection.find().fetch())
    const userInfos = useOpenIDConnectContext().idToken
    if (!isLogged) {
      Meteor.logout()
    }
    const onReload = (e, isLogged) => {
          if(isLogged) return e.preventDefault("");
    }
    window.onbeforeunload = (e)=>onReload(e, isLogged)
  
    return (
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <BrowserRouter>
          <EPFLHeader />
          <WelcomeUser />
          <Routes>
            <Route path="/">
              {isLogged ? (
                <Route index element={<Search />} />
              ) : (
                <Route index element={<PleaseLogin />} />
              )}
            </Route>
            <Route path="/checkLDAP/:sciper">
              {isLogged ? (
                <Route index element={<CheckLDAP />} />
                ) : (
                <Route index element={<PleaseLogin />} />
              )}
            </Route>
          </Routes>
          <div>
            <FooterLight />
          </div>
        </BrowserRouter>
      </div>
    );
}

const WelcomeUser: React.FC = () => {
  const user = useTracker(() => Meteor.user())
  
  return <IfOIDCState is={StateEnum.LoggedIn}>
    {/* {user ? `Hello, ${user.given_name} ${user.family_name}!` : `Hello! For some reason you are logged into OIDC, but not on Meteor.` } */}
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
