import { createActionGroup, props } from '@ngrx/store';
import { IParty } from 'app/models/party';

export const partyAPIActions = createActionGroup({
  source: 'Party API',
  events: {
    'Load Party Success':     props<{ party: IParty[] }>(),
    'Load Party Failure':     props<{ error: string }>(),
    'Party Deleted Success':  props<{ id: number }>(),
    'Party Added Success':    props<{ party: IParty }>(),
    'Party Added Fail':       props<{ message: string }>(),
    'Party Updated Success':  props<{ party: IParty }>(),
    'Party Updated Fail':     props<{ message: string }>(),    
    'Party Deleted Fail':     props<{ message: string }>(),
  },
});
