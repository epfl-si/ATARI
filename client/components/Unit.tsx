import React from 'react'
import { UnitInfos } from '../../imports/types/UnitInfos'

function Unit(props:{show?: boolean, infos: UnitInfos}) {
  const [show, setShow] = React.useState(!!props.show)
  var phone_numbers = props.infos.phone_numbers?.map(x=> {
    return <><a href={"999"} className="btn btn-sm btn-secondary mb-2 align-baseline">{"999"}</a>
            <br/></>
  })
  let hierarchy:string[] = props.infos?.hierarchie ? props.infos?.hierarchie?.split(' ') : [''];
  const hierarchySchema = hierarchy.map((x,i,arr)=> <> <a href="#">{x}</a>{i !== arr.length-1 ? <> &rsaquo; </> : ''}</>)
  
  return (
    <>
      <button className={`collapse-title collapse-title-desktop ${show ? '' : 'collapsed'}`} type="button" onClick={()=> setShow(!show)} aria-expanded="false" aria-controls="collapse-1">
        <strong>{props.infos.fonction}</strong>, <span className="font-weight-normal">{props.infos.libelle}</span>
      </button>

      <div>
          <div className={`collapse ${show ? 'show' : ''} collapse-item collapse-item-desktop`} id="collapse-1">
            <div className="row pt-2 pb-2">
              <div className="col-md-5">
                <p itemProp="location" itemScope itemType="http://schema.org/Place">
                  <strong itemProp="name">{props.infos.adresse_1}</strong><br />
                  <span itemProp="address">
                    {props.infos.adresse_2}<br />
                    {props.infos.adresse_3}<br />
                    {props.infos.adresse_4}
                  </span>
                </p>
              </div>
              <div className="col-md-7">
                <p>
                  {phone_numbers}
                  {props.infos.office !== undefined ? <small>Bureau: <a href="#">INN 018</a><br/></small> : ''}
                  <small>Unité: 
                    {hierarchySchema}
                    <br/>
                    </small>
                  <small>Statut: <span>{props.infos.statut}</span></small>
                  <br/>
                </p>
              </div>
            </div>
          </div>
      </div>

    </>
  )
}

export default Unit
