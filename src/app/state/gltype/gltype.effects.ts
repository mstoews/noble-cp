import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, withLatestFrom, filter, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TypeService } from 'app/services/type.service';
import { glTypePageActions } from './gltype.page.actions';
import { glTypeAPIActions } from './gltype.actions';
import { Store } from '@ngrx/store';
import { take } from 'lodash';

export class glTypeEffects {

  store = inject(Store);

  loadType = createEffect((
    actions$ = inject(Actions),
    gltypeService = inject(TypeService)) => {
    return actions$.pipe(
      ofType(glTypePageActions.load),            
      switchMap(() =>
        gltypeService.read().pipe(
          map((gltype) =>
            glTypeAPIActions.loadGLTypeSuccess({ gltype })
          ),
          catchError((error) =>
            of(glTypeAPIActions.loadGLTypeFailure({ error }))
          )
        )));
  });


  addType = createEffect((
    actions$ = inject(Actions),
    gltypeService = inject(TypeService)) => {
    return actions$.pipe(
      ofType(glTypePageActions.add),
      concatMap(({ gltype }) =>
        gltypeService.create(gltype).pipe(
          map((gltype) =>
            glTypeAPIActions.gLTypeAddedSuccess({ gltype })
          ),
          catchError((error) =>
            of(glTypeAPIActions.gLTypeAddedFail({ message: error }))
          )
        )));
  });


  updateType = createEffect((
    actions$ = inject(Actions),
    gltypeService = inject(TypeService)) => {
    return actions$.pipe(
      ofType(glTypePageActions.update),
      concatMap(({ gltype }) =>
        gltypeService.update(gltype).pipe(
          map(() => glTypeAPIActions.gLTypeUpdatedSuccess({ gltype })),
          catchError((error) =>
            of(glTypeAPIActions.gLTypeUpdatedFail({ message: error }))
          )
        )));
  });



  deleteType = createEffect((
    actions$ = inject(Actions),
    gltypeService = inject(TypeService)) => {
    return actions$.pipe(
      ofType(glTypePageActions.delete),            
      concatMap(({ gltype }) =>
        gltypeService.delete(gltype).pipe(
          map(() => glTypeAPIActions.gLTypeDeletedSuccess({ gltype })),
          catchError((error) =>
            of(glTypeAPIActions.gLTypeDeletedFail({ message: error }))
          )
        )));
  });

}




