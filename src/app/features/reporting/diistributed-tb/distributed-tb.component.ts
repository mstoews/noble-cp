import { Component, inject, OnDestroy, OnInit, output, ViewChild, viewChild } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GridMenubarStandaloneComponent } from 'app/features/accounting/grid-components/grid-menubar.component';
import { ReportStore } from 'app/services/reports.store';
import { ITrialBalance } from 'app/models';
import { GLGridComponent } from 'app/features/accounting/grid-components/gl-grid.component';
import { MatButtonModule } from '@angular/material/button';
import { IGridSettingsModel } from 'app/services/grid.settings.service';
import { MaterialModule } from 'app/services/material.module';
import { MatDrawer } from '@angular/material/sidenav';
import { FormBuilder, FormControl } from '@angular/forms';
import { AggregateService, ColumnMenuService, ContextMenuItem, ContextMenuService, EditService, EditSettingsModel, ExcelExportService, FilterService, FilterSettingsModel, GridComponent, GridModule, PageService, ResizeService, SaveEventArgs, SearchSettingsModel, SelectionSettingsModel, SortService, ToolbarItems, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { IPeriod } from 'app/models/period';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { PeriodsService } from 'app/services/periods.service';
import { Router } from '@angular/router';



const mods = [
  MatProgressSpinnerModule,
  MaterialModule,
  GridModule,
  GridMenubarStandaloneComponent,
  MatButtonModule];

@Component({

  template: `
  <div class="flex flex-col min-w-0 overflow-y-auto -px-10">
    <div class="flex-auto">
        <div class="h-full border-gray-300">
            <div class="flex-col">
        <mat-drawer class="lg:w-[450px] md:w-full bg-white-100" #drawer [opened]="false" mode="over" [position]="'end'"
        [disableClose]="false">
        <div class="flex flex-col w-full text-gray-700 filter-article filter-interactive">
            <div class="h-11 m-2 p-2 text-2xl text-justify text-white bg-slate-700" mat-dialog-title>
                {{ 'Report Table Save Settings' }}
            </div>
            <div mat-dialog-content>
                <form [formGroup]="gridForm">

                    <div class="flex flex-col m-1">
                        
                        <div class="flex flex-col grow">
                            <mat-label class="ml-2 text-base">Settings Name</mat-label>
                            <mat-form-field class="m-1 form-element grow" appearance="outline">
                                <input matInput placeholder="Setting Name" formControlName="settings_name" />
                            </mat-form-field>
                        </div>
                        
                        <div class="flex flex-col grow">
                            <mat-label class="ml-2 text-base">Description</mat-label>
                            <mat-form-field class="m-1 form-element" appearance="outline">
                                <input matInput placeholder="Description" formControlName="description" />
                            </mat-form-field>
                        </div>

                    </div>
                </form>
            </div>
            <div mat-dialog-actions>
                <button mat-icon-button color="primary"
                       class="bg-slate-300 hover:bg-slate-400 ml-1"
                        (click)="onCommit($event)"
                       matTooltip="Select" aria-label="hovered over">
                      <span class="e-icons e-check"></span>
                </button>
                <button mat-icon-button color="primary" class="bg-slate-300 hover:bg-slate-400 ml-1" (click)="onUpdate($event)" matTooltip="Edit"
                    aria-label="Button that displays a tooltip when focused or hovered over">
                    <span class="e-icons e-edit-4"></span>
                    
                </button>
                <button mat-icon-button color="primary" class="bg-slate-300 hover:bg-slate-400 ml-1" (click)="onCreate($event)" matTooltip="Add"
                    aria-label="Button that displays a tooltip when focused or hovered over">
                    <span class="e-icons e-file-new"></span>
                </button>
                <button mat-icon-button color="primary" class="bg-slate-300 hover:bg-slate-400 ml-1" (click)="onDelete($event)" matTooltip="Delete"
                    aria-label="Button that displays a tooltip when focused or hovered over">
                    
                    <span class="e-icons e-delete-2"></span>
                </button>
                <button mat-icon-button color="primary" class="bg-slate-300 hover:bg-slate-400 ml-1" (click)="closeDrawer()" matTooltip="Close"
                    aria-label="Button that displays a tooltip when focused or hovered over">
                    
                    <span class="e-icons e-close-6"></span>
                </button>
            </div>            
        </div> 
        <mat-card class="m-2" > 
          <ejs-grid #settings id="items" [dataSource]="store.settings()" [rowHeight]='30'>
            <e-columns>
              <e-column field='settingsName' headerText='Settings Name' width='100' textAlign='Left'></e-column>            
              <e-column field='description' headerText='Description' width='200' textAlign='Left'></e-column>
              
            </e-columns>        
          </ejs-grid>
        </mat-card>       
    </mat-drawer> 
    <mat-drawer-container>
                @defer (on viewport; on timer(5s)) {
                    <ng-container>                    
                        
                        <grid-menubar [inTitle]="'Distribution Ledger'" 
                          (openSettings)="openDrawer()" 
                          (onPrint)="onPrint()"                          
                          (exportXL)="exportLX()"
                          (exportPRD)="exportPDF()"
                          (exportCSV)="exportCSV()"
                          (showPrint)="true"
                          (showExportXL)="true"
                          (showExportPDF)="true"
                          (showExportCSV)="true"
                          (showSettings)="true"
                          (showBack)="false" >
                        </grid-menubar>  
                          
                                                                          
                        @if (store.isLoading() === false) 
                        {                            
                            <ejs-grid #grid id="grid" class="mt-2 text-sm"
                                [rowHeight]='30'
                                allowSorting='true'
                                showColumnMenu='true' 
                                allowEditing='true' 
                                [gridLines]="'Both'"
                                [allowFiltering]='true'                 
                                [toolbar]='toolbarOptions'                 
                                [filterSettings]='filterSettings'
                                [editSettings]='editSettings' 
                                [pageSettings]='pageSettings'                 
                                [enableStickyHeader]='true' 
                                [enablePersistence]='false'
                                [enableStickyHeader]=true
                                [allowGrouping]="false"
                                [allowResizing]='true' 
                                [allowReordering]='true' 
                                [allowExcelExport]='true' 
                                [allowPdfExport]='true' 
                                [contextMenuItems]="contextMenuItems" 
                                (actionBegin)='actionBegin($event)' 
                                (actionComplete)='actionComplete($event)'                                 
                                [dataSource]="store.tb()" 
                                [columns]="columns">
                            </ejs-grid>                        
                        }
                           @else
                        {
                            <div class="fixed z-[1050] -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4">
                                <mat-spinner></mat-spinner>
                            </div>
                        }                
                    
                    </ng-container> 
                  
                }
                @placeholder(minimum 1000ms) {
                    <div class="flex justify-center items-center">
                       <mat-spinner></mat-spinner>
                    </div>
                }
            </mat-drawer-container>
            </div>
        </div>
    </div>
  </div>
  `,
  imports: [mods],
  selector: 'distributed-tb',
  providers: [ReportStore, ExcelExportService, ContextMenuService, SortService, PageService, ResizeService, FilterService, ToolbarService, EditService, AggregateService, ColumnMenuService],

})

export class DistributedTbComponent implements OnInit, OnDestroy {

  public store = inject(ReportStore);
  public periodsService = inject(PeriodsService);
  public grid = viewChild<GridComponent>('grid')
  public drawer = viewChild<MatDrawer>('drawer')
  private router = inject(Router);

  public openTradeId = output<Object>();
  public onFocusChanged = output<Object>();
  public contextMenuItems: ContextMenuItem[];
  public editing: EditSettingsModel;


  public formatoptions: Object;
  public initialSort: Object;
  public pageSettings: Object;
  public editSettings: Object;
  public dropDown: DropDownListComponent;
  public submitClicked: boolean = false;
  public selectionOptions?: SelectionSettingsModel;
  public toolbarOptions?: ToolbarItems[];
  public searchOptions?: SearchSettingsModel;
  public filterSettings: FilterSettingsModel;
  public sTitle: any;
  public gridForm: any;

  public state?: GridComponent;
  public message?: string;
  public userId: string;
  private fb = inject(FormBuilder);

  // drop down list selection for periods
  public periodList: IPeriod[] = [];
  public periodCtrl: FormControl<IPeriod> = new FormControl<IPeriod>(null);
  public periodFilterCtrl: FormControl<string> = new FormControl<string>(null);
  public periodFilter: ReplaySubject<IPeriod[]> = new ReplaySubject<IPeriod[]>(1);
  protected _onPeriodDestroy = new Subject<void>();
  protected _onDestroy = new Subject<void>();
  @ViewChild("singlePeriodSelect", { static: true }) singlePeriodSelect!: MatSelect;


  columns = [
    { field: 'id', headerText: 'ID', visible: true, width: 50 },
    { field: 'account', headerText: 'Grp', visible: false, width: 90 },
    { field: 'child', headerText: 'Acct', visible: true, isPrimaryKey: true, isIdentity: true, width: 90 },
    { field: 'account_description', headerText: 'Description', visible: false, width: 100, displayAsCheckbox: true },
    { field: 'trans_type', headerText: 'Tr Type', visible: true, width: 100, displayAsCheckbox: true },
    { field: 'trans_date', headerText: 'Tr Date', visible: false, width: 80, type: Date, displayAsCheckbox: true },
    { field: 'amount', headerText: 'Amount', visible: false, width: 100, format: 'N2', textAlign: 'Right' },
    { field: 'description', headerText: 'Transaction Description', width: 200 },
    { field: 'reference', headerText: 'Reference', width: 100, visible: false },
    { field: 'party_id', headerText: 'Party', width: 100, visible: false },
    { field: 'amount', headerText: 'Amount', width: 80, format: 'N2', textAlign: 'Right' },
    { field: 'opening_balance', headerText: 'Open', width: 80, format: 'N2', textAlign: 'Right' },
    { field: 'debit_amount', headerText: 'Debit', width: 80, format: 'N2', textAlign: 'Right' },
    { field: 'credit_amount', headerText: 'Credit', width: 80, format: 'N2', textAlign: 'Right' },
    { field: 'close', headerText: 'Closing', width: 80, format: 'N2', textAlign: 'Right' },
    { field: 'net', headerText: 'Net', width: 80, format: 'N2', textAlign: 'Right' },
    { field: 'pd', headerText: 'Prd', visible: false, width: 100 },
    { field: 'prd_year', headerText: 'Yr', visible: false, width: 100 }
  ];

  periodParams = {
    period: 1,
    year: 2024,
  };

  protected filterPeriod() {
    if (!this.periodList) {
      return;
    }
    // get the search keyword
    let search = this.periodFilterCtrl.value;
    if (!search) {
      this.periodFilter.next(this.periodList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.periodFilter.next(
      this.periodList.filter(period => period.period.toString().toLowerCase().indexOf(search) > -1)
    );
  }

  actionBegin(args: SaveEventArgs): void {
      console.debug('args : ', args.requestType);
      
      if (args.requestType === 'beginEdit' || args.requestType === 'add') {        
        args.cancel = true;
        // this.router.navigate(['journals/gl', args.rowData]);
      }
    }
  


  ngOnInit() {
    this.store.loadTB(this.periodParams);

    this.periodsService.read().pipe(takeUntil(this._onDestroy)).subscribe((period) => {
      this.periodList = period;
      this.periodFilter.next(this.periodList.slice());
    });

    if (this.periodFilter)
      this.periodFilter.pipe(take(1), takeUntil(this._onPeriodDestroy)).subscribe(() => {
        if (this.singlePeriodSelect != null || this.singlePeriodSelect != undefined)
          this.singlePeriodSelect.compareWith = (a: IPeriod, b: IPeriod) => a && b && a.period === b.period;
      });

    this.createEmptyForm();

  }


  createEmptyForm() {
    this.gridForm = this.fb.group({
      settings_name: [''],
      description: [''],
    });
  }


  ngOnDestroy(): void {
    // this.setPersistData();
  }

  restorePersistData() {
    this.store.loadTB(this.periodParams);
  }

  public settingsList: IGridSettingsModel[] = [];

  exportLX() {
    const fileName = new Date().toLocaleDateString() + '.xlsx';
    this.grid()!.excelExport({
      fileName: fileName, header: {
        headerRows: 7,
        rows: [
          { cells: [{ colSpan: 4, value: "Company Name", style: { fontColor: '#03396c', fontSize: 20, hAlign: 'Left', bold: true, } }] },
          { cells: [{ colSpan: 4, value: "Trial Balance", style: { fontColor: '#03396c', fontSize: 20, hAlign: 'Left', bold: true, } }] },
        ]
      },
      footer: {
        footerRows: 4,
        rows: [
          { cells: [{ colSpan: 4, value: "", style: { hAlign: 'Center', bold: true } }] },
          { cells: [{ colSpan: 4, value: "", style: { hAlign: 'Center', bold: true } }] }
        ]
      },
    });
  }

  exportPDF() {
    throw new Error('Method not implemented.');
  }


  exportCSV() {
    throw new Error('Method not implemented.');
  }

  onCommit($event: any) {
    throw new Error('Method not implemented.');
  }


  savePersistData() {
    console.log("setting persist data");
    //this.grid().savePersistData({ settingsName: "tb-id", settings: '', description: '', grid: "DistTb", userId: '', created: Date.now() });
  }

  saveDefaultPersistData() {
    console.log("setting persist data");
    //this.grid().savePersistData({ settingsName: "tb-id", settings: '',  description: '', grid: "DistTb", userId: '', created: Date.now() });
  }

  openDrawer() {
    this.drawer().toggle();
    this.store.settings().forEach((setting) => {
      console.log(setting);
    });
  }

  onExportExcel() {
    this.exportLX();
  }



  resetPersistData() {
    //this.grid().restorePersistData("Reset");
  }

  selectedRow($event: ITrialBalance) {
    console.log($event);
  }

  onPrint() {

  }

  onUpdate($event: any) {
    console.log(JSON.stringify($event));
  }
  onCreate($event: any) {
    console.log(JSON.stringify($event));
  }
  onDelete($event: any) {
    console.log(JSON.stringify($event));
  }
  closeDrawer() {
    this.drawer().toggle();
  }

}

/*
    "account": 6000,
    "child": 6160,
    "account_description": "Amortization of capital asset",
    "transaction_date": "2024-12-16",
    "id": "",
    "trans_type": "TB Summary",
    "trans_date": "2024-12-16",
    "type": "",
    "description": "",
    "reference": "",
    "party_id": "",
    "amount": 0,
    "opening_balance": 0,
    "debit_amount": 0,
    "credit_amount": 0,
    "close": 0,
    "net": 0,
    "pd": 1,
    "prd_year": 2024
*/

