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
  import { inject } from '@angular/core';
  import { tapResponse } from '@ngrx/operators';  
  import { IBudget } from 'app/models';
  import { BudgetService } from './budget.service';
  import { ISubType } from 'app/services/subtype.service';
  import { IType } from 'app/services/type.service';
  import { IAccounts } from 'app/models/journals';
  import { IFund } from 'app/modules/kanban/kanban.service';

export interface BudgetInterface {
    budgetAmt: IBudget[]
    accounts: IAccounts[],
    types: IType[],
    subTypes: ISubType[],
    funds: IFund[],
    isLoading: boolean;
    error: string | null;
    query: string
  }
  
export const BudgetStore = signalStore(    
    withState<BudgetInterface>({
      budgetAmt: [],
      accounts: [],
      types: [],
      subTypes:[],
      funds:[],
      error: null,
      isLoading: false,
      query: ''
    }),    
    withMethods((store, budgetService = inject(BudgetService)) => ({   
      removeBudget: rxMethod<IBudget>(
        pipe(
          switchMap((value) => {
            patchState(store, { isLoading: true });
            return budgetService.delete(value.).pipe(
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
      loadTypes: rxMethod<void>(
          pipe(
              switchMap((value) => { 
                  patchState(store, { isLoading: true });
                  return budgetService.readTypes().pipe(
                    tapResponse({
                      next: (types) => patchState(store, { types : types }),             
                      error: console.error,
                      finalize: () => patchState(store, { isLoading: false }),
                    })
                  );
                })
              )
        ),                       
      loadSubtypes: rxMethod<void>(
          pipe(
              switchMap((value) => { 
                  patchState(store, { isLoading: true });
                  return budgetService.readSubtypes().pipe(
                    tapResponse({
                      next: (budget) =>  patchState(store, { budgetAmt : budget }),             
                      error: console.error,
                      finalize: () => patchState(store, { isLoading: false }),
                    })
                  );
                })
              )
        ),
      loadFunds: rxMethod<void>(
          pipe(
              switchMap((value) => { 
                  patchState(store, { isLoading: true });
                  return budgetService.readFunds().pipe(
                    tapResponse({
                      next: (budget) =>  patchState(store, { budgetAmt : budget }),             
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
                  return budgetService.readAccounts().pipe(
                    tapResponse({
                      next: (accounts) =>  patchState(store, { accounts : accounts }),             
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
  