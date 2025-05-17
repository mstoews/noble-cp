import { Component, inject, OnDestroy, OnInit, output, ViewChild, viewChild } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GridMenubarStandaloneComponent } from 'app/features/accounting/grid-components/grid-menubar.component';
import { ReportStore } from 'app/store/reports.store';
import { ITrialBalance } from 'app/models';
import { MatButtonModule } from '@angular/material/button';
import { IGridSettingsModel } from 'app/services/grid.settings.service';
import { MaterialModule } from 'app/shared/material.module';
import { MatDrawer } from '@angular/material/sidenav';
import { FormBuilder, FormControl } from '@angular/forms';
import { AggregateService, ColumnMenuService, ContextMenuItem, ContextMenuService, EditService, EditSettingsModel, ExcelExportService, FilterService, FilterSettingsModel, GridComponent, GridModule, GroupService, PageService, PdfExport, PdfExportService, Reorder, ReorderService, ResizeService, SaveEventArgs, SearchSettingsModel, SelectionSettingsModel, SortService, ToolbarItems, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { ICurrentPeriod, IPeriod } from 'app/models/period';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { PeriodsService } from 'app/services/periods.service';

import { WorkSheet, utils, writeFile } from 'xlsx';


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
                    
                        <grid-menubar
                              [inTitle]="'Distribution Ledger by Period'" 
                              (openSettings)="openDrawer()"
                              (period)=onPeriod($event) 
                              (onPrint)="onPrint()"                          
                              (exportXL)="exportXL()"
                              (exportPRD)="exportPDF()"
                              (exportCSV)="exportCSV()"
                              [showCalendar]=true
                              [showCalendarButton]=true
                              [showPrint]=false
                              [showExportXL]=true
                              [showExportPDF]=false
                              [showExportCSV]=false
                              [showSettings]=false
                              [showBack]=true>
                        </grid-menubar>  
                                                                                                    
                        @if (store.isLoading() === false)                           
                        {                            
                            <ejs-grid #grid id="grid" class="mt-2 text-sm"                                
                                gridLines="Both"
                                allowSorting='true'
                                allowResizing='true'
                                showColumnMenu='true'                                                                 
                                [allowFiltering]='false'                 
                                [enablePersistence]='false'                                
                                [enableStickyHeader]='true'                                 
                                [allowGrouping]="true"                                
                                [allowReordering]='true' 
                                [allowExcelExport]='true' 
                                [allowPdfExport]='true' 
                                [contextMenuItems]="contextMenuItems" 
                                (actionBegin)='actionBegin($event)' 
                                (actionComplete)='actionComplete($event)'                                 
                                [dataSource]="store.tb()"
                                [rowHeight]='30'>                                
                                <e-columns>                                     
                                      <e-column field='trans_type' headerText='Account' width='140' [visible]=true>
                                                  <ng-template #template let-data>                                                                
                                                          @switch (data.trans_type) 
                                                          {                                    
                                                              @case ('TB Summary') {                                        
                                                                  <span class="e-badge flex text-md gap-1 items-center w-max bg-transparent">
                                                                      {{data.description}}
                                                                  </span>
                                                              }
                                                              @case ('Transaction') {
                                                                <span class="e-badge flex text-md  gap-1 items-center w-max bg-transparent"> 
                                                                </span>                                                            
                                                          }
                                                        }
                                                      </ng-template>
                                      </e-column> 
                                      <e-column field='account' headerText='Grp' width='90' [visible]=false>
                                              <ng-template #template let-data>                                                                
                                                  @switch (data.trans_type) 
                                                  {                                    
                                                      @case ('TB Summary') {                                        
                                                            <span class="e-badge flex text-md gap-1 items-center w-max bg-transparent">                                                                                                                                      
                                                              {{data.account}}                                                                    
                                                          </span>
                                                      }
                                                      @case ('Transaction') {
                                                      <span class="e-badge flex text-md  gap-1 items-center w-max bg-transparent">                                                
                                                      </span>                                                            
                                                  }
                                                }
                                              </ng-template>
                                      </e-column>
                                      <e-column field='child' headerText='Acct' width='60' [visible]=true  isPrimaryKey=true isIdentity=true>
                                      <ng-template #template let-data>                                                                
                                                  @switch (data.trans_type) 
                                                  {                                    
                                                      @case ('TB Summary') {                                        
                                                        <span class="e-badge flex text-md gap-1 items-center w-max bg-transparent">                                                                                                                                      
                                                              {{data.child}}                                                                    
                                                        </span>
                                                      }
                                                      @case ('Transaction') {
                                                      <span class="e-badge flex text-md  gap-1 items-center w-max bg-transparent">                                                
                                                      </span>                                                            
                                                  }
                                                }
                                              </ng-template>
                                      </e-column>
                                      <e-column field='id' headerText='Transaction' width='50' [visible]=true textAlign='Right'> 
                                        <ng-template #template let-data>                                                                
                                                    @switch (data.trans_type) 
                                                    {                                    
                                                        @case ('TB Summary') {                                        
                                                          <span class="e-badge flex text-md gap-1 items-center w-max bg-transparent">                                                                                                                                                                                                    
                                                          </span>
                                                        }
                                                        @case ('Transaction') {
                                                          <span class="e-badge flex text-md  gap-1 items-center w-max bg-transparent">                                                
                                                              {{data.id}} - {{data.description}} 
                                                          </span>                                                            
                                                        }
                                                  }
                                        </ng-template>
                                      </e-column>
                                      <e-column field='account_description' headerText='Description'width='100' [visible]=false></e-column>                                     
                                      <e-column field='trans_date'          headerText='Tr Date'    width='80'  [visible]=false type='Date' displayAsCheckbox=true></e-column> 
                                      <e-column field='amount'              headerText='Amount'     width='100' [visible]=false format='N2' textAlign='Right'> </e-column>
                                      <e-column field='description'         headerText='Trans Desc' width='200' [visible]=false> </e-column>
                                      <e-column field='reference'           headerText='Reference'  width='100' [visible]=false> </e-column>
                                      <e-column field='party_id'            headerText='Party'      width='100' [visible]=false> </e-column>                                    
                                      <e-column field='opening_balance'     headerText='Open'       width='80'  [visible]=true  format='N2' textAlign='Right'> </e-column>
                                      <e-column field='debit_amount'        headerText='Debit'      width='80'  [visible]=true  format='N2' textAlign='Right'> </e-column>
                                      <e-column field='credit_amount'       headerText='Credit'     width='80'  [visible]=true  format='N2' textAlign='Right'> </e-column>
                                      <e-column field='close'               headerText='Closing'    width='80'  [visible]=true  format='N2' textAlign='Right'> </e-column>
                                      <e-column field='net'                 headerText='Net'        width='80'  [visible]=true  format='N2' textAlign='Right'> </e-column>
                                      <e-column field='pd'                  headerText='Prd'        width='100' [visible]=false > </e-column>
                                      <e-column field='prd_year'            headerText='Yr'         width='100' [visible]=false ></e-column>                                                                                                             
                                
                                </e-columns>
                            </ejs-grid>                        
                        }
                           @else
                        {
                            <div class="fixed z-[1050] -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4">
                                <mat-spinner></mat-spinner>
                            </div>
                        }                
                  
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
  selector: 'dist-tb',
  providers: [ReportStore, PdfExportService,  ReorderService, GroupService, ExcelExportService, ContextMenuService, SortService, PageService, ResizeService, FilterService, ToolbarService, EditService, AggregateService, ColumnMenuService],
  styles: `
  // .e-gridheader .e-table{ display: none;  } 
  .e-grid .e-altrow {  background-color: #ffffff; }
  `    
})

