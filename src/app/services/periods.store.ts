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
import { IPeriod, PeriodsService } from './periods.service';


export interface PeriodStateInterface {
  periods: IPeriod[];
  isLoading: boolean;
  error: string | null;
}

export const PeriodStore = signalStore(
  withState<PeriodStateInterface>({
    periods: [],
    error: null,
    isLoading: false,
  }),
  withComputed((state) => ({
    tasksCount: computed(() => state.periods().length),
    selected: computed(() => state.periods().filter((t) => state.periods()[t.period_id])),
  })),
  withMethods((state, periodService = inject(PeriodsService)) => ({       
    removePeriod: rxMethod<IPeriod>(
      pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return periodService.delete(value.period_id).pipe(
            tapResponse({
              next: () => {
                patchState(state, { periods: state.periods().filter((prd) => prd.period_id !== value.period_id) });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),

    addPeriod: rxMethod<IPeriod>(
      pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return periodService.create(value).pipe(
            tapResponse({
              next: (period) => {
               patchState(state, { periods: [...state.periods(), period] });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),

    updatePeriod: rxMethod<IPeriod>(
      pipe(
        switchMap((value) => {
          return periodService.update(value).pipe(
            tapResponse({
              next: (period) => {
                patchState(state, { periods: period });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),

    loadPeriods: rxMethod<void>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap(() => {
          return periodService.read().pipe(
            tapResponse({
              next: (period) => patchState(state, { periods: period }),
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
      store.loadPeriods();
    },
  })
);
