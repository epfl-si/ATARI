import React, { useEffect } from "react";
import { Meteor } from "meteor/meteor";
import { Container } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";


function CheckAD() {
  const { sciper } = useParams();
  const [user, setUser] = useState({});
  const [distrilog, setDistrilog] = useState([]);

  useEffect(() => {
    Meteor.call('AD.user', sciper, function(err, res) {
      if(err) {
        console.log(err)
      } else {
        const hasDistrilog = res[0].memberOf.filter((e) => e.startsWith('CN=DroitAccred_Distrilog'))
        setDistrilog(hasDistrilog)
        setUser(res[0])
        console.log(user)
      }
    })
  }, [])

  function UACDetails(src) {
    let sb = [];

    if (src & 0x1) sb.push("Logon script exécuté");
    if (src & 0x8) sb.push("Homedir exigé");
    if (src & 0x10) sb.push("Verrouillé (locked)");
    if (src & 0x20) sb.push("Pas de mot de passe requis");
    if (src & 0x40) sb.push("L'utilisateur ne peut changer le mot de passe");
    if (src & 0x80) sb.push("L'utilisateur peut envoyer un mot de passe crypté");
    if (src & 0x100) sb.push("Compte dupliqué temporairement");
    if (src & 0x200) sb.push("Compte normal par défaut");
    if (src & 0x800) sb.push("Permissions accordées via un domaine de confiance");
    if (src & 0x1000) sb.push("Compte d'ordinateur de ce domaine");
    if (src & 0x2000) sb.push("Compte d'ordinateur pour contrôleur de domaine (backup)");
    if (src & 0x10000) sb.push("Le mot de passe n'expire jamais");
    if (src & 0x20000) sb.push("C'est un compte MNS (Eh! Oui!)");
    if (src & 0x40000) sb.push("Une carte à puce (ou biométrique) est exigé");
    if (src & 0x80000) sb.push("Compte de confiance pour la délégation (Kerberos)");
    if (src & 0x100000) sb.push("Compte non délégué (Kerberos)");
    if (src & 0x200000) sb.push("Exige et n'autorise que des cryptages par clés DES");
    if (src & 0x400000) sb.push("N'exige pas de pré-authentification Kerberos pour un login");
    if (src & 0x800000) sb.push("Le mot de passe est expiré!");
    if (src & 0x1000000) sb.push("Ce compte est autorisé de gérer des délégations");

    if (sb.length === 0) sb.push("Aucun attribut valide");

    return sb;
  }
    

  return (
    <Container>
      <h1>CheckAD</h1>
      <div className="d-flex flex-column">        
        <span><strong>Description</strong> : {user.description}</span>
        <span><strong>Display Name</strong> : {user.displayName}</span>
        <span><strong>Email</strong> : {user.mail}</span>
        <span><strong>UPN</strong> : {user.userPrincipalName}</span>
        <span><strong>Status (User Account Control)</strong> : 0x{parseInt(user.baseUserAccountControl).toString(16)}</span>
        <span>
          <ul>
            {UACDetails(parseInt(user.baseUserAccountControl)).map(e => (
              <li>{e}</li>
            ))}
          </ul>
        </span>
        <span><strong>Expire</strong> : {user.accountExpires == 9223372036854775807 ? 'Jamais' : new Date(((user.accountExpires / 10000000) - 11644473600) * 1000).toLocaleDateString('en-US')}</span>
        <span><strong>Exchange mailbox</strong> : {user.msExchMailboxGuid ? "Oui" : "Non"}</span>
        <span><strong>Where is the mailbox ?</strong> : {user.msExchRecipientTypeDetails == "1" ? "Exchange OnPrem" : "Exchange Online"}</span>
        <span><strong>A le droit Distrilog</strong> : {distrilog.length ? 'Oui' : 'Non'}</span>



      </div>

    </Container>
  );
}

export default CheckAD;
