import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit, ViewEncapsulation, inject, input, output, viewChild } from '@angular/core';
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
import { PeriodStore } from 'app/store/periods.store';
import { SummaryCardComponent } from "../../admin/dashboard/summary-card.component";
import { take } from 'rxjs';


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
    selector: 'ar-journal-list',
    imports: [imports, GridMenubarStandaloneComponent, SummaryCardComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    template: `    
    <div id="target" class="flex flex-col w-full filter-article filter-interactive text-gray-700 ">
    <div class="sm:hide md:visible ml-5 mr-5">
        <grid-menubar class="pl-5 pr-5"            
            [showBack]="true"             
            [showPeriod]="true"
            (print)="onPrint()"
            (back)="onBack()"  
            (clone)="onClone()"  
            (period)="onPeriod($event)"         
            [inTitle]="'Account Receivable Update'" 
            [prd]="journalStore.currentPeriod()"
            [prd_year]="journalStore.currentYear()">
        </grid-menubar>
     </div>

    <div id="settings" class="control-section default-splitter flex flex-col overflow-hidden">    
      <div class="grid grid-row-3 overflow-hidden">
        <div class="flex flex-col min-w-0 overflow-y-auto -px-10" cdkScrollable>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 w-full min-w-400 overflow-hidden ml-3 mr-3">
            
              <div  class="flex-auto p-6 bg-card shadow rounded-2xl overflow-hidden m-2 hover:cursor-pointer">
                  <summary-card (click)="onReceipts()" class="min-h-48" [mainValue]="1526.00" [caption]="'Receipts'" [title]="'Funds'" [chart]="'1'"
                  [subtitle]="currentPeriod" [subtitle_value]="">
                  </summary-card>
              </div>
              
              <div  class="flex-auto p-6 bg-card shadow rounded-2xl overflow-hidden m-2 hover:cursor-pointer">
                  <summary-card class="min-h-32" (click)="onReceipts()" [mainValue]="24000.00" [caption]="'Outstanding'" [title]="'30 Days'"
                  [subtitle]="currentPeriod" [subtitle_value]="" [chart]="'4'">
                  </summary-card>
              </div>
              <div class="flex-auto p-6 bg-card shadow rounded-2xl overflow-hidden m-2 hover:cursor-pointer">
                  <summary-card  class="min-h-32" (click)="onReceipts()" [mainValue]="45050.00" [caption]="'Current Receivables'" [title]="'Capital'"
                  [subtitle]="currentPeriod" [subtitle_value]="" [chart]="'5'">
                  </summary-card>
              </div>
              
              <div class="flex-auto p-6 bg-card shadow rounded-2xl overflow-hidden m-2 hover:cursor-pointer">
                  <summary-card  class="min-h-32" (click)="onReceipts()"  [mainValue]="15000.00" [caption]="'Past Due Receipts'" [title]="'Capital'"
                      [subtitle]="currentPeriod" [subtitle_value]="" [chart]="'3'">
                  </summary-card>
              </div>
          </div>
      
          <mat-drawer-container id="target" class="flex flex-col min-w-0 overflow-y-auto -px-10 h-[calc(100vh-21.5rem)] mr-4 ml-4">     
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
                                                    
                </div>
           </mat-card>       
            
            <ejs-contextmenu              
                target='#target' 
                (select)="itemSelect($event)"
                [animationSettings]='animation'
                [items]= 'menuItems'> 
            </ejs-contextmenu> 
          </mat-drawer-container>
          
        </div>
      </div>
    </div>
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


export class ARJournalListComponent implements OnInit {

    public route = inject(Router);
    public toast = inject(ToastrService);
    public journalStore = inject(JournalStore);
    
    public settingsService = inject(SettingsService);
    public changeDetectorRef = inject(ChangeDetectorRef);
    public periodStore = inject(PeriodStore);

    private fb = inject(FormBuilder);

    public isVisible = true;

    //public periodForm!: FormGroup;
    public transactionType = input('all');
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
    public gridHeight: number;
    public groupSettings: { [x: string]: Object } = { showDropArea: true };
    
    // periods$ = this.store.select(periodsFeature.selectPeriods);

    drawer = viewChild<MatDrawer>("drawer");
    grid = viewChild<GridComponent>('grid');
    toolbar = viewChild<GridMenubarStandaloneComponent>('toolbar');
    onCloseDrawer = output();

    currentRowData: any;
    drawOpen: 'open' | 'close' = 'open';
    collapsed = false;
    activatedRoute: any;
    journalHeader: any;
    accountList: any;
    subtypeList: any;
    templateList: any;
    partyList: any;
    currentPeriod: any; 
    updateTransactionPeriod(currentPeriod: string) {

        const current = this.activePeriods().filter((period) => period.description === currentPeriod)
        if (current.length === 0) {
            this.toast.error('No period found');
            return;
        }        
        
        
        
        
    }

    ngOnInit() {
        
        var currentPeriod = localStorage.getItem('currentPeriod');        
        if (currentPeriod === null) {
            currentPeriod = 'January 2025';
        }
        this.journalStore.getJournalListByPeriod({current_period: currentPeriod})                
        this.currentPeriod = currentPeriod;        
        localStorage.setItem('openPeriods', JSON.stringify(this.periodStore.activePeriods()));
                                        
        this.toolbarTitle = "Journal Transactions by Period ";        
        this.formatoptions = { type: 'dateTime', format: 'M/dd/yyyy' }
        this.selectionOptions = { mode: 'Row', type: 'Single' };
        this.editSettings = { allowEditing: true, allowAdding: false, allowDeleting: false };
        this.searchOptions = { operator: 'contains', ignoreCase: true, ignoreAccent: true };
        this.toolbarOptions = ['Search'];
        this.filterSettings = { type: 'Excel' };
        this.lines = 'Both';
        this.toast.info('Loading Journals');               
    }
    refreshJournalForm(journalHeader: any) {
        throw new Error('Method not implemented.');
    }

    onPeriod(event: any) {
        this.currentPeriod = event;
        localStorage.setItem('currentPeriod', this.currentPeriod);
        this.journalStore.getJournalListByPeriod({current_period: event})                
        this.journalStore.getJournalListByPeriod({current_period: this.currentPeriod})
        this.toast.info(event, 'Period changed to: ');
        this.changeDetectorRef.detectChanges();
        
    }

    onTemplate() {
        this.toast.info('Template');
    }

    onClone() {
        // this.store.dispatch(cloneJournal({ journal_id: this.currentRowData.journal_id }));
        this.toast.info('Journal Entry Cloned : ', this.currentRowData.journal_id);
    }

    onAdd() {
        this.toast.info('Add');
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
        // var period = this.periodForm.getRawValue();
        // var periodPrm = { period: period.period(), period_year: period.period_year() } as IPeriodParam;
        // this.settingsService.updateCurrentPeriod(periodPrm).subscribe((res) => {
        //     this.toast.success('Period Updated : ' + periodPrm.period + ' - ' + periodPrm.period_year);
        // });        
        // this.journalStore.loadJournalsByPeriod(periodPrm);
        // this.closeDrawer();
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

    

      onBack() {
        throw new Error('Method not implemented.');
      }
      onReceipts() {
        throw new Error('Method not implemented.');
      }
    
      onOpenSettings() {
        throw new Error('Method not implemented.');
      }
      onPrinting() {
        throw new Error('Method not implemented.');
      }
    
}



