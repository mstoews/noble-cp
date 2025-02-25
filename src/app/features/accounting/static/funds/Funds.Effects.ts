import { Actions, createEffect, ofType } from "@ngrx/effects";
import { FundsService } from "app/services/funds.service";
import { exhaustMap, map, catchError, of, concatMap, mergeMap, switchMap } from "rxjs";
import * as fromFunds from "./Funds.Action";
import { inject } from "@angular/core";

export class fundsEffects {

  private fundsService = inject(FundsService);
  private actions = inject(Actions);

  _loadFunds = createEffect(() => this.actions.pipe(
    ofType(fromFunds.loadFunds),
    exhaustMap(() => {
      return this.fundsService.read().pipe(
        map((data) => fromFunds.loadFundsSuccess({ funds: data })),
        catchError((error) => of(fromFunds.loadFundsFailure({ error })))
      )
    })
   ));

   // delete is mergeMap

   _deleteFunds = createEffect(() =>
    this.actions.pipe(
      ofType(fromFunds.deleteFunds),
      mergeMap((action) => {
        return this.fundsService.delete(action.id.toString()).pipe(
          map(() => fromFunds.deleteFundsSuccess({ id: action.id })),
          catchError((error) => of(fromFunds.loadFundsFailure({ error })))
        );
      })
    )
  );

  // creation effect we use concatMap

  _addFunds = createEffect(() =>
    this.actions.pipe(
      ofType(fromFunds.addFunds),
      concatMap((action) => {
        return this.fundsService.create(action.funds).pipe(
          map(() => fromFunds.addFundsSuccess({ funds : action.funds })),
          catchError((error) => of(fromFunds.loadFundsFailure({ error })))
        );
      })
    )
  );

  // update effect we use concatMap
  _updateFunds = createEffect(() =>
    this.actions.pipe(
      ofType(fromFunds.updateFunds),
      exhaustMap((action) => {
        return this.fundsService.update(action.funds).pipe(
          map(() => fromFunds.updateFundsSuccess({ funds: action.funds })),
          catchError((error) => of(fromFunds.loadFundsFailure({ error })))
        );
      })
    )
  );

}
