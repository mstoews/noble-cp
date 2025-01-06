import { createActionGroup, props } from '@ngrx/store';
import { ITeam } from 'app/models/team';

export const teamAPIActions = createActionGroup({
  source: 'Team API',
  events: {
    'Load Team Success': props<{ team: ITeam[] }>(),
    'Load Team Failure': props<{ error: string }>(),
  },
});
