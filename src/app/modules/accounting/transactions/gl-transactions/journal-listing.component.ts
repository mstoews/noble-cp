import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation, inject, viewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { CommonModule } from '@angular/common';
import { DndComponent } from 'app/modules/drag-n-drop/loaddnd/dnd.component';

import { FundsService } from 'app/services/funds.service';
import { GLAccountsService } from 'app/services/accounts.service';

import { GridMenubarStandaloneComponent } from '../../grid-menubar/grid-menubar.component';
import { JournalUpdateComponent } from './journal-update.component';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { SubTypeService } from 'app/services/subtype.service';
import { TypeService } from 'app/services/type.service';

import { DialogEditEventArgs, 
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
import { JournalStore } from 'app/store/journal.store';
import { Router } from '@angular/router';


const imports = [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    JournalUpdateComponent,
    DndComponent,
    GridMenubarStandaloneComponent,
    NgxMatSelectSearchModule,
    GridModule
];

@Component({
    selector: 'transactions',
    standalone: true,
    imports: [imports],
    encapsulation: ViewEncapsulation.None,
    templateUrl: './journal-listing.component.html',
    providers: [ ToolbarService, 
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
                 ColumnMenuService],
})
export class JournalEntryComponent implements OnInit, OnDestroy {

    public typeService = inject(TypeService);
    public subtypeService = inject(SubTypeService);
    public fundService = inject(FundsService);
    public accountService = inject(GLAccountsService);
    public route = inject(Router);
    public store = inject(JournalStore);


    drawer = viewChild<MatDrawer>('drawer');
    grid = viewChild<GridComponent>('grid');
    
    currentRowData: any;

    drawOpen: 'open' | 'close' = 'open';
    collapsed = false;
    sTitle = 'Journal Entry';
    selectedItemKeys: any[] = [];

    public journalType = 'GL';
    
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
    public journalForm!: FormGroup;
    public keyField: any;
    public childData?: IJournalDetail[] | null;
    
    customizeTooltip = (pointsInfo: { originalValue: string; }) => ({ text: `${parseInt(pointsInfo.originalValue)}%` });

    initialDatagrid() {
        // this.pageSettings = { pageCount: 10 };        
        this.formatoptions = { type: 'dateTime', format: 'M/dd/yyyy' }
        this.pageSettings = { pageSizes: true, pageCount: 10 };
        this.selectionOptions = { mode: 'Cell' };
        this.editSettings = { allowEditing: true, allowAdding: false, allowDeleting: false };
        this.searchOptions = { operator: 'contains', ignoreCase: true, ignoreAccent: true };
        this.toolbarOptions = ['Search', 'ExcelExport', 'PdfExport', 'CsvExport','Print']
        this.filterSettings = { type: 'Excel' };
    }

    
    ngOnInit() {
        this.initialDatagrid();
        this.onLoad();
    }

    onLoad(): void {
        var params = {
            period: 1,
            period_year: 2024
        }
        this.store.loadAllDetails(params)    
    }

    actionBegin(args: SaveEventArgs): void {
        var data = args.rowData as IJournalHeader;
        if (args.requestType === 'beginEdit' || args.requestType === 'add') {
            args.cancel = true;
            this.submitClicked = false;
            this.bOpenDetail = true;
            this.journalType = data.type;
            this.currentRowData = data;

            switch (data.type) {
                case 'GL':
                    this.route.navigate(['journals/gl', data.journal_id]);
                    break;
                case 'AP':
                    this.route.navigate(['journals/ap', data.journal_id]);
                    break;
                case 'AR':
                    this.route.navigate(['journals/ar', data.journal_id]);
                    break;
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

    public childDataGrid: GridModule = {
        dataSource: this.childData,
        filterSettings: { type: 'Excel' },
        queryString: 'child',        
        columns: [    
            { field: 'journal_subid',headerText: 'ID', textAlign: 'left', width: 50 },
            { field: 'child', headerText: 'Child', textAlign: 'left', width: 100 },
            { field: 'description', headerText: 'Description', textAlign: 'left', width: 100},
            { field: 'fund', headerText: 'Fund', textAlign: 'left', width: 100 },            
            { field: 'debit', headerText: 'Debit', textAlign: 'Right', format: 'N2',  width: 100},
            { field: 'credit', headerText: 'Credit', textAlign: 'Right', format: 'N2', width: 100},
            ],
            aggregates: [
                {
                  columns: [
                    {
                      type: 'Sum',
                      field: 'debit',
                      footerTemplate: '${Sum}',
                      format: 'N2'
                    },
                    {
                        type: 'Sum',
                        field: 'credit',
                        footerTemplate: '${Sum}',
                        format: 'N2'
                      },
                  ],
                },                
              ],
        
    }

    onClickGrid() { 
        const selectedRecords = this.grid().getSelectedRecords();
        const records = this.store.details();
        this.grid().childGrid.dataSource = this.store.details();
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


    onEdit() {
        this.bOpenDetail = true;
        this.openDrawer();
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

    }
}
