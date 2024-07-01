import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewChild,
    inject,
} from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';

import { DistMenuStandaloneComponent } from '../distributed-ledger/dist-menubar/grid-menubar.component';
import { DistributionLedgerService } from 'app/services/distribution.ledger.service';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { TransactionDetailComponent } from '../distributed-ledger/transaction-detail/transaction-detail.component';
import { GridModule } from '@syncfusion/ej2-angular-grids';

const imports = [
    CommonModule,
    MaterialModule,
    DistMenuStandaloneComponent,
    TransactionDetailComponent,
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
export class DistributionReportV2Component implements OnInit {
    private dlService = inject(DistributionLedgerService);
    public currentPeriod = 1;
    public currentYear = 2024;
    public selectedItemKeys: any[] = [];
    public keyField: any;
    public currentDate: string;
    public dl$ = this.dlService.getDistributionReportByPrdAndYear(
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
        this.dl$ = this.dlService.getDistributionReportByPrdAndYear(
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
        //console.debug(formattedWithOptions);
        return formattedWithOptions;
    }

    selectionChanged(data: any) {
        //console.debug(`selectionChanged ${JSON.stringify(data.data)}`);
        this.selectedItemKeys = data.selectedRowKeys;
    }

    onFocusedRowChanged(e: any) {
        // console.debug(`selectionChanged ${JSON.stringify(e.data)}`);
    }
}
