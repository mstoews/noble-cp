import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IProjects } from 'app/models/kanban';

export const projectsPageActions = createActionGroup({
  source: 'Projects Page',
  events: {
    load: emptyProps(),    
    select: props<IProjects>(),
    add: props<{ project: IProjects }>(),
    update: props<{ project: IProjects }>(),
    delete: props<{ project: IProjects }>()        
  },
});
