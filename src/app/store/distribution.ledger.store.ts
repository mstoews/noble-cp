import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { inject } from '@angular/core';
import { DistributionLedgerService } from '../services/distribution.ledger.service'
import { tapResponse } from '@ngrx/operators';
import { IDistributionLedger, IDistributionParams, IJournalParams, IJournalSummary } from 'app/models';


export interface DistributionStateInterface {
  header: IDistributionLedger[];
  details: IJournalSummary[],
  periodParam: IDistributionParams,
  accountParam: IJournalParams,
  isLoading: boolean;
  error: string | null;
  accountCount: number;
}

export const TrialBalanceStore = signalStore(
  { protectedState: false }, 
    withState<DistributionStateInterface>({
    header: [],
    details: [],
    periodParam: { period: 1, period_year: 2025 },
    accountParam: null,
    error: null,
    isLoading: false,
    accountCount: 0
  }),

  withMethods((state, distributionService = inject(DistributionLedgerService)) => ({
    loadHeader: rxMethod<IDistributionParams>(
      pipe(
        switchMap((value) => {
          return distributionService.getDistributionReportByPrdAndYear(value).pipe(
            tapResponse({
              next: (header) => patchState(state, { header: header }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    loadDetail: rxMethod<IJournalParams>(
      pipe(
        switchMap((value) => {
          return distributionService.getDistributionJournalsByChild(value).pipe(
            tapResponse({
              next: (detail) => patchState(state, { details: detail }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    loadJournals: rxMethod<IDistributionParams>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        switchMap((value) => {
          return distributionService.getDistributionJournalsByPeriod(value).pipe(
            tapResponse({
              next: (tasks) => patchState(state, { details: tasks }),
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
    },
  })
);
