import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ITeam } from 'app/models/team';

export const teamPageActions = createActionGroup({
  source: 'Period Page',
  events: {
    load: emptyProps(),
    update: props<ITeam>(),
    delete: props<ITeam>(),
    select: props<ITeam>(),
  },
});
