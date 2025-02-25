import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { PeriodsService } from 'app/services/periods.service';
import { periodsPageActions } from './actions/roles-page.actions';
import { periodsAPIActions } from './actions/roles.actions';



export const loadPeriods = createEffect((
  actions$ = inject(Actions),
  periodsService = inject(PeriodsService)) => {
  return actions$.pipe(
    ofType(periodsPageActions.load),
    concatMap(() =>
      periodsService.read().pipe(
        map((periods) =>
          periodsAPIActions.loadPeriodsSuccess({ periods })
        ),
        catchError((error) =>
          of(periodsAPIActions.loadPeriodsFailure({ error }))
        )
      )));
},
  {
    functional: true,
  }
);
