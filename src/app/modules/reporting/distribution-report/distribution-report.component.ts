import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewChild,
    inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';


import { JournalDetailComponent } from '../distribution-report-v1/distribution-detail/journal-detail.component';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { TransactionDetailComponent } from '../distributed-ledger/transaction-detail/transaction-detail.component';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { GLAccountsService } from 'app/services/accounts.service';

const imports = [
    CommonModule,
    MaterialModule,
    TransactionDetailComponent,
    JournalDetailComponent,
    GridModule
];

@Component({
    selector: 'app-distribution-report',
    standalone: true,
    imports: [imports],
    templateUrl: './distribution-report.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [],
})
export class DistributionReportComponent implements OnInit {
    private accountsService = inject(GLAccountsService);
    public currentPeriod = 1;
    public currentYear = 2024;
    public selectedItemKeys: any[] = [];
    public keyField: any;
    public currentDate: string;

    public dl$ = this.dlService.getDistributionByPrdAndYear(
        this.currentPeriod,
        this.currentYear
    );
    public collapsed = false;

    // local variables
    @ViewChild('drawer') drawer!: MatDrawer;

    ngOnInit() {
        const dDate = new Date();
        this.currentDate = dDate.toISOString().split('T')[0];
    }

    onYearChanged(e: any) {
        this.currentYear = Number(e);
        this.onRefresh();
    }

    onPeriodChanged(e: any) {
        this.currentPeriod = Number(e);
        this.onRefresh();
    }

    onRefresh() {
        this.dl$ = this.dlService.getDistributionByPrdAndYear(
            this.currentPeriod,
            this.currentYear
        );
    }

    onAdd() { }

    onCellDoubleClicked(e) { }

    formatNumber(e) {
        const options = {
            style: 'decimal', // Other options: 'currency', 'percent', etc.
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        };
        const formattedWithOptions = e.value.toLocaleString('en-US', options);
        return formattedWithOptions;
    }

    selectionChanged(data: any) {
        this.selectedItemKeys = data.selectedRowKeys;
    }

    onFocusedRowChanged(e: any) { }
}
