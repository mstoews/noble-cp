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
  import { IAccounts, IJournalDetail, JournalService } from 'app/services/journal.service';
  import { tapResponse } from '@ngrx/operators';
  
  
  export interface TransactionDetailInterface {
    details: IJournalDetail[];    
    accounts: IAccounts[];
    isLoading: boolean;
    error: string | null;
    detailCount: number;
  }
  
  export const TransactionDetailStore = signalStore(
    withState<TransactionDetailInterface>({
      details: [],      
      accounts: [],
      error: null,
      isLoading: false,
      detailCount: 0
    }),
    withComputed((store) => ({
      detailCount: computed(() => store.details().length),
    })),
    withMethods((store, journalService = inject(JournalService)) => ({   
      removeDetail: rxMethod<IJournalDetail>(
        pipe(
          switchMap((value) => {
            patchState(store, { isLoading: true });
            return journalService.deleteHttpJournalDetail(value.journal_id, value.journal_subid).pipe(
              tapResponse({
                next: (details) => {
                  patchState(store, { details: store.details().filter((details) => details.journal_id !== value.journal_id && details.journal_subid ) });
                },
                error: console.error,
                finalize: () => patchState(store, { isLoading: false }),
              })
            );
          })
        )
      ),
      addDetail:  rxMethod<IJournalDetail>(
        pipe(
          switchMap((value) => {
            patchState(store, { isLoading: true });
            return journalService.createHttpJournalDetail(value).pipe(
              tapResponse({
                next: (details) => {
                 patchState(store, { details: [...store.details(), details] });
                },
                error: console.error,
                finalize: () => patchState(store, { isLoading: false }),
              })
            );
          })
        )
      ),
      updateDetail: rxMethod<IJournalDetail>(
        pipe(
          switchMap((value) => {
            patchState(store, { isLoading: true });
            return journalService.updateHttpJournalDetail(value).pipe(
              tapResponse({
                next: (detail) => {
                  const updatedDetails = store.details().filter((detail) => detail.journal_id !== value.journal_id && detail.journal_subid !== value.journal_subid);
                  patchState(store, { details: updatedDetails });
                  const addDetails = [...store.details(), detail];
                  patchState(store, { details: addDetails });
                },
                error: console.error,
                finalize: () => patchState(store, { isLoading: false }),
              })
            );
          })
        )
      ),
      addDetails: rxMethod<IJournalDetail>(
        pipe(
          switchMap((value) => {
            patchState(store, { isLoading: true });
            return journalService.createHttpJournalDetail(value).pipe(
              tapResponse({
                next: (details) =>  patchState(store, { details : [...store.details(), value ]}),             
                error: console.error,
                finalize: () => patchState(store, { isLoading: false }),
              })
            );
          })
        )
      ),  
      loadDetails: rxMethod<number>(
        pipe(
            switchMap((value) => { 
                patchState(store, { isLoading: true });
                return journalService.getHttpJournalDetails(value).pipe(
                  tapResponse({
                    next: (details) =>  patchState(store, { details : details }),             
                    error: console.error,
                    finalize: () => patchState(store, { isLoading: false }),
                  })
                );
              })
            )
        ),      
      loadAccounts: rxMethod<void>(
        pipe(
            switchMap((value) => {
              patchState(store, { isLoading: true });
              return journalService.listAccounts().pipe(
                tapResponse({
                  next: (accounts) =>  patchState(store, { accounts : accounts}),             
                  error: console.error,
                  finalize: () => patchState(store, { isLoading: false }),
                })
              );
            })
            )
      ),
    })),    
  );
  