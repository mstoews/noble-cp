import { createActionGroup, props } from '@ngrx/store';
import { IPeriod } from 'app/models/period';

export const rolesAPIActions = createActionGroup({
  source: 'Periods API',
  events: {
    'Load Periods Success': props<{ roles: IPeriod[] }>(),
    'Load Periods Failure': props<{ error: string }>(),
  },
});
