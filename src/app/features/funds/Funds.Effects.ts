import { Actions, createEffect, ofType } from "@ngrx/effects";
import { FundsService } from "app/services/funds.service";
import { exhaustMap, map, catchError, of } from "rxjs";
import { deleteFunds, loadFunds, loadFundsFailure, loadFundsSuccess, deleteFundsSuccess, updateFundsSuccess, updateFunds, addFunds, addFundsSuccess } from "./Funds.Action";
import { inject } from "@angular/core";

export class fundsEffects {

  private fundsService = inject(FundsService);
  private actions = inject(Actions);

  _loadFunds = createEffect(() => this.actions.pipe(
    ofType(loadFunds),
    exhaustMap(() => {
      return this.fundsService.read().pipe(
        map((data) => loadFundsSuccess({ list: data })),
        catchError((error) => of(loadFundsFailure({ error })))
      )
    })
   ));

   _deleteFunds = createEffect(() =>
    this.actions.pipe(
      ofType(deleteFunds),
      exhaustMap((action) => {
        return this.fundsService.delete(action.id.toString()).pipe(
          map(() => deleteFundsSuccess({ id: action.id })),
          catchError((error) => of(loadFundsFailure({ error })))
        );
      })
    )
  );

  _addFunds = createEffect(() =>
    this.actions.pipe(
      ofType(addFunds),
      exhaustMap((action) => {
        return this.fundsService.create(action.funds).pipe(
          map(() => addFundsSuccess({ funds : action.funds })),
          catchError((error) => of(loadFundsFailure({ error })))
        );
      })
    )
  );

  _updateFunds = createEffect(() =>
    this.actions.pipe(
      ofType(updateFunds),
      exhaustMap((action) => {
        return this.fundsService.update(action.funds).pipe(
          map(() => updateFundsSuccess({ funds: action.funds })),
          catchError((error) => of(loadFundsFailure({ error })))
        );
      })
    )
  );

}
