import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "app/services/user.service";
import { exhaustMap, map, catchError, of } from "rxjs";
import {
  loadUsers,
  loadUsersFailure,
  loadUsersSuccess,
  deleteUsers,
  deleteUsersSuccess,
  addUsers,
  addUsersSuccess,
  updateUsers,
  updateUsersSuccess,
  emptyAction,
} from "./Users.Action";

import { inject } from "@angular/core";
import { ToastrService } from "ngx-toastr";

export class userEffects {
private userService = inject(UserService);
private actions = inject(Actions);
private toastr = inject(ToastrService);

  _loadUsers = createEffect(() =>
    this.actions.pipe(
      ofType(loadUsers),
      exhaustMap(() => {
        return this.userService.read().pipe(
          map((data) => loadUsersSuccess({ user: data })),
          catchError((error) => of(loadUsersFailure({ error })))
        );
      })
    )
  );

  _deleteUsers = createEffect(() =>
    this.actions.pipe(
      ofType(deleteUsers),
      exhaustMap((action) => {
        return this.userService.delete(action.id.toString()).pipe(
          map(() => deleteUsersSuccess({ id: action.id })),
          catchError((error) => of(loadUsersFailure({ error })))
        );
      })
    )
  );

  _addUsers = createEffect(() =>
    this.actions.pipe(
      ofType(addUsers),
      exhaustMap((action) => {
        return this.userService.create(action.user).pipe(
          map(() => addUsersSuccess({ user: action.user })),
          catchError((error) => of(loadUsersFailure({ error })))
        );
      })
    )
  );

  _updateUsers = createEffect(() =>
    this.actions.pipe(
      ofType(updateUsers),
      exhaustMap((action) => {
        return this.userService.update(action.user).pipe(
          map(() => updateUsersSuccess({ user: action.user })),
          catchError((error) => of(loadUsersFailure({ error })))
        );
      })
    )
  );

  ShowAlert(message: string, response: string) {
    if (response == "pass") {
      this.toastr.success(message);
    } else {
      this.toastr.error(message);
    }
    return emptyAction();
  }
}
