import { Routes } from '@angular/router';
import { TransactionMainComponent } from './transaction-main.component';
import { JournalResolver } from 'app/services/journal.resolver';
import { JournalUpdateComponent } from './gl-transactions/journal-update.component';

export default [
    {
        path: '',
        component: TransactionMainComponent,
    },
    {
        path: 'ar/:id',
        // component: ARUpdateComponent,
        component: JournalUpdateComponent, 
        resolve: { journal: JournalResolver },
    },
    {
        path: 'ap/:id',
        // component: APUpdateComponent,
        component: JournalUpdateComponent, 
        resolve: {journal: JournalResolver },
    },
    {
        path: 'gl/:id',
        component: JournalUpdateComponent, 
        resolve: {journal: JournalResolver },
    },
] as Routes;
