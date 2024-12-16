import {
    patchState,
    signalStore,
    withComputed,
    withMethods,
    withState,
    withHooks,
  } from '@ngrx/signals';
  
  import { rxMethod } from '@ngrx/signals/rxjs-interop';
  import { pipe, switchMap, tap } from 'rxjs';
  import { inject } from '@angular/core';
  import { tapResponse } from '@ngrx/operators';
  import { ITrialBalance } from 'app/models';
  import { ReportService } from './reports.service';
  import { ITBParams } from 'app/models/journals';
  
  
  export interface ReportStateInterface {
    tb: ITrialBalance[];
    isLoading: boolean;
    error: string | null;    
  }
  
  export const ReportStore = signalStore( { protectedState: false }, 
     withState<ReportStateInterface>({
      tb: [],
      error: null,
      isLoading: false,
    }),
    withComputed((state) => ({ })),
        withMethods((state, reportService = inject(ReportService)) => ({     
        loadTB: rxMethod<ITBParams>(
            pipe(
            tap(() => patchState(state, { isLoading: true })),
            switchMap((value) => {
                return reportService.readTbByPeriod(value).pipe(
                tapResponse({
                    next: (tb) => patchState(state, { tb: tb }),
                    error: console.error,
                    finalize: () => patchState(state, { isLoading: false }),
                }));
            }))
        ),
    })),
    withHooks({
      onInit(store) {        
        // store.loadTB({ period: 1, year: 2024 });
      },
    }) 
  );

