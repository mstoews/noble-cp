import { Routes } from '@angular/router';
import { JournalEntryComponent } from './transactions/journal-listing.component';
import { TransactionMainComponent } from './transaction-main.component';

export default [
    {
        path: '',
        component: TransactionMainComponent,
    },
] as Routes;