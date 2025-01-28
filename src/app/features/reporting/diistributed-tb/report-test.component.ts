import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { employeeData, orderDatas } from '../accounting/tree/datasource';

import { GridModule, DetailRowService, FilterService, PageService, SortService } from '@syncfusion/ej2-angular-grids';
import { TrialBalanceStore } from 'app/services/distribution.ledger.store';


@Component({
  selector: 'report-test',
  standalone: true,
  imports: [GridModule],
  templateUrl: './report-test.component.html',
  styles: ``,
  providers: [DetailRowService, SortService, PageService, FilterService, TrialBalanceStore],
})
export class ReportTestComponent implements OnInit, AfterViewInit {
  public parentData: Object[];
  public childGrids: any;
  public secondChildGrid: any;
  public filterSettings: Object;
  public store = inject(TrialBalanceStore);
  public childData?: object[];

  ngAfterViewInit(): void {
     
     console.log(this.store.details().length)

     this.childData = orderDatas;
 
     this.childGrids = {
      dataSource: this.childData,
      queryString: 'EmployeeID',
      allowPaging: true,
      pageSettings: {pageSize: 6, pageCount: 5},
      columns: [
        { field: 'EmployeeID', headerText: 'ID', textAlign: 'Right', width: 90 },
        { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 90 },
        { field: 'CustomerID', headerText: 'Customer ID', width: 100 },
        { field: 'ShipCity', headerText: 'Ship City', width: 100 },
        { field: 'ShipName', headerText: 'Ship Name', width: 120 }
    ],
  };
  }

  actionBegin(args: any) {
    console.debug(JSON.stringify(args.requestType));    
  }


   
  ngOnInit(): void {
      this.parentData = employeeData;
      this.filterSettings = { type: 'Excel'};
      this.store.loadDetail({child: 1001, period: 1, period_year: 2024})
      
  }
}
