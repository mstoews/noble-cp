import { Routes } from '@angular/router';
import { JournalListRouteComponent } from './journal.list-route.component';
import { JournalEditResolver } from 'app/features/accounting/transactions/routing/journal.edit.resolver';

export default [
    {
        path: '',
        component: JournalListRouteComponent,
        // resolve: { journal: JournalEditResolver },
    },

] as Routes;
