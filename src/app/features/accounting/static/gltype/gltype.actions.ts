import { createActionGroup, props } from '@ngrx/store';
import { IGLType } from 'app/models/types';

export const glTypeAPIActions = createActionGroup({
  source: 'GLType API',
  events: {
    'Load GLType Success': props<{ gltype: IGLType[] }>(),
    'Load GLType Failure': props<{ error: string }>(),
    'GLType Deleted Success':  props<{ gltype: string }>(),
    'GLType Deleted Fail':     props<{ message: string }>(),
    'GLType Added Success':    props<{ gltype: IGLType }>(),
    'GLType Added Fail':       props<{ message: string }>(),
    'GLType Updated Success':  props<{ gltype: IGLType }>(),
    'GLType Updated Fail':     props<{ message: string }>(),        
  },
});
