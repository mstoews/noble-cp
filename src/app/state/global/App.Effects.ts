import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { pipe, exhaustMap, map } from "rxjs"
import { EmptyAction, ShowAlert } from "./App.Action";

@Injectable()
export class AppEffects {

    constructor(private action$: Actions, private _snackbar: MatSnackBar) {

    }

    _ShowAlert = createEffect(() =>
        this.action$.pipe(
            ofType(ShowAlert),
            exhaustMap(action => {
                return this.ShowSnackbarAlert(action.message, action.actionResult)
                    .afterDismissed()
                    .pipe(
                        map(() => {
                            return EmptyAction();
                        })
                    )
            })
        )
    );

    ShowSnackbarAlert(message: string, actionResult: string = 'fail') {
        let _class = actionResult == 'pass' ? 'green-snackbar' : 'red-snackbar'
        return this._snackbar.open(message, 'OK', {
            verticalPosition: 'top',
            horizontalPosition: 'end',
            panelClass: [_class],
            duration: 5000
        })
    }

}
