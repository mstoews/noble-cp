import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, switchMap, tap } from 'rxjs';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { IAccounts, IJournalTemplate } from 'app/models/journals';
import { JournalService } from '../services/journal.service';
import { IParty } from 'app/models/party';
import { IPeriod } from '../services/periods.service';
import { PartyService } from './party.service';


export interface ApplicationStateInterface {
  templates: IJournalTemplate[];
  accounts: IAccounts[];
  party: IParty[];
  period: IPeriod[];
  currentPeriod: string;
  currentYear: string;
  isLoading: boolean;
  error: string | null;
}

export const ApplicationStore = signalStore(
  { providedIn: 'root' },
  withState<ApplicationStateInterface>({
    accounts: [],
    party: [],
    period: [],
    templates: [],
    error: null,
    isLoading: false,
    currentPeriod: '',
    currentYear: '',
  }),
  withComputed((state) => ({})),
  withMethods((state, 
    partyService = inject(PartyService),
    journalService = inject(JournalService)) => ({

    loadTemplates: rxMethod<void>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap(() => {
          return journalService.readJournalTemplate().pipe(
            tapResponse({
              next: (templates) => patchState(state, { templates: templates }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      ),
    ),
    loadAccounts: rxMethod<void>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap(() => {
          return journalService.readHttpAccounts().pipe(
            tapResponse({
              next: (accounts) => patchState(state, { accounts: accounts }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    loadParties: rxMethod<void>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap(() => {
          return partyService.read().pipe(
            tapResponse({
              next: (parties) => patchState(state, { party: parties }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    loadPeriod: rxMethod(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        switchMap((value) => {
          return journalService.getSettings('Period').pipe(
            tapResponse({
              next: (period) => patchState(state, { currentPeriod: period }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    loadYear: rxMethod(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        switchMap((value) => {
          return journalService.getSettings('Year').pipe(
            tapResponse({
              next: (year) => patchState(state, { currentYear: year }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),

  })),
  withHooks({
    onInit(store) {
      store.loadTemplates();
      store.loadAccounts();
      store.loadParties();
    },
  }));