export class DistributedTbComponent implements OnInit, OnDestroy {
onPrint() {
throw new Error('Method not implemented.');
}

  public store = inject(ReportStore);
  public periodsService = inject(PeriodsService);
  private fb = inject(FormBuilder);
  public grid = viewChild<GridComponent>('grid')
  public drawer = viewChild<MatDrawer>('drawer')


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

  public searchOptions?: SearchSettingsModel;
  public filterSettings: FilterSettingsModel;
  public sTitle: any;
  public gridForm: any;

  public state?: GridComponent;
  public message?: string;
  public userId: string;
  

  // drop down list selection for periods
  public periodList: IPeriod[] = [];
  public periodCtrl: FormControl<IPeriod> = new FormControl<IPeriod>(null);
  public periodFilterCtrl: FormControl<string> = new FormControl<string>(null);
  public periodFilter: ReplaySubject<IPeriod[]> = new ReplaySubject<IPeriod[]>(1);
  protected _onPeriodDestroy = new Subject<void>();
  protected _onDestroy = new Subject<void>();
  public settingsList: IGridSettingsModel[] = [];
  
  @ViewChild("singlePeriodSelect", { static: true }) singlePeriodSelect!: MatSelect;

  periodParams = {
    period: 1,
    year: 2025,
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
      this.periodList.filter(period => period.period_id.toString().toLowerCase().indexOf(search) > -1)
    );
  }

  
  onPeriod(e: string) {
  
          console.debug("Period : ", e);
          
          var prd: ICurrentPeriod[] = [];
  
          var currentPeriod = localStorage.getItem('currentPeriod');        
          if (currentPeriod === null) {
              currentPeriod = 'January 2025';
          }
  
          var activePeriods: ICurrentPeriod[] = [];
  
          var _currentActivePeriods = localStorage.getItem('activePeriod');
              
          if (_currentActivePeriods) {
                activePeriods = JSON.parse(_currentActivePeriods) as ICurrentPeriod[];
          }         
  
          if (activePeriods.length > 0) {
              prd = activePeriods.filter((period) =>  period.description === currentPeriod); 
              if (prd.length > 0) {
                  this.periodParams.period = prd[0].period_id;
                  this.periodParams.year = prd[0].period_year;
              }
              this.store.loadTB(this.periodParams);
          }          
    }
  actionBegin(args: SaveEventArgs): void {
    console.debug('args : ', args.requestType);

    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      args.cancel = true;
      // this.router.navigate(['journals/gl', args.rowData]);
    }
  }
  ngOnInit() {
    //this.store.loadTB(this.periodParams);
    this.periodsService.read().pipe(takeUntil(this._onDestroy)).subscribe((period) => {
      this.periodList = period;
      this.periodFilter.next(this.periodList.slice());
    });

    if (this.periodFilter)
      this.periodFilter.pipe(take(1), takeUntil(this._onPeriodDestroy)).subscribe(() => {
        if (this.singlePeriodSelect != null || this.singlePeriodSelect != undefined)
          this.singlePeriodSelect.compareWith = (a: IPeriod, b: IPeriod) => a && b && a.period_id === b.period_id;
      });
    this.createEmptyForm();
    this.refreshReport();
  }

  refreshReport() 
    {
      const tbParams = {
        start_date: '05/10/2025',
        end_date: '05/05/2025',
        status: 'OPEN'
      };
      this.store.loadTBByStartAndEndDate(tbParams)

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


  exportToExcelFormat() { 
    

    const worksheet = utils.json_to_sheet(this.store.tb());
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Trial Balance");
    
  
    /* calculate column width */
    //const max_width = this.store.tb().reduce((w, r) => Math.max(w, r.name.length), 10);
    //worksheet["!cols"] = [ { wch: max_width } ];
    const fileName = "Dist-TB-" + new Date().toLocaleDateString() + '.xlsx';    
    writeFile(workbook, fileName, { compression: true });
  }

  exportXL() {
    this.exportToExcelFormat();
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

  resetPersistData() {
    //this.grid().restorePersistData("Reset");
  }

  selectedRow($event: ITrialBalance) {
    console.log($event);
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

