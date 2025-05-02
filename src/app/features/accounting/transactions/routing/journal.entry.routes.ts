import { Routes } from '@angular/router';
import { TransactionMainComponent } from '../transaction-main.component';
import { JournalResolver } from 'app/services/journal.resolver';
import { JournalUpdateComponent } from '../journal-update.component';
import { JournalListResolver } from 'app/features/accounting/transactions/routing/journal.list.resolver';
import { GLJournalListComponent } from '../gl-journal-list.component';
import { EntryWizardComponent } from '../wizard-entry.component';
import { ARJournalListComponent } from '../ar-journal-list.component';
import { APJournalListComponent } from '../ap-journal-list.component';

export default [
    {
        path: '',
        component: TransactionMainComponent,
    },
    {
        path: 'new',
        component: EntryWizardComponent,        
        resolve: { journal: JournalListResolver },
    },
    {
        path: 'list/:id',
        component: GLJournalListComponent,
        resolve: { journal: JournalListResolver },
    },
    {
        path: 'ar',        
        component: ARJournalListComponent,
        resolve: { journal: JournalResolver },
    },
    {
        path: 'ap',        
        component: APJournalListComponent,
        resolve: { journal: JournalResolver },
    },
    {
        path: 'gl/:id',
        component: JournalUpdateComponent,
        resolve: { journal: JournalResolver },
    },
] as Routes;
