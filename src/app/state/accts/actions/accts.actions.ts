import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IAccounts } from 'app/models';

export const accountAPIActions = createActionGroup({
  source: 'Accounts API',
  events: {
    'Load Accounts Success': props<{ accounts: IAccounts[] }>(),
    'Load Accounts Failure': props<{ error: string }>(),
    'Account Deleted Success': emptyProps(),
    'Account Added Success':props<{ account: IAccounts }>(),
    'Account Added Fail': props<{ message: string }>(),
    'Account Updated Success': props<{ account: IAccounts }>(),
    'Account Updated Fail': props<{ message: string }>(),    
    'Account Deleted Fail': props<{ message: string }>(),
  },
});
