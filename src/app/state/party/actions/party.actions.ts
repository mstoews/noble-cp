import { createActionGroup, props } from '@ngrx/store';
import { IParty } from 'app/models/party';

export const partyAPIActions = createActionGroup({
  source: 'Party API',
  events: {
    'Load Party Success': props<{ party: IParty[] }>(),
    'Load Party Failure': props<{ error: string }>(),
  },
});
