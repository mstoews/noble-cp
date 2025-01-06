export interface IKanbanStatus {
  id: string,
  status: string,
  rankid: string,
  priority: string
}

export interface ITeam { 
    team_member : string,
    first_name  : string,
    last_name   : string,
    location    : string,
    title       : string,
    updatedte   : string,
    updateusr   : string,
    email       : string,
    image       : string,
    uid         : string
}

export interface IKanbanType {
  type: string,
  description: string,
  updatedte: string,
  updateusr: string
}

export interface IStatus {
  status: string,
  description: string,
  fullDescription?: string,
  updatedte?: string,
  updateusr?: string
}

export interface IPriority {
  priority: string,
  description: string,
  updatedte: string,
  updateusr: string,
  color?: string
}

export interface IType {
  type: string,
  description: string,
  fullDescription?: string,
  updatedte?: string,
  updateusr?: string
}


export interface ITeam {
  id?: string;
  type: string;
  reporting: string;
  description: string;
  email: string;
  image: string;
  uid: string;
  updateDate: string;
  updateUsr: string;
  update_dte: string,
  update_usr: string
}

export interface IKanban {
  id?: number,
  title: string,
  status: string,
  summary: string,
  type: string,
  priority: string,
  tags: string,
  estimate: number,
  assignee: string,
  rankid: number,
  color: string,
  className: string,
  updateuser: string,
  updatedate: string,
  startdate: string,
  estimatedate: string
}

