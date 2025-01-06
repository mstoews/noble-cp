import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IParty } from 'app/models/party';

export const partyPageActions = createActionGroup({
  source: 'Period Page',
  events: {
    load: emptyProps(),
    select: props<IParty>(),
  },
});
