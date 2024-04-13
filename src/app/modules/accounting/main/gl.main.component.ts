import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';

import { BalanceSheetComponent } from '../balance-sheet/balance-sheet.component';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { DistributedLedgerComponent } from '../../reporting/distributed-ledger/distributed-ledger.component';
import { FundsComponent } from '../funds/funds.component';
import { GeneralLedgerTreeComponent } from '../general-ledger-tree/general-ledger-tree.component';
import { GlAccountsComponent } from '../accts/gl-accts.component';
import { GlTypesComponent } from '../types/gl-types.component';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { PeriodsComponent } from '../periods/periods.component';
import { RouterLink } from '@angular/router';
import { TransactionAnalysisComponent } from '../../reporting/transaction-analysis/transaction-analysis.component';
import { TrialBalanceComponent } from '../trial-balance/trial-balance.component';

@Component({
    selector: 'gl-main',
    templateUrl: './gl.main.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        MatIconModule,
        RouterLink,
        MatButtonModule,
        CdkScrollable,
        MatTabsModule,
        BalanceSheetComponent,
        TrialBalanceComponent,
        DistributedLedgerComponent,
        TransactionAnalysisComponent,
        FundsComponent,
        GeneralLedgerTreeComponent,
        GlAccountsComponent,
        GlTypesComponent,
        PeriodsComponent,
        ],
    providers: [HttpClient],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlMainComponent {

}
