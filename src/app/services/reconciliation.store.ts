import {
    patchState,
    signalStore,
    withComputed,
    withHooks,
    withMethods,
    withState,
  } from '@ngrx/signals';
  
  import { rxMethod } from '@ngrx/signals/rxjs-interop';
  import { exhaustMap, pipe, shareReplay, switchMap, tap } from 'rxjs';
  import { computed, inject } from '@angular/core';
  import { JournalService } from './journal.service';
  import { tapResponse } from '@ngrx/operators';
  import { IJournalDetail } from 'app/models/journals';
  import { IAccounts } from 'app/models/journals';
  import { AccountsService } from './accounts.service';
  import { IReadJournalDetailsParams } from 'app/models/journals';

  
  export interface IReconciledAmounts {
    id: string;
    account_id: number;
    amount: number;
    journal_id: number;
    journal_type: string;
    transaction_date: string;
    document_ref: string;
  }

  export interface ReconciliationStateInterface {
    transactions: IJournalDetail[];
    accounts: IAccounts[];
    reconciliation: IReconciledAmounts[];
    isLoading: boolean;
    error: string | null;    
  }
  
  export const ReconciliationStore = signalStore(
    { protectedState: false }, withState<ReconciliationStateInterface>({
      transactions: [],
      accounts: [],
      reconciliation: [],
       error: null,
      isLoading: false,
    }),
    withComputed((state) => ({  
      selected: computed(() => state.reconciliation().filter((t) => state.transactions()[t.id])),
    })),
    withMethods((state, 
        journalService = inject(JournalService), 
        accountsService = inject(AccountsService)

        ) => ({       
      removeTask: rxMethod<IJournalDetail>(
        pipe(
          switchMap((value) => {
            patchState(state, { isLoading: true });
            return journalService.deleteHttpJournalDetail(value).pipe(
              tapResponse({
                next: (task) => {
                  patchState(state, { transactions: state.transactions().filter((trans) => trans.journal_subid !== value.journal_subid) });
                },
                error: console.error,
                finalize: () => patchState(state, { isLoading: false }),
              })
            );
          })
        )
      ),
      loadJournalsByAccount: rxMethod<IReadJournalDetailsParams>(
        pipe(
          tap(() => patchState(state, { isLoading: true })),
          switchMap((value) => {
            return journalService.readJournalsByAccount(value).pipe(
              tapResponse({
                next: (trans) => patchState(state, { transactions: trans }),
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
      },
    })
  );
  