import { createAction, props } from "@ngrx/store";
import { IAccounts }  from "app/models/journals";


export const LOAD_ACCOUNTS = 'accounts getall';
export const LOAD_ACCOUNTS_SUCCESS = 'accounts getall success';
export const LOAD_ACCOUNTS_FAILURE = 'accounts getall failure'; 

export const DELETE_ACCOUNTS = 'account delete'
export const DELETE_ACCOUNTS_SUCCESS = 'account delete success'

export const ADD_ACCOUNTS = 'account add'
export const ADD_ACCOUNTS_SUCCESS = 'account add success'

export const UPDATE_ACCOUNTS = 'account update'
export const UPDATE_ACCOUNTS_SUCCESS = 'account update success'

export const GET_ACCOUNTS = 'account get account'

export const loadAccounts = createAction(LOAD_ACCOUNTS);
export const loadAccountsSuccess = createAction(LOAD_ACCOUNTS_SUCCESS, props<{ accounts: IAccounts[] }>());
export const loadAccountsFailure = createAction(LOAD_ACCOUNTS_FAILURE, props<{ error: string }>());


export const deleteAccounts = createAction(DELETE_ACCOUNTS, props<{ id: number }>());
export const deleteAccountsSuccess = createAction(DELETE_ACCOUNTS_SUCCESS, props<{ id: number }>());

export const addAccounts = createAction(ADD_ACCOUNTS, props<{ account: IAccounts }>());
export const addAccountsSuccess = createAction(ADD_ACCOUNTS_SUCCESS, props<{ account: IAccounts }>());

export const updateAccounts = createAction(UPDATE_ACCOUNTS, props<{ account: IAccounts }>());
export const updateAccountsSuccess = createAction(UPDATE_ACCOUNTS_SUCCESS, props<{ account: IAccounts }>());

export const getAccounts = createAction(GET_ACCOUNTS, props<{ id: number }>());
export const getAccountsSuccess = createAction(UPDATE_ACCOUNTS_SUCCESS, props<{ account: IAccounts }>());
export const getAccountsFailure = createAction(LOAD_ACCOUNTS_FAILURE, props<{ error: string }>());

export const emptyAction = createAction('Empty Action');





export const AccountActions = {
    loadAccounts
};



