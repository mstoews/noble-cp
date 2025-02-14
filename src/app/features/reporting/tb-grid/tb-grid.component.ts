
import { Component, inject, OnInit } from '@angular/core';
import { ITrialBalance } from 'app/models';
import { ReportStore } from 'app/services/reports.store';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { GridMenubarStandaloneComponent } from 'app/features/accounting/grid-components/grid-menubar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CurrencyPipe } from '@angular/common';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { IDataOptions, PivotView, PivotViewModule, IDataSet, VirtualScrollService } from '@syncfusion/ej2-angular-pivotview';
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';

@Component({
  selector: 'tb-grid',
  providers: [ReportStore],
  imports: [
    MatTableModule,  
    MatProgressSpinnerModule, 
    GridMenubarStandaloneComponent,
    PivotViewModule, 
    DropDownListModule ],
  template: `
  <div class="flex flex-col min-w-0 overflow-y-auto -px-10">
    <div class="flex-auto">
        <div class="h-full border-gray-300">
            <div class="flex-col">
                @defer (on viewport; on timer(5s)) {
                    <ng-container>
                        <grid-menubar> </grid-menubar>                                                  
                        
                        @if (store.isLoading() === false) 
                        {                            
                          <div class="control-section">
                            <div id="ddl-control">
                                <ejs-dropdownlist id='performance' #performance 
                                    [dataSource]='dataSource' 
                                    [fields]='fields' 
                                    showFieldList='true' 
                                    width="240" 
                                    index='0'
                                    (change)='onChange($event)' 
                                    placeholder="Select a Data Range" popupHeight="240px">
                                </ejs-dropdownlist>
                                <span id="performanceTime">Time Taken: 0 sec</span>
                            </div>
                            <ejs-pivotview #pivotview id='PivotView' [dataSourceSettings]=dataSourceSettings [width]='width' height='300'
                                  enableVirtualization='true' [gridSettings]='gridSettings' (dataBound)='ondataBound($event)' (load)='load()'>
                            </ejs-pivotview>
                          </div>

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
export class TbGridComponent implements OnInit {

  store = inject(ReportStore);
  dataSource: ITrialBalance[] = [];  
  dataSourceSettings: IDataOptions;  
  Pivot_Data: IDataSet[] = [];
  public remoteData: DataManager;
  
  public jsonReport: IDataOptions;

  
  ngOnInit(): void {

    this.remoteData = new DataManager({
      url: 'https://',
      adaptor: new WebApiAdaptor,
      crossDomain: true
    });

    const periodParams = {
      period: 1,
      year: 2024,
    };

    this.store.loadTB(periodParams);
    this.dataSource = this.store.tb();

    this.jsonReport = {
      url: '',
      dataSource: this.getPivotData(),
      type: 'JSON',
      expandAll: true,
      filters: [],
      columns: [{ name: 'ProductName', caption: 'Product Name' }],
      rows: [{ name: 'ShipCountry', caption: 'Ship Country' }, { name: 'ShipCity', caption: 'Ship City' }],
      formatSettings: [{ name: 'UnitPrice', format: 'C0' }],
      values: [{ name: 'Quantity' }, { name: 'UnitPrice', caption: 'Unit Price' }]
    };
    
  }

  getPivotData(): any {
    let pivotData: IDataSet[] = this.dataSource.map((item: ITrialBalance) => {
      return {
        Account: item.account,
        AccountName: item.account_description,
        Debit: item.credit_amount,
        Credit: item.debit_amount,
        Balance: item.opening_balance,
      };
    } );
  }
}