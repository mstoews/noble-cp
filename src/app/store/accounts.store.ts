import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, map, pipe, switchMap, tap } from 'rxjs';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';

import { IAccounts, IDropDownAccounts } from 'app/models'
import { AccountsService } from '../services/accounts.service';
import { update } from 'lodash';


export interface AccountsStateInterface {
  accounts: IAccounts[];
  dropDownAccounts: IDropDownAccounts[];
  isLoading: boolean;
  isLoaded: boolean;
  isDropDownLoaded: boolean;
  error: string | null;
}

export const AccountsStore = signalStore(
  { providedIn: 'root' },
    withState<AccountsStateInterface>({
    accounts: [],
    dropDownAccounts: [],
    error: null,
    isLoading: false,
    isLoaded: false,
    isDropDownLoaded: false,

  }),
  withComputed((state) => ({
    selected: computed(() => state.accounts().filter((t) => state.accounts()[t.child])),
  })),
  withMethods((state, accountsService = inject(AccountsService)) => ({
    
    resetLoaded: rxMethod<number>(
      pipe(  map(() => {
          patchState(state, { isLoaded: false });          
        }))
     ),    
     resetDownload: rxMethod<number>(
      pipe(  map(() => {
          patchState(state, { isDropDownLoaded: false });          
        }))
     ),    
     removeAccounts: rxMethod<number>(
      pipe(
        switchMap((account) => {
          patchState(state, { isLoading: true });
          return accountsService.delete(account).pipe(
            tapResponse({
              next: (accounts) => {
                patchState(state, { accounts: state.accounts().filter((accounts) => accounts.child !== account) });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    
    addAccounts: rxMethod<IAccounts>(
      pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return accountsService.create(value).pipe(
            tapResponse({
              next: (account) => {
                patchState(state, { accounts: [...state.accounts(), account] });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    updateAccounts: rxMethod<IAccounts>(
      pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return accountsService.update(value).pipe(
            tapResponse({
              next: (accts) => {
                const updatedAccounts = state.accounts().filter((accounts) => accounts.child !== accts.child);
                updatedAccounts.push(accts);
                updatedAccounts.sort((a, b) => a.child - b.child);
                patchState(state, { accounts: updatedAccounts });                              
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    readDropAccounts: rxMethod<void>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap(() => {
          return accountsService.readAccountDropdown().pipe(
            tapResponse({
              next: accounts => patchState(state, { dropDownAccounts: accounts }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false, isDropDownLoaded: true }),
            })
          );
        })
      )
    ),
    readAccounts: rxMethod<void>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap(() => {
          return accountsService.readAccounts().pipe(
            tapResponse({
              next: accounts => patchState(state, { accounts: accounts }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false, isLoaded: true }),
            })
          );
        })
      )
    ),
    
  })),
  withHooks({
    onInit(store) {
      if (store.isLoaded() === false) {
        store.readAccounts();
      }
      if (store.isDropDownLoaded() === false) {
        store.readDropAccounts();
      }
    },
  })
);
