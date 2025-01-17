import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AccountsService } from "app/services/accounts.service";
import { exhaustMap, map, catchError, of } from "rxjs";
import * as  AccountActions  from  "./Accounts.Action";
import { inject } from "@angular/core";
import { ToastrService } from "ngx-toastr";

export class accountEffects {
  private accountsService = inject(AccountsService);
  private actions = inject(Actions);
  private toastr = inject(ToastrService);

  _loadAccounts = createEffect(() =>
    this.actions.pipe(
      ofType(AccountActions.loadAccounts),
      exhaustMap(() => {
        return this.accountsService.readAccounts().pipe(
          map((data) => AccountActions.loadAccountsSuccess({ accounts: data })),
          catchError((error) => of(AccountActions.loadAccountsFailure({ error })))
        );
      })
    )
  );


  _deleteAccounts = createEffect(() =>
    this.actions.pipe(
      ofType(AccountActions.deleteAccount),
      exhaustMap((action) => {
        return this.accountsService.delete(action.id.toString()).pipe(
          map(() => AccountActions.deleteAccountsSuccess({ id: action.id })),
          catchError((error) => of(AccountActions.loadAccountsFailure({ error })))
        );
      })
    )
  );

  _addAccounts = createEffect(() =>
    this.actions.pipe(
      ofType(AccountActions.addAccounts),
      exhaustMap((action) => {
        return this.accountsService.create(action.account).pipe(
          map(() => AccountActions.addAccountsSuccess({ account: action.account })),
          catchError((error) => of(AccountActions.loadAccountsFailure({ error })))
        );
      })
    )
  );

  _updateAccounts = createEffect(() =>
    this.actions.pipe(
      ofType(AccountActions.updateAccounts),
      exhaustMap((action) => {
        return this.accountsService.update(action.account).pipe(
          map(() => AccountActions.updateAccountsSuccess({ account: action.account })),
          catchError((error) => of(AccountActions.loadAccountsFailure({ error })))
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
    return AccountActions.emptyAction();
  }
}
