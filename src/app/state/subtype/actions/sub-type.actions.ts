import { createActionGroup, props } from '@ngrx/store';
import { ISubType } from 'app/models/subtypes';

export const subtypeAPIActions = createActionGroup({
  source: 'SubType API',
  events: {
    'Load SubType Success': props<{ subtype: ISubType[] }>(),
    'Load SubType Failure': props<{ error: string }>(),
  },
});
