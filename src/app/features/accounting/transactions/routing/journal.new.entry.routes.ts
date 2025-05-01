import { Routes } from '@angular/router';
import { JournalEditResolver } from './journal.edit.resolver';
import { JournalNewRouteComponent } from './journal.new-route.component';

export default [
    {
        path: '',
        component: JournalNewRouteComponent,        
        resolve: { journal: JournalEditResolver },
    },

] as Routes;
