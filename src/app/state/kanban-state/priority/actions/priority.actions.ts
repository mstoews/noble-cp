import { createActionGroup, props } from '@ngrx/store';
import { IPriority } from 'app/models/kanban';

export const priorityAPIActions = createActionGroup({
  source: 'Priority API',
  events: {
    'Load Priorities Success': props<{ priorities: IPriority[] }>(),
    'Load Priorities Failure': props<{ error: string }>(),
  },
});
