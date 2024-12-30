import { createFeatureSelector, createSelector } from "@ngrx/store"; 
import { AccountState } from "./Accounts.Model";

const getAccountsState = createFeatureSelector<AccountState>('acct');

export const getAccounts = createSelector(
    getAccountsState, (state) => {
        return state.accounts
    }
);


