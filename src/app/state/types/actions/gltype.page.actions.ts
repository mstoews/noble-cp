import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IGLType } from 'app/models/types';

export const gltypePageActions = createActionGroup({
  source: 'GL Type Page',
  events: {
    load: emptyProps(),
    update: props<IGLType>(),
    delete: props<IGLType>(),
    select: props<IGLType>(),
  },
});
