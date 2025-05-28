import React from 'react'
import { DigestUser } from '../../imports/api/DigestUser'
import styled from "styled-components"
import CopyButton from './CopyButton'
import Unit from './Unit'
import { UserDetails } from '../../imports/api/UserDetails';
import { Link } from 'react-router-dom'
import '../css/UserDetails.css'

const Container = styled.div`
  // Very small devices (up to 576px)
  @media only screen and (max-width: 576px) {
    // background-color: yellow;
    width: 100%;
  }
  // Small devices (landscape phones, 576px and up)
  @media only screen and (min-width: 576px) {
    // background-color: green;
    width: 100%;
  }

  // Medium devices (tablets, 768px and up)
  @media only screen and (min-width: 768px) {
    // background-color: blue;
    width: 95%;
  }

  // Large devices (desktops, 992px and up)
  @media only screen and (min-width: 992px) {
    // background-color: purple;
    width: 90%;
  }

  // Extra large devices (large desktops, 1200px and up)
  @media only screen and (min-width: 1200px) {
    // background-color: red;
    width: 80%;
  }

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
const UserInfoContainer = styled.div`
  padding-top: 20px;
  padding-bottom: 20px;
  padding-right: 30px;
  padding-left: 30px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  min-width: 60%;

  // Very small devices (up to 576px)
  @media only screen and (max-width: 576px) {
    // background-color: yellow;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: rgba(255,0,0,0.6);
  }

  // Small devices (landscape phones, 576px and up)
  @media only screen and (min-width: 576px) {
    // background-color: green;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: rgba(255,0,0,0.6);
  }

  // Medium devices (tablets, 768px and up)
  @media only screen and (min-width: 768px) {
    // background-color: blue;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: rgba(255,0,0,0.6);
  }

  // Large devices (desktops, 992px and up)
  @media only screen and (min-width: 992px) {
    // background-color: purple;
    border-top: none;
    border-left-width: 1px;
    border-left-style: solid;
    border-left-color: rgba(255,0,0,0.6);
  }

  // Extra large devices (large desktops, 1200px and up)
  @media only screen and (min-width: 1200px) {
    // background-color: red;
    border-left-width: 1px;
    border-left-style: solid;
    border-left-color: rgba(255,0,0,0.6);
  }
