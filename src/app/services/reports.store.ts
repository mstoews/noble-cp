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
  import { ReportService } from './reports.service';
  import { ITBParams } from 'app/models/journals';
import { GridSettingsService, IGridSettingsModel } from './grid.settings.service';
  
  
  export interface ReportStateInterface {
    tb: ITrialBalance[];
    settings: IGridSettingsModel[];
    isLoading: boolean;
    error: string | null;    
  }
  
  export const ReportStore = signalStore( { protectedState: false }, 
     withState<ReportStateInterface>({
      tb: [],
      settings: [],
      error: null,
      isLoading: false,
    }),
    withComputed((state) => ({ })),
        withMethods((state, 
          reportService = inject(ReportService),
          settingsService = inject(GridSettingsService),
        ) => ({     
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
        store.loadSettings();
      },
    }) 
  );

