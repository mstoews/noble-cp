export interface IInvoice {
    invoice_id: string,
    invoice_no: string,
    invoice_date: Date,
    invoice_due_date: Date,
    invoice_amount: number,
    invoice_amount_paid: number,
    invoice_amount_due: number,
    invoice_status: string,
    invoice_description: string,
    invoice_reference: string,
    invoice_create_date: Date,
    invoice_create_user: string,
    invoice_update_date: Date,
    invoice_update_user: string,
    invoice_account: number,
    invoice_child: number,
    invoice_period: number,
}

export interface IAPVendor {
    vendor_id           : string,
    vendor_name         : string,
    vendor_short_name   : string,
    vendor_address1     : string,
    vendor_address2     : string,
    vendor_address3     : string,
    vendor_postal_code  : string,
    vendor_phone        : string,
    vendor_fax          : string,
    vendor_account      : number,
    vendor_child        : number,
    vendor_vat_account  : number,
    vendor_vat_child    : number,
    vendor_ap_account   : number,
    vendor_ap_child     : number,
    vendor_description  : string,
    vendor_contact      : string,
    vendor_type         : string,
    vendor_status       : string,
    vendor_terms        : number,
    create_date         : Date,
    create_user         : string,
    update_date         : Date,
    update_user         : string,
}

export interface IAPTransaction {
    transaction_id   : number,
    account          : number,
    child            : number,
    status           : string,
    ap_account       : number,
    ap_child         : number,
    period           : number,
    period_year      : number,
    transaction_date : Date,
    due_date         : Date,
    invoice_id       : string,
    vendor_id        : string,
    payment          : number,
    order_no         : string,
    check_no         : string,
    reference        : string,
    description      : string,
    amount           : number,
    amount_paid      : number,
    date_paid        : Date,
    gst_amount       : number,
    pst_amount       : number,
    adjustment_amt   : number,
    rebate_amt       : number,
    remainder_amt    : number,
    create_date      : Date,
    create_user      : string,
    update_date      : Date,
    update_user      : string
  }

  
  
  
  
  
  
  
  
  
  
  
