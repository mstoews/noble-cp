import { Routes } from '@angular/router';
import { TransactionMainComponent } from './transaction-main.component';
import { ARUpdateComponent } from './ar-transactions/ar-update.component';
import { APUpdateComponent } from './ap-transactions/ap-update.component';

export default [
    {
        path: '',
        component: TransactionMainComponent,
    },
    {
        path: 'ar/:journalNo',
        component: ARUpdateComponent,
    },
    {
        path: 'ap/:journalNo',
        component: APUpdateComponent,
    },
    {
        path: 'gl/:journalNo',
        component: APUpdateComponent,
    },
] as Routes;
