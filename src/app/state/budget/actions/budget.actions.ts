import { createActionGroup, props } from '@ngrx/store';
import { IBudget } from 'app/models';

export const budgetAPIActions = createActionGroup({
  source: 'Budget API',
  events: {
    'Load Budget Failure': props<{ error: string }>(),
    'Load Budget Success': props<{ budget: IBudget[] }>(),
    'Delete Budget Success': props<{ child: number }>(),
    'Delete Budget Failure': props<{ error: string}>(),
  },
});
