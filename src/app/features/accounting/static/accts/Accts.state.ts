import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { accountAPIActions } from './Accts.actions';
import { accountPageActions } from './Accts-page.actions';
import { IAccounts, IDropDownAccounts } from 'app/models';

export interface State {
  accounts: IAccounts[];
  children: IDropDownAccounts[];
  isLoading: boolean;
  isLoaded: boolean;
  selectedId: number | null;
}

export const initialState: State = {
  accounts: [],
  children: [],
  isLoading: false,
  isLoaded: false,
  selectedId: null,
};

const reducer = createReducer(
  initialState,
  // Accounts 
  on(accountPageActions.load, (state) => ({ ...state, isLoading: true })),
  on(accountAPIActions.loadAccountsSuccess, (state, { accounts }) => ({ ...state, accounts, isLoading: false, isLoaded: true })),
  on(accountAPIActions.loadAccountsFailure, (state) => ({ ...state, isLoading: false, isLoaded: false })),

  on(accountPageActions.children, (state) => ({ ...state, isLoading: true })),
  on(accountAPIActions.loadChildrenSuccess, (state, { accounts }) => ({ ...state, children: accounts, isLoading: false, })),
  on(accountAPIActions.loadChildrenFailure, (state) => ({ ...state, isLoading: false, })),
  on(accountPageActions.select, (state, { account }) => ({ ...state, selectedId: account })),
  on(accountPageActions.deleteAccount, (state) => ({ ...state, isLoading: true })),
  on(accountPageActions.addAccount, (state) => ({ ...state, isLoading: true })),
  on(accountPageActions.updateAccount, (state) => ({ ...state, isLoading: true })),
  on(accountAPIActions.accountUpdatedSuccess, (state) => ({ ...state, isLoading: false, })),
  on(accountAPIActions.accountUpdatedFail, (state) => ({ ...state, isLoading: false, })),
  on(accountAPIActions.accountAddedSuccess, (state, { account }) => ({ ...state, accounts: [...state.accounts, account], isLoading: false, })),
  on(accountAPIActions.accountAddedFail, (state) => ({ ...state, isLoading: false, })),
  on(accountAPIActions.accountDeletedFail, (state) => ({ ...state, isLoading: false, })),


);

export const accountsFeature = createFeature({
  name: 'accountsFeature',
  reducer,
  extraSelectors: ({ selectSelectedId, selectAccounts }) => ({
    selectSelectedAccount: createSelector(
      selectSelectedId,
      selectAccounts,
      (selectedId, account) => account.find((s) => s.account === selectedId)
    )
  })
})

