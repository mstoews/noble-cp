import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IAccounts } from 'app/models';

export const addressAPIActions = createActionGroup({
  source: 'Address API',
  events: {
    'Address Load Success': props<{ addresses: IAccounts[] }>(),
    'Address Load Failure': props<{ error: string }>(),
    'Address Deleted Success': emptyProps(),
    'Address Added Success':props<{ address: IAccounts }>(),
    'Address Added Fail': props<{ message: string }>(),
    'Address Updated Success': props<{ address: IAccounts }>(),
    'Address Updated Fail': props<{ message: string }>(),    
    'Address Deleted Fail': props<{ message: string }>(),
  },
});
