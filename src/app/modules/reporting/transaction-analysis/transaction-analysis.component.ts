import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    DxPivotGridModule,
    DxPivotGridComponent,
    DxChartComponent,
    DxChartModule,
  } from 'devextreme-angular';
import { GLAccountsService } from 'app/services/accounts.service';
import { MatDrawer } from '@angular/material/sidenav';
import { DistributionLedgerService } from 'app/services/distribution.ledger.service';



@Component({
  selector: 'transaction-analysis',
  standalone: true,
  imports: [CommonModule, DxPivotGridModule, DxPivotGridModule, DxChartModule],
  templateUrl: './transaction-analysis.component.html',
  styleUrl: './transaction-analysis.component.scss'
})
export class TransactionAnalysisComponent {
  @ViewChild(DxPivotGridComponent, { static: false }) pivotGrid: DxPivotGridComponent;
  @ViewChild(DxChartComponent, { static: false }) chart: DxChartComponent;
  
  
  
  private dlService = inject(DistributionLedgerService);
  public currentPeriod =1;
  public currentYear=2024;
  public selectedItemKeys: any[] = [];
  public keyField: any;
  public currentDate: string
  public dl$ = this.dlService.getDistributionReportByPrdAndYear(this.currentPeriod, this.currentYear);
  public collapsed = false;

  // local variables
  @ViewChild('drawer') drawer!: MatDrawer;
  
  ngOnInit() {
      const dDate = new Date();
      this.currentDate = dDate.toISOString().split('T')[0];
  }

  
    

}
