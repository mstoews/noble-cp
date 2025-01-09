import { createReducer, on } from '@ngrx/store';
import { addAccountsSuccess, deleteAccountsSuccess, getAccount, getAccountsSuccess, loadAccountsDropdownFailure, loadAccountsDropdownSuccess, loadAccountsFailure, loadAccountsSuccess, updateAccountsSuccess } from './Accounts.Action';
import { accountState } from './Accounts.State';



const accountsReducer = createReducer(
    accountState,
    on(loadAccountsSuccess, (state, action) => {
        return {
            ...state,
            accounts: action.accounts,
            error: null,
        }
    }),
    on(loadAccountsFailure, (state, action) => {
        return {
            ...state,
            accounts: [],
            error: action.error,
        }
    }
    ),
    on(loadAccountsDropdownSuccess, (state, action) => {
        return {
            ...state,
            accountsDropdown: action.accountsDropdown,
            error: null,
        }
    }),
    on(loadAccountsDropdownFailure, (state, action) => {
        return {
            ...state,
            accountsDropdown: [],
            error: action.error,
        }
    }
    ),
    on(deleteAccountsSuccess, (state, action) => {
        return {
            ...state,
            accounts: state.accounts.filter(x => x.child !== action.id),
            error: null,
        }
    }),
    on(addAccountsSuccess, (state, action) => {
        return {
            ...state,
            accounts: [...state.accounts, action.account],
            error: null,
        }
    }),
    on(updateAccountsSuccess, (state, action) => {
        return {
            ...state,
            accounts: state.accounts.map(x => x.child === action.account.child ? action.account : x),
            error: null,
        }
    }),
    on(getAccountsSuccess, (state, action) => {
        return {
            ...state,
            account: action.account,
            error: null,
        }
    })

);

export function AccountsReducer(state: any, action: any) {
    return accountsReducer(state, action);
}


