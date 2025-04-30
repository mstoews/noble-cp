import { Routes } from '@angular/router';
import { TransactionMainComponent } from './transaction-main.component';
import { JournalResolver } from 'app/services/journal.resolver';
import { JournalUpdateComponent } from './journal-update.component';
import { JournalListResolver } from 'app/services/journal.list.resolver';
import { GLJournalListComponent } from './gl-journal-list.component';

export default [
    {
        path: '',
        component: TransactionMainComponent,        
    },
    {
        path: 'list',
        component: GLJournalListComponent,
        resolve: { journal: JournalListResolver },        
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
        resolve: { journal: JournalResolver },
    },
    {
        path: 'gl/:id',
        component: JournalUpdateComponent,
        resolve: { journal: JournalResolver },
    },
] as Routes;
