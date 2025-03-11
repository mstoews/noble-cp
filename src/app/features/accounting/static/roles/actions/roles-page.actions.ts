import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IPeriod } from 'app/models/period';

export const rolesPageActions = createActionGroup({
  source: 'Period Page',
  events: {
    load: emptyProps(),
    select: props<IPeriod>(),
  },
});
