import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { SubTypeService } from 'app/services/subtype.service';
import { subtypePageActions } from './actions/sub-type.page.actions';
import { subtypeAPIActions } from './actions/sub-type.actions';



export const loadSubType = createEffect((
  actions$ = inject(Actions),
  subtypeService = inject(SubTypeService)) => {
  return actions$.pipe(
    ofType(subtypePageActions.load),
    concatMap(() =>
      subtypeService.read().pipe(
        map((subtype) =>
          subtypeAPIActions.loadSubTypeSuccess({ subtype })
        ),
        catchError((error) =>
          of(subtypeAPIActions.loadSubTypeFailure({ error }))
        )
      )));
},
  {
    functional: true,
  }
);
