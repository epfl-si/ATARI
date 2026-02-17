import React, { useState } from 'react'
import { useParams } from "react-router-dom"
import { useSubscribe, useFind } from 'meteor/react-meteor-data'
import { Container } from '@mui/material'
import { Inventory, InventoryEntry } from '/imports/api/inventory'
import { differenceInDays, intervalToDuration } from "date-fns";
import styled from "styled-components"
import { LoadingSpinner } from './LoadingSpinner'

export function CheckInv() {
  const { inventoryParam } = useParams();
  const [yellowStickerCode, setYellowStickerCode] = useState<string | undefined>(inventoryParam);

  const isLoading = useSubscribe(
    yellowStickerCode ? "inventory" : undefined, yellowStickerCode);

  const found : InventoryEntry[] = useFind(() =>
      yellowStickerCode && Inventory ?
        Inventory.find({ _id: yellowStickerCode }) :
        null,
    [yellowStickerCode]
  ) ?? [];
  const entry = found?.length === 1 ? found[0] : null;

  const Button = styled.button`
    padding: 10px;
    padding-left: 20px;
    padding-right: 20px;
    /* margin: 10px; */
    border-radius: 5px;
    /* width: 50vw; */
  `;  // Warning, counts as a React use hook 🤷‍♂️

  if (isLoading()) return <LoadingSpinner/>;

  window.history.pushState({ id:"100" }, "Page", `/inv/${yellowStickerCode}`);

  return <Container>
           <h1>Check Inventory</h1>
           <form onSubmit={e => {
             e.preventDefault();
             setYellowStickerCode(e.target['invNumberInput'].value);
           }}
             style={{ display: 'flex', gap: '10px' }}>
             <input defaultValue={yellowStickerCode} id="invNumberInput" placeholder="A123456789..." />
             <Button className="btn btn-secondary" type="submit">Check</Button>
           </form>
           {entry ? renderEntry(entry) : <>Non trouvé dans l'inventaire.</> }
         </Container>;
}

function renderEntry (entry : InventoryEntry) {

  const ageDate = new Date(+new Date() - +entry.purchaseDate);
  const itemYears = Math.abs(ageDate.getFullYear()) - 1970;
  const bulletPoints : any[] = [<>{itemYears >= 6 ? '❌' : '✅'} La machine a {itemYears >= 6 ? 'plus' : 'moins'} de 6 ans.</>];

  let value;

  function consumeKey (key: any) {
    const val = entry.features[key];
    delete entry.features[key];
    return val;
  }

  if (value = consumeKey('ANSDT')) {
        const ageDate = intervalToDuration({start: value, end: new Date()});
        bulletPoints.push(`Date d'acquisition : ${value.toISOString().slice(0, 10)}`);
        bulletPoints.push(
          <b>+++ AGE = {differenceInDays(new Date(), value)} jours
            soit {ageDate.years} an{ageDate.years && ageDate.years > 1 && 's'},&nbsp;
            {ageDate.months} mois,&nbsp;
            {ageDate.days} jour{ageDate.days && ageDate.days > 1 && 's'}
          </b>);
  }
  if (value = consumeKey('EQUNR')) {
        bulletPoints.push(`Numéro d'équipement : ${value}`);
  }
  if (value = consumeKey('EQKTX')) {
        bulletPoints.push(`Désignation de l'équipement : ${value}`);
  }
  if (value = consumeKey('EQTYP')) {
        bulletPoints.push(`Catégorie de l'équipement : ${value}`);
  }
  if (value = consumeKey('INVNR')) {
        bulletPoints.push(`N° d'inventaire : ${value}`);
  }
  if (value = consumeKey('ANSWT')) {
        bulletPoints.push(`Valeur d'acquisition : ${value}`);
  }
  if (value = consumeKey('WAERS')) {
        bulletPoints.push(`Clé de devise : ${value}`);
  }
  if (value = consumeKey('HERST')) {
        bulletPoints.push(`Fabricant : ${value}`);
  }
  if (value = consumeKey('TYPBZ')) {
        bulletPoints.push(`Type/Modèle : ${value}`);
  }
  if (value = consumeKey('SERGE')) {
        bulletPoints.push(<><span style={{color: 'red', fontWeight: 'bold'}}>N° de série</span> (SERGE) : {value}</>);
  }
  if (value = consumeKey('MSGRP')) {
        bulletPoints.push(`Local : ${value}`);
  }
  if (value = consumeKey('KOSTL')) {
        bulletPoints.push(`Centre de coût : ${value}`);
  }
  if (value = consumeKey('CLAID')) {
        bulletPoints.push(`Classe : ${value}`);
  }
  if (value = consumeKey('CLATX')) {
        bulletPoints.push(`Désignation de la classe : ${value}`);
  }
  if (value = consumeKey('CLASSIF')) {
        bulletPoints.push(`Identifiant de la classe : ${value}`);
  }
  if (value = consumeKey('ZIMG_024')) {
        bulletPoints.push(`No de poste de commande : ${value}`);
  }
  if (value = consumeKey('ZIMG_037')) {
        bulletPoints.push(`Centre de coût d'achat : ${value}`);
  }
  if (value = consumeKey('ZIMG_001')) {
        bulletPoints.push(`N° de commande d'achat EPFL : ${value}`);
  }
  if (value = consumeKey('ZIMG_002')) {
        bulletPoints.push(`Propriété de : ${value}`);
  }
  if (value = consumeKey('ZIMG_005')) {
        bulletPoints.push(`Attribué à (SCIPER) : ${value}`);
  }
  if (value = consumeKey('ZIMG_017')) {
        bulletPoints.push(`Valeur résiduelle : ${value}`);
  }

  for (const [key, value] of Object.entries(entry.features)) {
    bulletPoints.push(`${key} : ${value}`);
  }

  return <>
           <b>{entry.header}</b>
           <ul>
             <li></li>
             { bulletPoints.map(e => <li>{e}</li>) }
           </ul>
           {
             <b>{entry.softwareStatus}</b>
           }
         </>;
}
