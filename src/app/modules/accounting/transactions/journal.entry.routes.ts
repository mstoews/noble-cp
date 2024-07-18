import { Routes } from '@angular/router';
import { TransactionMainComponent } from './transaction-main.component';
import { ARUpdateComponent } from './ar-transactions/ar-update.component';
import { APUpdateComponent } from './ap-transactions/ap-update.component';
import { JournalResolver } from 'app/services/journal.resolver';

export default [
    {
        path: '',
        component: TransactionMainComponent,
    },
    {
        path: 'ar/:journal_id',
        component: ARUpdateComponent,
        resolve: { journal: JournalResolver },
    },
    {
        path: 'ap/:id',
        component: APUpdateComponent,
        resolve: {journal: JournalResolver },
    },
    {
        path: 'gl/:journalNo',
        component: APUpdateComponent,
    },
] as Routes;
