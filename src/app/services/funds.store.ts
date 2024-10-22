import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, switchMap, tap } from 'rxjs';
import { computed, inject } from '@angular/core';

import { tapResponse } from '@ngrx/operators';
import { FundsService } from './funds.service';
import { IFunds } from 'app/models';


export interface FundStateInterface {
  funds: IFunds[];
  isLoading: boolean;
  error: string | null;
}

export const FundsStore = signalStore(
  withState<FundStateInterface>({
    funds: [],
    error: null,
    isLoading: false,
  
  }),
  withComputed((state) => ({
    selected: computed(() => state.funds().filter((t) => state.funds()[t.id])),
  })),
  withMethods((state, fundService = inject(FundsService)) => ({       
    removeFund:   rxMethod<IFunds>(
      pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return fundService.delete(value.id).pipe(
            tapResponse({
              next: (fund) => {
                patchState(state, { funds: state.funds().filter((fund) => fund.fund !== value.fund) });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),

    addFund:  rxMethod<IFunds>(
      pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return fundService.create(value).pipe(
            tapResponse({
              next: (fund) => {
               patchState(state, { funds: [...state.funds(), fund] });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    updateFund: rxMethod<IFunds>(
      pipe(
        switchMap((value) => {
          return fundService.update(value).pipe(
            tapResponse({
              next: (fund) => {
                const updatedTasks = state.funds().filter((fund) => fund.fund !== fund.fund);
                patchState(state, { funds: updatedTasks });
                const currentTasks = state.funds();
                const updateTask = [fund, ...currentTasks.slice(1)];
                patchState(state, {funds: updateTask})
              },
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
          return fundService.read().pipe(
            tapResponse({
              next: (fund) => patchState(state, { funds: fund }),
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
      store.loadFunds();
    },
  })
);