`

function UserDetails(props:{user:DigestUser}) {
    const [accreds, setAccreds] = React.useState([]);
    const [easterStyle, setEasterStyle] = React.useState("");
    const [ownEmailAddrAuth, setOwnEmailAddrAuth] = React.useState(false);

    React.useEffect(() => {
      Meteor.call('getAccreds.sciper', props.user.id, function(err, res) {
        if(err) {
          console.log(err)
        } else {
          res.accreds ? setAccreds(res.accreds) : setAccreds([]);
        }
      })
    }, [props.user.id])

    React.useEffect(() => {
      setEasterStyle("hover-rotate");

      if (props.user.id == 169419) return setEasterStyle('hover-rotate nbo-special');
      if (props.user.id == 348084) return setEasterStyle('hover-rotate sami-special');
      if (props.user.id == 316897) return setEasterStyle('hover-rotate jerome-special');

    }, [props.user.id])

    React.useEffect(() => {
      accreds.map(unit => {
        if(props.user.id == 169419 || props.user.id == 348084 || props.user.id == 316897) return;
        if (unit.unitid == 13030) return setEasterStyle('hover-rotate fsd-special');
        if (unit.unitid == 13034) return setEasterStyle('hover-rotate sdesk-special');
      });
    })
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

    React.useEffect(() => {
      Meteor.call('getOwnEmailAddressProperty.user', props.user.id, function(err, res) {
        if(err) {
          console.log(err)
        } else {
          if(res.authorizations.length > 0) {
            const filteredResAuth = res.authorizations.filter((e) => e.status == 'active')
            setOwnEmailAddrAuth(filteredResAuth.length > 0);
          } else {
            setOwnEmailAddrAuth(false);
          }
        }
      })
    }, [props.user.id])

    React.useEffect(() => {
      function handleKeyDown(e) {
        // console.log(e.keyCode);
        if (e.keyCode === 27) { // Escape
          document.getElementById('atariSearchBar').value = '';
          document.getElementById('atariSearchBar').focus();
        }
      }
      document.addEventListener('keydown', handleKeyDown);
    }, []);

    const serviceNowCreateTicketLinkGenerator = () => {
      const url = `https://epfl.service-now.com/incident.do?
                sys_id=-1
                &sysparm_stack=incident_list.do
                &sysparm_query=short_description=Ticket pour ${props.user.firstname} ${props.user.lastname}^
                caller_id=javascript:
                  var userRecord = new GlideRecord('sys_user'); 
                  userRecord.addQuery('user_name', '${props.user.id}'); 
                  userRecord.query(); 
                  if(userRecord.next()) { userRecord.sys_id }^
                category=incident^
                assigned_to=javascript:
                  gs.getUserID()^
                assignment_group=javascript:
                  var assignmentGroup = new GlideRecord('sys_user_group');
                  assignmentGroup.addQuery('name', 'SI_SERVICEDESK');
                  assignmentGroup.query();
                  if(assignmentGroup.next()) { assignmentGroup.sys_id }^
                business_service=javascript:
                  var businessService = new GlideRecord('cmdb_ci_service');
                  businessService.addQuery('name', 'Service Desk');
                  businessService.query();
                  if(businessService.next()) { businessService.getValue('sys_id') }^
                description=%0ANote: Ticket ouvert pour ${props.user.firstname} ${props.user.lastname} le ${new Date().toLocaleString('en-GB')} via ATARI (<https://atari.epfl.ch>).`;
      return url.replace(/  +/g, '');
    };

    const copyContentToClipboard = async (text) => {
      navigator.clipboard.writeText(text).then(
        () => {/*ok*/},
        () => { console.error("😢 An error occurred during the copy process");}
      );
    };

  return (
    <Container>
      <div className="d-lg-flex flex-row" style={{ marginBottom: '40px' }}>
        <div className="card-body d-flex flex-column align-items-center" style={{ minWidth: '40%', }}>
          <figure className={easterStyle}>
            <img
              className="img-fluid"
              src={`https://people.epfl.ch/private/common/photos/links/${props.user.id}.jpg`}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cGF0aCBkPSJNMTAyLjQzIDEyNC41M1MxMDUuNSAxNTIgMTI4IDE1MnMyNS41Ny0yNy40NiAyNS41Ny0yNy40NiA0Ljg1IDEgNy4xOS05LjI4YzEuNS02LjctLjUtOC40OS0xLjc2LTguNDloLTEuMkMxNjMuNjggNzQuMjggMTQwIDY0IDEyOCA2NHMtMzUuNjggMTAuMjgtMjkuOCA0Mi43Nkg5N2MtMS4yNiAwLTMuMjYgMS43OS0xLjc2IDguNDkgMi4zNCAxMC4zMyA3LjE5IDkuMjggNy4xOSA5LjI4ek0xNzAuMzYgMTY0Yy0yMC4yNi0zLjg5LTI0LjM0LTgtMjUuMS0xMS42NGEyOS4xNSAyOS4xNSAwIDAgMS0zNC41MiAwYy0uNzQgMy42NC00Ljg0IDcuNzItMjUuMSAxMS42NC0yMC44NSA0LTIwLjU3IDIxLjE4LTIwLjU3IDI0aDEyNS44NmMwLTIuODUuMjgtMjAtMjAuNTctMjR6Ii8+PC9zdmc+Cg=='
              }}
              alt={`${props.user.firstname} ${props.user.lastname} profile picture`}
            />
          </figure>
          <h3 
            onClick={async () => copyContentToClipboard(`${props.user.firstname} ${props.user.lastname}`)}
            style={{ textAlign: 'center', marginTop: '15px', textDecoration: 'underline', textDecorationColor: 'red', textUnderlineOffset: '6px', cursor: 'copy'}}>
            {`${props.user.firstname} ${props.user.lastname}`}
          </h3>
          <div style={{ textAlign: 'start', display: 'grid' }}>
            <div>
              <strong>Sciper</strong> : <span onClick={async () => copyContentToClipboard(props.user.id)} style={{cursor: 'copy', marginRight: '50px'}}>{props.user.id}</span>
              <CopyButton
                text={props.user.id}
              />
            </div>
            {
              props.user.email && (
              <div>
                <strong>Email</strong> : <span onClick={async () => copyContentToClipboard(props.user.email)} style={{cursor: 'copy', marginRight: '50px'}}>{props.user.email}</span>
                <CopyButton
                  text={props.user.email}
                />
              </div>
              )
            }
            {
              props.user.account && (
                <div>
                  <strong>Nom d'utilisateur</strong> : <span onClick={async () => copyContentToClipboard(props.user.account.username)} style={{cursor: 'copy', marginRight: '50px'}}>{props.user.account.username}</span>
                  <CopyButton
                    text={props.user.account.username}
                  />
                </div>
              )
            }
            {
              props.user.phones && props.user.phones.length > 0 && (
                props.user.phones.slice(0, 2).map((phone, index) => 
                  <div key={phone.id}>
                    <strong>Téléphone</strong> : <span onClick={async () => copyContentToClipboard(phone.number)} style={{cursor: 'copy', marginRight: '50px'}}>{phone.number}</span>
                    <CopyButton
                      text={phone.number}
                    />
                  </div>
                )
              )
            }
            {
              props.user.sapid && (
                <div>
                  <strong>Matricule SAP</strong> : <span onClick={async () => copyContentToClipboard(props.user.sapid)} style={{cursor: 'copy', marginRight: '50px'}}>{props.user.sapid}</span>
                  <CopyButton
                    text={props.user.sapid}
                  />
                </div>
              )
            }
            {
              adData.gidNumber && (
                <div>
                  <strong>GID</strong> : <span onClick={async () => copyContentToClipboard(adData.gidNumber)} style={{cursor: 'copy', marginRight: '50px'}}>{adData.gidNumber}</span>
                  <CopyButton
                    text={adData.gidNumber}
                  />
                </div>
              )
            }
            {
              adData.uidNumber && (
                <div>
                  <strong>UID</strong> : <span onClick={async () => copyContentToClipboard(adData.uidNumber)} style={{cursor: 'copy', marginRight: '50px'}}>{adData.uidNumber}</span>
                  <CopyButton
                    text={adData.uidNumber}
                  />
                </div>
              )
            }
            {
              adData.unixHomeDirectory && (
                <div>
                  <strong>Home</strong> : <span onClick={async () => copyContentToClipboard(adData.unixHomeDirectory)} style={{cursor: 'copy', marginRight: '50px'}}>{adData.unixHomeDirectory}</span>
                  <CopyButton
                    text={adData.unixHomeDirectory}
                  />
                </div>
              )
            }
            {
              adData.loginShell && (
                <div>
                  <strong>Shell</strong> : <span onClick={async () => copyContentToClipboard(adData.loginShell)} style={{cursor: 'copy', marginRight: '50px'}}>{adData.loginShell}</span>
                  <CopyButton
                    text={adData.loginShell}
                  />
                </div>
              )
            }
            {
              props.user.account && (
                <div style={{ paddingTop: '15px' }}>
                  <a href={serviceNowCreateTicketLinkGenerator()} target="_blank">
                    <Button className="btn btn-primary">Créer un ticket pour cet utilisateur</Button>
                  </a>
                </div>
              )
            }
          </div>
        </div>
        <UserInfoContainer>
          <div style={{
            width: '100%',
            display:'flex',
            flexDirection: 'column',
            alignItems:'start',
            // maxHeight: '600px',
            height: '100%',
            // overflowY: 'scroll',
            overflowX: 'hidden',
            position: 'relative'
            }}
          >
            <h3 id="general"><a href="#" className="link-pretty">Général</a></h3>
            <>
              <ul>
                <li key="gender"><strong>Genre</strong> : {props.user.gender}</li>
                {accreds ? (
                  accreds.sort((a,b) => a.order - b.order).map((x, i) => <li key={i}><div>{<Unit infos={x} user={props.user} />}</div></li>)
                ) : (
                  <></>
                )}
                <li key="ownEmailAddrAuth"><strong>Avoir une adresse email</strong> : {ownEmailAddrAuth ? "Oui" : "Non"}</li>
              </ul>
            </>
            {adData && (
              <div>
                <h3 id="active-directory"><a href="#" className="link-pretty">Active Directory</a></h3>
                <>
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
                      adData.pwdLastSet && (
                        <li><strong>Dernier changement de mot de passe</strong> : {adData.pwdLastSet == 0 ? 'Jamais' : new Date(((adData.pwdLastSet / 10000000) - 11644473600) * 1000).toLocaleDateString('fr-FR', 
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
                </>
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
                    <Link to={'https://people.epfl.ch/' + (props.user.email ? props.user.email.replace('@epfl.ch', '') : props.user.id)} target='_blank'>
                      <Button className="btn btn-secondary">People</Button>
                    </Link>
                    <Link to={`https://mailwww.epfl.ch/emailStatus.cgi?query=${props.user.email}`} target='_blank'>
                      <Button className="btn btn-secondary">Check Email</Button>
                    </Link>
                    <Link to={`https://mycamipro.epfl.ch/admin/home.php?page=cmpcardmgt&sciper=${props.user.id}`} target='_blank'>
                      <Button className="btn btn-secondary">Camipro admin</Button>
                    </Link>
                  </>
                )
              }
            </Buttons>
          </div>
        </UserInfoContainer>
      </div>
    </Container>
  );
}

export default UserDetails

function WaitForIt() {
  return <>⌛</>
}
