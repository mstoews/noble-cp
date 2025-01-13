import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IBudget } from 'app/models';


export const budgetPageActions = createActionGroup({
  source: 'Budget Page',
  events: {
    load: emptyProps(),
    update: props<IBudget>(),
    delete: props<IBudget>(),
    select: props<IBudget>(),
  },
});
