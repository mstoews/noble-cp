export interface IPeriod {
  id: number,
  period : number,
  period_year: number,
  start_date: Date, 
  end_date:  Date,
  description: string,
  create_date: string,
  create_user: string,
  update_date: string,
  update_user: string
}

export interface IPeriodParam {
  period: number,
  period_year: number
}

