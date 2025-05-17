import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';

import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, exhaustMap, pipe, switchMap, tap } from 'rxjs';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  IJournalTransactions,
  IJournalDetail,
  IJournalHeader,
  ITemplateParams,
  IArtifacts,
  IJournalTemplate,
  IReadJournalDetailsParams,
  IJournalDetailDelete
} from 'app/models/journals';

import { JournalService } from '../services/journal.service';

import { ICurrentPeriod, ICurrentPeriodParam, IPeriodParam } from 'app/models/period';
import { FundsStore } from './funds.store';
import { PartyStore } from './party.store';
import { TemplateStore } from './template.store';
import { AccountsStore } from './accounts.store';
import { PeriodStore } from './periods.store';
import { EvidenceStore } from './evidence.store';

export interface JournalStateInterface {
  currentJournal: IJournalHeader;
  maxJournal: number | null;
  gl: IJournalHeader[];
  details: IJournalDetail[];
  currentPeriod: number;
  currentYear: number;
  isLoading: boolean;
  prd: ICurrentPeriod;
  error: string | null;
  isTransactionLoaded : boolean;  
}

export const JournalStore = signalStore(
  { providedIn: 'root' },
    withState<JournalStateInterface>({
    currentJournal: null,
    maxJournal: 0,
    gl: [],
    details: [],    
    error: null,
    isLoading: false,
    prd: null,
    currentPeriod: 0,
    currentYear: 0,
    isTransactionLoaded: false,
  }),
  withProps(_ => ({
      _partyStore: inject(PartyStore),
      _evidenceStore: inject(EvidenceStore),
      _templateStore: inject(TemplateStore),
      _accountsStore: inject(AccountsStore),
      _periodStore: inject(PeriodStore),
      _fundsStore: inject(FundsStore),      
    })),
  withComputed((state) => ({
    
  })),
  withMethods((state,
       journalService = inject(JournalService)) => ({      
       // load
       loadTemplates: state._templateStore.readTemplate,       
       loadDropDownAccounts: state._accountsStore.readDropAccounts,
       loadParties: state._partyStore.readParty,
       loadPeriod: state._periodStore.loadPeriods,
       loadFunds: state._fundsStore.loadFunds,       
       loadTemplateDetails: (detailParam: string) => state._templateStore.readTemplateDetails(detailParam),     
       loadArtifactsById: (id: string) => state._templateStore.readTemplateDetails(id),
       loadArtifacts: () => state._templateStore.readTemplate,
       
       // read
       readTemplates: () => state._templateStore.tmp(),
       readFunds: () => state._fundsStore.funds(),
       readParties: () => state._partyStore.party(),
       readAccounts: () => state._accountsStore.dropDownAccounts(),
       readArtifacts: () => state._evidenceStore.evidence(),
       readTemplateDetails: () => state._templateStore.tmp_details(),

       // update
       updateArtifacts: (artifact: IArtifacts) => state._evidenceStore.updateEvidence(artifact), 

       // create 
       createJournalTemplate: (template: IJournalTemplate) => state._templateStore.addTemplate(template),
       createEvidence: (evidence: IArtifacts) => state._evidenceStore.addEvidence(evidence),
                     
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
      deleteJournalDetail: rxMethod<IJournalDetailDelete>(
        pipe(
          switchMap((value) => {
            patchState(state, { isLoading: true });
            return journalService.deleteHttpJournalDetail(value).pipe(            
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
      loadJournalDetails: rxMethod<number>(
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
      createJournal: rxMethod<IJournalTransactions>(
        pipe(
          switchMap((value) => {
            patchState(state, { isLoading: true });
            return journalService.createJournal(value).pipe(
              tapResponse({
                next: (journal) => {
                  const header = {
                    journal_id: journal.journal_id,
                    description: journal.description,
                    booked: false,
                    booked_user: journal.booked_user,
                    period: journal.period,
                    period_year: journal.period_year,
                    transaction_date: journal.transaction_date,
                    type: journal.type,
                    amount: journal.amount,
                    party_id: journal.party_id,
                    invoice_no: journal.invoice_no,
                    template_name: journal.template_name,
                  }
                  patchState(state, { gl: [...state.gl(), header] });
                },
                error: console.error,
                finalize: () => patchState(state, { isLoading: false }),
              })
            );
          })
        )
      ),
      getJournalHeader: rxMethod<number>(
        pipe(
          tap(() => patchState(state, { isLoading: true })),
          switchMap((value) => {
            return journalService.getJournalHeaderById(value).pipe(
              tapResponse({
                next: (journal) => patchState(state, { currentJournal: journal }),
                error: console.error,
                finalize: () => patchState(state, { isLoading: false }),
              })
            );
          })
      )),
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
              debounceTime(1000),
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
      
      loadDetails: rxMethod<number>(
        pipe(
          tap(() => patchState(state, { isLoading: true })),
          switchMap((value) => {
            return journalService.getHttpJournalDetails(value).pipe(
              tapResponse({
                next: (details) => patchState(state, { details: details }),
                error: console.error,
                finalize: () => patchState(state, { isLoading: false }),
              })
            );
          })
        )
      ),
      loadCurrentPeriod: rxMethod<void>(
        pipe(
          tap(() => patchState(state, { isLoading: true })),
          switchMap((value) => {
            return journalService.getCurrentPeriod().pipe(
              tapResponse({
                next: (period) => patchState(state, { prd: period[0] }),
                error: console.error,
                finalize: () => patchState(state, { isLoading: false}),
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
                next: (journal) => patchState(state, { gl: journal, isTransactionLoaded: true }),
                error: console.error,
                finalize: () => patchState(state, { isLoading: false   }),
              })
            );
          })
        )
      ),

      loadJournalsByPeriod: rxMethod<IPeriodParam>(
        pipe(
          tap(() => patchState(state, { isLoading: true })),
          switchMap((value) => {
            return journalService.getJournalHeaderByPeriod(value).pipe(
              tapResponse({                
                next: (journal) => patchState(state, { gl: journal.filter((jrn) => jrn.status === 'OPEN') }),
                error: console.error,
                finalize: () => patchState(state, { isLoading: false, isTransactionLoaded: true }),
              })
            );
          })
        )
      ),
      
  
      getJournalListByPeriod: rxMethod<ICurrentPeriodParam>(
        pipe(
          tap(() => patchState(state, { isLoading: true })),
          switchMap((value) => {
            return journalService.getJournalListByPeriod(value).pipe(
              tapResponse({
                next: (journal) => patchState(state, { gl: journal }),
                error: console.error,
                finalize: () => patchState(state, { isLoading: false, isTransactionLoaded: true }),
              })
            );
          })
        )
      ),

      getJournalAPOpenListByPeriod: rxMethod<ICurrentPeriodParam>(
        pipe(
          tap(() => patchState(state, { isLoading: true })),
          switchMap((value) => {
            return journalService.getJournalAPOpenListByPeriod(value).pipe(
              tapResponse({
                next: (journal) => patchState(state, { gl: journal }),
                error: console.error,
                finalize: () => patchState(state, { isLoading: false }),
              })
            );
          })
        )
      ),

      getJournalAROpenListByPeriod: rxMethod<ICurrentPeriodParam>(
        pipe(
          tap(() => patchState(state, { isLoading: true })),
          switchMap((value) => {
            return journalService.getJournalAROpenListByPeriod(value).pipe(
              tapResponse({
                next: (journal) => patchState(state, { gl: journal }),
                error: console.error,
                finalize: () => patchState(state, { isLoading: false }),
              })
            );
          })
        )
      ),


      getOpenJournalListByPeriod: rxMethod<ICurrentPeriodParam>(
        pipe(
          tap(() => patchState(state, { isLoading: true })),
          switchMap((value) => {
            return journalService.getJournalListByPeriod(value).pipe(
              tapResponse({
                next: (journal) => patchState(state, { gl: journal.filter((jrn) => jrn.status === 'OPEN') }),
                error: console.error,
                finalize: () => patchState(state, { isLoading: false }),
              })
            );
          })
        )
      ),
      
      loadMaxJournal: rxMethod<void>(
        pipe(
          tap(() => patchState(state, { isLoading: true })),
          exhaustMap(() => {
            return journalService.getLastJournalNo().pipe(
              tapResponse({
                next: (journal_no) => patchState(state, { maxJournal: journal_no }),
                error: console.error,
                finalize: () => patchState(state, { isLoading: false }),
              })
            );
          })
        )),
      renumberJournalDetail: rxMethod<number>(
        pipe(
          tap(() => patchState(state, { isLoading: true })),
          switchMap((value) => {
            return journalService.reNumberJournalDetail(value).pipe(
              tapResponse({
                next: (journal) => patchState(state, { details: journal }),
                error: console.error,
                finalize: () => patchState(state, { isLoading: false }),
              })
            );
          })
        )
      ),
      cloneJournal: rxMethod<number>(
        pipe(
          tap(() => patchState(state, { isLoading: true })),
          switchMap((params) => {
            return journalService.cloneJournalById(params).pipe(
              tapResponse({
                next: console.log,
                error: console.error,
                finalize: () => patchState(state, { isLoading: false }),
              })
            );
          })
        )
      ),
      createTemplate: rxMethod<ITemplateParams>(
        pipe(
          tap(() => patchState(state, { isLoading: true })),
          switchMap((params) => {
            return journalService.createTemplateById(params).pipe(
              tapResponse({
                next: console.log,
                error: console.error,
                finalize: () => patchState(state, { isLoading: false }),
              })
            );
          }))
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
  withHooks(store => ({
    onInit: () => {    
      store.loadMaxJournal();  
      if (store.isTransactionLoaded() === false) {
        store.loadJournals();
      }
      if (store._periodStore.isLoaded() === false) {
        store.loadPeriod();
      }
    },
  }))

);
