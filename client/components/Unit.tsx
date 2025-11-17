import React from 'react'
import { useSubscribe, useFind } from 'meteor/react-meteor-data'
import styled from "styled-components"
import { Accred, Person, Address as AddressInterface } from '/imports/api/persons'
import { Authorization, Unit, Units } from '/imports/api/units'
import Chevron from './Chevron'

export function Unit(props:{infos: Accred, user: Person}) {
  const [show, setShow] = React.useState(false);

  const [showAdminsIT, setShowAdminsIT] = React.useState(false);

  const [rotateChevron, setRotateChevron] = React.useState(false);
  const [rotateChevronAdminsIT, setRotateChevronAdminsIT] = React.useState(false);

  const HoverableTextButton = styled.button`
    padding-top: 0;
    padding-bottom: 0;
    border: 0;
    transition: all 0.1s linear;
    &:hover {
      color: red;
    }
  `;  // Warning, counts as a React use hook 🤷‍♂️

  const unitId = props.infos.unitid;

  const isLoading = useSubscribe(unitId ? "unitAdminIT" : undefined, unitId);
  const found : Unit[] = useFind(
    (() => unitId ?
      Units.find({ _id: String(unitId) }) : null),
    [unitId]);
  const entry = found?.length === 1 ? found[0] : null;

  if (isLoading()) return <></>;

  const authorizations : Authorization[] = entry?.authorizations || [];

  const explicitAdminsIT = authorizations.filter((a) => a.attribution === "explicit");
  const inheritedAdminsIT = Object.groupBy(
    authorizations.filter((a) => a.attribution === "inherited"),
    ({ reasonname }) => reasonname);

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
      <HoverableTextButton
        className={`collapse-title ${show ? '' : 'collapsed'}`}
        type="button" onClick={()=> { setShow(!show); handleRotate() }}
        aria-expanded="false"
        aria-controls={`collapse-${unitId}`}>
        {props.infos.position && <span style={{ display: props.infos.position.labelfr ? '' : 'none' }}><strong>{props.infos.position.labelfr}</strong>,</span>} <span className="font-weight-normal">{props.infos.unit.labelfr}</span>&nbsp;
        <Chevron handleRotate={handleRotate} rotateChevron={rotateChevron} setRotateChevron={setRotateChevron} />
      </HoverableTextButton>

      <div>
        <div className={`collapse ${show ? 'show' : ''} collapse-item collapse-item-desktop`} id={`collapse-${unitId}`}>
          <div className="row pt-2 pb-2">
            <Address address={ (props?.user?.addresses || []).find((e) => parseInt(e.unitid) === unitId) } />
            <div className="col-md">
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
            </div>
          </div>
          { (! entry) ? <>Impossible de charger les droits Admin IT dans l'unité {unitId}</> :
            <div className="row">
              <div className="col-md">
                <HoverableTextButton
                  className={`collapse-title ${showAdminsIT ? '' : 'collapsed'}`}
                  type="button"
                  onClick={()=> { setShowAdminsIT(!showAdminsIT); handleRotateAdminsIT() }}
                  aria-expanded="false"
                  aria-controls={`collapse-adminsIT-${unitId}`}>
                  <strong>Admins IT</strong>&nbsp;
                  <Chevron handleRotate={handleRotateAdminsIT} rotateChevron={rotateChevronAdminsIT} setRotateChevron={setRotateChevronAdminsIT} />
                </HoverableTextButton>
                <div className={`collapse ${showAdminsIT ? 'show' : ''} collapse-item collapse-item-desktop`} id={`collapse-adminsIT-${unitId}`}>
                  <ol>
                    {explicitAdminsIT.length > 0 && (
                      <>
                        <strong className="pb-5">Admins IT de {explicitAdminsIT[0].resource.name}</strong>
                        {explicitAdminsIT.map(admin => (
                          <li>
                            <a href={`mailto:${admin.person.email}`}>{admin.person.email}</a>
                          </li>
                        ))}
                      </>
                    )}
                    { Object.keys(inheritedAdminsIT).map((key) =>
                      <>
                        <strong>Admins IT hérités de {key}</strong>
                        {
                          inheritedAdminsIT[key].map(admin =>
                            <li>
                              <a href={`mailto:${admin.person.email}`}>{admin.person.email}</a>
                            </li>
                          )
                        }
                      </>
                    )}
                  </ol>
                </div>
              </div>
            </div>
          }
        </div>
      </div>

    </>
  );
}

function Address ({ address } : { address : AddressInterface | undefined}) {
  if (! address) return <></>;
  return <div className="col-md">
           <div itemProp="location" itemScope itemType="http://schema.org/Place">
             <strong itemProp="name">{address.part1}</strong><br />
             <span itemProp="address">
               {address.part2}<br />
               {address.part3}<br />
               {address.part4}
             </span>
           </div>
         </div>;
}
