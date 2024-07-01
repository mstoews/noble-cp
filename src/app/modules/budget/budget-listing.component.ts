import { Component, OnDestroy, OnInit, inject, viewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IJournalDetail, JournalService } from 'app/services/journal.service';
import { Observable, ReplaySubject, Subject, map, takeUntil } from 'rxjs';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { CommonModule } from '@angular/common';
import { DndComponent } from 'app/modules/drag-n-drop/loaddnd/dnd.component';

import { FundsService } from 'app/services/funds.service';
import { GLAccountsService } from 'app/services/accounts.service';

import { GridMenubarStandaloneComponent } from '../accounting/grid-menubar/grid-menubar.component';
import { BudgetDetailComponent } from './budget-detail/budget-detail.component';
import { BudgetUpdateComponent } from './budgetl-update/budget-update.component';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { SubTypeService } from 'app/services/subtype.service';
import { TypeService } from 'app/services/type.service';
import { Workbook } from 'exceljs';

import { saveAs } from 'file-saver-es';

const imports = [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,    
    DndComponent,
    GridMenubarStandaloneComponent,
    NgxMatSelectSearchModule
];


@Component({
    selector: 'budgets',
    standalone: true,
    imports: [imports],
    templateUrl: './budget-listing.component.html',    
})
export class BudgetEntryComponent implements OnInit, OnDestroy {
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
    journalUpdate = viewChild(BudgetUpdateComponent);

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
        // this.transactionService.update(this.journalForm.value).then((res: any) => {
        //     console.debug(`update ${JSON.stringify(res)}`);
        // });
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
