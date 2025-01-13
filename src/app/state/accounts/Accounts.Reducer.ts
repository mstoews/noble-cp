import { createReducer, on } from '@ngrx/store';
import { addAccountsSuccess, deleteAccountsSuccess, getAccount, getAccountsSuccess, loadAccounts, loadAccountsDropdownFailure, loadAccountsDropdownSuccess, loadAccountsFailure, loadAccountsSuccess, updateAccountsSuccess } from './Accounts.Action';
import { accountState } from './Accounts.State';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IAccounts } from 'app/models/journals';

export interface AccountState extends EntityState<IAccounts> {  
    
    loading: boolean;
    errorMessage: string;
    // ids: string[] | number[];
    // entities: Dictionary<T>;
  }
  
export const adapter: EntityAdapter<IAccounts> = createEntityAdapter<IAccounts>({});

const initialState: AccountState = adapter.getInitialState({
    
    loading: false,
    errorMessage: '',
    // ids: string[] | number[];
    // entities: Dictionary<T>;
  });
  

const accountsReducer = createReducer(
   //accountState,
   initialState,
   on(loadAccounts, (state) => ({
    ...state,
    loading: true,
    errorMessage: '',
    })),
   
    on(loadAccountsSuccess, (state, { accounts }) => 
        adapter.addMany(accounts, {
            ...state,
            loading: false,
           })
    ),
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
    // on(deleteAccountsSuccess, (state, action) => {
    //     return {
    //         ...state,
    //         accounts: state.entities .filter(x => x.child !== action.id),
    //         error: null,
    //     }
    // }),
    // on(addAccountsSuccess, (state, action) => {
    //     return {
    //         ...state,
    //         accounts: [...state.entities, action.account],
    //         error: null,
    //     }
    // }),
    // on(updateAccountsSuccess, (state, action) => {
    //     return {
    //         ...state,
    //         accounts: state.accounts.map(x => x.child === action.account.child ? action.account : x),
    //         error: null,
    //     }
    // }),
    on(getAccountsSuccess, (state, action) => {
        return {
            ...state,
            account: action.account,
            error: null,
        }
    })

);

export const { selectAll, selectEntities } = adapter.getSelectors();

export const selectAccounts = selectAll;
export const selectAccountEntities = selectEntities;


export function AccountsReducer(state: any, action: any) {
    return accountsReducer(state, action);
}


