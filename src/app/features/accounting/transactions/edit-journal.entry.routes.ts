import { Routes } from '@angular/router';
import { JournalRouteComponent } from './journal-route.component';
import { JournalEditResolver } from 'app/services/journal.edit.resolver';

export default [
    {
        path: '',
        component: JournalRouteComponent,
        resolve: { journal: JournalEditResolver },
    },
    
] as Routes;
