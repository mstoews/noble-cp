        
  export interface ICustomers {
        customer_id: number,
        customer_name: string,
        customer_type: string,
        address1: string,
        address2: string,
        city: string,
        state: string,
        zip: string,
        country: string,
        phone1: string,
        phone2: string,
        fax: string,
        email: string,
        website: string,
        create_date: Date,
        create_user: string,
        update_date: Date,
        update_user: string
    }



  export interface IARTransaction {
      transaction_id   : number,
      account          : number,
      child            : number,
      status           : string,
      ar_account       : number,
      ar_child         : number,
      period           : number,
      period_year      : number,
      transaction_date : Date,
      due_date         : Date,
      invoice_no       : number,
      receipt          : string,
      reference        : string,
      description      : string,
      amount           : number,
      amount_received  : number,
      date_paid        : Date,
      adjustment_amt   : number,
      rebate_amt       : number,
      remainder_amt    : number,
      payment_req      : string,
      create_date      : Date,
      create_user      : string,
      update_date      : Date,
      update_user      : string,
  }
  
  