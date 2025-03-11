import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IPriority } from 'app/models/kanban';

export const priorityPageActions = createActionGroup({
  source: 'Priority Page',
  events: {
    load: emptyProps(),
    select: props<IPriority>(),
  },
});
