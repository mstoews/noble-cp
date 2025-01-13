import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromAccounts from './Accounts.Reducer';

export const selectAccountState = createFeatureSelector<fromAccounts.AccountState>('accounts');

export const selectAccounts = createSelector(
    selectAccountState, 
    fromAccounts.selectAll    
);

// export const selectAccountsDropdown = createSelector(
//     selectAccountState, (state) => {
//         return state.accountsDropdown
//     }
// );

export const selectJournalById = (child: number) => createSelector(
    selectAccounts,
    (accounts) => accounts.find(j => j.child === child)
);

export const deleteAccount = (child: number) => createSelector(
    selectAccounts,
    (accounts) => accounts.filter(j => j.child !== child)
);

export const updateAccounts = (child: number) => createSelector(
    selectAccounts,
    (accounts) => accounts.map(j => j.child === child ? j : j)
);

