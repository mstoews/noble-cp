import { createReducer, on } from '@ngrx/store';
import * as AccountActions from './Accounts.Action';
import { accountState } from './Accounts.State';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IAccounts } from 'app/models/journals';


export interface AccountState extends EntityState<IAccounts> {  
    
    loading: boolean;
    errorMessage: string;
    selectedAccount: number | null;
    // ids: string[] | number[];
    // entities: Dictionary<T>;
  }
  


export function selectAccountId(a: IAccounts): number {
    //In this case this would be optional since primary key is id
    return a.child;
  }
  
  export function sortByName(a: IAccounts, b: IAccounts): number {
    return a.child.toString().localeCompare(b.child.toString());
  }
  
  export const adapter: EntityAdapter<IAccounts> = createEntityAdapter<IAccounts>({
    selectId: selectAccountId,
    sortComparer: sortByName,
  });

  // export const adapter: EntityAdapter<IAccounts> = createEntityAdapter<IAccounts>({});


const initialState: AccountState = adapter.getInitialState({
    
    loading: false,
    errorMessage: '',
    selectedAccount: null,
    // ids: string[] | number[];
    // entities: Dictionary<T>;
  });
  

const accountsReducer = createReducer(
    initialState,
    on(AccountActions.loadAccountsSuccess, (state, { accounts }) => { return adapter.setAll(accounts, state) }),
    on(AccountActions.addAccountsSuccess, (state, action) => {return adapter.addOne(action.account, state) }),
    on(AccountActions.updateAccountsSuccess, (state, action) => { return adapter.updateOne({ id: action.account.child, changes: action.account }, state) }),    
    on(AccountActions.getAccountsSuccess, (state, action) => { return adapter.upsertOne(action.account, state) }), 
    on(AccountActions.mapAccount, (state, { entityMap }) => { return adapter.mapOne(entityMap, state) }),
    on(AccountActions.mapAccounts, (state, { entityMap }) => { return adapter.map(entityMap, state)}),
    on(AccountActions.deleteAccount, (state, { id }) => {return adapter.removeOne(id, state) }),
    on(AccountActions.deleteAccounts, (state, { ids }) => {return adapter.removeMany(ids, state)}),
    on(AccountActions.deleteUsersByPredicate, (state, { predicate }) => { return adapter.removeMany(predicate, state) }),        
             
);

export const { selectAll, selectEntities } = adapter.getSelectors();

export const selectAccounts = selectAll;
export const selectAccountEntities = selectEntities;


export function AccountsReducer(state: any, action: any) {
    return accountsReducer(state, action);
}


