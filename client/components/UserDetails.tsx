import React from 'react'
import { DigestUser } from '../../imports/api/DigestUser'
import styled from "styled-components"
import CopyButton from './CopyButton'
import Unit from './Unit'
import { UserDetails } from '../../imports/api/UserDetails';
import { Link } from 'react-router-dom'

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

function UserDetails(props:{user:DigestUser}) {
    const [accreds, setAccreds] = React.useState([]);

    React.useEffect(() => {
      Meteor.call('getAccreds.sciper', props.user.id, function(err, res) {
        if(err) {
          console.log(err)
        } else {
          res.accreds ? setAccreds(res.accreds) : setAccreds([]);
        }
      })
    }, [props.user.id])
    const [adData, setAdData] = React.useState({})

    React.useEffect(() => {
      Meteor.call('AD.user', props.user.id, function(err, res) {
        if(err) {
          console.log(err)
        } else {
          setAdData(res[0]);
        }
      })
    }, [props.user.id])
  return (
    <Container>
      <div className="d-lg-flex flex-row" style={{ marginBottom: '40px' }}>
        <div className="card-body d-flex flex-column align-items-center" style={{ minWidth: '40%', }}>
          <div style={{ width: "100px",  height: "100px", position: 'relative', overflow: 'hidden', borderRadius: '100%'}}>
            <img
              className="img-fluid"
              src={`https://people.epfl.ch/private/common/photos/links/${props.user.id}.jpg`}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cGF0aCBkPSJNMTAyLjQzIDEyNC41M1MxMDUuNSAxNTIgMTI4IDE1MnMyNS41Ny0yNy40NiAyNS41Ny0yNy40NiA0Ljg1IDEgNy4xOS05LjI4YzEuNS02LjctLjUtOC40OS0xLjc2LTguNDloLTEuMkMxNjMuNjggNzQuMjggMTQwIDY0IDEyOCA2NHMtMzUuNjggMTAuMjgtMjkuOCA0Mi43Nkg5N2MtMS4yNiAwLTMuMjYgMS43OS0xLjc2IDguNDkgMi4zNCAxMC4zMyA3LjE5IDkuMjggNy4xOSA5LjI4ek0xNzAuMzYgMTY0Yy0yMC4yNi0zLjg5LTI0LjM0LTgtMjUuMS0xMS42NGEyOS4xNSAyOS4xNSAwIDAgMS0zNC41MiAwYy0uNzQgMy42NC00Ljg0IDcuNzItMjUuMSAxMS42NC0yMC44NSA0LTIwLjU3IDIxLjE4LTIwLjU3IDI0aDEyNS44NmMwLTIuODUuMjgtMjAtMjAuNTctMjR6Ii8+PC9zdmc+Cg=='
              }}
              alt={`${props.user.firstname} ${props.user.lastname} profile picture`}
            />
          </div>
          <h3 style={{ textAlign: 'center', marginTop: '15px', textDecoration: 'underline', textDecorationColor: 'red', textUnderlineOffset: '6px'}}>
            {`${props.user.firstname} ${props.user.lastname}`}
          </h3>
          <div style={{ textAlign: 'start', display: 'grid' }}>
            <div>
              <strong>Sciper</strong> : {props.user.id}
              <CopyButton
                text={props.user.id}
              />
            </div>
            {
              props.user.email && (
              <div>
                <strong>Email</strong> : {props.user.email}
                <CopyButton
                  text={props.user.email}
                />
              </div>
              )
            }
            {
              props.user.account && (
                <div>
                  <strong>Nom d'utilisateur</strong> : {props.user.account.username}
                  <CopyButton
                    text={props.user.account.username}
                  />
                </div>
              )
            }
            {
              props.user.account && (
                <div style={{ paddingTop: '15px' }}>
                  <a href={`https://epfl.service-now.com/incident.do?sys_id=-1&sysparm_stack=incident_list.do&sysparm_query=short_description=Ticket pour ${props.user.firstname} ${props.user.lastname}^
                          caller_id=javascript:var userRecord = new GlideRecord('sys_user'); userRecord.addQuery('user_name', '${props.user.id}'); userRecord.query(); if(userRecord.next()) { userRecord.sys_id }^
                          category=incident^assigned_to=javascript:gs.getUserID()^
                          assignment_group=javascript:var assignmentGroup = new GlideRecord('sys_user_group'); assignmentGroup.addQuery('name', 'SI_SERVICEDESK'); assignmentGroup.query(); if(assignmentGroup.next()) { assignmentGroup.sys_id }^
                          business_service=javascript:var businessService = new GlideRecord('cmdb_ci_service'); businessService.addQuery('name', 'Service Desk'); businessService.query(); if(businessService.next()) { businessService.getValue('sys_id') }^
                          description=%0A%0ATicket ouvert pour ${props.user.firstname} ${props.user.lastname} le ${new Date().toLocaleString('en-GB')} via ATARI`}
                      target="_blank">
                            <Button className="btn btn-primary">Créer un ticket pour cet utilisateur</Button>
                  </a>
                </div>
              )
            }
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
          border: '2px solid red',
        }}>
          <div style={{
            width: '100%',
            display:'flex',
            flexDirection: 'column',
            alignItems:'start',
            maxHeight: '600px',
            height: '100%',
            overflowY: 'scroll',
            overflowX: 'hidden',
            position: 'relative'
            }}
          >
            <h3 id="general"><a href="#" className="link-pretty">Général</a></h3>
            <p>
              <ul>
                <li><strong>Genre</strong> : {props.user.gender}</li>
                {accreds ? (
                  accreds.sort((a,b) => a.order - b.order).map((x, i) => <li><div key={i}>{<Unit infos={x} user={props.user} />}</div></li>)
                ) : (
                  <></>
                )}
              </ul>
            </p>
            {adData && (
              <div>
                <h3 id="active-directory"><a href="#" className="link-pretty">Active Directory</a></h3>
                <p>
                  <ul>
                    {adData.userPrincipalName && (
                      <li><strong>Domaine\login</strong> : {`${adData.userPrincipalName?.split('@')[1].split('.')[0].toUpperCase()}\\${adData.sAMAccountName}`}</li>
                    )}
                    <li><strong>Status du compte</strong> : {
                      adData.userAccountControl
                    }</li>
                    <li><strong>Expiration du compte</strong> : {
                      adData.accountExpires == 9223372036854775807 ? 'Jamais' : new Date(((adData.accountExpires / 10000000) - 11644473600) * 1000).toLocaleDateString('en-US')
                    }
                    </li>
                    {
                      adData.lastLogon && (
                        <li><strong>Dernière connexion</strong> : {adData.lastLogon == 0 ? 'Jamais' : new Date(((adData.lastLogon / 10000000) - 11644473600) * 1000).toLocaleDateString('fr-FR', 
                        { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</li>
                      )
                    }
                    {
                      !!adData.badPasswordTime && (
                        <li><strong>Dernier mot de passe erroné</strong> : {adData.badPasswordTime == 0 ? 'Jamais' : new Date(((adData.badPasswordTime / 10000000) - 11644473600) * 1000).toLocaleDateString('fr-FR',
                        { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</li>
                      )
                    }
                    {
                      adData.badPwdCount !== undefined && adData.badPwdCount !== 0 && (
                        <li><strong>Nombre d'essais de mot de passe erronnés</strong> : {adData.badPwdCount}</li>
                      )
                    }
                  </ul>
                </p>
              </div>
            )}
            <h3 id="tools"><a id="tools-a" href="#" className="link-pretty">Tools</a></h3>
            <Buttons>
              <Link to={`https://accred.epfl.ch/#/catalog/persons/${props.user.id}`} target='_blank'>
                <Button className="btn btn-secondary">Accred</Button>
              </Link>
              {
                props.user.account && (
                  <>
                    <Link to={`/checkAD/${props.user.id}`} target='_blank'>
                      <Button className="btn btn-secondary">Check AD</Button>
                    </Link>
                    <Link to={`/checkLDAP/${props.user.id}`} target='_blank'>
                      <Button className="btn btn-secondary">Check LDAP</Button>
                    </Link>
                    <Link to={`https://it.epfl.ch/backoffice/sys_user.do?sysparm_query=user_name=${props.user.id}`} target='_blank'>
                      <Button className="btn btn-secondary">ServiceNow</Button>
                    </Link>
                    <Link to={`https://search.epfl.ch/?filter=people&q=${props.user.email}`} target='_blank'>
                      <Button className="btn btn-secondary">People</Button>
                    </Link>
                    <Link to={`https://mailwww.epfl.ch/emailStatus.cgi?query=${props.user.email}`} target='_blank'>
                      <Button className="btn btn-secondary">Check Email</Button>
                    </Link>
                  </>
                )
              }
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
