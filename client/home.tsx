import * as React from 'react'

import { Base } from '@epfl/epfl-sti-react-library'
import { StateEnum, LoginButton, IfOIDCState, useOpenIDConnectContext } from '@epfl-si/react-appauth'
import Search from './components/Search'
import { Accounts } from 'meteor/accounts-base'
import { useTracker, useSubscribe } from 'meteor/react-meteor-data'
import { DigestUser, DigestUsersCollection } from '../imports/api/DigestUser';
import { Meteor } from 'meteor/meteor'
import '../imports/types/UserInfo'
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function Home() {
    const isLoading = useSubscribe('digestusers');
    let digestUsers = useTracker(() => DigestUsersCollection.find().fetch())
    const isLogged = useOpenIDConnectContext().state === StateEnum.LoggedIn
    const userInfos = useOpenIDConnectContext().idToken
    if (!isLogged) {
      Meteor.logout()
    }
    const onReload = (e, isLogged) => {
          if(isLogged) return e.preventDefault("");
    }
    window.onbeforeunload = (e)=>onReload(e, isLogged)
  
    return (
    <BrowserRouter>
      <Base useReactLinks
      useLightFooter={true}
      user={isLogged ? {
        first_name: userInfos!.given_name,
        last_name: userInfos!.family_name,
        sciper: "00000",
        photo_url: "https://this-person-does-not-exist.com/img/avatar-genb9134ae84d50cd59fe581519684d7be9.jpg",
        // logoutUrl:"https://tequila.epfl.ch/logout"
      } : {
        first_name: "Juan",
        last_name: "Convers",
        sciper: "00000",
        photo_url: "https://this-person-does-not-exist.com/img/avatar-genb9134ae84d50cd59fe581519684d7be9.jpg",
        // logOutUrl:"https://tequila.epfl.ch/logout"
      }}
      avatarLogoAltText={""}
      avatarLogoUrl={"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="}
      >

        
        <LoginButton inProgressLabel={ <>⏳</> }/>
        <WelcomeUser/>
              <Routes>
                <Route path="/" >
                  {isLogged ? <Route index element={<Search/>}/> : ''}
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
