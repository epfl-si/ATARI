import React from "react"
import { useQueryPerson } from '/imports/ui/use-hooks'
import { Container } from "@mui/material";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from './LoadingSpinner'

export function CheckAD() {
  const { sciper } = useParams();
  const { isLoading, person } = useQueryPerson(sciper, 'personActiveDirectory');

  if (isLoading()) return <LoadingSpinner/>

  const hasDistrilog = person?.activeDirectory.memberOf.find(
    (e) => e.startsWith('CN=DroitAccred_Distrilog'));

  function UACDetails(bitmap : number) {
    let sb = [];

    if (bitmap & 0x1) sb.push("Logon script exécuté");
    if (bitmap & 0x8) sb.push("Homedir exigé");
    if (bitmap & 0x10) sb.push("Verrouillé (locked)");
    if (bitmap & 0x20) sb.push("Pas de mot de passe requis");
    if (bitmap & 0x40) sb.push("L'utilisateur ne peut changer le mot de passe");
    if (bitmap & 0x80) sb.push("L'utilisateur peut envoyer un mot de passe crypté");
    if (bitmap & 0x100) sb.push("Compte dupliqué temporairement");
    if (bitmap & 0x200) sb.push("Compte normal par défaut");
    if (bitmap & 0x800) sb.push("Permissions accordées via un domaine de confiance");
    if (bitmap & 0x1000) sb.push("Compte d'ordinateur de ce domaine");
    if (bitmap & 0x2000) sb.push("Compte d'ordinateur pour contrôleur de domaine (backup)");
    if (bitmap & 0x10000) sb.push("Le mot de passe n'expire jamais");
    if (bitmap & 0x20000) sb.push("C'est un compte MNS (Eh! Oui!)");
    if (bitmap & 0x40000) sb.push("Une carte à puce (ou biométrique) est exigé");
    if (bitmap & 0x80000) sb.push("Compte de confiance pour la délégation (Kerberos)");
    if (bitmap & 0x100000) sb.push("Compte non délégué (Kerberos)");
    if (bitmap & 0x200000) sb.push("Exige et n'autorise que des cryptages par clés DES");
    if (bitmap & 0x400000) sb.push("N'exige pas de pré-authentification Kerberos pour un login");
    if (bitmap & 0x800000) sb.push("Le mot de passe est expiré!");
    if (bitmap & 0x1000000) sb.push("Ce compte est autorisé de gérer des délégations");

    if (sb.length === 0) sb.push("Aucun attribut valide");

    return sb;
  }

  return (
    <Container>
      <h1>CheckAD</h1>
      <div className="d-flex flex-column">
        <span><strong>Description</strong> : {person?.activeDirectory?.description}</span>
        <span><strong>Display Name</strong> : {person?.activeDirectory?.displayName}</span>
        <span><strong>Email</strong> : {person?.activeDirectory?.mail}</span>
        <span><strong>UPN</strong> : {person?.activeDirectory?.userPrincipalName}</span>
        <span>
          <strong>Status (User Account Control)</strong> : {
            person?.activeDirectory?.baseUserAccountControl &&
              <>0x{parseInt(person?.activeDirectory?.baseUserAccountControl).toString(16)}</>
          }
        </span>
        <span>
          { person?.activeDirectory?.baseUserAccountControl && <>
            <ul>
              {UACDetails(parseInt(person?.activeDirectory?.baseUserAccountControl)).map(e => (
                <li>{e}</li>
              ))}
            </ul>
          </>}
        </span>
        <span>
          <strong>Expire</strong> : {
            !(person?.activeDirectory?.accountExpires) ?
              <></> :
              person.activeDirectory.accountExpires == 9223372036854775807 ?
                'Jamais' :
                new Date(((person.activeDirectory.accountExpires / 10000000) - 11644473600) * 1000).toLocaleDateString('en-US')
          }
        </span>
        <span><strong>Exchange mailbox</strong> : {person?.activeDirectory?.msExchRecipientTypeDetails ? "Oui" : "Non"}</span>
        <span><strong>Where is the mailbox ?</strong> : {person?.activeDirectory?.msExchRecipientTypeDetails == "1" ? "Exchange OnPrem" : person?.activeDirectory?.msExchRecipientTypeDetails == "2147483648" ? "Exchange Online" : "N/A"}</span>
        <span><strong>A le droit Distrilog</strong> : {hasDistrilog ? 'Oui' : 'Non'}</span>
      </div>
    </Container>
  );
}
