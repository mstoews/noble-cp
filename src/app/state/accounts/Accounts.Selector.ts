import { createFeatureSelector, createSelector } from "@ngrx/store"; 
import { AccountModel } from "./Accounts.Model";

const getAccountsState = createFeatureSelector<AccountModel>('acct');

export const getTemplates = createSelector(
    getAccountsState, (state) => {
        return state.accounts
    }
);


