import React from 'react'
import { UnitInfos } from '../../imports/types/UnitInfos'
import Chevron from './Chevron'
import { DigestUser } from '../../imports/api/DigestUser';

function Unit(props:{show?: boolean, infos: UnitInfos, user: DigestUser}) {
  const [show, setShow] = React.useState(false)

  const addressForUnit = props.user.addresses ? props.user.addresses.filter(e => parseInt(e.unitid) == props.infos.unitid) : []
  const [adminsIT, setAdminsIT] = React.useState([])

  React.useEffect(() => {
    Meteor.call('getAdminsIT.unit', props.infos.unitid, function(err, res) {
      if(err) {
        console.log(err)
      } else {
        setAdminsIT([]);
        if(res.authorizations) {
          const adminResArray = [];
          res.authorizations.map(auth => {
            Meteor.call('getUser.sciper', auth.persid, function(err, adminRes) {
              if(err) {
                console.log(err)
              } else {
                adminResArray.push(adminRes);
                if (adminResArray.length === res.authorizations.length) {
                  setAdminsIT(adminResArray);
                }
              }
            })
          })
        }
      }
    })
  }, [props.user.id, props.infos.unitid])

  const [showAdminsIT, setShowAdminsIT] = React.useState(adminsIT.length > 10 ? false : true)

  const [hover, setHover] = React.useState(false);
  const [hoverAdminsIT, setHoverAdminsIT] = React.useState(false);

  const [rotateChevron, setRotateChevron] = React.useState(false);
  const [rotateChevronAdminsIT, setRotateChevronAdminsIT] = React.useState(false);

  const handleRotate = () => setRotateChevron(!rotateChevron);
  const handleRotateAdminsIT = () => setRotateChevronAdminsIT(!rotateChevronAdminsIT);

  var phone_numbers = props.infos.phone_numbers?.map(x=> {
    return <><a href={"999"} className="btn btn-sm btn-secondary mb-2 align-baseline">{"999"}</a>
            <br/></>
  })
  let hierarchy:string[] = props.infos?.unit.path ? props.infos?.unit.path?.split(' ') : [''];
  const hierarchySchema = hierarchy.map((x,i,arr)=> <> <a href={`http://search.epfl.ch/ubrowse.action?acro=${x}`} target='_blank'>{x}</a>{i !== arr.length-1 ? <> &rsaquo; </> : ''}</>)
  return (
    <>
      <button style={{ paddingTop: 0, paddingBottom: 0, border: 0, color: hover ? 'red' : '', transition: "all 0.1s linear" }} 
      className={`collapse-title ${show ? '' : 'collapsed'}`}
      type="button" onClick={()=> { setShow(!show); handleRotate() }}
      aria-expanded="false"
      aria-controls={`collapse-${props.infos.unitid}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
        {props.infos.position && <span style={{ display: props.infos.position.labelfr ? '' : 'none' }}><strong>{props.infos.position.labelfr}</strong>,</span>} <span className="font-weight-normal">{props.infos.unit.labelfr}</span>&nbsp;
        <Chevron handleRotate={handleRotate} rotateChevron={rotateChevron} setRotateChevron={setRotateChevron} />
      </button>

      <div>
          <div className={`collapse ${show ? 'show' : ''} collapse-item collapse-item-desktop`} id={`collapse-${props.infos.unitid}`}>
            <div className="row pt-2 pb-2">
                {
                  addressForUnit[0] && (
                    <div className="col-md-4">
                      <p itemProp="location" itemScope itemType="http://schema.org/Place">
                        <strong itemProp="name">{addressForUnit[0].part1}</strong><br />
                        <span itemProp="address">
                          {addressForUnit[0].part2}<br />
                          {addressForUnit[0].part3}<br />
                          {addressForUnit[0].part4}
                        </span>
                      </p>
                    </div>
                  )
                }
              <div className="col-md-8">
                <p>
                  {phone_numbers}
                  {props.infos.office !== undefined ? <small>Bureau: <a href="#">INN 018</a><br/></small> : ''}
                  <small>Unité: 
                    {hierarchySchema}
                    <br/>
                    </small>
                  <small>Statut: <span>{props.infos.status.labelfr}</span></small>
                  <br/>
                </p>
                {adminsIT.length >= 1 && (
                  <>                  
                    <button style={{ paddingTop: 0, paddingBottom: 0, border: 0, color: hoverAdminsIT ? 'red' : '', transition: "all 0.1s linear" }}
                      className={`collapse-title ${showAdminsIT ? '' : 'collapsed'}`}
                      type="button"
                      onClick={()=> { setShowAdminsIT(!showAdminsIT); handleRotateAdminsIT() }}
                      aria-expanded="false"
                      aria-controls={`collapse-adminsIT-${props.infos.unitid}`}
                      onMouseEnter={() => setHoverAdminsIT(true)}
                      onMouseLeave={() => setHoverAdminsIT(false)}>
                      <strong>Admins IT</strong>&nbsp;
                      <Chevron handleRotate={handleRotateAdminsIT} rotateChevron={rotateChevronAdminsIT} setRotateChevron={setRotateChevronAdminsIT} />
                    </button>
                    <div className={`collapse ${showAdminsIT ? 'show' : ''} collapse-item collapse-item-desktop`} id={`collapse-adminsIT-${props.infos.unitid}`}>
                      <ol>
                        {
                          adminsIT.map(admin => <li><a href={`mailto:${admin.email}`}>{admin.email}</a></li>)
                        }
                      </ol>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
      </div>

    </>
  )
}

export default Unit
