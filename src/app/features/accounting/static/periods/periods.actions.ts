import { createActionGroup, props } from '@ngrx/store';
import { IPeriod } from 'app/models/period';

export const periodsAPIActions = createActionGroup({
  source: 'Periods API',
  events: {
    'Load Periods Success': props<{ periods: IPeriod[] }>(),
    'Load Periods Failure': props<{ error: string }>(),
    'Period Deleted Success': props<{ id: number }>(),
    'Period Added Success': props<{ period: IPeriod }>(),
    'Period Added Fail': props<{ message: string }>(),
    'Period Updated Success': props<{ period: IPeriod }>(),
    'Period Updated Fail': props<{ message: string }>(),    
    'Period Deleted Fail': props<{ message: string }>(),
  },
});
