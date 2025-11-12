import * as React from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import { SearchPerson } from './components/SearchPerson'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import EPFLHeader from './components/EPFLHeader';
import PleaseLogin from './components/PleaseLogin';
import { CheckLDAP } from './components/CheckLDAP';
import CheckInv from './components/CheckInv';
import Footer from './components/Footer';
import { CheckAD } from './components/CheckAD';

export default function Home() {
    const isLoggedIn = useTracker(() => !! Meteor.userId());
    const [alert, setAlert] = React.useState(false)
    const [alertInfos, setAlertInfos] = React.useState({reason: '', from: '', to: ''})

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
    if(!isLoggedIn && urlParams.get('error_description')) {
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
            <Routes>
              <Route path="/">
                {isLoggedIn ? (
                  <Route index element={<SearchPerson />} />
                ) : (
                  <Route index element={<PleaseLogin />} />
                )}
              </Route>
              <Route path="/:sciper">
                {isLoggedIn ? (
                  <Route index element={<SearchPerson />} />
                ) : (
                  <Route index element={<PleaseLogin />} />
                )}
              </Route>
              <Route path="/checkAD/:sciper">
                {isLoggedIn ? (
                  <Route index element={<CheckAD />} />
                  ) : (
                  <Route index element={<PleaseLogin />} />
                )}
              </Route>
              <Route path="/checkLDAP/:sciper">
                {isLoggedIn ? (
                  <Route index element={<CheckLDAP />} />
                  ) : (
                  <Route index element={<PleaseLogin />} />
                )}
              </Route>
              <Route path="/inv">
                {isLoggedIn ? (
                  <Route index element={<CheckInv />} />
                  ) : (
                  <Route index element={<PleaseLogin />} />
                )}
              </Route>
              <Route path="/inv/:inventoryParam">
                {isLoggedIn ? (
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
