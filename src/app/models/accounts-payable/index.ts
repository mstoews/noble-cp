export interface IAccountsReceivable {
    ar_id : number,
    description: string,
    party_id: number,
    ar_status: string,
    type: string,
    reference: string,
    amount: string,
    booked: string,
    booked_date: string,
    booked_user: string,
    create_date: string,
    create_user: string,
    transaction_date: string,    
}

export interface IAccountsReceivableDetail {

}