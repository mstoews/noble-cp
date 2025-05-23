import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { accountService } from 'app/services/address.service';
import { accountPageActions } from './actions/address-page.actions';
import { accountAPIActions } from './actions/address.actions';

export class accountEffects {
  actions$ = inject(Actions);
  accountService = inject(AccountsService);


  loadAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(accountPageActions.load),
      concatMap(() =>
        this.accountService.readAccounts().pipe(
          map((accounts) =>
            accountAPIActions.loadAccountsSuccess({ accounts })
          ),
          catchError((error) =>
            of(accountAPIActions.loadAccountsFailure({ error }))
          )
        )
      )
    )
  );

  addAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(accountPageActions.addAccount),
      concatMap(({ account }) =>
        this.accountService.create(account).pipe(
          map((newAccount) =>
            accountAPIActions.accountAddedSuccess({ account: newAccount })
          ),
          catchError((error) =>
            of(accountAPIActions.accountAddedFail({ message: error }))
          )
        )
      )
    )
  );


  updateAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(accountPageActions.updateAccount),
      concatMap(({ account }) =>
        this.accountService.update(account).pipe(
          map(() => accountAPIActions.accountUpdatedSuccess({ account })),
          catchError((error) =>
            of(accountAPIActions.accountUpdatedFail({ message: error }))
          )
        )
      )
    )
  );

  deleteAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(accountPageActions.deleteAccount),
      mergeMap(({ child }) =>
        this.accountService.delete(child.toString())
          .pipe(map(() => accountAPIActions.accountDeletedSuccess()))
      ),
      catchError((error) =>
        of(accountAPIActions.accountDeletedFail({ message: error }))
      )
    )
  );

}
