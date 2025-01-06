import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ISubType } from 'app/models/subtypes';

export const subtypePageActions = createActionGroup({
  source: 'Sub Type Page',
  events: {
    load: emptyProps(),
    update: props<ISubType>(),
    delete: props<ISubType>(),
    select: props<ISubType>(),
  },
});
