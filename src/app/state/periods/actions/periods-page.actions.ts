import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IPeriod } from 'app/models/period';

export const periodsPageActions = createActionGroup({
  source: 'Period Page',
  events: {
    load: emptyProps(),
    select: props<IPeriod>(),
  },
});
