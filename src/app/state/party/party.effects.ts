import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { PartyService } from 'app/services/party.service';
import { partyPageActions } from './actions/party-page.actions';
import { partyAPIActions } from './actions/party.actions';



export const loadParty = createEffect((
  actions$ = inject(Actions),
  partyService = inject(PartyService)) => {
  return actions$.pipe(
    ofType(partyPageActions.load),
    concatMap(() =>
      partyService.read().pipe(
        map((party) =>
          partyAPIActions.loadPartySuccess({ party })
        ),
        catchError((error) =>
          of(partyAPIActions.loadPartyFailure({ error }))
        )
      )));
},
  {
    functional: true,
  }
);
