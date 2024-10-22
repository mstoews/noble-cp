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
import { IAccounts, IArtifacts, IJournalDetail, IJournalDetailDelete, IJournalHeader, IPeriodParam } from 'app/models/journals';
import { JournalService } from '../services/journal.service';
import { IFund, IType } from 'app/modules/kanban/kanban.service';
import { IParty } from 'app/models/party';
import { IPeriod } from '../services/periods.service';
import { ISubType } from '../services/subtype.service';
import { debounce } from 'lodash';


export interface JournalStateInterface {
  gl: IJournalHeader[];
  ap: IJournalHeader[];
  ar: IJournalHeader[];
  details: IJournalDetail[];
  accounts: IAccounts[];
  account_type: IType[];
  party: IParty[];
  period: IPeriod[];
  sub_type: ISubType[];
  funds: IFund[];
  artifacts: IArtifacts[];
  isLoading: boolean;
  error: string | null;
}

export const JournalStore = signalStore(
  withState<JournalStateInterface>({
    gl: [],
    ap: [],
    ar: [],
    details: [],
    accounts: [],
    account_type: [],
    party: [],
    period: [],
    sub_type: [],
    funds: [],
    artifacts: [],
    error: null,
    isLoading: false,
  }),
  withComputed((state) => ({
  })),
  withMethods((state, journalService = inject(JournalService)) => ({
    removeJournalHeader: rxMethod<IJournalHeader>(
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
    createJournalHeader: rxMethod<IJournalHeader>(
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
    updateJournalHeader: rxMethod<IJournalHeader>(
      pipe(
        switchMap((value) => {
          return journalService.updateJournalHeader(value).pipe(
            tapResponse({
              next: (journal) => {
                const updatedHeader = state.gl().filter((jrn) => jrn.journal_id !== value.journal_id);
                updatedHeader.push(journal);
                patchState(state, { gl: updatedHeader });
                
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    updateJournalDetail: rxMethod<IJournalDetail>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        switchMap((value) => {
          return journalService.updateHttpJournalDetail(value).pipe(
            tapResponse({
              next: () => {
                const updatedDetail = state.details().filter((journal) => journal.journal_subid !== value.journal_subid);
                updatedDetail.push(value);
                patchState(state, { details: updatedDetail });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    createJournalDetail: rxMethod<IJournalDetail>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        switchMap((value) => {
          return journalService.createHttpJournalDetail(value).pipe(
            tapResponse({
              next: (journal) => {
                patchState(state, { details: [...state.details(), journal] });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    deleteJournalDetail: rxMethod<IJournalDetailDelete>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        switchMap((value) => {
          return journalService.deleteHttpJournalDetail(value).pipe(
            tapResponse({
              next: (journal) => {
                const updatedDetail = state.details().filter((jnl) => journal.journal_subid !== jnl.journal_subid);
                patchState(state, { details: updatedDetail });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    loadDetails: rxMethod<number>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        switchMap((value) => {
          return journalService.getHttpJournalDetails(value).pipe(
            tapResponse({
              next: (journal) => patchState(state, { details: journal }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    loadAllDetails: rxMethod<IPeriodParam>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        switchMap((value) => {
          return journalService.getHttpAllJournalDetailsByPeriod(value).pipe(
            tapResponse({
              next: (journal) => patchState(state, { details: journal }),
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
    loadArtifactsByJournalId: rxMethod<number>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        switchMap((value) => {
          return journalService.readHttpLoadArtifactsByJournalId(value).pipe(
            tapResponse({
              next: (artifacts) => patchState(state, { artifacts: artifacts }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    updateArtifacts: rxMethod<IArtifacts>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        switchMap((value) => {
          return journalService.updateHttpArtifacts(value).pipe(
            tapResponse({
              next: () => {                
                const updatedArtifacts = state.artifacts().filter((journal) => journal.id !== value.id);
                updatedArtifacts.push(value);
                patchState(state, { artifacts: updatedArtifacts });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    renumberJournalDetail: rxMethod<number>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        switchMap((value) => {
          return journalService.reNumberJournalDetail(value).pipe(
          tapResponse({
            next: (journal) => patchState(state, { details: journal}),
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
      store.loadAccounts();
    },
  })
);
