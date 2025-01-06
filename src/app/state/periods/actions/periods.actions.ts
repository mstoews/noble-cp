import { createActionGroup, props } from '@ngrx/store';
import { IPeriod } from 'app/models/period';

export const periodsAPIActions = createActionGroup({
  source: 'Periods API',
  events: {
    'Load Periods Success': props<{ periods: IPeriod[] }>(),
    'Load Periods Failure': props<{ error: string }>(),
  },
});
