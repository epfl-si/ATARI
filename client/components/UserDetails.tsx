import React from 'react'
import { DigestUser } from '../../imports/api/DigestUser'
import styled from "styled-components"
import CopyButton from './CopyButton'
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
    padding: 50px;
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
`

function UserDetails(props:{user:DigestUser}) {
    const [show, setShow] = React.useState(true)
  return (
    <Container className='container-full'>
    <div className="card">

  <div className="card-body">

    <div className="my-3 d-md-flex align-items-center">

      <img style={{maxHeight:'150px'}} className="img-fluid rounded-circle mr-4" src="https://this-person-does-not-exist.com/img/avatar-gen11bd0006e3bed909ee88e50fa6da87e0.jpg" alt="Shawna Reeves O'Neill Edwards"/>

      <div className="w-100 mt-2 mt-md-0">

        <a className="btn btn-block btn-primary mb-2" href="mailto:heidy.traill@epfl.ch">shawna.reeves.oneill.edwards@epfl.ch</a>

        <div style={{display:'block'}}>
            <a style={{width:'65%'}} className="btn btn-secondary" href="tel:+41791234567">+41 79 123 45 67</a>
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
        {props.user.email}
        <a href="#" style={{marginLeft:'20px'}} className="tag tag-primary">📋</a>
      </dd>
      <dt>Téléphone</dt>
      <dd>
        {props.user.phone_number}
      <a href="#" style={{marginLeft:'20px'}} className="tag tag-primary">📋</a>
      </dd>

      <dt>Email</dt>
      <dd>
        {props.user.email}
        <a href="#" style={{marginLeft:'20px'}} className="tag tag-primary">📋</a>
      </dd>


      <dt>Nom d'utilisateur</dt>
      <dd>
        {props.user.gaspar}
        <a href="#" style={{marginLeft:'20px'}} className="tag tag-primary">📋</a>
      </dd>
      <dt>Genre</dt>
      <dd>
        Féminin
      </dd>
      <dt>Sciper géré par</dt>
        <dd>
            SAP
        </dd>
    </dl>
      
      
      
      







      
      
      
      
      
<button className={`collapse-title collapse-title-desktop ${show ? '' : 'collapsed'}`} type="button" onClick={()=> setShow(!show)} aria-expanded="false" aria-controls="collapse-1">
  <h3>Fonctions</h3>
</button>


<button className={`collapse-title collapse-title-desktop ${show ? '' : 'collapsed'}`} type="button" onClick={()=> setShow(!show)} aria-expanded="false" aria-controls="collapse-1">
  <strong>Fonction précise</strong>, <span className="font-weight-normal">Nom du département</span>
</button>

<div>
    <div className={`collapse ${show ? 'show' : ''} collapse-item collapse-item-desktop`} id="collapse-1">
      <div className="row pt-2 pb-2">
        <div className="col-md-5">
          <p itemProp="location" itemScope itemType="http://schema.org/Place">
            <strong itemProp="name">EPFL PRES</strong><br />
            <span itemProp="address">
              CE 3 316 (Centre Est)<br />
              Station 1<br />
              CH-1015 Lausanne
            </span>
          </p>
        </div>
        <div className="col-md-7">
          <p>
            <a href="tel:+41 21 666 77 88" className="btn btn-sm btn-secondary mb-2 align-baseline">+41 21 666 77 88</a>
            <small className="align-baseline ml-2">Bureau principal: <a href="#">INN 019</a></small>
            <br/>
            <a href="tel:+41 21 666 55 66" className="btn btn-sm btn-secondary mb-2 align-baseline">+41 21 666 55 66</a>
            <small className="align-baseline ml-2">Bureau: <a href="#">INN 018</a></small>
            <br/>
            <small>Unité: <a href="#">EPFL</a> &rsaquo; <a href="#">SI</a> &rsaquo; <a href="#">SI-EXOP</a> &rsaquo; <a href="#">EXAPP</a></small>
          </p>
        </div>
        <div className="col-sm-12">
          <p><span className="sr-only">Web site: </span><a href="https://www.epfl.ch/about/vice-presidencies/vice-presidencies/information-systems/">https://www.epfl.ch/about/vice-presidencies/vice-presidencies/information-systems/</a></p>
        </div>
      </div>
    
    </div>
</div>


<button className="collapse-title collapse-title-desktop collapsed" type="button" data-toggle="collapse" data-target="#collapse-2" aria-expanded="false" aria-controls="collapse-2">
  <strong>Fonction précise</strong>, <span className="font-weight-normal">Nom du département</span>
</button>

<div className="collapse collapse-item collapse-item-desktop" id="collapse-2">

  <div className="row pt-2 pb-2">
    <div className="col-md-5">
      <p itemProp="location" itemScope itemType="http://schema.org/Place">
        <strong itemProp="name">EPFL PRES</strong><br />
        <span itemProp="address">
          CE 3 316 (Centre Est)<br />
          Station 1<br />
          CH-1015 Lausanne
        </span>
      </p>
    </div>
    <div className="col-md-7">
      <p>
        <a href="tel:+41 21 666 77 88" className="btn btn-sm btn-secondary mb-2 align-baseline">+41 21 666 77 88</a>
        <small className="align-baseline ml-2">Bureau principal: <a href="#">INN 019</a></small>
        <br/>
        <small>Unité: <a href="#">EPFL</a> &rsaquo; <a href="#">SI</a> &rsaquo; <a href="#">SI-EXOP</a> &rsaquo; <a href="#">EXAPP</a></small>
      </p>
    </div>
    <div className="col-sm-12">
      <p><span className="sr-only">Web site: </span><a href="https://rh.epfl.ch/">https://rh.epfl.ch/</a></p>
    </div>
  </div>

</div>

<button className="collapse-title collapse-title-desktop collapsed" type="button" data-toggle="collapse" data-target="#collapse-3" aria-expanded="false" aria-controls="collapse-3">
  <strong>Fonction précise</strong>, <span className="font-weight-normal">Nom du département</span>
</button>

<div className="collapse collapse-item collapse-item-desktop" id="collapse-3">

  <div className="row pt-2 pb-2">
    <div className="col-md-5">
      <p itemProp="location" itemScope itemType="http://schema.org/Place">
        <strong itemProp="name">EPFL PRES</strong><br />
        <span itemProp="address">
          CE 3 316 (Centre Est)<br />
          Station 1<br />
          CH-1015 Lausanne
        </span>
      </p>
    </div>
    <div className="col-md-7">
      <p>
        <a href="tel:+41 21 666 77 88" className="btn btn-sm btn-secondary mb-2 align-baseline">+41 21 666 77 88</a>
        <small className="align-baseline ml-2">Bureau principal: <a href="#">INN 019</a></small>
        <br/>
        <a href="tel:+41 21 666 55 66" className="btn btn-sm btn-secondary mb-2 align-baseline">+41 21 666 55 66</a>
        <small className="align-baseline ml-2">Bureau: <a href="#">INN 018</a></small>
        <br/>
        <small>Unité: <a href="#">EPFL</a> &rsaquo; <a href="#">SI</a> &rsaquo; <a href="#">SI-EXOP</a> &rsaquo; <a href="#">EXAPP</a></small>
      </p>
    </div>
  </div>
</div>
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
            Compte désactivé
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
