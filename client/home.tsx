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
import CheckInv from './components/CheckInv';
import Footer from './components/Footer';
import CheckAD from './components/CheckAD';

export default function Home() {
    const isLogged = useOpenIDConnectContext().state === StateEnum.LoggedIn || Meteor.user() !== null
    const isLoading = useSubscribe('digestusers');
    let digestUsers = useTracker(() => DigestUsersCollection.find().fetch())
    const userInfos = useOpenIDConnectContext().idToken
    const [alert, setAlert] = React.useState(false)
    const [alertInfos, setAlertInfos] = React.useState({reason: '', from: '', to: ''})
    if (!isLogged) {
      Meteor.logout()
    }

    React.useEffect(() => {
      const maintenance = require('../maintenance.json')
      if(!maintenance.maintenance) {
        setAlert(false)
      } else {
        setAlert(true)
        setAlertInfos({reason: maintenance.reason || '', from: maintenance.from || '', to: maintenance.to || ''})
      }
    }, [])

    const urlParams = new URLSearchParams(window.location.search);
    if(!isLogged && urlParams.get('error_description')) {
      return (
        <div className="d-flex flex-column min-vh-100">
          <EPFLHeader />
          <div>
            You do not have access to this web application.
            If you think that this is a mistake and that you should have access to it,
            please write to <a style={{ display: 'inline-block' }} href="mailto:1234@epfl.ch">1234@epfl.ch</a>
          </div>
          <div className="pt-5 mt-auto">
            <Footer />
          </div>
        </div>
      )
    } else {
      return (
        <div className="d-flex flex-column min-vh-100">
          <BrowserRouter>
            <EPFLHeader />
            <div style={{ width: '50%', margin: 'auto', marginTop: '50px', display: alert ? '' : 'none', marginBottom: '1px' }} className="alert alert-info alert-dismissible fade show" role="alert">
              <strong>Annonce :</strong> Une maintenance est prévue de {alertInfos.from} à {alertInfos.to}. <strong>Raison :</strong> {alertInfos.reason}
              <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <WelcomeUser />
            <Routes>
              <Route path="/">
                {isLogged ? (
                  <Route index element={<Search />} />
                ) : (
                  <Route index element={<PleaseLogin />} />
                )}
              </Route>
              <Route path="/:sciper">
                {isLogged ? (
                  <Route index element={<Search />} />
                ) : (
                  <Route index element={<PleaseLogin />} />
                )}
              </Route>
              <Route path="/checkAD/:sciper">
                {isLogged ? (
                  <Route index element={<CheckAD />} />
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
              <Route path="/inv">
                {isLogged ? (
                  <Route index element={<CheckInv />} />
                  ) : (
                  <Route index element={<PleaseLogin />} />
                )}
              </Route>
              <Route path="/inv/:inventoryParam">
                {isLogged ? (
                  <Route index element={<CheckInv />} />
                  ) : (
                  <Route index element={<PleaseLogin />} />
                )}
              </Route>
            </Routes>
            <div className="pt-5 mt-auto">
              <Footer />
            </div>
          </BrowserRouter>
        </div>
      );
    }
  
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
