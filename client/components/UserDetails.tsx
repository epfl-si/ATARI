import React from 'react'
import { DigestUser } from '../../imports/api/DigestUser'
import styled from "styled-components"
import CopyButton from './CopyButton'
import Unit from './Unit'
import { UnitInfos } from '../../imports/types/UnitInfos'
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import { UserDetails, userDetailsCollection } from '../../imports/api/UserDetails';
const {log} = console;

const Container = styled.div`
    /* border-style: solid;
    border-color: black; */
    border-width: 1px;
    /* background-color: red; */
    /* min-width: 10%; */
    width: 60%;
    /* height: 50vh; */
    /* padding: 50px; */
    margin: auto;
    .definition-list-grid {
      grid-template-columns: fit-content(100%) 1fr;
    }
`
const Legend = styled.legend`
    text-align: center;
`
const Table = styled.table`
    width: 100%;
`
const Buttonold = styled.button`
    background-color: red;
    border:none;
    padding: 10px;
    padding-left: 20px;
    padding-right: 20px;
    /* margin: 10px; */
    color: white;
    border-radius: 5px;
    
`
const Button = styled.button`
    padding: 10px;
    padding-left: 20px;
    padding-right: 20px;
    /* margin: 10px; */
    border-radius: 5px;
    /* width: 50vw; */
`
const Buttons = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 1vh;
`
const Img = styled.div`
    /* width: 100%; */
    height: 100%;
`
const Div = styled.div`
    border-style: solid;
    border-width: 1px;
    border-color: grey;
`
const Infos = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 1vh;
`;

