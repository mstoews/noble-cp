import { createActionGroup, props } from '@ngrx/store';
import { IType } from 'app/models';

export const typeAPIActions = createActionGroup({
  source: 'Type API',
  events: {
    'Load Type Success': props<{ transaction_type: IType[] }>(),
    'Load Type Failure': props<{ error: string }>(),
  },
});
