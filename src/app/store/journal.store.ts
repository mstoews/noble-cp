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
  IJournalTransactions,
  IJournalDetail,
  IJournalDetailDelete,
  IJournalDetailTemplate,
  IJournalHeader,
  IJournalTemplate,
  ITemplateParams,

} from 'app/models/journals';
import { JournalService } from '../services/journal.service';
import { IParty } from 'app/models/party';

import { IAccounts, IFunds } from 'app/models';
import { IType } from 'app/models/types';
import { ICurrentPeriod, ICurrentPeriodParam, IPeriod, IPeriodParam } from 'app/models/period';
import { ISubType } from 'app/models/subtypes';
import { FundsService } from 'app/features/accounting/static/funds/funds.service';
import { EvidenceService } from 'app/services/evidence.service';
import { SettingsService } from 'app/services/settings.service';

export interface JournalStateInterface {
  currentJournal: IJournalHeader;
  maxJournal: number | null;
  gl: IJournalHeader[];
  open_transactions: IJournalHeader[];
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
  prd: ICurrentPeriod;
  error: string | null;
}

export const JournalStore = signalStore(
  { providedIn: 'root' },
    withState<JournalStateInterface>({
    currentJournal: null,
    maxJournal: 0,
    gl: [],
    open_transactions: [],
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
    prd: null,
    currentPeriod: 0,
    currentYear: 0,

  }),
  withComputed((state) => ({
  })),
  withMethods((state,
    
    fundsService = inject(FundsService),
    settingsService = inject(SettingsService),
    evidenceService = inject(EvidenceService),
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
      createJournalTemplate: rxMethod<ITemplateParams>(
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
                finalize: () => patchState(state, { isLoading: false }),
              })
            );
          })
        )
      ),

      loadFunds: rxMethod<void>(
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

      loadJournalsByPeriod: rxMethod<IPeriodParam>(
        pipe(
          tap(() => patchState(state, { isLoading: true })),
          switchMap((value) => {
            return journalService.getJournalHeaderByPeriod(value).pipe(
              tapResponse({                
                next: (journal) => patchState(state, { gl: journal.filter((jrn) => jrn.status === 'OPEN') }),
                error: console.error,
                finalize: () => patchState(state, { isLoading: false }),
              })
            );
          })
        )
      ),
      
      loadOpenJournalsByPeriod: rxMethod<IPeriodParam>(
        pipe(
          tap(() => patchState(state, { isLoading: true })),
          switchMap((value) => {
            return journalService.getJournalHeaderByPeriod(value).pipe(
              tapResponse({                
                next: (journal) => patchState(state, { open_transactions: journal.filter((jrn) => jrn.status === 'OPEN') }),
                error: console.error,
                finalize: () => patchState(state, { isLoading: false }),
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
                finalize: () => patchState(state, { isLoading: false }),
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
      loadArtifactsByJournalId: rxMethod<number>(
        pipe(
          tap(() => patchState(state, { isLoading: true })),
          switchMap((value) => {
            return evidenceService.readById(value).pipe(
              tapResponse({
                next: (artifacts) => patchState(state, { isLoading: false  }),
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
            return evidenceService.update(value).pipe(
              tapResponse({
                next: (evidence) => {
                  patchState(state, { artifacts : [...state.artifacts(), evidence ]})
                },
                error: console.error,
                finalize: () => patchState(state, { isLoading: false }),
              })
            );
          })
        )
      ),
      createArtifacts: rxMethod<IArtifacts>(
        pipe(
          tap(() => patchState(state, { isLoading: true })),
          switchMap((value) => {
            return evidenceService.create(value).pipe(
              tapResponse({
                next: (artifact) => {
                  patchState(state, { artifacts: [...state.artifacts(), artifact] });
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
      store.loadTemplates();      
      store.loadAccounts();
      store.loadFunds();
      store.loadPeriod('Period');
      store.loadYear('Year');
      store.loadMaxJournal();      
    },
  }))

);
