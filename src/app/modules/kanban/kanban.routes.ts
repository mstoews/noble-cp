import { Routes } from '@angular/router';
// import { KanbanMainComponent } from './kanban.component';
import { TasksComponent } from './tasks.component';

export default [
    {
        path     : '',
        component: TasksComponent,
    },
] as Routes;
