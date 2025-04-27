
import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ITrialBalance } from 'app/models';
import { ReportStore } from 'app/store/reports.store';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { GridMenubarStandaloneComponent } from 'app/features/accounting/grid-components/grid-menubar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CurrencyPipe } from '@angular/common';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { IDataOptions, PivotView, PivotViewModule, IDataSet, VirtualScrollService, FieldList, DrillThroughService, FieldListService } from '@syncfusion/ej2-angular-pivotview';
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import { GridSettings } from '@syncfusion/ej2-pivotview/src/pivotview/model/gridsettings';
import { ReportService } from 'app/services/reports.service';

@Component({
  selector: 'tb-grid',
  providers: [ReportStore, DrillThroughService, FieldListService, VirtualScrollService, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    MatProgressSpinnerModule,
    GridMenubarStandaloneComponent,
    PivotViewModule,
    DropDownListModule],
  template: `
  <div class="flex flex-col min-w-0 overflow-y-auto -px-10">
    <div class="flex-auto">
        <div class="h-screen border-gray-300">
            <div class="flex-col">                
                    <ng-container>
                        <grid-menubar class="mb-2" [inTitle]= "'Financial Results Pivot'"> </grid-menubar>                                                  
                            <ejs-pivotview #pivotview id='PivotView' 
                               allowDrillThrough='true'
                               [dataSourceSettings]= dataSrcSettings 
                               width='100%' height='800'  
                               [gridSettings]='gridSettings'>
                            </ejs-pivotview>                                              
                    </ng-container>                 
            </div>
        </div>
    </div>
  </div>
  `,
  styles: `
  :root {
    --mat-table-background-color: gray;
  }`
})
export class TbGridComponent implements OnInit, AfterViewInit {

  reportService = inject(ReportService);

  data$ = this.reportService.readTbByPeriod({ year: 2025, period: 1 });

  
  dataSrcSettings: IDataOptions;
  public gridSettings: GridSettings;
  public remoteData: DataManager;
  ngOnInit(): void {
    this.gridSettings = {
      columnWidth: 140      
    } as GridSettings;
    // this.data = this.store.tb() as any as IDataSet[];          
  }


  ngAfterViewInit(): void {
      this.data$.subscribe((data) => {    
        this.dataSrcSettings = {
          url: '',
          dataSource: data as any as IDataSet[],
          enableSorting: true,
          columns: [{ name: 'yr' }, { name: 'prd' }],
          values: [{ name: 'opening_amount', caption: 'Open' }, { name: 'debit_amount', caption: 'Debit' }, { name: 'credit_amount', caption: 'Credit' }, { name: 'close_amount', caption: 'Close' }],      
          rows: [{ name: 'type' }, { name: 'account_description' }],
          formatSettings: [{ name: 'opening_amount', format: 'N2' }, { name: 'closing_amount', format: 'N2' }, { name: 'debit_amount', format: 'N2' }, { name: 'credit_amount', format: 'N2' }],
          expandAll: true,      
          filters: []     
      }
    });
  }
  
}