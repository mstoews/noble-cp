import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IAccounts } from 'app/models';


export const addressPageActions = createActionGroup({
  source: 'Address Page',
  events: {
    load: emptyProps(),
    select: props<IAccounts>(),
    'Delete Address': props<{child: number}>(),
    'Add Address': props<{ account: IAccounts }>(),
    'Update Address': props<{account: IAccounts}>(),
  },
});
