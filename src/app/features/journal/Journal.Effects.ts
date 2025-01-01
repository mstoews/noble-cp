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
  
  emptyAction,
  loadJournalDetailSuccess
} from "./Journal.Action";
import { inject } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { tapResponse } from "@ngrx/operators";

export class journalHeaderEffects {
  private journalService = inject(JournalService);
  private actions = inject(Actions);
  private toastr = inject(ToastrService);

  _loadJournalHeader = createEffect(() =>
    this.actions.pipe(
      ofType(loadJournalHeader),
      exhaustMap(() => {
        return this.journalService.readHttpJournalHeader().pipe(
          map((data) => loadJournalHeaderSuccess({ journal_headers: data })),
          catchError((error) => of(loadJournalHeaderFailure({ error })))
        );
      })
    )
  );

  _loadJournalDetails = createEffect(() =>
    this.actions.pipe(
      ofType(loadJournalDetail),
      exhaustMap((action) => {
        return this.journalService.getHttpJournalDetails(action.journal_id).pipe(
          map((data) => loadJournalDetailSuccess({ journal_details: data })),
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
        return this.journalService.createJournalHeader( action.journal_header ).pipe(
          map(() => addJournalHeaderSuccess({ journal_header: action.journal_header })),
          catchError((error) => of(loadJournalHeaderFailure({ error })))
        );
      })
    )
  );

  _updateJournalHeader = createEffect(() =>
    this.actions.pipe(
      ofType(updateJournalHeader),
      exhaustMap((action) => {
        return this.journalService.updateJournalHeader(action.journal_header).pipe(
          map(() => updateJournalHeaderSuccess({ journal_header: action.journal_header })),
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
    return emptyAction();
  }
}
function switchMap(arg0: (action: any) => import("rxjs").Observable<({ journal_headers: import("../../models/journals").IJournalHeader[]; } & import("@ngrx/store").Action<"[journal_headers] getall success">) | ({ error: string; } & import("@ngrx/store").Action<"[journal_headers] getall failure">) >): import("rxjs").OperatorFunction<import("@ngrx/store").Action<"[journal_headers] getall">, unknown> {
  throw new Error("Function not implemented.");
}

