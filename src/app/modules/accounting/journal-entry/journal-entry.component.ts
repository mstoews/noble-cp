import { Component, ViewChild, inject } from '@angular/core';
import { DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IJournalDetail, JournalService } from 'app/services/journal.service';
import { Observable, map } from 'rxjs';

import { CommonModule } from '@angular/common';
import { DndComponent } from 'app/modules/drag-n-drop/loaddnd/dnd.component';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { FundsService } from 'app/services/funds.service';
import { GLAccountsService } from 'app/services/accounts.service';
import { GlTransactionsService } from 'app/services/gltransaction.service';
import { GridMenubarStandaloneComponent } from '../grid-menubar/grid-menubar.component';
import { JournalDetailComponent } from './journal-detail/journal-detail.component';
import { JournalUpdateComponent } from './journal-update/journal-update.component';
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
    selector: 'app-journal-entry',
    standalone: true,
    imports: [imports],
    templateUrl: './journal-entry.component.html',
    styles: `::ng-deep .dx-datagrid .dx-datagrid-rowsview .dx-row-focused.dx-data-row:not(.dx-edit-row) > td:not(.dx-focused)
    {
       background-color: rgb(195, 199, 199);
       border-color: #ada6a7;
    }`
})

export class JournalEntryComponent {

    private fb = inject(FormBuilder);
    private transactionService = inject(GlTransactionsService);
    private journalService = inject(JournalService);
    private typeService = inject(TypeService);
    private subtypeService = inject(SubTypeService);
    private fundService = inject(FundsService);
    private accountService = inject(GLAccountsService);
    public currentDate: string;
    public journal_details: any[];
    public bOpenDetail: boolean = false;

    journalHeader$ = this.journalService.listJournalHeader();
    types$ = this.typeService.read();
    funds$ = this.fundService.read();
    accounts$ = this.accountService.read().pipe(map((child) => child.filter((parent) => parent.parent_account === false)));
    details$: Observable<IJournalDetail[]>;

    @ViewChild('drawer') drawer!: MatDrawer;
    collapsed = false;
    sTitle = 'Journal Entry';
    selectedItemKeys: any[] = [];
    public nJournal = 0;
    public description = '';
    public transaction_date = '';

    drawOpen: 'open' | 'close' = 'open';

    customizeTooltip = (pointsInfo: { originalValue: string; }) => ({ text: `${parseInt(pointsInfo.originalValue)}%` });
    journalForm!: FormGroup;
    keyField: any;
    // accountsForm!: FormGroup;

    async ngOnInit() {
        // this.createEmptyForm();
        const dDate = new Date();
        this.currentDate = dDate.toISOString().split('T')[0];
        // await this.updateBooked()
    }

    
    changeType(e) {
        console.log('changeType ', JSON.stringify(e));
    }

    changeSubType(e) {
        console.log('changeType ', JSON.stringify(e));
    }


    changeFund(e) {
        console.log('changeType ', JSON.stringify(e));
    }

    changeChildAccount(e) {
        console.log('changeType ', JSON.stringify(e));
    }


    onAdd() {
        console.debug('add a new transaction ....');
        this.openDrawer()
    }

    onRefresh() {
        throw new Error('Method not implemented.');
    }

    onDeleteSelection() {

    }

    onUpdateSelection() {

    }

    onDelete(e: any) {
        throw new Error('Method not implemented.');
    }

    onUpdate($event: any) {
        throw new Error('Method not implemented.');
    }

    onBooked(booked: boolean) {
        this.journalForm.patchValue({ booked: booked });
        this.transactionService.update(this.journalForm.value).then((res: any) => {
            console.log(`update ${JSON.stringify(res)}`);
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

    async updateBooked() {
        this.journalHeader$.subscribe((data: any) => {
            data.forEach((element: any) => {
                element.booked = element.booked === 'true' ? true : false;
                this.transactionService.update(element).then((res: any) => {
                    console.log(`update ${JSON.stringify(res)}`);
                });
            });
        });
    }

    onCreate() {    
        this.openDrawer();
    }


    selectionChanged(data: any) {
        console.log(`selectionChanged ${JSON.stringify(data.data)}`);
        this.selectedItemKeys = data.selectedRowKeys;
    }

    onCellDoubleClicked(e: any) {
        
        if (e.data.booked === undefined || e.data.booked === '') {
            e.data.booked = false;
            e.data.booked_date = '';
        }
        
        // this.details$ = this.journalService.getJournalDetail(e.data.journal_id);        
        // this.journalForm = this.fb.group({
        //     journal_id: [e.data.journal_id],
        //     description: [e.data.description, Validators.required],            
        //     cdate: [e.data.create_date, Validators.required],
        //     entry: ['',Validators.required] ,
        //     account: ['',Validators.required] ,
        //     fund:['',Validators.required] ,
        //     debit:['',Validators.required] ,
        //     credit:['',Validators.required],                       
        // });
        
        this.bOpenDetail = true;
        this.nJournal = e.data.journal_id;
        this.openDrawer();
    }

    onFocusedDetailRowChanged(e: any) {
        console.log('onFocusRowChanged :', JSON.stringify(e.row.data))
        
        var description = e.row.data.description;
        var fund = e.row.data.fund;
        var child = e.row.data.child;
        var debit =  e.row.data.debit;
        var credit = e.row.data.credit;

        this.journalForm = this.fb.group({           
            entry: [description, Validators.required] ,
            child: [child,Validators.required] ,
            fund:[fund,Validators.required] ,
            debit:[debit,Validators.required] ,
            credit:[credit,Validators.required],                       
        });
        
    }

    onFocusedRowChanged(e: any) {
        console.log('onFocusRowChanged :', JSON.stringify(e.row.data))            
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
