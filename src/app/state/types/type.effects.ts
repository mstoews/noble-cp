import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { TypeService } from 'app/services/type.service';
import { typePageActions } from './actions/type-page.actions';
import { typeAPIActions } from './actions/type.actions';



export const loadType = createEffect((
  actions$ = inject(Actions),
  typeService = inject(TypeService)) => {
  return actions$.pipe(
    ofType(typePageActions.load),
    concatMap(() =>
      typeService.read().pipe(
        map((transaction) =>
          typeAPIActions.loadTypeSuccess({ transaction_type : transaction })
        ),
        catchError((error) =>
          of(typeAPIActions.loadTypeFailure({ error }))
        )
      )));
},
  {
    functional: true,
  }
);
