import { Actions, createEffect, ofType } from "@ngrx/effects";
import { JournalService } from "app/services/journal.service";
import { exhaustMap, map, catchError, of } from "rxjs";
import { JournalActions } from "./JournalTransactions.Action";
import { inject } from "@angular/core";
import { ToastrService } from "ngx-toastr";


export class journalTransactionEffects {
  private journalService = inject(JournalService);
  private actions = inject(Actions);
  private toastr = inject(ToastrService);

  _loadJournalHeader = createEffect(() =>
    this.actions.pipe(
      ofType(JournalActions.loadJournal),
      exhaustMap((action) => {
        return this.journalService.readJournalTransactions(action.period).pipe(
          map((data) => JournalActions.loadJournalSuccess({ transactions: data })),
          catchError((error) => of(JournalActions.loadJournalFailure({ error })))
        );
      })
    )
  );

  // _loadUpdateHeader = createEffect(() =>
  //   this.actions.pipe(
  //     ofType(JournalActions.updateJournal),
  //     exhaustMap((action) => {
  //       return this.journalService.updateJournalHeader(action.transactions).pipe(
  //         map((data) => JournalActions.loadJournalSuccess({ transactions: data })),
  //         catchError((error) => of(JournalActions.loadJournalFailure({ error })))
  //       );
  //     })
  //   )
  // );

  // _cloneJournal = createEffect(() =>
  //   this.actions.pipe(
  //     ofType(cloneJournal),
  //     exhaustMap((action) => {
  //       return this.journalService.cloneJournalById(action.journal_id).pipe(
  //         map((data) => cloneJournalSuccess({ journals : data })),
  //         catchError((error) => of(cloneJournalFailure({ error })))
  //       );
  //     })
  //   )
  // );

  // _loadJournalHeaderByPeriod = createEffect(() =>
  //   this.actions.pipe(
  //     ofType(loadJournalHeaderByPeriod),
  //     exhaustMap((action) => {
  //       return this.journalService.getJournalHeaderByPeriod(action.period).pipe(
  //         map((data) => loadJournalHeaderByPeriodSuccess({ journals : data })),
  //         catchError((error) => of(loadJournalHeaderByPeriodFailure({ error })))
  //       );
  //     })
  //   )
  // );

  // _deleteJournalHeader = createEffect(() =>
  //   this.actions.pipe(
  //     ofType(deleteJournalHeader),
  //     exhaustMap((action) => {
  //       return this.journalService.deleteJournalHeader(action.id).pipe(
  //         map(() => deleteJournalHeaderSuccess({ id: action.id })),
  //         catchError((error) => of(loadJournalHeaderFailure({ error })))
  //       );
  //     })
  //   )
  // );

  // _addJournalHeader = createEffect(() =>
  //   this.actions.pipe(
  //     ofType(addJournalHeader),
  //     exhaustMap((action) => {
  //       return this.journalService.createJournalFullHeader( action.journals ).pipe(
  //         map(() => addJournalHeaderSuccess({ journals: action.journals })),
  //         catchError((error) => of(loadJournalHeaderFailure({ error })))
  //       );
  //     })
  //   )
  // );

  // _updateJournalHeader = createEffect(() =>
  //   this.actions.pipe(
  //     ofType(updateJournalHeader),
  //     exhaustMap((action) => {
  //       return this.journalService.updateJournalHeader(action.journals).pipe(
  //         map(() => updateJournalHeaderSuccess({ journals: action.journals})),
  //         catchError((error) => of(loadJournalHeaderFailure({ error })))
  //       );
  //     })
  //   )
  // );

  ShowAlert(message: string, response: string) {
    if (response == "pass") {
      this.toastr.success(message);
    } else {
      this.toastr.error(message);
    }
    return;
  }
}