function UserDetails(props:{user:DigestUser}) {
    
    const isLoading = useSubscribe('userDetails', props.user.sciper);
    const users = useFind(() => userDetailsCollection.find());
    const user = (users[0] || {}) as UserDetails;
    
    const [show, setShow] = React.useState(true)
    const infos = {
      fonction:"Full-Stack Developer", 
      libelle:"Full-Stack Developement", 
      adresse_1: "EPFL SI ISAS-FSD",
      adresse_2: "INN 013 (Bâtiment INN",
      adresse_3: "Station 14",
      adresse_4: "CH-1015 Lausanne",
      phone_numbers: ["+41 21 693 43 21", "+41 21 693 1234"],
      // office: "INN 013",
      // mainOffice: "INN 013",
      website: "example.com",
      unit: "EPFL VPO VPO-SI ISAS ISAS-FSD",
      statut: "Personnel",
    } as UnitInfos
  return (
    <Container>
      <div className="d-lg-flex flex-row" style={{ borderRight: '4px solid red', borderTop: '4px solid red', marginBottom: '40px' }}>
        <div className="card-body d-flex flex-column align-items-center" style={{ minWidth: '40%', borderBottom: '4px solid red', borderLeft: '4px solid red' }}>
          <div style={{ width: "100px",  height: "100px", position: 'relative', overflow: 'hidden', borderRadius: '100%'}}>
            <img
              className="img-fluid"
              src={`https://people.epfl.ch/private/common/photos/links/${props.user.sciper}.jpg`}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cGF0aCBkPSJNMTAyLjQzIDEyNC41M1MxMDUuNSAxNTIgMTI4IDE1MnMyNS41Ny0yNy40NiAyNS41Ny0yNy40NiA0Ljg1IDEgNy4xOS05LjI4YzEuNS02LjctLjUtOC40OS0xLjc2LTguNDloLTEuMkMxNjMuNjggNzQuMjggMTQwIDY0IDEyOCA2NHMtMzUuNjggMTAuMjgtMjkuOCA0Mi43Nkg5N2MtMS4yNiAwLTMuMjYgMS43OS0xLjc2IDguNDkgMi4zNCAxMC4zMyA3LjE5IDkuMjggNy4xOSA5LjI4ek0xNzAuMzYgMTY0Yy0yMC4yNi0zLjg5LTI0LjM0LTgtMjUuMS0xMS42NGEyOS4xNSAyOS4xNSAwIDAgMS0zNC41MiAwYy0uNzQgMy42NC00Ljg0IDcuNzItMjUuMSAxMS42NC0yMC44NSA0LTIwLjU3IDIxLjE4LTIwLjU3IDI0aDEyNS44NmMwLTIuODUuMjgtMjAtMjAuNTctMjR6Ii8+PC9zdmc+Cg=='
              }}
              alt={`${props.user.first_name} ${props.user.last_name} profile picture`}
            />
          </div>
          <h3 style={{ textAlign: 'center', marginTop: '15px' }}>
            <a
              className="link-pretty"
              href="#"
            >{`${props.user.first_name} ${props.user.last_name}`}</a>
          </h3>
          <div style={{ textAlign: 'start', display: 'grid' }}>
            <div>
              <strong>Sciper</strong> : {props.user.sciper} &nbsp;
              <CopyButton
                text={props.user.sciper}
              />
            </div>
            <div>
              <strong>Email</strong> : {props.user.email} &nbsp;
              <CopyButton
                text={props.user.email}
              />
            </div>
            <div>
              <strong>Nom d'utilisateur</strong> : {props.user.gaspar} &nbsp;
              <CopyButton
                text={props.user.gaspar}
              />
            </div>
          </div>
        </div>
        <div style={{
          paddingTop: '20px',
          paddingBottom: '20px',
          paddingRight: '30px',
          paddingLeft:'30px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          minWidth: '60%',
          borderBottom: '4px solid red',
          borderLeft: '4px solid red'
        }}>
          <div style={{ marginRight: '20px', display: 'flex', justifyContent: 'center', gap: '5px', borderRight: '2px solid red', }} className="list-group">
            <a style={{ width: '100px' }} href="#general">Général</a>
            <a style={{ width: '100px' }} href="#active-directory">AD</a>
            <a style={{ width: '100px' }} href="#tools">Tools</a>
          </div>
          <div style={{
            width: '100%',
            display:'flex',
            flexDirection: 'column',
            alignItems:'start',
            maxHeight: '300px',
            height: '300px',
            overflowY: 'scroll',
            overflowX: 'hidden',
            position: 'relative'
            }}
          >
            <h3 id="general"><a href="#" className="link-pretty">Général</a></h3>
            <p>
              <ul>
                <li><strong>Genre</strong> : {user.sexe}</li>
                <li><strong>Sciper géré par</strong> : {user.type}</li>
                {user.units ? (
                  user.units.map((x, i) => <li><div key={i}>{<Unit infos={x} />}</div></li>)
                ) : (
                  <></>
                )}
              </ul>
            </p>
            <h3 id="active-directory"><a href="#" className="link-pretty">Active Directory</a></h3>
            <p>
              <ul>
                <li><strong>Domaine\login</strong> : EPFL\user</li>
                <li><strong>Status du compte</strong> : Compte désactivé</li>
                <li><strong>Expiration du compte</strong> : Peut-être un jour</li>
                <li><strong>Dernière connexion</strong> : 10 May 1980 12:55</li>
                <li><strong>Dernier mot de passe erroné</strong> : 1 May 1850 13:45</li>
              </ul>
            </p>
            <h3 id="tools"><a id="tools-a" href="#" className="link-pretty">Tools</a></h3>
            <Buttons>
              <a href={`https://accred.epfl.ch/`}>
                <Button className="btn btn-secondary">Accred</Button>
              </a>
              <a href={`https://windows.epfl.ch/checkad/default.aspx`}>
                <Button className="btn btn-secondary">Check AD</Button>
              </a>
              <a
                href={`/checkLDAP/${props.user.sciper}`}
              >
                <Button className="btn btn-secondary">Check LDAP</Button>
              </a>
              <a
                href={`https://it.epfl.ch/backoffice/sys_user.do?sysparm_query=user_name=${props.user.sciper}`}
              >
                <Button className="btn btn-secondary">ServiceNow</Button>
              </a>
              <a
                href={`https://search.epfl.ch/?filter=people&q=${props.user.email}`}
              >
                <Button className="btn btn-secondary">People</Button>
              </a>
              <a
                href={`https://mailwww.epfl.ch/emailStatus.cgi?query=${props.user.email}`}
              >
                <Button className="btn btn-secondary">Check Email</Button>
              </a>
            </Buttons>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default UserDetails

function WaitForIt() {
  return <>⌛</>
}
