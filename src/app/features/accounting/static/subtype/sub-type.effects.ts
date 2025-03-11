import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { SubTypeService } from 'app/services/subtype.service';
import { subTypePageActions } from './sub-type-page.actions';
import { subTypeAPIActions } from './sub-type.actions';



export class subTypeEffects {
  actions$ = inject(Actions);
  subTypeService = inject(SubTypeService);

  loadSubType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(subTypePageActions.load),
      concatMap(() =>
        this.subTypeService.read().pipe(
          map((subtype) =>
            subTypeAPIActions.subTypeLoadSuccess({ subtype })
          ),
          catchError((error) =>
            of(subTypeAPIActions.subTypeLoadFailure({ error }))
          )
        )
      )
    )
  );

  loadSubTypeDropdown$ = createEffect(() =>
    this.actions$.pipe(
      ofType(subTypePageActions.load),
      concatMap(() =>
        this.subTypeService.read_dropdown().pipe(
          map((subtype) =>
            subTypeAPIActions.subTypeDropdownSuccess({ subtype: subtype })
          ),
          catchError((error) =>
            of(subTypeAPIActions.subTypeDropdownFailure({ error }))
          )
        )
      )
    )
  );


  addSubType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(subTypePageActions.addSubtype),
      concatMap(({ subtype }) =>
        this.subTypeService.create(subtype).pipe(
          map((subType) =>
            subTypeAPIActions.subTypeAddedSuccess({ subtype })
          ),
          catchError((error) =>
            of(subTypeAPIActions.subTypeAddedFail({ message: error }))
          )
        )
      )
    )
  );

  updateType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(subTypePageActions.updateSubtype),
      concatMap(({ subtype }) =>
        this.subTypeService.update(subtype).pipe(
          map(() => subTypeAPIActions.subTypeUpdatedSuccess({ subtype })),
          catchError((error) =>
            of(subTypeAPIActions.subTypeUpdatedFail({ message: error }))
          )
        )
      )
    )
  );

  deleteType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(subTypePageActions.deleteSubtype),
      concatMap(({ id }) =>
        this.subTypeService.delete(id)
          .pipe(map(() => subTypeAPIActions.subTypeDeletedSuccess({ id })))
      ),
      catchError((error) =>
        of(subTypeAPIActions.subTypeDeletedFail({ message: error }))
      )
    )
  );

}
