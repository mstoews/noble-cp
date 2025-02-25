import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { accountAPIActions } from './accts.actions';
import { accountPageActions } from './accts-page.actions';
import { IAccounts } from 'app/models';

export interface State {
  accounts: IAccounts[];
  isLoading: boolean;
  selectedId: number | null;
}

export const initialState: State = {
  accounts: [],
  isLoading: false,
  selectedId: null,
};

const reducer = createReducer(
  initialState,
  on(accountPageActions.load, (state) => ({ ...state, isLoading: true })),
  on(accountAPIActions.loadAccountsSuccess,
    (state, { accounts }) =>
      ({ ...state, accounts, isLoading: false, })),
  on(accountAPIActions.loadAccountsFailure, (state) => ({ ...state, isLoading: false, })),

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

