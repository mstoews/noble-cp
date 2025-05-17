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
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { PeriodsService } from '../services/periods.service';
import { ICurrentPeriod, IPeriod } from 'app/models/period';
import { SettingsService } from 'app/services/settings.service';


export interface PeriodStateInterface {
  periods: IPeriod[];
  activePeriods: ICurrentPeriod[] | null;
  currentPeriod: string;
  isLoading: boolean;
  isLoaded: boolean;
  isCurrentLoaded: boolean;
  isActiveLoaded: boolean;
  error: string | null;
  called: number;
}

export const PeriodStore = signalStore(
  { providedIn: 'root' },
  withState<PeriodStateInterface>({
    periods: [],
    activePeriods: [],
    error: null,
    currentPeriod: '',
    isLoading: false,
    isLoaded: false,
    isCurrentLoaded: false, 
    isActiveLoaded: false,
    called: 0
  }),
  withComputed((state) => ({
    selected: computed(() => state.periods().filter((t) => state.periods()[t.period_id])),
  })),
  withMethods((state, 
      periodService = inject(PeriodsService),
      settingsService = inject(SettingsService),
    ) => ({
   
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

    loadCurrentPeriod : rxMethod<void>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        switchMap(() => {
          return settingsService.read_by_value('CurrentPeriod').pipe(
            tapResponse({
              next: (period) => {
                patchState(state, { currentPeriod: period });
                localStorage.setItem('currentPeriod', period);
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false  }),
            })
          );
        })
      )
    ),
    
    loadActivePeriods: rxMethod<void>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        switchMap(() => {
          return periodService.getActivePeriods().pipe(            
            tapResponse({
              next: (period) => patchState(state, 
                { 
                  activePeriods: period,
                  isActiveLoaded: true,
                  called: state.called() + 1 
                 }),                
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

    updateCurrentPeriod: rxMethod<string>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        switchMap((value) => {
          return settingsService.update_current_period(value).pipe(
            tapResponse({
              next: (period) => {
                patchState(state, { currentPeriod: period });
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
              finalize: () => patchState(state, { isLoading: false, isLoaded: true}),
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
