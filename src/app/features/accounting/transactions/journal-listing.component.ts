import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, ViewEncapsulation, inject, input, output, viewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/shared/material.module';
import { MatDrawer } from '@angular/material/sidenav';
import { FilterTypePipe } from 'app/filter-type.pipe';
import { AggregateService, ColumnMenuService, ContextMenuService, EditService, EditSettingsModel, ExcelExportService, FilterService, FilterSettingsModel, GridComponent, GridLine, GridModule, GroupService, PageService, PdfExportService, ReorderService, ResizeService, RowSelectEventArgs, SearchService, SearchSettingsModel, SelectionSettingsModel, SortService, ToolbarItems, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { ToastrService } from 'ngx-toastr';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-navigations';
import { ContextMenuModule } from '@syncfusion/ej2-angular-navigations';
import { Router } from '@angular/router';
import { JournalCardComponent } from "./journal-card.component";
import { JournalStore } from 'app/store/journal.store';
import { ICurrentPeriod, IPeriodParam } from 'app/models/period';
import { SettingsService } from 'app/services/settings.service';
import { GridMenubarStandaloneComponent } from '../grid-components/grid-menubar.component';
import { JournalService } from 'app/services/journal.service';
import { PeriodStore } from 'app/store/periods.store';
import { titleSettings } from '@syncfusion/ej2-charts';


const providers = [
    ReorderService,
    PdfExportService,
    ExcelExportService,
    ContextMenuService,
    GroupService,
    SortService,
    PageService,
    ResizeService,
    FilterService,
    ToolbarService,
    EditService,
    AggregateService,
    ColumnMenuService,
    SearchService,
    JournalCardComponent
];

const imports = [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    GridModule,
    ContextMenuModule,
    FilterTypePipe,
];
@Component({
    selector: 'transactions',
    imports: [imports],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    template: `    
    <mat-drawer class="lg:w-[400px] md:w-full bg-white-100" #drawer [opened]="openDrawers()" mode="over" [position]="'end'" [disableClose]="false">
        <mat-card class="m-2">
            <div class="flex flex-col w-full text-gray-700">
                <div class="h-11 m-2 p-2 text-2xl text-justify text-white bg-slate-700" mat-dialog-title>
                    {{ 'Report Table Save Settings' }}
                </div>            

                <div mat-dialog-content>
                    <form [formGroup]="periodForm">

                        <div class="flex flex-col m-1">

                            <div class="flex flex-col grow">
                                <mat-label class="ml-2 text-base">Period</mat-label>
                                <mat-form-field class="m-1 form-element grow" appearance="outline">
                                    <input matInput placeholder="Period" formControlName="period" />
                                </mat-form-field>
                            </div>

                            <div class="flex flex-col grow">
                                <mat-label class="ml-2 text-base">Year</mat-label>
                                <mat-form-field class="m-1 form-element" appearance="outline">
                                    <input matInput placeholder="Year" formControlName="period_year" />
                                </mat-form-field>
                            </div>

                        </div>
                    </form>
                </div>
                <div mat-dialog-actions class="flex justify-end m-2">
                    <button mat-icon-button color="primary" class="bg-slate-300 hover:bg-slate-400 ml-1" (click)="onUpdate($event)" matTooltip="Edit"
                        aria-label="Button that displays a tooltip when focused or hovered over">
                        <span class="e-icons e-edit-4"></span>
                    </button>

                    <button mat-icon-button color="primary" class="bg-slate-300 hover:bg-slate-400 ml-1" (click)="closeDrawer()" matTooltip="Close"
                        aria-label="Button that displays a tooltip when focused or hovered over">                    
                        <span class="e-icons e-close-6"></span>
                    </button>
                </div>            
            </div>         
        </mat-card>
    </mat-drawer> 
    <mat-drawer-container id="target" class="flex flex-col min-w-0 overflow-y-auto -px-10 h-[calc(100vh-21.5rem)] ">    
        <mat-card>            
            <div class="flex-auto">                    
                        
                        @if(journalStore.isLoading() === false) { 
                            <ng-container>                     
                                <ejs-grid #grid id="grid"
                                    [dataSource]="journalStore.gl() | filterType : transactionType()"                                    
                                    [height]='gridHeight' 
                                    [rowHeight]='30'                                  
                                    [allowSorting]='true'                                    
                                    [showColumnMenu]='false'                
                                    [gridLines]="lines"
                                    [allowFiltering]='false'                 
                                    [toolbar]='toolbarOptions'                                             
                                    [editSettings]='editSettings'
                                    [enablePersistence]='false'                                    
                                    [allowGrouping]="true"
                                    [allowResizing]='true' 
                                    [allowReordering]='true' 
                                    [allowExcelExport]='true'
                                    [allowSelection]='true'                                     
                                    [allowPdfExport]='true'            
                                    [groupSettings]='groupSettings' 
                                    (rowSelected)='onRowSelected($event)'                                
                                    (actionBegin)='selectedRow($event)' >
                                    <e-columns>
                                        <e-column field='journal_id' headerText='ID' isPrimaryKey='true' isIdentity='true' [visible]=false width='40'></e-column>                                            
                                        <e-column field="type" headerText="ID" width="80">
                                                <ng-template #template let-data>                                                                
                                                    @switch (data.type) 
                                                    {                                    
                                                        @case ('GL') {                                        
                                                            <span class="e-badge flex text-md gap-1 items-center w-max bg-transparent">
                                                                <div class="w-4 h-4  rounded-full bg-green-700"></div>
                                                                GL - {{data.journal_id}}
                                                            </span>
                                                        }
                                                        @case ('AP') {
                                                        <span class="e-badge flex text-md  gap-1 items-center w-max bg-transparent">
                                                            <div class="w-4 h-4 rounded-full bg-blue-700"></div>
                                                                AP - {{data.journal_id}}
                                                        </span>
                                                        }                                    
                                                        @case ('AR') {
                                                            <span class="e-badge flex text-md  gap-1 items-center w-max bg-transparent">
                                                                <div class="w-4 h-4 rounded-full bg-cyan-600"></div>
                                                                AR - {{data.journal_id}}
                                                            </span>
                                                        }
                                                        @case ('CL') {
                                                            <span class="e-badge flex  text-md  gap-1 items-center w-max bg-transparent">
                                                                <div class="w-4 h-4 rounded-full bg-purple-700"></div>
                                                                CL - {{data.journal_id}}
                                                            </span>
                                                        }
                                                    }
                                                </ng-template>
                                        </e-column>                                                                
                                        <e-column field='description' headerText='Description' width='150'></e-column>
                                        <e-column field='booked' headerText='Bk' width='60' [visible]=false ></e-column>
                                            <ng-template #template let-data>                       
                                                    @if(data.booked === 'true') {
                                                        <div>
                                                            <span class="text-green-800 border-2 p-1 rounded-md text-sm bg-gray-100">{{data.booked}}</span>  
                                                        </div>
                                                    } @else 
                                                    {                                            
                                                    <div>                                    
                                                            <span class="text-blue-800 border-2 p-1 rounded-md text-sm bg-gray-100">{{data.booked}}</span>                                                                                    
                                                    </div>                                                                                            
                                                    }   
                                            </ng-template>                                                   
                                        <e-column field='transaction_date' headerText='Date' width='60' format='M/dd/yyyy' textAlign='Middle'></e-column>
                                        <e-column field="status" headerText="Status" width="60">
                                                <ng-template #template let-data>                                                                
                                                    @switch (data.status) 
                                                    {                                    
                                                        @case ('CLOSED') {                                        
                                                            <span class="e-badge flex text-md gap-1 items-center w-max bg-transparent">
                                                                <div class="w-4 h-4  rounded-full bg-green-700"></div>
                                                                Completed
                                                            </span>
                                                        }
                                                        @case ('OPEN') {
                                                        <span class="e-badge flex text-md  gap-1 items-center w-max bg-transparent">
                                                            <div class="w-4 h-4 rounded-full bg-amber-500"></div>
                                                            Open
                                                        </span>
                                                        }                                    
                                                        @case ('CLEARED') {
                                                            <span class="e-badge flex text-md  gap-1 items-center w-max bg-transparent">
                                                                <div class="w-4 h-4 rounded-full bg-cyan-800"></div>
                                                                Cleared
                                                            </span>
                                                        }
                                                        @case ('REVERSED') {
                                                            <span class="e-badge flex  text-md  gap-1 items-center w-max bg-transparent">
                                                                <div class="w-4 h-4 rounded-full bg-red-700"></div>
                                                                Reversed
                                                            </span>
                                                        }
                                                    }
                                                </ng-template>
                                        </e-column>                                                                                                        
                                        <e-column field="status" headerText="Period" width="60">                                                
                                            <ng-template #template let-data>                                                                
                                                {{data.period_year}} - {{data.period}}  
                                            </ng-template>
                                        </e-column>
                                        <e-column field='amount' headerText='Amount' width='80' format='N2' textAlign='Right'></e-column>
                                        <e-column field='period_year' headerText='Yr' width='100' [visible]='false'></e-column>
                                        <e-column field='create_date' headerText='Updated' width='100' format='M/dd/yyyy' [visible]='false'></e-column>
                                        <e-column field='create_user' headerText='User' width='100' [visible]='false'></e-column>
                                        <e-column field='party_id'    headerText='Vendor' width='100' [visible]='true'></e-column>
                                    </e-columns>
                                    <e-aggregates>
                                            <e-aggregate>
                                                <e-columns>
                                                    <e-column type="Sum" field="amount" format="N2">
                                                        <ng-template #groupFooterTemplate let-data>{{data.Sum}}</ng-template>
                                                    </e-column>
                                                </e-columns>
                                            </e-aggregate>
                                            <e-aggregate>
                                                <e-columns>
                                                    <e-column type="Sum" field="amount" format="N2">
                                                        <ng-template #footerTemplate let-data>{{data.Sum}}</ng-template>
                                                    </e-column>                                                    
                                                </e-columns>
                                            </e-aggregate>
                                    </e-aggregates>
                                </ejs-grid>         
                            </ng-container> 
                            
                            }
                        @else {
                            <div class="flex justify-center items-center">
                                <mat-spinner></mat-spinner>
                            </div>
                        } 
                        
                        <!-- @else  {
                        @placeholder(minimum 200ms) {
                            <div class="flex justify-center items-center">
                            <mat-spinner></mat-spinner>
                            </div>
                        }       
                    }                              -->
            </div>
        </mat-card>       
         

         <ejs-contextmenu              
             target='#target' 
             (select)="itemSelect($event)"
             [animationSettings]='animation'
             [items]= 'menuItems'> 
         </ejs-contextmenu> 

    </mat-drawer-container>
    `,
    styles: `
     .custom-css {  
        background: #093d16;
        font-style: sans-serif;        
        color: white;
    }
    `,
    providers: [providers]
})


export class JournalEntryComponent implements AfterViewInit {

    public route = inject(Router);

    public toast = inject(ToastrService);
    public journalStore = inject(JournalStore);
    public journalService = inject(JournalService);
    public settingsService = inject(SettingsService);
    public changeDetectorRef = inject(ChangeDetectorRef);
    
    public isVisible = true;

    public periodForm!: FormGroup;
    public transactionType = input('');
    public activePeriods = input<ICurrentPeriod[]>(null);
    public openDrawers = input<boolean>(false);
    public printClicked = input<boolean>(false);
    public currentPrd = input<string>(null)

    public toolbarTitle: string;
    public sGridTitle: string;

    public formatoptions: Object;
    public initialSort: Object;
    public editSettings: EditSettingsModel;
    public dropDown: DropDownListComponent;
    public submitClicked: boolean = false;
    public selectionOptions?: SelectionSettingsModel;
    public toolbarOptions?: ToolbarItems[];
    public searchOptions?: SearchSettingsModel;
    public filterSettings: FilterSettingsModel;
    public lines: GridLine;
    
    public periodParam: IPeriodParam;

    public groupSettings: { [x: string]: Object } = { showDropArea: true };
    
    // periods$ = this.store.select(periodsFeature.selectPeriods);

    drawer = viewChild<MatDrawer>("drawer");
    grid = viewChild<GridComponent>('grid');
    toolbar = viewChild<GridMenubarStandaloneComponent>('toolbar');
    onCloseDrawer = output();

    currentRowData: any;
    drawOpen: 'open' | 'close' = 'open';
    collapsed = false;
    updateTransactionPeriod(currentPeriod: string) {

        const current = this.activePeriods().filter((period) => period.description === currentPeriod)
        if (current.length === 0) {
            this.toast.error('No period found');
            return;
        }

        var param = { period: current[0].period_id, period_year: current[0].period_year }
        this.journalStore.loadJournalsByPeriod(param);
        
    }

    ngOnInit() {

                
        const period = this.activePeriods().filter((period) => {
            period.description === period.description
        });
            
        period.forEach((prd) => {
            var param = { period: prd.period_id, period_year: prd.period_year }
            this.journalStore.loadJournalsByPeriod(param);
        });
                
        this.toolbarTitle = "Journal Transactions by Period ";        
        this.formatoptions = { type: 'dateTime', format: 'M/dd/yyyy' }
        this.selectionOptions = { mode: 'Row', type: 'Single' };
        this.editSettings = { allowEditing: true, allowAdding: false, allowDeleting: false };
        this.searchOptions = { operator: 'contains', ignoreCase: true, ignoreAccent: true };
        this.toolbarOptions = ['Search'];
        this.filterSettings = { type: 'Excel' };
        this.lines = 'Both';
        this.changeDetectorRef.markForCheck();

    }

    onTemplate() {
        this.toast.success('Template');
    }

    onClone() {
        // this.store.dispatch(cloneJournal({ journal_id: this.currentRowData.journal_id }));
        this.toast.success('Journal Entry Cloned : ', this.currentRowData.journal_id);
    }

    onAdd() {
        this.toast.success('Add');
    }

    onRowSelected(args: RowSelectEventArgs) {
        this.currentRowData = args.data; // Handle row selection event        
    }

    selectedRow(args: any) {
        if (args.requestType === 'beginEdit' || args.requestType === 'add') {
            args.cancel = true;
            this.currentRowData = args.rowData;
            this.route.navigate(['journals/gl', args.rowData.journal_id]);
        }
    }
    closeDrawer() {
        this.onCloseDrawer.emit();
    }

    exportLX() {
        this.grid().excelExport
    }
    exportPDF() {
        this.grid().pdfExport();
    }
    exportCSV() {
        this.grid().csvExport
    }

    onPrint() {
        this.grid().print();
    }

    public dateValidator() {
        return (control: FormControl): null | Object => {
            return control.value && control.value.getFullYear &&
                (1900 <= control.value.getFullYear() && control.value.getFullYear() <= 2099) ? null : { OrderDate: { value: control.value } };
        }
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
        var period = this.periodForm.getRawValue();
        var periodPrm = { period: period.period(), period_year: period.period_year() } as IPeriodParam;
        this.settingsService.updateCurrentPeriod(periodPrm).subscribe((res) => {
            this.toast.success('Period Updated : ' + periodPrm.period + ' - ' + periodPrm.period_year);
        });        
        this.journalStore.loadJournalsByPeriod(periodPrm);
        this.closeDrawer();
    }

    journalColumns = [
        { field: 'journal_id', headerText: 'Journal ID', isPrimaryKey: true, isIdentity: true, visible: true, width: 80 },
        { field: 'type', headerText: 'Type', width: 60 },
        { field: 'description', headerText: 'Description', width: 170 },
        { field: 'booked', headerText: 'Booked', width: 60, visible: false },
        { field: 'status', headerText: 'Status', width: 80 },
        { field: 'transaction_date', headerText: 'Date', width: 80, format: 'M/dd/yyyy' },
        { field: 'period', headerText: 'Prd', width: 50, visible: false },
        { field: 'amount', headerText: 'Amount', width: 80, format: 'N2', textAlign: 'Right' },
        { field: 'period_year', headerText: 'Yr', width: 100, visible: false },
        { field: 'create_date', headerText: 'Created', width: 100, format: 'M/dd/yyyy', visible: false },
        { field: 'create_user', headerText: 'User', width: 100, visible: false },
        { field: 'party_id', headerText: 'Party', width: 100, visible: false }
    ];

    public animation = {
        effect: 'FadeIn',
        duration: 800
    };

    public menuItems: MenuItemModel[] = [
        {
            text: 'Edit Journal',
            iconCss: 'e-icons e-edit-2'
        },
        {
            text: 'Create New Journal',
            iconCss: 'e-icons e-circle-add'
        },
        {
            text: 'Clone Journal Entry',
            iconCss: 'e-icons e-copy'
        },
        {
            text: 'Create Template',
            iconCss: 'e-icons e-table-overwrite-cells'
        },
        {
            separator: true
        },
        {
            text: 'Settings',
            iconCss: 'e-icons e-settings'
        },

    ];

    public itemSelect(args: MenuEventArgs): void {

        switch (args.item.text) {
            case 'Edit Journal':
                this.route.navigate(['journals/gl', this.currentRowData.journal_id]);
                break;
            case 'Create New Journal':
                this.onAdd();
                break;
            case 'Clone Journal Entry':
                this.onClone();
                break;
            case 'Create Template':
                this.onTemplate();
                break;
            case 'Settings':
                this.drawer().toggle();
                break;
        }
    }


    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        const width = window.innerWidth;
        if (width < 768) {
            this.isVisible = false;
        }
        else {
            this.isVisible = true;
        }

        this.adjustHeight();
    }



    ngAfterViewInit() {
        const width = window.innerWidth;
        if (width < 768) {
            this.isVisible = false;
        }
        else {
            this.isVisible = true;
        }
        this.adjustHeight();
    }

    adjustHeight() {
        if (this.grid()) {
            this.grid().height = (window.innerHeight - 700) + 'px'; // Adjust as needed
        }
    }

    public gridHeight: number;


}
