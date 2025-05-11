import { patchState, signalStore, withComputed, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, switchMap, tap } from 'rxjs';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { FundsService } from '../features/accounting/static/funds/funds.service';
import { IFunds } from 'app/models';
export interface FundStateInterface {
  funds: IFunds[];
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
}

export const FundsStore = signalStore(
  { providedIn: 'root' },
  withState<FundStateInterface>({
    funds: [],
    isLoaded: false,
    error: null,
    isLoading: false,
  }),
  withProps(() => {
    const _fundsService = inject(FundsService);
    return {
      _fundsService
    };
  }),
  withComputed((state) => ({
    selected: computed(() => state.funds().filter((t) => state.funds()[t.id])),
  })),
  withMethods((state) => ({
    removeFund: rxMethod<IFunds>(
      pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return state._fundsService.delete(value.id).pipe(
            tapResponse({
              next: (fund) => { patchState(state, { funds: state.funds().filter((fund) => fund.fund !== value.fund) }); },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    addFund: rxMethod<IFunds>(
      pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return state._fundsService.create(value).pipe(
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
          return state._fundsService.update(value).pipe(
            tapResponse({
              next: fund => patchState(state, { funds: state.funds().filter((fnd) => fnd.fund !== fund.fund) }),
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
          return state._fundsService.read().pipe(
            tapResponse({
              next: fund => patchState(state, { funds: fund }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false, isLoaded: true }),
            })
          );
        })
      )
    ),
  })),

  withHooks({
    onInit(store) {
      if (!store.isLoaded() === false) {
        store.loadFunds();
      }
    },
  })
);
