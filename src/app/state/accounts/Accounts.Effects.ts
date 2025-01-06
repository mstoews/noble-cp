import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AccountsService } from "app/services/accounts.service";
import { exhaustMap, map, catchError, of } from "rxjs";
import {
  loadAccounts,
  loadAccountsFailure,
  loadAccountsSuccess,
  addAccounts,
  addAccountsSuccess,
  updateAccounts,
  updateAccountsSuccess,
  deleteAccountsSuccess,
  deleteAccounts,
  emptyAction
} from "./Accounts.Action";
import { inject } from "@angular/core";
import { ToastrService } from "ngx-toastr";

export class accountEffects {
  private accountsService = inject(AccountsService);
  private actions = inject(Actions);
  private toastr = inject(ToastrService);

  _loadAccounts = createEffect(() =>
    this.actions.pipe(
      ofType(loadAccounts),
      exhaustMap(() => {
        return this.accountsService.readAccounts().pipe(
          map((data) => loadAccountsSuccess({ accounts: data })),
          catchError((error) => of(loadAccountsFailure({ error })))
        );
      })
    )
  );

  _deleteAccounts = createEffect(() =>
    this.actions.pipe(
      ofType(deleteAccounts),
      exhaustMap((action) => {
        return this.accountsService.delete(action.id.toString()).pipe(
          map(() => deleteAccountsSuccess({ id: action.id })),
          catchError((error) => of(loadAccountsFailure({ error })))
        );
      })
    )
  );

  _addAccounts = createEffect(() =>
    this.actions.pipe(
      ofType(addAccounts),
      exhaustMap((action) => {
        return this.accountsService.create(action.account).pipe(
          map(() => addAccountsSuccess({ account: action.account })),
          catchError((error) => of(loadAccountsFailure({ error })))
        );
      })
    )
  );

  _updateAccounts = createEffect(() =>
    this.actions.pipe(
      ofType(updateAccounts),
      exhaustMap((action) => {
        return this.accountsService.update(action.account).pipe(
          map(() => updateAccountsSuccess({ account: action.account })),
          catchError((error) => of(loadAccountsFailure({ error })))
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
