import { Update } from '@ngrx/entity';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IKanban } from 'app/models/kanban';

export const KanbanAPIActions = createActionGroup({
  source: 'Kanbans API',
  events: {
    'Load Kanbans': emptyProps(),
    'Toggle Show Kanban Code': emptyProps(),
    'Add Kanban': props<{ tasks: IKanban }>(),
    'Update Kanban': props<{ tasks: IKanban }>(),
    'Delete Kanban': props<{ id: number }>(),
    'Kanbans Loaded Success': props<{ tasks: IKanban[] }>(),
    'Kanbans Loaded Fail': props<{ message: string }>(),
    'Kanban Added Success': props<{ tasks: IKanban }>(),
    'Kanban Added Fail': props<{ message: string }>(),
    'Kanban Updated Success': props<{ update: Update<IKanban> }>(),
    'Kanban Updated Fail': props<{ message: string }>(),
    'Kanban Deleted Success': props<{ id: number }>(),
    'Kanban Deleted Fail': props<{ message: string }>(),
  },
});
