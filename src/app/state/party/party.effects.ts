import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { PartyService } from 'app/services/party.service';
import { partyPageActions } from './actions/party-page.actions';
import { partyAPIActions } from './actions/party.actions';


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

  updateParty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(partyPageActions.updateParty),
      concatMap(({ party }) =>
        this.partyService.update(party).pipe(
          map(() => partyAPIActions.partyUpdatedSuccess({ party })),
          catchError((error) =>
            of(partyAPIActions.partyUpdatedFail({ message: error }))
          )
        )
      )
    )
  );


  deleteParty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(partyPageActions.deleteParty),
      concatMap(({ id }) =>
        this.partyService.delete(id).pipe(
          map(() => partyAPIActions.partyDeletedSuccess({ id })),
          catchError((error) =>
            of(partyAPIActions.partyDeletedFail({ message: error }))
          )
        )
      )
    )
  );
 
}

