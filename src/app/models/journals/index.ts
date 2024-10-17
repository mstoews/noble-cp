export interface IPeriod {
  period_id: number,
  period_year: number,
}


export interface IJournalDetailDelete {
  journal_id: number,
  journal_subid: number

}

export interface  IJournalHeaderUpdate {
  journal_id: number,
  description: string,
  transaction_date: string,
  amount: number
};
export interface IJournalHeader {
  journal_id: number,         
  description: string,
  booked: boolean,
  booked_date: string,
  booked_user: string,
  create_date: string,
  create_user: string,
  period: number,
  period_year: number,
  transaction_date: string,
  status: string,
  type: string,
  sub_type: string,
  amount: number,    
  party_id?: string,
  invoice_no?: string,
  due_date?: Date
  credit?: number,
  debit?: number
}

export interface IPeriodParam {
  period: number,
  period_year: number
}

export interface IJournalDetail {
  journal_id    : number,
  journal_subid : number,
  account       : number,
  child         : number,
  child_desc?   : string,
  fund          : string,
  sub_type      : string,
  description   : string,
  reference     : string,
  debit         : number,
  credit        : number,
  create_date   : string,
  create_user   : string,
  period?       : number,
  period_year?  : number,  
}

export interface IAccounts {
  account       : number,
  child         : number,
  parent_account: string,
  type          : string,
  sub_type      : string,
  description   : string,
  balance       : number,
  comments      : string,
  create_date   : string,
  create_user   : string,
  update_date   : string,
  update_user   : string,
  period?       : number,
  period_year?  : number,
  status?       : string
}

export interface ITransactionDate {
  start_date: string,
  end_date: string
}

export interface IArtifacts {
  id?           : number,
  journal_id    : number,
  reference     : string,
  description   : string,
  location      : string,
  date_created  : string,
  user_created  : string
}


export interface IJournalTemplate {
    template_ref: string,    
    description: string,
    type: string,
    debit_percentage:  number,
    credit_percentage: number,
    create_date:       Date,
    create_user:       string
}

export interface IJournalViewDetails {
    period?         : number,
    period_year?    : number,
    journal_id      : number,
    journal_subid   : number,
    account         : number,
    child           : number,
    description     : string,
    sub_type        : string,
    debit           : number,
    credit          : number,
    create_date     : Date,
    create_user     : string,
    fund            : string,
    reference       : string,
}
