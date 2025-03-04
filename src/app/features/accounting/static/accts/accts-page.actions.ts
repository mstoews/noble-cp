import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IAccounts} from 'app/models';

export const accountPageActions = createActionGroup({
  source: 'Account Page',
  events: {
    load: emptyProps(),
    children: emptyProps(), 
    select: props<IAccounts>(),    
    'Delete Account': props<{child: number}>(),
    'Add Account': props<{ account: IAccounts }>(),
    'Update Account': props<{account: IAccounts}>(),
  },
});
