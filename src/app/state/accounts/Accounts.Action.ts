import { createAction, props } from "@ngrx/store";
import { IAccounts }  from "app/models/journals";
import { IDropDownAccounts } from 'app/models';
import { Update, EntityMap, EntityMapOne, Predicate } from '@ngrx/entity';


export const LOAD_ACCOUNTS = 'accounts getall';
export const LOAD_ACCOUNTS_SUCCESS = 'accounts getall success';
export const LOAD_ACCOUNTS_FAILURE = 'accounts getall failure'; 


export const LOAD_ACCOUNTS_DROPDOWN = 'accounts getDropdown';
export const LOAD_ACCOUNTS_DROPDOWN_SUCCESS = 'accounts getDropdown success';
export const LOAD_ACCOUNTS_DROPDOWN_FAILURE = 'accounts getDropdown failure'; 


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

export const loadAccountsDropdown = createAction(LOAD_ACCOUNTS_DROPDOWN);
export const loadAccountsDropdownSuccess = createAction(LOAD_ACCOUNTS_DROPDOWN_SUCCESS, props<{ accountsDropdown: IDropDownAccounts[] }>());
export const loadAccountsDropdownFailure = createAction(LOAD_ACCOUNTS_DROPDOWN_FAILURE, props<{ error: string }>());

export const deleteAccountsSuccess = createAction(DELETE_ACCOUNTS_SUCCESS, props<{ id: number }>());

export const addAccounts = createAction(ADD_ACCOUNTS, props<{ account: IAccounts }>());
export const addAccountsSuccess = createAction(ADD_ACCOUNTS_SUCCESS, props<{ account: IAccounts }>());

export const updateAccounts = createAction(UPDATE_ACCOUNTS, props<{ account: IAccounts }>());
export const updateAccountsSuccess = createAction(UPDATE_ACCOUNTS_SUCCESS, props<{ account: IAccounts }>());

export const getAccount = createAction(GET_ACCOUNTS, props<{ child: number }>());
export const getAccountsSuccess = createAction(UPDATE_ACCOUNTS_SUCCESS, props<{ account: IAccounts }>());
export const getAccountsFailure = createAction(LOAD_ACCOUNTS_FAILURE, props<{ error: string }>());

export const mapAccount = createAction('[User/API] Map User', props<{ entityMap: EntityMapOne<IAccounts> }>());
export const mapAccounts= createAction('[User/API] Map Users', props<{ entityMap: EntityMap<IAccounts> }>());
export const deleteAccount = createAction('[User/API] Delete User', props<{ id: number }>());
export const deleteAccounts = createAction('[User/API] Delete Users', props<{ ids: number[] }>());
export const deleteUsersByPredicate = createAction('[User/API] Delete Users By Predicate', props<{ predicate: Predicate<IAccounts> }>());

export const emptyAction = createAction('Empty Action');





export const AccountActions = {
    loadAccounts
};



