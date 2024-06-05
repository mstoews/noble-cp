import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewChild,
    inject,
} from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import {
    DxBulletModule,
    DxDataGridModule,
    DxTemplateModule,
} from 'devextreme-angular';

import { DistMenuStandaloneComponent } from '../distributed-ledger/dist-menubar/grid-menubar.component';
import { DistributionLedgerService } from 'app/services/distribution.ledger.service';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { JournalDetailComponent } from 'app/modules/accounting/journal-entry/journal-detail/journal-detail.component';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { TransactionDetailComponent } from '../distributed-ledger/transaction-detail/transaction-detail.component';
import { Workbook } from 'exceljs';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { saveAs } from 'file-saver-es';

const imports = [
    CommonModule,
    DxDataGridModule,
    DxBulletModule,
    DxTemplateModule,
    MaterialModule,
    DistMenuStandaloneComponent,
    TransactionDetailComponent,
];

@Component({
    selector: 'app-distribution-report',
    standalone: true,
    imports: [imports],
    templateUrl: './distribution-report.component.html',
    styles: [
        `
            ::ng-deep
                .dx-datagrid
                .dx-datagrid-rowsview
                .dx-row-focused.dx-data-row:not(.dx-edit-row)
                > td:not(.dx-focused) {
                background-color: rgb(195, 199, 199);
                border-color: rgb(195, 199, 199);
            }
        `,
    ],
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
        //this.dlService.writeDistributionReportFromHash();
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

    onExporting(e: DxDataGridTypes.ExportingEvent) {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Dist Ledger');

        exportDataGrid({
            component: e.component,
            worksheet,
            autoFilterEnabled: true,
            keepColumnWidths: true,
            topLeftCell: { row: 4, column: 1 },
            customizeCell: ({ gridCell, excelCell }) => {
                if (gridCell.rowType === 'data') {
                    if (gridCell.column.dataType === 'number') {
                        excelCell.value = parseFloat(gridCell.value);
                        excelCell.numFmt = '#,##0.00_);(#,##0.00)';
                    }
                }
                if (gridCell.rowType === 'group') {
                    excelCell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'BEDFE6' },
                    };
                }
                if (gridCell.rowType === 'totalFooter' && excelCell.value) {
                    excelCell.font.italic = true;
                }
            },
        })
            .then((cellRange) => {
                // header
                const headerRow = worksheet.getRow(2);
                headerRow.height = 30;
                headerRow.getCell(
                    1
                ).value = `Distribution Ledger Report - ${this.currentDate}`;
                headerRow.getCell(1).font = {
                    name: 'Segoe UI Light',
                    size: 22,
                };
                headerRow.getCell(1).alignment = { horizontal: 'left' };
                worksheet.mergeCells(2, 1, 2, 8);

                // footer
                const footerRowIndex = cellRange.to.row + 2;
                const footerRow = worksheet.getRow(footerRowIndex);
                footerRow.height = 20;
                worksheet.mergeCells(footerRowIndex, 1, footerRowIndex, 8);
                footerRow.getCell(1).value = 'www.nobleledger.com';
                footerRow.getCell(1).font = {
                    color: { argb: 'BFBFFF' },
                    italic: true,
                };
                footerRow.getCell(1).alignment = { horizontal: 'left' };
            })
            .then(() => {
                workbook.xlsx.writeBuffer().then((buffer) => {
                    saveAs(
                        new Blob([buffer], {
                            type: 'application/octet-stream',
                        }),
                        `distributed_ledger_${this.currentDate}.xlsx`
                    );
                });
            });
    }

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

    customizeColumns(columns: DxDataGridTypes.Column[]) {
        columns[0].width = 70;
    }

    onContentReady(e: DxDataGridTypes.ContentReadyEvent) {
        e.component.option('loadPanel.enabled', false);
    }

    onFocusedRowChanged(e: any) {
        // console.debug(`selectionChanged ${JSON.stringify(e.data)}`);
    }
}
