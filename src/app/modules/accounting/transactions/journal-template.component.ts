import { Component, ViewChild, inject } from '@angular/core';
import { DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IAccounts, IJournalTemplate, JournalService } from 'app/services/journal.service';
import { Observable, map, of } from 'rxjs';

import { CommonModule } from '@angular/common';
import { DndComponent } from 'app/modules/drag-n-drop/loaddnd/dnd.component';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { FundsService } from 'app/services/funds.service';
import { GLAccountsService } from 'app/services/accounts.service';
import { GlTransactionsService } from 'app/services/gltransaction.service';
import { GridMenubarStandaloneComponent } from '../grid-menubar/grid-menubar.component';
import { JournalDetailComponent } from './transactions/journal-detail.component';
import { JournalUpdateComponent } from './transactions/journal-update.component';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { SubTypeService } from 'app/services/subtype.service';
import { TypeService } from 'app/services/type.service';
import { Workbook } from 'exceljs';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { saveAs } from 'file-saver-es';

const imports = [
    CommonModule,
    DxDataGridModule,
    DxTemplateModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    JournalDetailComponent,
    DndComponent,
    GridMenubarStandaloneComponent,
    JournalUpdateComponent
];

@Component({
    selector: 'journal-template',
    standalone: true,
    imports: [imports],
    templateUrl: './journal-template.component.html',
    styles: `::ng-deep .dx-datagrid .dx-datagrid-rowsview .dx-row-focused.dx-data-row:not(.dx-edit-row) > td:not(.dx-focused)
    {
       background-color: rgb(195, 199, 199);
       border-color: #ada6a7;
    }`,
    providers: []
})

export class JournalTemplateComponent {
    private transactionService = inject(GlTransactionsService);
    private journalService = inject(JournalService);
    private accountService = inject(GLAccountsService);
    public currentDate: string;
    public journal_details: any[];
    public bOpenDetail: boolean = false;
    @ViewChild(JournalUpdateComponent) journalUpdate!: JournalUpdateComponent

    journalTemplate$ = this.journalService.readJournalTemplate();

    accounts$ = this.accountService.readChildren(); // retrieves only the child accounts which can be used for booking

    @ViewChild('drawer') drawer!: MatDrawer;
    sTitle = 'Journal Template';
    selectedItemKeys: any[] = [];

    public description = '';
    public transaction_date = '';
    readonly allowedPageSizes = [10, 20, 'all'];
    currentRowData: any;

    readonly displayModes = [{ text: "Display Mode 'compact'", value: 'compact' }];
    displayMode = 'compact';
    showPageSizeSelector = true;
    showInfo = true;
    showNavButtons = true;

    drawOpen: 'open' | 'close' = 'open';

    customizeTooltip = (pointsInfo: { originalValue: string; }) => ({ text: `${parseInt(pointsInfo.originalValue)}%` });
    journalForm!: FormGroup;
    keyField: any;

    async ngOnInit() {
        const dDate = new Date();
        this.currentDate = dDate.toISOString().split('T')[0];
    }

    onCellDoubleClicked(e: any) {
        this.bOpenDetail = true;
        this.description = e.data.description;
        this.transaction_date = e.data.create_date;
        this.openDrawer();
    }



    changeType(e) {
        console.debug('changeType ', JSON.stringify(e));
    }

    changeSubType(e) {
        console.debug('changeType ', JSON.stringify(e));
    }


    changeFund(e) {
        console.debug('changeType ', JSON.stringify(e));
    }

    changeChildAccount(e) {
        console.debug('changeType ', JSON.stringify(e));
    }


    onAdd() {
        this.bOpenDetail = true;
        this.openDrawer()
    }

    onRefresh() {
        console.debug('Refresh')
    }

    onDeleteSelection() {
        console.debug('Delete Selection')
    }

    onUpdateSelection() {
        console.debug('onUpdateSelection')
    }

    onDelete(e: any) {
        console.debug('onDelete')
    }

    onUpdate($event: any) {
        console.debug('onUpdate')
    }

    onBooked(booked: boolean) {
        this.journalForm.patchValue({ booked: booked });
        this.transactionService.update(this.journalForm.value).then((res: any) => {
            console.debug(`update ${JSON.stringify(res)}`);
        });
    }

    formatNumber(e) {
        const options = {
            style: 'decimal',  // Other options: 'currency', 'percent', etc.
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        };
        const formattedWithOptions = e.value.toLocaleString('en-US', options);
        return formattedWithOptions;
    }

    onExporting(e: DxDataGridTypes.ExportingEvent) {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Journal Template');

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
                        excelCell.numFmt = '#,##0.00_);\(#,##0.00\)';
                        if (gridCell.column.name === 'journal_id') {
                            excelCell.numFmt = '#,##0);\(#,##0\)';
                        }
                    }

                }
                if (gridCell.rowType === 'group') {
                    excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { arg: 'BEDFE6' } };
                }
                if (gridCell.rowType === 'totalFooter' && excelCell.value) {
                    excelCell.font.italic = true;
                }
            },
        }).then((cellRange) => {
            // header
            const headerRow = worksheet.getRow(2);
            headerRow.height = 30;
            headerRow.getCell(1).value = `Journal Template List`;
            headerRow.getCell(1).font = { name: 'Segoe UI Light', size: 22 };
            headerRow.getCell(1).alignment = { horizontal: 'left' };
            worksheet.mergeCells(2, 1, 2, 8);

            // footer
            const footerRowIndex = cellRange.to.row + 2;
            const footerRow = worksheet.getRow(footerRowIndex);
            footerRow.height = 20;
            worksheet.mergeCells(footerRowIndex, 1, footerRowIndex, 8);
            footerRow.getCell(1).value = 'www.nobleledger.com';
            footerRow.getCell(1).font = { color: { argb: 'BFBFFF' }, italic: true };
            footerRow.getCell(1).alignment = { horizontal: 'left' };
        }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `transactions_details_${this.currentDate}.xlsx`);
            });
        });
    }


    onCreate() {
        this.openDrawer();
    }


    selectionChanged(data: any) {
        console.debug(`selectionChanged ${JSON.stringify(data.data)}`);
        this.selectedItemKeys = data.selectedRowKeys;
    }



    onEdit() {
        this.bOpenDetail = true;
        // this.refresh(this.hJournal, this.description, this.transaction_date);
        this.openDrawer();
    }


    onFocusedDetailRowChanged(e: any) {

        this.currentRowData = e.row.data;
    }

    onFocusedRowChanged(e: any) {
        console.debug('onFocusRowChanged :', JSON.stringify(e.row.data))
    }

    openDrawer() {
        const opened = this.drawer.opened;
        if (opened !== true) {
            this.drawer.toggle();
        } else {
            return;
        }
    }

    closeDrawer() {
        this.bOpenDetail = true;
        const opened = this.drawer.opened;
        if (opened === true) {
            this.drawer.toggle();
        } else {
            return;
        }
    }

}