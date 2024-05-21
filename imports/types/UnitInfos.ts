export interface UnitInfos {
  person: {
    id: string,
    sciper: string,
    firstname: string,
    lastname: string,
    lastnameuc: string,
    firstnameuc: string,
    firstnameusual: string,
    lastnameusual: string,
    display: string
  },
  unitid: number,
  unit: {
    id: number,
    name: string,
    labelfr: string,
    labelen: string,
    path: string,
    level: number,
    cf: string,
    positionunitvalue: string
  },
  statusid: number,
  classid: number,
  positionid: number,
  duration: string,
  creatorid: string,
  creator: string,
  comment: string,
  origin: string,
  authorid: string,
  author: string,
  manualreveal: string,
  order: number,
  startdate: string,
  enddate: string,
  revalidatedat: string,
  createdat: string,
  status: {
    id: number,
    name: string,
    labelfr: string,
    labelen: string,
    description: string,
    maillist: string,
    classes: string
  },
  class: {
    id: number,
    name: string,
    labelfr: string,
    labelen: string,
    description: string,
    maillist: string,
    statusid: number
  },
  position: {
    id: number,
    labelfr: string,
    labelen: string,
    labelxx: string,
    labelinclusive: string,
    restricted: string
  }
}
