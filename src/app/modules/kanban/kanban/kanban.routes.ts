import { Routes } from '@angular/router';
// import { KanbanMainComponent } from './kanban.component';
// import { TasksComponent } from '../task/tasks.component';
import { KanbanPanelComponent } from '../kanban-panel.component';


export default [
    {
        path     : '',
        component: KanbanPanelComponent,
    },
] as Routes;
