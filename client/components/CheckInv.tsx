import React from "react";
import { Meteor } from "meteor/meteor";
import { Button, Container } from "@mui/material";
import { useState } from "react";
import { parse } from 'node-html-parser';
import { differenceInDays, intervalToDuration } from "date-fns";
import styled from "styled-components"


function CheckInv() {

  const [inventoryItem, setInventoryItem] = useState(<></>);

  const Button = styled.button`
    padding: 10px;
    padding-left: 20px;
    padding-right: 20px;
    /* margin: 10px; */
    border-radius: 5px;
    /* width: 50vw; */
  `

  function checkValidInvNumber(parsedHtml) {
    /* If true : Inventory number is INVALID
    If false : Inventory number is VALID */
    return !parsedHtml.querySelector('#ctl00_ContentPlaceHolder1_Label1')?.childNodes[0].rawTagName &&
        parsedHtml.querySelector('#ctl00_ContentPlaceHolder1_Label1')?.childNodes[0].rawText.includes('Oups')
  }

  function checkInventoryNumber(event) {
    event.preventDefault()
    const inventoryNumber = event.target['invNumberInput'].value

    if(!inventoryNumber) {
      alert(`Merci d'entrer un numéro d'inventaire.`)
    }

    Meteor.call('checkInventory.inventoryNumber', inventoryNumber, function(err, res) {
      if(err) {
        console.log(err)
      } else {
        const parsedHtml = parse(res)

        if(checkValidInvNumber(parsedHtml)) {
          setInventoryItem(<></>)
          return alert(`Ce numéro d'inventaire est invalide !`)
        } else {
          const bulletList:any = [];
          let itemDate;
          parsedHtml.querySelector('#ctl00_ContentPlaceHolder1_Label1')?.childNodes.map(e => {
            if(e._rawText) {
              let splittedRaw = e._rawText.split(' = ')
              if(splittedRaw[0] !== 'EQKTX' && splittedRaw[0] !== 'MSGRP') {
                splittedRaw[1] = splittedRaw[1].replaceAll(' ', '')
              }
              
              switch (splittedRaw[0]) {
                case 'EQUNR':
                  bulletList.push(`Numéro d'équipement : ${splittedRaw[1]}`)
                break;
                case'EQKTX':
                  bulletList.push(`Désignation de l'équipement : ${splittedRaw[1]}`)
                break;
                case'EQTYP':
                  bulletList.push(`Catégorie de l'équipement : ${splittedRaw[1]}`)
                break;
                case'INVNR':
                  bulletList.push(`N° d'inventaire : ${splittedRaw[1]}`)
                break;
                case'ANSDT':
                  let dateArray = splittedRaw[1].match(/^(\d{4})(\d{2})(\d{2})$/).slice(1)
                  bulletList.push(`Date d'acquisition : ${dateArray[0]}-${dateArray[1]}-${dateArray[2]}`)
                  
                  itemDate = new Date(parseInt(dateArray[0]), parseInt(dateArray[1]) - 1, parseInt(dateArray[2]))
                  var ageDate = intervalToDuration({start: itemDate, end: new Date()})
                  bulletList.push(<><b>+++ AGE = {differenceInDays(new Date(), itemDate)} jours
                    soit {ageDate.years} an{ageDate.years > 1 && 's'},&nbsp;
                    {ageDate.months} mois,&nbsp;
                    {ageDate.days} jour{ageDate.days > 1 && 's'}
                    </b>
                  </>)
                break;
                case 'ANSWT':
                  bulletList.push(`Valeur d'acquisition : ${splittedRaw[1]}`)
                break;
                case 'WAERS':
                  bulletList.push(`Clé de devise : ${splittedRaw[1]}`)
                break;
                case 'HERST':
                  bulletList.push(`Fabricant : ${splittedRaw[1]}`)
                break;
                case 'TYPBZ':
                  bulletList.push(`Type/Modèle : ${splittedRaw[1]}`)
                break;
                case 'SERGE':
                  bulletList.push(<><span style={{color: 'red', fontWeight: 'bold'}}>N° de série</span> (SERGE) : {splittedRaw[1]}</>)
                break;
                case 'MSGRP':
                  bulletList.push(`Local : ${splittedRaw[1]}`)
                break;
                case 'KOSTL':
                  bulletList.push(`Centre de coût : ${splittedRaw[1]}`)
                break;
                case 'CLAID':
                  bulletList.push(`Classe : ${splittedRaw[1]}`)
                break;
                case 'CLATX':
                  bulletList.push(`Désignation de la classe : ${splittedRaw[1]}`)
                break;
                case 'CLASSIF':
                  bulletList.push(`Identifiant de la classe : ${splittedRaw[1]}`)
                break;
                case 'ZIMG_024':
                  bulletList.push(`No de poste de commande : ${splittedRaw[1]}`)
                break;
                case 'ZIMG_037':
                  bulletList.push(`Centre de coût d'achat : ${splittedRaw[1]}`)
                break;
                case 'ZIMG_001':
                  bulletList.push(`N° de commande d'achat EPFL : ${splittedRaw[1]}`)
                break;
                case 'ZIMG_002':
                  bulletList.push(`Propriété de : ${splittedRaw[1]}`)
                break;
                default:
                  bulletList.push(`${splittedRaw[0]} : ${splittedRaw[1]}`)
                break;
              }

            }
          })

          var ageDate = new Date(+new Date() - +itemDate);
          var itemYears = Math.abs(ageDate.getFullYear()) - 1970

          const fullHTML =
          <>
            <b>{parsedHtml.querySelector('#ctl00_ContentPlaceHolder1_Label1')?.childNodes[0].childNodes[0].rawText}</b>
            {
              checkValidInvNumber(parsedHtml) == false &&
              (
                <p>{itemYears >= 6 ? '❌' : '✅'} La machine a {itemYears >= 6 ? 'plus' : 'moins'} de 6 ans.</p>
              )
            }
            <ul>
              {
                bulletList.map(e => (
                  <li>{e}</li>
                ))
              }
            </ul>
            {
              checkValidInvNumber(parsedHtml) == false &&
              (
                <b>{parsedHtml.querySelector('#ctl00_ContentPlaceHolder1_Label2')?.childNodes[0].childNodes[0].childNodes[0].rawText}</b>
              )
            }
          </>
          setInventoryItem(fullHTML)
        }
      }
    })
  }


  return (
    <Container>
      <h1>Check Inventory</h1>
      <form onSubmit={checkInventoryNumber} style={{ display: 'flex', gap: '10px' }}>
        <input id="invNumberInput" placeholder="A123456789..." />
        <Button className="btn btn-secondary" type="submit">Check</Button>
      </form>
      {inventoryItem}
    </Container>
  );
}

export default CheckInv;
