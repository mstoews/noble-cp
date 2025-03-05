import { createActionGroup, props } from '@ngrx/store';
import { IProjects } from 'app/models/kanban';

export const projectsAPIActions = createActionGroup({
  source: 'Projects API',
  events: {
    'Load Projects Success':      props<{ projects: IProjects[] }>(),
    'Load Projects Failure':      props<{ error: string }>(),
    'Deleted Projects Success':   props<{ projects: IProjects }>(),
    'Deleted Projects Fail':      props<{ message: string }>(),
    'Added Projects Success':     props<{ projects: IProjects }>(),
    'Added Projects Fail':        props<{ message: string }>(),
    'Updated Projects Success':   props<{ projects: IProjects }>(),
    'Updated Projects Fail':      props<{ message: string }>(),        
  },
});
