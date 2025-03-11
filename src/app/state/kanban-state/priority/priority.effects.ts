import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { priorityAPIActions } from './actions/priority.actions';
import { KanbanService } from 'app/features/kanban/kanban.service';
import { priorityPageActions } from './actions/priority-page.actions';

export const loadPriorities = createEffect(
  (
    actions$ = inject(Actions),
    kanbanService = inject(KanbanService)) => {
    return actions$.pipe(
      ofType(priorityPageActions.load),
      concatMap(() =>
        kanbanService.httpReadPriority().pipe(        
          map((priorities) =>
            priorityAPIActions.loadPrioritiesSuccess({ priorities })
          ),
          catchError((error) =>
            of(priorityAPIActions.loadPrioritiesFailure({ error }))
          )
        )
      )
    );
  },
  {
    functional: true,
  }
);
