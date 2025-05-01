export interface IPeriod {  
  id: number,
  period_id : number,
  period_year: number,
  start_date: Date, 
  end_date:  Date,
  description: string,
  create_date: string,
  create_user: string,
  update_date: string,
  update_user: string,
  status: string, 
}


export interface ICurrentPeriodParam {
  current_period: string,
}
export interface ICurrentPeriod {
  period_year: number,
  period_id: number,
  description: string,
}
export interface IPeriodParam {
  period: number,
  period_year: number
}

