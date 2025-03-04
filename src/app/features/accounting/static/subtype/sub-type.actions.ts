import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ISubType, ISubtypeDropDown } from 'app/models/subtypes';

export const subTypeAPIActions = createActionGroup({
  source: 'SubType Page',
  events: {
    'SubType Load Success': props<{ subtype: ISubType[] }>(),
    'SubType Load Failure': props<{ error: string }>(),
    'SubType Dropdown Success': props<{ subtype: ISubtypeDropDown[] }>(),
    'SubType Dropdown Failure': props<{ error: string }>(),
    'SubType Deleted Success': props<{ id: number }>(),
    'SubType Added Success': props<{ subtype: ISubType }>(),
    'SubType Added Fail': props<{ message: string }>(),
    'SubType Updated Success': props<{ subtype: ISubType }>(),
    'SubType Updated Fail': props<{ message: string }>(),    
    'SubType Deleted Fail': props<{ message: string }>(),
  },
});
