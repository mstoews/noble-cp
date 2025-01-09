import { createActionGroup, props } from '@ngrx/store';
import { IGLType } from 'app/models/types';

export const gltypeAPIActions = createActionGroup({
  source: 'GLType API',
  events: {
    'Load GLType Success': props<{ gltype: IGLType[] }>(),
    'Load GLType Failure': props<{ error: string }>(),
  },
});
