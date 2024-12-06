import { Component, OnDestroy, OnInit, ViewEncapsulation, inject, viewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CommonModule } from '@angular/common';
import { FundsService } from 'app/services/funds.service';
import { GLAccountsService } from 'app/services/accounts.service';
import { GridMenubarStandaloneComponent } from '../../grid-menubar/grid-menubar.component';
import { MaterialModule } from 'app/services/material.module';
import { SubTypeService } from 'app/services/subtype.service';
import { TypeService } from 'app/services/type.service';

import { 
    DialogEditEventArgs, 
    EditService, 
    SelectionSettingsModel, 
    GroupService, 
    FilterService, 
    GridModule, 
    PageService, 
    SaveEventArgs, 
    SortService, 
    ToolbarService, 
    GridComponent, 
    AggregateService, 
    FilterSettingsModel, 
    ToolbarItems, 
    SearchSettingsModel, 
    ColumnMenuService, 
    ResizeService, 
    PdfExportService, 
    ExcelExportService, 
    ReorderService, 
    DetailRowService} from '@syncfusion/ej2-angular-grids';

import { Browser } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { IJournalDetail, IJournalHeader } from 'app/models/journals';
import { JournalStore } from 'app/services/journal.store';
import { Router } from '@angular/router';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';


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
    selector: 'transactions',
    imports: [imports],
    encapsulation: ViewEncapsulation.None,
    templateUrl: './journal-listing.component.html',
    providers: [ToolbarService,
        FilterService,
        ExcelExportService,
        PdfExportService,
        SortService,
        JournalStore,
        SortService,
        ResizeService,
        ReorderService,
        PageService,
        ResizeService,
        GroupService,
        FilterService,
        DetailRowService,
        EditService,
        AggregateService,
        ColumnMenuService]
})
export class JournalEntryComponent implements OnInit, OnDestroy {

    public typeService = inject(TypeService);
    public subtypeService = inject(SubTypeService);
    public fundService = inject(FundsService);
    public accountService = inject(GLAccountsService);
    public route = inject(Router);
    public store = inject(JournalStore);

    sTitle = 'Transaction Listings by Journal Type';
    grid = viewChild<GridComponent>('grid');    
    currentRowData: any;
    drawOpen: 'open' | 'close' = 'open';
    collapsed = false;    
    public sGridTitle = 'Journal Entry';
    
    selectedItemKeys: any[] = [];
    public journalType = 'GL';    
    public bOpenDetail: boolean = false;
    public pageSettings: Object;
    public formatoptions: Object;
    public filterOptions: FilterSettingsModel;
    public editSettings: Object;
    public dropDown: DropDownListComponent;
    public submitClicked: boolean = false;
    public selectionOptions?: SelectionSettingsModel;
    public toolbarOptions?: ToolbarItems[];
    public searchOptions?: SearchSettingsModel;
    public filterSettings: FilterSettingsModel;
    public journalForm!: FormGroup;
    public keyField: any;

    customizeTooltip = (pointsInfo: { originalValue: string; }) => ({ text: `${parseInt(pointsInfo.originalValue)}%` });

    initialDatagrid() {
        this.formatoptions = { type: 'dateTime', format: 'M/dd/yyyy' }
        this.pageSettings = { pageSizes: true, pageCount: 10 };
        this.selectionOptions = { mode: 'Cell' };
        this.editSettings = { allowEditing: true, allowAdding: false, allowDeleting: false };
        this.searchOptions = { operator: 'contains', ignoreCase: true, ignoreAccent: true };
        this.toolbarOptions = ['Search']
        this.filterSettings = { type: 'Excel' };
    }

    toolbarClick(args: ClickEventArgs): void {
        if (args.item.id === 'grid_excelexport') {             
            this.grid().excelExport();
        }
        else if (args.item.id === 'grid_csvexport') { 
            this.grid().csvExport();
        }
    }

    onBack(e: string) {
        console.debug('onBack: ', e)
    }

    onExportXL(e: string) {        
        this.grid().excelExport();
    }
    onExportCSV(e: string) {
        this.grid().csvExport();
    }
    
    onPrint(e: string) {
        this.grid().print();
    }
    
    onExportPDF(e: string) {
        this.grid().pdfExport();
    }
        
    ngOnInit() {
        this.initialDatagrid();
    }

    onLoad(): void {
        var params = {
            period: 1,
            period_year: 2024
        }
        // this.store.loadAllDetails(params)    
    }

    actionBegin(args: SaveEventArgs): void {
        var data = args.rowData as IJournalHeader;
        
        if (args.requestType === 'beginEdit' || args.requestType === 'add') {
            args.cancel = true;
            this.submitClicked = false;
            this.bOpenDetail = true;
            this.journalType = data.type;
            this.currentRowData = data;
            this.route.navigate(['journals/gl', data.journal_id]);
        }
        if (args.requestType === 'save') {
            args.cancel = true;        
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

    public dateValidator() {
        return (control: FormControl): null | Object => {
            return control.value && control.value.getFullYear &&
                (1900 <= control.value.getFullYear() && control.value.getFullYear() <= 2099) ? null : { OrderDate: { value: control.value } };
        }
    }

    public onClickGrid() { 
        const selectedRecords = this.grid().getSelectedRecords();
        const records = this.store.details();
        this.grid().childGrid.dataSource = this.store.details();
    }

    public onAdd() {
        this.bOpenDetail = true;        
    }

    public onRefresh() {
        console.debug('Refresh')
    }

    public onDeleteSelection() {
        console.debug('Delete Selection')
    }

    public onUpdateSelection() {
        console.debug('onUpdateSelection')
    }

    public onDelete(e: any) {
        console.debug('onDelete')
    }

    public onUpdate($event: any) {
        console.debug('onUpdate')
    }

    public onBooked(booked: boolean) {
        this.journalForm.patchValue({ booked: booked });
    }

    updateBooked() { }

    ngOnDestroy() {

    }
}
