import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { TypeService } from 'app/services/type.service';
import { gltypePageActions } from './actions/gltype.page.actions';
import { gltypeAPIActions } from './actions/gltype.actions';



export const loadType = createEffect((
  actions$ = inject(Actions),
  gltypeService = inject(TypeService)) => {
  return actions$.pipe(
    ofType(gltypePageActions.load),
    concatMap(() =>
      gltypeService.read().pipe(
        map((gltype) =>
          gltypeAPIActions.loadGLTypeSuccess({ gltype })
        ),
        catchError((error) =>
          of(gltypeAPIActions.loadGLTypeFailure({ error }))
        )
      )));
},
  {
    functional: true,
  }
);
