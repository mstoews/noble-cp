import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, filter, pipe, switchMap, tap } from 'rxjs';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { IJournalDetail, IJournalHeader } from 'app/models/journals';
import { JournalService } from './journal.service';


export interface JournalStateInterface {
  gl: IJournalHeader[];
  ap: IJournalHeader[];
  ar: IJournalHeader[]
  details: IJournalDetail[];
  isLoading: boolean;
  error: string | null;
}

export const JournalStore = signalStore(
  withState<JournalStateInterface>({
    gl: [],
    ap:[],
    ar:[],
    details: [],
    error: null,
    isLoading: false,
  }),
  withComputed((state) => ({
    tasksCount: computed(() => state.gl().length),
  })),
  withMethods((state, journalService = inject(JournalService)) => ({       
    removeJournal: rxMethod<IJournalHeader>(
      pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return journalService.deleteJournalHeader(value.journal_id).pipe(
            tapResponse({
              next: () => {
                patchState(state, { gl: state.gl().filter((prd) => prd.journal_id !== value.journal_id) });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),

    addJournal: rxMethod<IJournalHeader>(
      pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return journalService.createJournalHeader(value).pipe(
            tapResponse({
              next: (journal) => {
               patchState(state, { gl: [...state.gl(), journal] });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),

    updateJournal: rxMethod<IJournalHeader>(
      pipe(
        switchMap((value) => {
          return journalService.updateJournalHeader(value).pipe(
            tapResponse({
              next: (journal) => {
                patchState(state, { gl: journal });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    loadJournals: rxMethod<void>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap(() => {
          return journalService.readHttpJournalHeader().pipe(
            tapResponse({
              next: (journal) => patchState(state, { gl: journal.filter(gl => gl.type === 'GL') }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    accountsPayable: rxMethod<void>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap(() => {
          return journalService.readHttpJournalHeader().pipe(
            tapResponse({
              next: (journal) => patchState(state, { ap: journal.filter(ar => ar.type === 'AP') }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    accountsReceivable: rxMethod<void>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap(() => {
          return journalService.readHttpJournalHeader().pipe(
            tapResponse({
              next: (journal) => patchState(state, { ar: journal.filter(ar => ar.type === 'AR') }),
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
      store.loadJournals();
      store.accountsPayable();
      store.accountsReceivable();
    },
  })
);
