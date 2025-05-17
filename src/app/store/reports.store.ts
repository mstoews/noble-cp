import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
  withHooks,
} from '@ngrx/signals';

import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { concatMap, pipe, switchMap, tap } from 'rxjs';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { ITrialBalance } from 'app/models';
import { ReportService } from '../services/reports.service';
import { ITBParams, ITBStartEndDate } from 'app/models/journals';
import { GridSettingsService, IGridSettingsModel } from '../services/grid.settings.service';
import { IDataSet } from '@syncfusion/ej2-angular-pivotview';


export interface ReportStateInterface {
  tb: any[];
  settings: IGridSettingsModel[];
  isLoading: boolean;
  isLoaded: boolean;
  isSettingsLoaded: boolean;
  error: string | null;
}

export const ReportStore = signalStore(
  { providedIn: 'root' },
  withState<ReportStateInterface>({
    tb: [],    
    settings: [],
    error: null,
    isLoading: false,
    isLoaded: false,
    isSettingsLoaded: false,
  }),
  withComputed((state) => ({})),
  withMethods((state,
    reportService = inject(ReportService),
    settingsService = inject(GridSettingsService), ) => ({
    loadTB: rxMethod<ITBParams>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        concatMap((value) => {
          return reportService.readTbByPeriod(value).pipe(
            tapResponse({
              next: (tb) => patchState(state, { tb: tb }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            }));
        }))
    ),

    loadTBByStartAndEndDate: rxMethod<ITBStartEndDate>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        concatMap((value) => {
          return reportService.readTBByStartAndEndDate(value).pipe(
            tapResponse({
              next: (tb) => patchState(state, { tb: tb }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            }));
        }))
    ),

    loadSettings: rxMethod<void>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        switchMap((value) => {
          return settingsService.readAll().pipe(
            tapResponse({
              next: (setting) => patchState(state, { settings: setting }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            }));
        }))
    ),
  })),
  withHooks({
    onInit(store) {
      if (store.isLoaded() === false) {
        store.loadTB({ period: 1, year: 2025 });
      }
      if (store.isSettingsLoaded() === false) {        
      store.loadSettings();
      }
      
    },
  })
);

