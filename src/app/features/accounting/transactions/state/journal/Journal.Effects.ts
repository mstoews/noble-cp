import { Actions, createEffect, ofType } from "@ngrx/effects";
import { JournalService } from "app/services/journal.service";
import { exhaustMap, map, catchError, of } from "rxjs";
import {
  loadJournalHeader,
  loadJournalHeaderFailure,
  loadJournalHeaderSuccess,

  deleteJournalHeader,
  deleteJournalHeaderSuccess,

  addJournalHeader,
  addJournalHeaderSuccess,

  updateJournalHeader,
  updateJournalHeaderSuccess,

  loadJournalDetail,
  
  
  loadJournalDetailSuccess,

  loadJournalHeaderByPeriod,
  loadJournalHeaderByPeriodSuccess,
  loadJournalHeaderByPeriodFailure,

  cloneJournal,
  cloneJournalSuccess,
  cloneJournalFailure,

  emptyAction,

} from "./Journal.Action";
import { inject } from "@angular/core";
import { ToastrService } from "ngx-toastr";


export class journalHeaderEffects {
  private journalService = inject(JournalService);
  private actions = inject(Actions);
  private toastr = inject(ToastrService);

  _loadJournalHeader = createEffect(() =>
    this.actions.pipe(
      ofType(loadJournalHeader),
      exhaustMap(() => {
        return this.journalService.readHttpJournalHeader().pipe(
          map((data) => loadJournalHeaderSuccess({ journals : data })),
          catchError((error) => of(loadJournalHeaderFailure({ error })))
        );
      })
    )
  );

  _cloneJournal = createEffect(() =>
    this.actions.pipe(
      ofType(cloneJournal),
      exhaustMap((action) => {
        return this.journalService.cloneJournalById(action.journal_id).pipe(
          map((data) => cloneJournalSuccess({ journals : data })),
          catchError((error) => of(cloneJournalFailure({ error })))
        );
      })
    )
  );

  _loadJournalHeaderByPeriod = createEffect(() =>
    this.actions.pipe(
      ofType(loadJournalHeaderByPeriod),
      exhaustMap((action) => {
        return this.journalService.getJournalHeaderByPeriod(action.period).pipe(
          map((data) => loadJournalHeaderByPeriodSuccess({ journals : data })),
          catchError((error) => of(loadJournalHeaderByPeriodFailure({ error })))
        );
      })
    )
  );

  _loadJournalDetails = createEffect(() =>
    this.actions.pipe(
      ofType(loadJournalDetail),
      exhaustMap((action) => {
        return this.journalService.getHttpJournalDetails(action.journal_id).pipe(
          map((data) => loadJournalDetailSuccess({ journalDetails: data })),
          catchError((error) => of(loadJournalHeaderFailure({ error })))
        );
      })
    )
  );

  _deleteJournalHeader = createEffect(() =>
    this.actions.pipe(
      ofType(deleteJournalHeader),
      exhaustMap((action) => {
        return this.journalService.deleteJournalHeader(action.id).pipe(
          map(() => deleteJournalHeaderSuccess({ id: action.id })),
          catchError((error) => of(loadJournalHeaderFailure({ error })))
        );
      })
    )
  );

  _addJournalHeader = createEffect(() =>
    this.actions.pipe(
      ofType(addJournalHeader),
      exhaustMap((action) => {
        return this.journalService.createJournalFullHeader( action.journals ).pipe(
          map(() => addJournalHeaderSuccess({ journals: action.journals })),
          catchError((error) => of(loadJournalHeaderFailure({ error })))
        );
      })
    )
  );

  _updateJournalHeader = createEffect(() =>
    this.actions.pipe(
      ofType(updateJournalHeader),
      exhaustMap((action) => {
        return this.journalService.updateJournalHeader(action.journals).pipe(
          map(() => updateJournalHeaderSuccess({ journals: action.journals})),
          catchError((error) => of(loadJournalHeaderFailure({ error })))
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
    return;
  }
}

