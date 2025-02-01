

export interface IJournalDetailDelete {
  journal_id: number,
  journal_subid: number

}

export interface IJournalHeader {
  journal_id?: number,         
  description: string,
  booked: boolean,
  booked_date?: string,
  booked_user: string,
  create_date?: string,
  create_user?: string,
  period: number,
  period_year: number,
  transaction_date: string,
  status?: string,
  type: string,
  sub_type?: string,
  amount: number,    
  party_id: string,
  invoice_no: string,
  template_name: string,
  due_date?: Date
  credit?: number,
  debit?: number
}

export interface IJournalArrayParams 
{
  journal_id: number
  description: string
  type: string
  booked_user: string
  period: number
  period_year: number
  transaction_date: string
  amount: number
  template_name: string
  invoice_no: string
  party_id: string
  subtype: string
  details: Details
}

export interface Details {
  detail: Detail[]
}

export interface Detail {
  journal_id: number
  journal_subid: number
  account: number
  child: number
  subtype: string
  description: string
  debit: number
  credit: number
  create_date: string
  create_user: string
  fund: string
  reference: string
}


export interface ITemplateParams {
  journal_id: number,
	template_description: string,
	templateType: string
}

export interface ITBParams {
  period: number,
  year: number
}

export interface IJournalDetail {
  journal_id    : number,
  journal_subid : number,
  account       : number,
  child         : number,
  child_desc?   : string,
  fund          : string,
  subtype       : string,
  description   : string,
  reference     : string,
  debit         : number,
  credit        : number,
  create_date   : string,
  create_user   : string,
  period?       : number,
  period_year?  : number, 
  template_name?: string 
}

export interface IJournalDetailUpdate {
  journal_id    : number,
  journal_subid : number,
  account       : number,
  child         : number,
  fund          : string,
  subtype      : string,
  description   : string,
  reference     : string,
  debit         : number,
  credit        : number,
  create_date   : string,
  create_user   : string
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

export interface IReadJournalDetailsParams {
  child: number;
  period: number;
  period_year: number;
}


export interface IJournalTemplate {
  template_ref: number,
  journal_no: number,
  description: string,
  template_name: string,
  create_date: string,
  create_user: string,
  journal_type: string
}

export interface IJournalDetailTemplate {
  template_ref: string,
  journal_no: number,
  journal_sub: number,
  description: string,
  account: number,
  child: number,
  sub_type: string,
  fund: string,
  debit: number,
  credit: number,
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


