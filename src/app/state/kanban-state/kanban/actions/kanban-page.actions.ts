import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IKanban } from 'app/models/kanban';

export const KanbanPageActions = createActionGroup({
  source: 'Kanban Page',
  events: {
    load: emptyProps(),    
    select: props<IKanban>(),
    add: props<{ kanban: IKanban }>(),
    update: props<{ kanban: IKanban }>(),
    delete: props<{ task_id: string }>()        
  },
});
