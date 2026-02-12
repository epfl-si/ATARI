import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { Accred, Person } from './persons'

export interface Authorization {
  type: "role"
  attribution: "inherited" | "explicit"
  authid: number
  persid: number
  person: Person
  resourceid: string
  resource: {
    id: string
    name: string
    labelfr: string
    labelen: string
    label: string
    path: string
    sortpath: string
    level: number
    parentid: string
    type: "unit"
    responsibleid: string
    responsible: Person
    cf: string
    pathcf: string
  }
  accredunitid: number
  accred: Accred
  value: string
  enddate: null
  status: "active"
  state: "active"
  workflowid: 0
  labelfr: string
  labelen: string
  label: string
  name: string
  reasontype: "inherited"
  reasonresourceid: string
  reasonname: string
  reasonlabelfr: string
  reasonlabelen: string
  reason: any
}

export type Unit = {
  _id: string
  authorizations: Authorization[]
}

/**
 * Client-only collection for subscription results
 *
 * @locus Client
 */
export const Units : Mongo.Collection<Unit> | null = Meteor.isServer ? null :
  new Mongo.Collection("units");
