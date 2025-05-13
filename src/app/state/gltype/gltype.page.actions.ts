import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IGLType } from 'app/models/types';

export const glTypePageActions = createActionGroup({
  source: 'GL Type Page',
  events: {
    load: emptyProps(),
    add: props<{ gltype: IGLType}>(),     
    update: props<{ gltype: IGLType}>(),
    delete: props<{ gltype : string}>(),
    select: props<{ gltype: string}>()   
  },
});
