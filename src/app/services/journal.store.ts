import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, exhaustMap, pipe, switchMap, tap } from 'rxjs';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
   
    IArtifacts,
    IJournalDetail,
    IJournalDetailDelete,
    IJournalDetailTemplate,
    IJournalHeader,
    IJournalTemplate,
    
} from 'app/models/journals';
import { JournalService } from '../services/journal.service';
import { IParty } from 'app/models/party';

import { IAccounts, IFunds, IJournalParams, ITrialBalance } from 'app/models';
import { IType } from 'app/models/types';
import { IPeriod, IPeriodParam } from 'app/models/period';
import { ISubType } from 'app/models/subtypes';
import {FundsService} from "./funds.service";


export interface JournalStateInterface {
  gl: IJournalHeader[];
  ap: IJournalHeader[];
  ar: IJournalHeader[];
  tb: ITrialBalance[];
  details: IJournalDetail[];
  templates: IJournalTemplate[];
  templateDetails: IJournalDetailTemplate[];
  accounts: IAccounts[];
  account_type: IType[];
  party: IParty[];
  period: IPeriod[];
  sub_type: ISubType[];
  funds: IFunds[];
  artifacts: IArtifacts[];
  currentPeriod: number;
  currentYear: number;
  isLoading: boolean;
  error: string | null;
}

export const JournalStore = signalStore(
  { protectedState: false },
   withState<JournalStateInterface>({
    gl: [],
    ap: [],
    ar: [],
    tb: [],
    details: [],
    accounts: [],
    account_type: [],
    templateDetails: [],
    templates: [],
    party: [],
    period: [],
    sub_type: [],
    funds: [],
    artifacts: [],
    error: null,
    isLoading: false,
    currentPeriod: 1,
    currentYear: 2024,
  }),
  withComputed((state) => ({
  })),
  withMethods((state,
               fundsService = inject(FundsService),
               journalService = inject(JournalService)) => ({
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
          return journalService.createJournalFullHeader(value).pipe(
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
        debounceTime(1000),
        switchMap((value) => {
          return journalService.updateJournalDetail(value).pipe(
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
    createJournalTemplate: rxMethod<IJournalParams>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        switchMap((value) => {
          return journalService.createJournalTemplate(value).pipe(
            tapResponse({
              next: (template) => {
                patchState(state, { templates: [...state.templates(), template] });
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
    loadFunds: rxMethod <void>(
          pipe(
              tap(() => patchState(state, { isLoading: true })),
              exhaustMap(() => {
                  return fundsService.read().pipe(
                      tapResponse({
                          next: (funds) => patchState(state, { funds }),
                          error: console.error,
                          finalize: () => patchState(state, { isLoading: false }),
                      })
                  );
              })
          )
      ),
    loadTemplates: rxMethod <void>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap(()  => {
          return journalService.readJournalTemplate().pipe(
            tapResponse({
              next: (templates) => patchState(state, { templates: templates }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    
    loadTemplateDetails: rxMethod<string>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        switchMap((value) => {
          return journalService.getTemplateDetails(value).pipe(
            tapResponse({
              next: (templateDetails) => patchState(state, { templateDetails: templateDetails }),
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
              next: (journal) => patchState(state, { gl: journal }), 
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
              next: (journal) => patchState(state, { ap: journal.filter(ap => ap.type === 'AP') }),
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
    loadPeriod: rxMethod(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap(() => {
          return journalService.getSettings('Period').pipe(
            tapResponse({
              next: (period) => patchState(state, { currentPeriod: Number(period) }),
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
        exhaustMap(() => {
          return journalService.getSettings('Year').pipe(
            tapResponse({
              next: (year) => patchState(state, { currentYear: Number(year) }),
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
  updateDistributionListing: rxMethod<IPeriodParam>(
    pipe(
      tap(() => patchState(state, { isLoading: true })),
      switchMap((params) => {
        return journalService.updateDistributionLedger(params).pipe(
        tapResponse({
          next: console.log,
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
      store.loadJournals();
      store.loadAccounts();
      store.loadFunds();
      store.loadPeriod('Period');
      store.loadYear('Year');
    },
  })
);
