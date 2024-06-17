import { Component, OnDestroy, OnInit, ViewChild, inject, viewChild } from '@angular/core';
import { DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { JournalService } from 'app/services/journal.service';
import { Subject } from 'rxjs';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { CommonModule } from '@angular/common';
import { DndComponent } from 'app/modules/drag-n-drop/loaddnd/dnd.component';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { FundsService } from 'app/services/funds.service';
import { GLAccountsService } from 'app/services/accounts.service';

import { GridMenubarStandaloneComponent } from '../../grid-menubar/grid-menubar.component';
import { JournalDetailComponent } from './journal-detail.component';
import { JournalUpdateComponent } from './journal-update.component';
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
    JournalUpdateComponent,
    NgxMatSelectSearchModule
];


@Component({
    selector: 'transactions',
    standalone: true,
    imports: [imports],
    templateUrl: './journal-entry.component.html',
    styles: `::ng-deep .dx-datagrid .dx-datagrid-rowsview .dx-row-focused.dx-data-row:not(.dx-edit-row) > td:not(.dx-focused)
    {
       background-color: rgb(195, 199, 199);
       border-color: #ada6a7;
    }`
})
export class JournalEntryComponent implements OnInit, OnDestroy {
    private journalService = inject(JournalService);
    private typeService = inject(TypeService);
    private subtypeService = inject(SubTypeService);
    private fundService = inject(FundsService);
    private accountService = inject(GLAccountsService);

    public journalHeader$ = this.journalService.readJournalHeader();
    public types$ = this.typeService.read();
    public subtypes$ = this.subtypeService.read()
    public funds$ = this.fundService.read();
    public accounts$ = this.accountService.readChildren();
    public details$ = this.journalService.getJournalDetail(0);

    drawer = viewChild<MatDrawer>('drawer')
    journalUpdate = viewChild(JournalUpdateComponent);

    collapsed = false;
    sTitle = 'Journal Entry';
    selectedItemKeys: any[] = [];
    public nJournal = 0;
    public description = '';
    public transaction_date = '';
    public amount = '';
    public currentDate: string;
    public journal_details: any[];
    public bOpenDetail: boolean = false;


//     readonly allowedPageSizes = [10, 20, 'all'];
    currentRowData: any;

    readonly displayModes = [{ text: "Display Mode 'compact'", value: 'compact' }];
    displayMode = 'compact';
    showPageSizeSelector = false;
    showInfo = false;
    showNavButtons = false;

    drawOpen: 'open' | 'close' = 'open';

    customizeTooltip = (pointsInfo: { originalValue: string; }) => ({ text: `${parseInt(pointsInfo.originalValue)}%` });
    journalForm!: FormGroup;
    keyField: any;
    protected _onDestroy = new Subject<void>();

    async ngOnInit() {
        const dDate = new Date();
        this.currentDate = dDate.toISOString().split('T')[0];
    }

    onCellDoubleClicked(e: any) {
        this.bOpenDetail = true;
        this.nJournal = e.data.journal_id;
        this.description = e.data.description;
        this.amount = e.data.amount;
        this.transaction_date = e.data.create_date;
        this.details$ = this.journalService.getJournalDetail(this.nJournal);
        if (this.journalUpdate() !== undefined) {
            this.journalUpdate().refresh(this.nJournal, this.description, this.transaction_date, this.amount);
        }
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
        this.nJournal = 0;
        this.openDrawer()
        this.journalUpdate().refresh(this.nJournal, this.description, this.transaction_date, this.amount);
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
        const worksheet = workbook.addWorksheet('Distribution Ledger');

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
            headerRow.getCell(1).value = `Distribution Ledger Report - ${this.currentDate}`;
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

    updateBooked() {
        // this.journalHeader$.subscribe((data: any) => {
        //     data.forEach((element: any) => {
        //         element.booked = element.booked === 'true' ? true : false;
        //         this.transactionService.update(element).then((res: any) => {
        //             console.debug(`update ${JSON.stringify(res)}`);
        //         });
        //     });
        // });
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
        this.nJournal = e.row.data.journal_id;
        this.currentRowData = e.row.data;
    }

    onFocusedRowChanged(e: any) {
        console.debug('onFocusRowChanged :', JSON.stringify(e.row.data))
    }

    openDrawer() {
        if (this.drawer().opened !== true)
            this.drawer().toggle();
    }

    closeDrawer() {
        if (this.drawer().opened === true)
            this.drawer().toggle();
    }

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }
}
