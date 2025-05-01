import { Routes } from '@angular/router';
import { JournalRouteComponent } from './journal.edit-route.component';
import { JournalEditResolver } from 'app/features/accounting/transactions/routing/journal.edit.resolver';

export default [
    {
        path: '',
        component: JournalRouteComponent,
        resolve: { journal: JournalEditResolver },
    },

] as Routes;
