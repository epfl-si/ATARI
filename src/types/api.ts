export interface PersonAccount {
  username?: string;
  gid?: number;
  uid?: number;
  home?: string;
  shell?: string;
}

export interface PersonPhone {
  id: number;
  number: string;
}

export interface PersonPosition {
  labelfr?: string;
  labelen?: string;
}

export interface PersonAddress {
  type?: string;
  part1?: string;
  part2?: string;
  part3?: string;
  part4?: string;
  country?: string;
  unitid?: string;
}

export interface ApiPerson {
  id: string;
  display: string;
  name?: string;
  firstname?: string;
  lastname?: string;
  email: string;
  normalized?: string;
  isaccredited?: boolean;
  gender?: string;
  org?: string;
  status?: string;
  sapid?: string;
  username?: string;
  account?: PersonAccount;
  phones?: PersonPhone[];
  position?: PersonPosition;
  addresses?: PersonAddress[];
}

// Account/attribute states are returned as codes (not display text) so the UI
// layer is the only place that owns localized strings, via next-intl.
export type AccountStatus = "ACCOUNT_DISABLED" | "ACCOUNT_ENABLED" | "ACCOUNT_UNKNOWN";

export type MailboxLocation = "MAILBOX_ONPREM" | "MAILBOX_ONLINE" | "MAILBOX_NA";

export type UacFlag =
  | "UAC_SCRIPT"
  | "UAC_HOMEDIR_REQUIRED"
  | "UAC_LOCKOUT"
  | "UAC_PASSWD_NOTREQD"
  | "UAC_PASSWD_CANT_CHANGE"
  | "UAC_ENCRYPTED_TEXT_PWD_ALLOWED"
  | "UAC_TEMP_DUPLICATE_ACCOUNT"
  | "UAC_NORMAL_ACCOUNT"
  | "UAC_INTERDOMAIN_TRUST_ACCOUNT"
  | "UAC_WORKSTATION_TRUST_ACCOUNT"
  | "UAC_SERVER_TRUST_ACCOUNT"
  | "UAC_DONT_EXPIRE_PASSWORD"
  | "UAC_MNS_LOGON_ACCOUNT"
  | "UAC_SMARTCARD_REQUIRED"
  | "UAC_TRUSTED_FOR_DELEGATION"
  | "UAC_NOT_DELEGATED"
  | "UAC_USE_DES_KEY_ONLY"
  | "UAC_DONT_REQ_PREAUTH"
  | "UAC_PASSWORD_EXPIRED"
  | "UAC_TRUSTED_TO_AUTH_FOR_DELEGATION"
  | "UAC_NONE";

export interface ActiveDirectoryInfo {
  description?: string;
  displayName?: string;
  mail?: string;
  userPrincipalName?: string;
  sAMAccountName?: string;
  gidNumber?: string;
  uidNumber?: string;
  unixHomeDirectory?: string;
  loginShell?: string;
  accountControlHex?: string;
  accountStatus?: AccountStatus;
  uacFlags: UacFlag[];
  accountExpiresISO?: string;
  accountExpiresNever: boolean;
  lastLogonISO?: string;
  lastLogonNever: boolean;
  pwdLastSetISO?: string;
  pwdLastSetNever: boolean;
  badPasswordTimeISO?: string;
  badPasswordTimeNever: boolean;
  badPwdCount?: number;
  hasExchangeMailbox: boolean;
  mailboxLocation: MailboxLocation;
  hasDistrilog: boolean;
}

export interface AccredUnit {
  id: number;
  labelfr?: string;
  labelen?: string;
  path?: string;
}

export interface AccredStatus {
  labelfr?: string;
  labelen?: string;
}

export interface AccredPosition {
  labelfr?: string;
  labelen?: string;
}

export interface Accred {
  order: number;
  startdate?: string;
  enddate?: string;
  unit: AccredUnit;
  status?: AccredStatus;
  position?: AccredPosition;
}

export type LdapEntry = Record<string, unknown> | undefined;

export interface LdapInfo {
  ldap?: LdapEntry;
  scoldap?: LdapEntry;
  automap?: LdapEntry;
}

export interface InventoryEntry {
  header?: string;
  softwareStatus?: string;
  purchaseDate?: string;
  features: Record<string, string>;
}
