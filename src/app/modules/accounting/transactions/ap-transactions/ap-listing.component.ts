import { Component, OnDestroy, OnInit, ViewChild, inject, viewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CommonModule } from '@angular/common';
import { DndComponent } from 'app/modules/drag-n-drop/loaddnd/dnd.component';
import { GridMenubarStandaloneComponent } from '../../grid-menubar/grid-menubar.component';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { DialogEditEventArgs, EditService, SelectionSettingsModel, GroupService, FilterService, GridModule, PageService, SaveEventArgs, SortService, ToolbarService, GridComponent, AggregateService, FilterSettingsModel, ToolbarItems, SearchSettingsModel, GroupSettingsModel, ColumnMenuService, ResizeService, ExcelExport, PdfExportService, ExcelExportService, ReorderService } from '@syncfusion/ej2-angular-grids';
import { Browser } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';

import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { IJournalHeader } from 'app/models/journals';

import { JournalStore } from 'app/services/journal.store';
import { Router } from '@angular/router';

const imports = [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    GridMenubarStandaloneComponent,
    NgxMatSelectSearchModule,
    GridModule
];


@Component({
    selector: 'ap-transactions',
    imports: [imports],
    templateUrl: './ap-listing.component.html',
    providers: [JournalStore, ResizeService, SortService, ReorderService, ExcelExportService, PdfExportService, PageService, ResizeService, GroupService, FilterService, ToolbarService, EditService, AggregateService, ColumnMenuService]
})
export class APTransactionComponent implements OnInit, OnDestroy {

    public route = inject(Router);

    store = inject(JournalStore);

    @ViewChild('grid')
    public grid?: GridComponent;

    drawer = viewChild<MatDrawer>('drawer')
    currentRowData: any;

    drawOpen: 'open' | 'close' = 'open';
    collapsed = false;
    sTitle = 'Journal Entry';
    selectedItemKeys: any[] = [];

    public nJournal = 0;
    public description = '';
    public transaction_date = '';
    public amount = '';
    public journalType = 'GL';
    public currentDate: string;
    public journal_details: any[];
    public bOpenDetail: boolean = false;

    // datagrid settings start
    public pageSettings: Object;
    public formatoptions: Object;
    public initialSort: Object;
    public filterOptions: FilterSettingsModel;
    public editSettings: Object;
    public dropDown: DropDownListComponent;
    public submitClicked: boolean = false;
    public selectionOptions?: SelectionSettingsModel;
    public toolbarOptions?: ToolbarItems[];
    public searchOptions?: SearchSettingsModel;
    public filterSettings: FilterSettingsModel;


    initialDatagrid() {
        // this.pageSettings = { pageCount: 10 };        
        this.formatoptions = { type: 'dateTime', format: 'M/dd/yyyy' }
        this.pageSettings = { pageSizes: true, pageCount: 10 };
        this.selectionOptions = { mode: 'Cell' };
        this.editSettings = { allowEditing: false, allowAdding: false, allowDeleting: false };
        this.searchOptions = { fields: ['description'], operator: 'contains', ignoreCase: true, ignoreAccent: true };
        this.toolbarOptions = ['Search'];
        this.filterSettings = { type: 'CheckBox' };
    }


    customizeTooltip = (pointsInfo: { originalValue: string; }) => ({ text: `${parseInt(pointsInfo.originalValue)}%` });
    journalForm!: FormGroup;
    keyField: any;
    protected _onDestroy = new Subject<void>();

    ngOnInit() {
        this.store.accountsPayable();
        console.debug('AP :', this.store.ap().length)
        this.initialDatagrid();
    }

    actionBegin(args: SaveEventArgs): void {
        args.cancel = true;
        var data = args.rowData as IJournalHeader;
        if (args.requestType === 'beginEdit' || args.requestType === 'add') {

            this.submitClicked = false;
            this.bOpenDetail = true;
            this.journalType = data.type;

            this.nJournal = Number(data.journal_id);
            if (this.nJournal > 0) {
                this.route.navigate(['journals/ap', data.journal_id]);
            }
        }
        if (args.requestType === 'save') {
            args.cancel = true;
            console.log(JSON.stringify(args.data));
            var data = args.data as IJournalHeader;
            this.submitClicked = true;
        }
    }

    actionComplete(args: DialogEditEventArgs): void {
        if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
            if (Browser.isDevice) {
                args.dialog.height = window.innerHeight - 90 + 'px';
                (<Dialog>args.dialog).dataBind();
            }
            if (args.requestType === 'beginEdit') {
                // (args.form.elements.namedItem('CustomerName') as HTMLInputElement).focus();
            } else if (args.requestType === 'add') {
                // (args.form.elements.namedItem('OrderID') as HTMLInputElement).focus();
            }
        }
    }

    dateValidator() {
        return (control: FormControl): null | Object => {
            return control.value && control.value.getFullYear &&
                (1900 <= control.value.getFullYear() && control.value.getFullYear() <= 2099) ? null : { OrderDate: { value: control.value } };
        }
    }

    onAdd() {
        this.bOpenDetail = true;
        this.nJournal = 0;
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

    updateBooked() { }

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
