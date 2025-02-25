import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IParty } from 'app/models/party';

export const partyPageActions = createActionGroup({
  source: 'Party Page',
  events: {
    load: emptyProps(),
    select: props<IParty>(),
    'Delete Party': props<{ party: string }>(),
    'Add Party': props<{ party: IParty }>(),
    'Update Party': props<{ party: IParty }>(),
  },
});
