import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { TeamService } from 'app/services/team.service';
import { teamPageActions } from './actions/team-page.actions';
import { teamAPIActions } from './actions/team.actions';



export const loadTeam = createEffect((
  actions$ = inject(Actions),
  teamService = inject(TeamService)) => {
  return actions$.pipe(
    ofType(teamPageActions.load),
    concatMap(() =>
      teamService.read().pipe(
        map((team) =>
          teamAPIActions.loadTeamSuccess({ team })
        ),
        catchError((error) =>
          of(teamAPIActions.loadTeamFailure({ error }))
        )
      )));
},
  {
    functional: true,
  }
);
