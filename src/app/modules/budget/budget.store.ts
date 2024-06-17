import {
    patchState,
    signalStore,
    withComputed,
    withHooks,
    withMethods,
    withState,
  } from '@ngrx/signals';
  
  import { rxMethod } from '@ngrx/signals/rxjs-interop';
  import { debounceTime, distinctUntilChanged, exhaustMap, pipe, shareReplay, switchMap, tap } from 'rxjs';
  import { computed, inject } from '@angular/core';
  import { tapResponse } from '@ngrx/operators';
  
  import { IBudget } from 'app/models';
  import { BudgetService } from 'app/services/budget.service';
  
  export interface TransactionDetailInterface {
    budgetAmt: IBudget[]
    isLoading: boolean;
    error: string | null;
    detailCount: number;
    query: string
  }
  
  export const TransactionDetailStore = signalStore(
    
    withState<TransactionDetailInterface>({
      budgetAmt: [],
      error: null,
      isLoading: false,
      detailCount: 0,
      query: ''
    }),    
    withMethods((store, budgetService = inject(BudgetService)) => ({   
      removeBudget: rxMethod<IBudget>(
        pipe(
          switchMap((value) => {
            patchState(store, { isLoading: true });
            return budgetService.delete(value.account, value.child).pipe(
              tapResponse({
                next: (budget) => {
                 
                },
                error: console.error,
                finalize: () => patchState(store, { isLoading: false }),
              })
            );
          })
        )
      ),
      addBudget:  rxMethod<IBudget>(
        pipe(
          switchMap((value) => {
            patchState(store, { isLoading: true });
            return budgetService.create(value).pipe(
              tapResponse({
                next: (budget) => {                 
                  patchState(store, { budgetAmt : [...store.budgetAmt(), budget ]})
                },
                error: console.error,
                finalize: () => patchState(store, { isLoading: false }),
              })
            );
          })
        )
      ),
      updateBudget: rxMethod<IBudget>(
        pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap((value) => {
            patchState(store, { isLoading: true });
            return budgetService.update(value).pipe(
              tapResponse({
                next: (budget) => {
                  patchState(store, { budgetAmt : [...store.budgetAmt(), budget ]})
                },
                error: console.error,
                finalize: () => patchState(store, { isLoading: false }),
              })
            );
          })
        )
      ),
      addDetails: rxMethod<IBudget>(
        pipe(
          switchMap((value) => {
            patchState(store, { isLoading: true });
            return budgetService.create(value).pipe(
              tapResponse({
                next: (budget) =>  patchState(store, { budgetAmt : [...store.budgetAmt(), budget ]}),             
                error: console.error,
                finalize: () => patchState(store, { isLoading: false }),
              })
            );
          })
        )
      ),  
      loadBudget: rxMethod<void>(
        pipe(
            switchMap((value) => { 
                patchState(store, { isLoading: true });
                return budgetService.read().pipe(
                  tapResponse({
                    next: (budget) =>  patchState(store, { budgetAmt : budget }),             
                    error: console.error,
                    finalize: () => patchState(store, { isLoading: false }),
                  })
                );
              })
            )
        ),      
      
    })),
    withHooks({
      onInit(store) {
        store.loadBudget();
      },
    })    
  );
  