import { Actions, createEffect, ofType } from "@ngrx/effects";
import { FundsService } from "app/services/funds.service";
import { exhaustMap, map, catchError, of, concatMap, mergeMap, switchMap } from "rxjs";
import { deleteFunds, loadFunds, loadFundsFailure, loadFundsSuccess, deleteFundsSuccess, updateFundsSuccess, updateFunds, addFunds, addFundsSuccess } from "./Funds.Action";
import { inject } from "@angular/core";

export class fundsEffects {

  private fundsService = inject(FundsService);
  private actions = inject(Actions);

  _loadFunds = createEffect(() => this.actions.pipe(
    ofType(loadFunds),
    exhaustMap(() => {
      return this.fundsService.read().pipe(
        map((data) => loadFundsSuccess({ funds: data })),
        catchError((error) => of(loadFundsFailure({ error })))
      )
    })
   ));

   // delete is mergeMap

   _deleteFunds = createEffect(() =>
    this.actions.pipe(
      ofType(deleteFunds),
      mergeMap((action) => {
        return this.fundsService.delete(action.id.toString()).pipe(
          map(() => deleteFundsSuccess({ id: action.id })),
          catchError((error) => of(loadFundsFailure({ error })))
        );
      })
    )
  );

  // creation effect we use concatMap

  _addFunds = createEffect(() =>
    this.actions.pipe(
      ofType(addFunds),
      concatMap((action) => {
        return this.fundsService.create(action.funds).pipe(
          map(() => addFundsSuccess({ funds : action.funds })),
          catchError((error) => of(loadFundsFailure({ error })))
        );
      })
    )
  );

  // update effect we use concatMap
  _updateFunds = createEffect(() =>
    this.actions.pipe(
      ofType(updateFunds),
      concatMap((action) => {
        return this.fundsService.update(action.funds).pipe(
          map(() => updateFundsSuccess({ funds: action.funds })),
          catchError((error) => of(loadFundsFailure({ error })))
        );
      })
    )
  );

}
