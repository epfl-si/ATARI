import React from 'react'
import { DigestUser } from '../../imports/api/DigestUser'
import styled from "styled-components"
import CopyButton from './CopyButton'
import Unit from './Unit'
import { UnitInfos } from '../../imports/types/UnitInfos'
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import { UserDetails, userDetailsCollection } from '../../imports/api/UserDetails';
const {log} = console;

<style>
    div {
    'font-size: large;'
    }
</style>
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
      
    <div className="card" style={{minWidth: '300px', margin: 'auto'}}>
      
      
      <div className="card-body">
      
      <div className="my-3 d-md-flex align-items-center">
        <img style={{maxHeight:'150px'}} className="img-fluid rounded-circle mr-4" src="https://this-person-does-not-exist.com/img/avatar-gen11bd0006e3bed909ee88e50fa6da87e0.jpg" alt="Shawna Reeves O'Neill Edwards"/>
        <div className="w-100 mt-2 mt-md-0">
          <a className="btn btn-block btn-primary mb-2" href={props.user.email}>{props.user.email}</a>
          <div style={{display:'block'}}>
              <a style={{width:'65%'}} className="btn btn-secondary" href={props.user.phone_number}>{props.user.phone_number}</a>
              <div style={{width:'35%', display: 'inline'}}>
                  {/* <CopyButton user={props.user}/> */}
                  <a style={{width:'35%'}} className="btn btn-secondary" href="tel:+41791234567">Copy</a>
              </div>
          </div>
        </div>
      </div>
      <h3><a className="link-pretty" href="#">{`${props.user.first_name} ${props.user.last_name}`}</a></h3>
      <br />
      <button className={`collapse-title collapse-title-desktop ${show ? '' : 'collapsed'}`} type="button" onClick={()=> setShow(!show)} aria-expanded="false" aria-controls="collapse-1">
          <h3>Général</h3>
      </button>
      <dl className="definition-list definition-list-grid">
        <dt>Nom complet</dt>
        <dd>
          {`${props.user.first_name} ${props.user.last_name}`}
          <a href="#" style={{float:'right'}} className="tag tag-primary">📋</a>
        </dd>
        <dt>Sciper</dt>
        {/* <dd>{props.user.sciper}<a style={{marginLeft:'20px', padding:'5px 20px 5px 20px', borderRadius:'5px'}} className="btn btn-secondary">📋</a></dd> */}
        <dd>
          {props.user.sciper}
          <a href="#" style={{float:'right'}} className="tag tag-primary">📋</a>
        </dd>
        <dt>Téléphone</dt>
        <dd>
          {props.user.phone_number}
        <a href="#" style={{float:'right'}} className="tag tag-primary">📋</a>
        </dd>

        <dt>Email</dt>
        <dd>
          {props.user.email}
          <a href="#" style={{float:'right'}} className="tag tag-primary">📋</a>
        </dd>


        <dt>Nom d'utilisateur</dt>
        <dd>
          {props.user.gaspar}
          <a href="#" style={{float:'right'}} className="tag tag-primary">📋</a>
        </dd>
        <dt>Genre</dt>
        <dd>
          {isLoading() ? <WaitForIt/> : user.sexe}
        </dd>
        <dt>Sciper géré par</dt>
          <dd>
              SAP (TODO)
          </dd>
      </dl>
      
      {user.units ? user.units.map((x, i)=> <div key={i}>{<Unit infos={x}/>}</div>) : <></>}
      <br />  

      <button className="collapse-title collapse-title-desktop collapsed" type="button" data-toggle="collapse" data-target="#collapse-3" aria-expanded="false" aria-controls="collapse-3">
        <h3>Active Directory</h3>
      </button>

      <dl className="definition-list definition-list-grid">
          <dt>Domaine\login</dt>
              <dd>
                  EPFL\USER
              </dd>
          <dt>Status du compte</dt>
              <dd>
                  {isLoading() ? <WaitForIt/> : user.account?.status}
              </dd>

          <dt>Expiration du compte</dt>
              <dd>
                  Peut-être un jour
              </dd>
          <dt>Dernière connexion</dt>
              <dd>
                  10 May 1890 12:55
              </dd>
          <dt>Dernier mot de passe erroné</dt>
              <dd>
                  1 May 1850 13:45
              </dd>
      </dl>

      <button className="collapse-title collapse-title-desktop collapsed" type="button" data-toggle="collapse" data-target="#collapse-3" aria-expanded="false" aria-controls="collapse-3">
        <h3>Tools</h3>
      </button>

                  <Buttons>
                      <a href={`https://accred.epfl.ch/`}><Button className='btn btn-secondary'>Accred</Button></a>
                      <a href={`https://windows.epfl.ch/checkad/default.aspx`}><Button className='btn btn-secondary'>Check AD</Button></a>
                      <a href={`https://idp-exop.epfl.ch/checkldap?username=${props.user.gaspar}&sciper=${props.user.sciper}`}><Button className='btn btn-secondary'>Check LDAP</Button></a>
                      <a href={`https://it.epfl.ch/backoffice/sys_user.do?sysparm_query=user_name=${props.user.sciper}`}><Button className='btn btn-secondary'>ServiceNow</Button></a>
                      <a href={`https://search.epfl.ch/?filter=people&q=${props.user.email}`}><Button className='btn btn-secondary'>People</Button></a>
                      <a href={`https://mailwww.epfl.ch/emailStatus.cgi?query=${props.user.email}`}><Button className='btn btn-secondary'>Check Email</Button></a>
                  </Buttons>
        </div>
      </div>
    </Container>
  )
}

export default UserDetails

function WaitForIt() {
  return <>⌛</>
}
