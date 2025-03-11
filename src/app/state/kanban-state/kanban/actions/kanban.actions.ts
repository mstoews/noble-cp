import { createActionGroup, props } from '@ngrx/store';
import { IKanban } from 'app/models/kanban';


export const KanbanAPIActions = createActionGroup({
  source: 'Kanban API',
  events: {
    'Load  Kanban Success':     props<{ Kanban: IKanban[] }>(),
    'Load  Kanban Failure':     props<{ error: string }>(),
    'Kanban Deleted Success':   props<{ task_id: string }>(),
    'Kanban Added Success':     props<{ Kanban: IKanban }>(),
    'Kanban Added Fail':        props<{ message: string }>(),
    'Kanban Updated Success':   props<{ Kanban: IKanban }>(),
    'Kanban Updated Fail':      props<{ message: string }>(),    
    'Kanban Deleted Fail':      props<{ message: string }>(),
  },
});
