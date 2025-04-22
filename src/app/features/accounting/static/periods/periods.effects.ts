import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { PeriodsService } from 'app/services/periods.service';
import { periodsPageActions } from './periods-page.actions';
import { periodsAPIActions } from './periods.actions';
import { SettingsService } from 'app/services/settings.service';

export class periodEffects {
  actions$ = inject(Actions);
  periodService = inject(PeriodsService);
  settingsService = inject(SettingsService);


  loadPeriods$ = createEffect(() =>
    this.actions$.pipe(
      ofType(periodsPageActions.load),
      concatMap(() =>
        this.periodService.read().pipe(
          map((periods) =>
            periodsAPIActions.loadPeriodsSuccess({ periods })
          ),
          catchError((error) =>
            of(periodsAPIActions.loadPeriodsFailure({ error }))
          )
        )
      )
    )
  );

  current$ = createEffect(() =>
    this.actions$.pipe(
      ofType(periodsPageActions.current),
      concatMap(() =>
        this.settingsService.read_by_value('CurrentPeriod').pipe(
          map((current) => periodsAPIActions.loadCurrentPeriod({ 
              current: current 
            } ) ),
          catchError((error) =>
            of(periodsAPIActions.loadPeriodsFailure({ error }))
          )
        )
      )
    )
  );


  addPeriod$ = createEffect(() =>
    this.actions$.pipe(
      ofType(periodsPageActions.addPeriod),
      concatMap(({ period }) =>
        this.periodService.create(period).pipe(
          map((period) =>
            periodsAPIActions.periodAddedSuccess({ period })
          ),
          catchError((error) =>
            of(periodsAPIActions.periodAddedFail({ message: error }))
          )
        )
      )
    )
  );

  updatePeriod$ = createEffect(() =>
    this.actions$.pipe(
      ofType(periodsPageActions.updatePeriod),
      concatMap(({ period }) =>
        this.periodService.update(period).pipe(
          map(() => periodsAPIActions.periodUpdatedSuccess({ period })),
          catchError((error) =>
            of(periodsAPIActions.periodUpdatedFail({ message: error }))
          )
        )
      )
    )
  );

  deletePeriod$ = createEffect(() =>
    this.actions$.pipe(
      ofType(periodsPageActions.deletePeriod),
      mergeMap(({ id }) =>
        this.periodService
          .delete(id)
          .pipe(map(() => periodsAPIActions.periodDeletedSuccess({ id })))
      ),
      catchError((error) =>
        of(periodsAPIActions.periodDeletedFail({ message: error }))
      )
    )
  );

}
