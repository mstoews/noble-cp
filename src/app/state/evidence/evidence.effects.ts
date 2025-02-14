import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, exhaustAll, exhaustMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { EvidenceService } from 'app/services/evidence.service';

import { artifactsAPIActions } from './actions/evidence.actions';
import { artifactsPageActions } from './actions/evidence-page.actions';

export const loadArtifacts = createEffect((
  actions$ = inject(Actions),
  evidenceService = inject(EvidenceService)) => {
  return actions$.pipe(
    ofType(artifactsPageActions.load),
    concatMap(() =>
      evidenceService.read().pipe(
        map((artifacts) =>
          artifactsAPIActions.loadArtifactsSuccess({ artifacts })
        ),
        catchError((error) =>
          of(artifactsAPIActions.loadArtifactsFailure({ error }))
        ))));
  },
  {
    functional: true,
  }
);



