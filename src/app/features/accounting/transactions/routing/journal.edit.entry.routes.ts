import { Routes } from '@angular/router';
import { JournalEditRouteComponent } from './journal.edit-route.component';
import { JournalEditResolver } from 'app/features/accounting/transactions/routing/journal.edit.resolver';

export default [
    {
        path: '',
        component: JournalEditRouteComponent,
        resolve: { journal: JournalEditResolver },
    },

] as Routes;
