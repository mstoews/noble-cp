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
import { PeriodsService } from '../services/periods.service';
import { IPeriod } from 'app/models/period';


export interface PeriodStateInterface {
  periods: IPeriod[];
  isLoading: boolean;
  error: string | null;
}

export const PeriodStore = signalStore(
  { providedIn: 'root' },
  withState<PeriodStateInterface>({
    periods: [],
    error: null,
    isLoading: false,
  }),
  withComputed((state) => ({
    selected: computed(() => state.periods().filter((t) => state.periods()[t.period])),
  })),
  withMethods((state, periodService = inject(PeriodsService)) => ({
    removePeriod: rxMethod<IPeriod>(
      pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return periodService.delete(value.period).pipe(
            tapResponse({
              next: () => {
                patchState(state, { periods: state.periods().filter((prd) => prd.period !== value.period) });
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
