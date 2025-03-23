import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ImageItemIndexService } from "app/services/image-item-index.service";
import { exhaustMap, map, catchError, of, concatMap, mergeMap, switchMap } from "rxjs";
import * as fromImages from "./Images.Action";
import { inject } from "@angular/core";

export class fundsEffects {

  private imageItemIndexService = inject(ImageItemIndexService);
  private actions = inject(Actions);

  _loadFunds = createEffect(() => this.actions.pipe(
    ofType(fromImages.loadImage),
    exhaustMap(() => {
      return this.imageItemIndexService.getAll().pipe(
        map((data) => fromImages.loadImageSuccess({ images : data })),
        catchError((error) => of(fromImages.loadImageFailure({ error })))
      )
    })
  ));
  
  // delete is mergeMap

  // _deleteFunds = createEffect(() =>
  //   this.actions.pipe(
  //     ofType(fromImages.deleteImage),
  //     mergeMap((action) => {
  //       return this.imageItemIndexService.delete(action.id).pipe(
  //         map(() => fromImages.deleteImageSuccess({ id: action.id })),
  //         catchError((error) => of(fromImages.loadImageFailure({ error })))
  //       );
  //     })
  //   )
  // );

  // creation effect we use concatMap

  // _addFunds = createEffect(() =>
  //   this.actions.pipe(
  //     ofType(fromFunds.addFunds),
  //     concatMap((action) => {
  //       return this.fundsService.create(action.funds).pipe(
  //         map(() => fromFunds.addFundsSuccess({ funds: action.funds })),
  //         catchError((error) => of(fromFunds.loadFundsFailure({ error })))
  //       );
  //     })
  //   )
  // );

  // update effect we use concatMap
  // _updateFunds = createEffect(() =>
  //   this.actions.pipe(
  //     ofType(fromFunds.updateFunds),
  //     exhaustMap((action) => {
  //       return this.fundsService.update(action.funds).pipe(
  //         map(() => fromFunds.updateFundsSuccess({ funds: action.funds })),
  //         catchError((error) => of(fromFunds.loadFundsFailure({ error })))
  //       );
  //     })
  //   )
  // );

}
