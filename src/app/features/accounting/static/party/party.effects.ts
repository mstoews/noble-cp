import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { PartyService } from 'app/services/party.service';
import { partyPageActions } from './party-page.actions';
import { partyAPIActions } from './party.actions';


export class partyEffects {
  actions$ = inject(Actions);
  partyService = inject(PartyService);

  loadParty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(partyPageActions.load),
      concatMap(() =>
        this.partyService.read().pipe(
          map((party) =>
            partyAPIActions.loadPartySuccess({ party })
          ),
          catchError((error) =>
            of(partyAPIActions.loadPartyFailure({ error }))
          )
        )
      )
    )
  );

  addParty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(partyPageActions.addParty),
      concatMap(({ party }) =>
        this.partyService.create(party).pipe(
          map((party) =>
            partyAPIActions.partyAddedSuccess({ party })
          ),
          catchError((error) =>
            of(partyAPIActions.partyAddedFail({ message: error }))
          )
        )
      )
    )
  );

  _updateParty = createEffect(() =>
    this.actions$.pipe(
      ofType(partyPageActions.updateParty),
      concatMap(({ party }) =>
        this.partyService.update(party).pipe(
          map(() => partyAPIActions.partyUpdatedSuccess({ party })),
          catchError((message) => of(partyAPIActions.partyUpdatedFail({ message }))
          )
        )
      )
    )
  );


  deleteParty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(partyPageActions.deleteParty),
      concatMap(({ party }) =>
        this.partyService.delete(party).pipe(
          map(() => partyAPIActions.partyDeletedSuccess({ id: party })),
          catchError((error) => of(partyAPIActions.partyDeletedFail({ message: error }))           
          )
        )
      )
    )
  );

}

