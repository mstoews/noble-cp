import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, exhaustAll, exhaustMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { BudgetService } from 'app/services/budget.service';
import { budgetPageActions } from './actions/budget-page.actions';
import { budgetAPIActions } from './actions/budget.actions';


export const loadBudget = createEffect((
  actions$ = inject(Actions),
  budgetService = inject(BudgetService)) => {
  return actions$.pipe(
    ofType(budgetPageActions.load),
    concatMap(() =>
      budgetService.read().pipe(
        map((budget) =>
          budgetAPIActions.loadBudgetSuccess({ budget })
        ),
        catchError((error) =>
          of(budgetAPIActions.loadBudgetFailure({ error }))
        )
      )));
  },
  {
    functional: true,
  }
);


export const deleteBudget = createEffect((
  actions$ = inject(Actions),
  budgetService = inject(BudgetService)) => {
  return actions$.pipe(
    ofType(budgetPageActions.delete),
    exhaustMap((child) =>
      budgetService.delete(child.child).pipe(
        map((budget) =>
          budgetAPIActions.deleteBudgetSuccess({ child: budget.child } )
        ),
        catchError((error) =>
          of(budgetAPIActions.deleteBudgetFailure({ error }))
        )
      )));
  },
  {
    functional: true,
  }
);
