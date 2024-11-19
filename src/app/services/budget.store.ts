import {
    patchState,
    signalStore,
    withHooks,
    withMethods,
    withState,
  } from '@ngrx/signals';
  
  import { rxMethod } from '@ngrx/signals/rxjs-interop';
  import { debounceTime, distinctUntilChanged, exhaustMap, pipe, switchMap, tap } from 'rxjs';
  import { inject } from '@angular/core';
  import { tapResponse } from '@ngrx/operators';  
  import { IBudget } from 'app/models';
  import { BudgetService } from './budget.service';
  
export interface BudgetInterface {
    budgetAmt: IBudget[]
    isLoading: boolean;
    error: string | null;
    query: string
  }
  
export const BudgetStore = signalStore(    
    { protectedState: false }, withState<BudgetInterface>({
      budgetAmt: [],
      error: null,
      isLoading: false,
      query: ''
    }),    
    withMethods((store, budgetService = inject(BudgetService)) => ({   
      deleteBudget: rxMethod<number>(
        pipe(
          switchMap((value) => {
            patchState(store, { isLoading: true });
            return budgetService.delete(value).pipe(
              tapResponse({
                next: (budget) => {                                   
                    patchState(store, { budgetAmt : store.budgetAmt().filter((budget) => budget.child !== value) }); 
                },
                error: console.error,
                finalize: () => patchState(store, { isLoading: false }),
              })
            );
          })
        )
      ),
      addBudget: rxMethod<IBudget>(
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
      readBudget: rxMethod<void>(
        pipe(
            tap(() => patchState(store, { isLoading: true })),
            exhaustMap(() => {                 
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
        store.readBudget();
      },
    })    
  );

