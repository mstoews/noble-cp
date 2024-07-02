import {
    patchState,
    signalStore,
    withComputed,
    withHooks,
    withMethods,
    withState,
  } from '@ngrx/signals';
  
  import { rxMethod } from '@ngrx/signals/rxjs-interop';
  import { exhaustMap, pipe, shareReplay, switchMap, tap } from 'rxjs';
  import { computed, inject } from '@angular/core';
  import { DistributionLedgerService } from './distribution.ledger.service'
  import { tapResponse } from '@ngrx/operators';
  import { IDistributionLedger, IDistributionLedgerReport } from 'app/models';
  
  export interface IDistributionParams {
    period : number,
    period_year: number

  }

  export interface IJournalParams {
    account: number,
    child: number,
    period: number,
    period_year: number
  }
  
  export interface DistributionStateInterface {
    header: IDistributionLedger[];
    details: IDistributionLedgerReport[],
    isLoading: boolean;
    error: string | null;
    accountCount: number;
  }
  
  export const KanbanStore = signalStore(
    withState<DistributionStateInterface>({
      header: [],
      details: [],
      error: null,
      isLoading: false,
      accountCount: 0
    }),
    withComputed((state) => ({
      tasksCount: computed(() => state.header().length),      
    })),
    withMethods((state, distributionService = inject(DistributionLedgerService)) => ({             
      loadHeader: rxMethod<void>(
        pipe(
          tap(() => patchState(state, { isLoading: true })),
          exhaustMap(() => {
            return distributionService.getDistributionReportByPrdAndYear(1, 2024).pipe(
              tapResponse({
                next: (header) => patchState(state, { header: header }),
                error: console.error,
                finalize: () => patchState(state, { isLoading: false }),
              })
            );
          })
        )
      ),
      loadDetail: rxMethod<void>(
        pipe(
          tap(() => patchState(state, { isLoading: true })),
          exhaustMap(() => {
            return kanbanService.getTasks().pipe(
              tapResponse({
                next: (tasks) => patchState(state, { tasks: tasks }),
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
        store.loadTasks();
        store.loadPriority();
      },
    })
  );
  