import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IType } from 'app/models';

export const typePageActions = createActionGroup({
  source: 'Type Page',
  events: {
    load: emptyProps(),
    update: props<IType>(),
    delete: props<IType>(),
    select: props<IType>(),
  },
});
