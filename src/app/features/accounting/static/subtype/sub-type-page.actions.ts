import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ISubType} from 'app/models/subtypes';

export const subTypePageActions = createActionGroup({
  source: 'SubType API',
  events: {
      load: emptyProps(),
      loadDropdown: emptyProps(),
      select: props<ISubType>(),      
      'Delete Subtype': props<{ id: number }>(),
      'Add Subtype': props<{ subtype: ISubType }>(),
      'Update Subtype': props<{ subtype: ISubType }>(),
  },
});
