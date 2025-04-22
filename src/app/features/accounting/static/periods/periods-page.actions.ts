import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IPeriod } from 'app/models/period';

export const periodsPageActions = createActionGroup({
  source: 'Period Page',
  events: {
    load: emptyProps(),
    current: emptyProps(),
    select: props<IPeriod>(),    
    'Delete Period': props<{ id: number }>(),
    'Add Period': props<{ period: IPeriod }>(),
    'Update Period': props<{ period: IPeriod }>(),
  },
});
