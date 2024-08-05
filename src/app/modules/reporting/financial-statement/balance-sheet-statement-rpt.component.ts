import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistMenuStandaloneComponent } from '../distributed-ledger/dist-menubar/grid-menubar.component';
import { IDistributionLedger, IDistributionLedgerRpt } from 'app/models';
import { ReportingToolbarComponent } from '../grid-reporting/grid-menubar.component';
import { DistributionLedgerService } from 'app/services/distribution.ledger.service';
import { SimpleDialogComponent } from "../../../common/simple-dialog.component";
import { StatementLineComponent } from './statement-line.component';
import { map, Subject, takeUntil } from 'rxjs';
import { MaterialModule } from 'app/services/material.module';
import { StatementTotalComponent } from './statement-totals.component';
import { StatementGrandTotalsComponent } from './statement-grand-totals.component';


const imports = [
  CommonModule,
  DistMenuStandaloneComponent,
  ReportingToolbarComponent,
  SimpleDialogComponent,
  StatementLineComponent,
  MaterialModule,
  StatementTotalComponent,
  StatementGrandTotalsComponent
]

@Component({
  selector: 'balance-sheet-statement-rpt',
  standalone: true,
  imports: [imports],
  encapsulation: ViewEncapsulation.None,
  template: `
  <div class="flex  flex-col min-w-0 overflow-y-auto overflow-x-auto" cdkScrollable >
  <!-- Main -->
  <div class="flex-auto p-2 sm:p-10 bg-white">
      <div class="h-max border-gray-300 rounded-2xl">                
          <reporting-toolbar [inTitle]="'Balance Sheet Analysis '"
              (notifyParentRefresh)="onRefresh()"
              (notifyExcel)="onExportExcel()" 
              (notifyCSV)="onExportCSV()" >
          </reporting-toolbar>          
      </div>
      <mat-card class="p-2">
          <div class="text-gray-800 text-2xl mt-3">Noble Ledger Ltd.</div>
          <div class="text-gray-800  text-2xl mt-1">Balance Sheet Statement</div>
          <div class="text-gray-800  text-2xl mt-1">{{dReportDate}}</div>
          
          <div class="flex flex-col md:flex-row gap-2 mt-10">
            <div class="text-gray-900 w-[50px] text-xl">Assets</div>                      
            <div class="text-gray-900 w-[400px] place-content-start "></div>
            <div class="text-gray-900 w-[110px] text-right">Opening</div>
            <div class="text-gray-900 w-[110px] text-right">Debit</div>      
            <div class="text-gray-900 w-[110px] text-right">Credit</div>
            <div class="text-gray-900 w-[110px] text-right">Closing</div>
          </div>
  
          <div class="grid grid-cols-1 ">
            @if (distributionService | async; as header) {              
                @for (item of header; track item){
                  @if (item.child >= 0 && item.child < 3000) {                
                      <statement-line-item class=" font-gray-800" [item]=item></statement-line-item>
                  }                  
                }              
            }
            <statement-line-totals class=" font-gray-800" [item]=assetTotals()></statement-line-totals>
          </div>
          
          

          <div class="text-gray-800  text-xl mt-10 mb-2 ">Liabilities</div>
          <div class="grid grid-cols-1 ">
            @if (distributionService | async; as header) {              
                @for (item of header; track item){
                   @if(item.child >= 3000 && item.child < 5000) {
                    <statement-line-item class=" font-gray-800" [item]=item></statement-line-item>                           
                  }          
                }              
            }
            <statement-line-totals class=" font-gray-800" [item]=liabilityTotals()></statement-line-totals>
          </div>

          <div class="text-gray-800  text-xl mt-10 mb-2 ">Income</div>
          <div class="grid grid-cols-1 ">
            @if (distributionService | async; as header) {              
                @for (item of header; track item){
                   @if(item.child > 5000 && item.child < 6000) {
                    <statement-line-item class=" font-gray-800" [item]=item></statement-line-item>                           
                  }          
                }              
            }
            <statement-line-totals class=" font-gray-800" [item]=incomeTotals()></statement-line-totals>
          </div>
          
          <div class="text-gray-800  text-xl mt-10 mb-2 ">Expenses</div>
          <div class="grid grid-cols-1 ">
            @if (distributionService | async; as header) {              
                @for (item of header; track item){
                   @if(item.child > 6000 ) {
                    <statement-line-item class=" font-gray-800" [item]=item></statement-line-item>                           
                  }          
                }              
            }
            <statement-line-totals class=" font-gray-800" [item]=expenseTotals()></statement-line-totals>
          </div>
          
          <statement-grand-totals class=" font-gray-800" [item]=grandTotals()></statement-grand-totals>
                                  
      </mat-card>
    
</div>
  `,
  providers: []
})

export class BalanceSheetStatementRptComponent implements OnInit, OnDestroy {

  public currentPeriod = signal(1);
  public currentYear = signal(2024);

  public dReportDate = new Date();

  public assetTotals = signal<IDistributionLedgerRpt>(null);
  public liabilityTotals = signal<IDistributionLedgerRpt>(null);
  public incomeTotals = signal<IDistributionLedgerRpt>(null);
  public expenseTotals = signal<IDistributionLedgerRpt>(null);
  public grandTotals = signal<IDistributionLedgerRpt>(null);
  public distributionService = inject(DistributionLedgerService).getDistributionReportByPrdAndYear({ period: this.currentPeriod(), period_year: this.currentYear() });

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  onYearChanged(e: any) {
    this.currentYear.set(Number(e));
    this.onRefresh();
  }

  onPeriodChanged(e: any) {
    this.currentPeriod.set(Number(e));
    this.onRefresh();
  }

  public scrollSettings: {
    isFinite: true,
    enableVirtualization: false,
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }


  createAssetTotals() {
    var openBalanceTotal = 0.0;
    var debitBalanceTotal = 0.0;
    var creditBalanceTotal = 0.0;
    var closingBalanceTotal = 0.0;

    this.distributionService.pipe(
      map((assets) =>
        assets.filter(
          (asset) => (asset.child < 3000)
        )
      )).pipe(takeUntil(this._unsubscribeAll)).subscribe(as => {
        as.forEach(assets => {
          openBalanceTotal = openBalanceTotal + assets.opening_balance;
          debitBalanceTotal = debitBalanceTotal + assets.debit_balance;
          creditBalanceTotal = creditBalanceTotal + assets.credit_balance;
          closingBalanceTotal = closingBalanceTotal + assets.closing_balance;
        })
      });

    var update = {
      child: 1,
      description: 'Asset Totals',
      opening_balance: openBalanceTotal,
      debit_balance: debitBalanceTotal,
      credit_balance: creditBalanceTotal,
      closing_balance: closingBalanceTotal,
    }
    this.assetTotals.set(update);
  }

  createIncomeTotals() {
    var openBalanceTotal = 0.0;
    var debitBalanceTotal = 0.0;
    var creditBalanceTotal = 0.0;
    var closingBalanceTotal = 0.0;

    this.distributionService.pipe(
      map((assets) =>
        assets.filter(
          (asset) => (asset.child > 5000 && asset.child < 6000)
        )
      )).pipe(takeUntil(this._unsubscribeAll))
      .subscribe(as => {
        as.forEach(assets => {
          openBalanceTotal = openBalanceTotal + assets.opening_balance;
          debitBalanceTotal = debitBalanceTotal + assets.debit_balance;
          creditBalanceTotal = creditBalanceTotal + assets.credit_balance;
          closingBalanceTotal = closingBalanceTotal + assets.closing_balance;
        })
      });

    var update = {
      child: 1,
      description: 'Income Totals',
      opening_balance: openBalanceTotal,
      debit_balance: debitBalanceTotal,
      credit_balance: creditBalanceTotal,
      closing_balance: closingBalanceTotal,
    }
    this.incomeTotals.set(update);
  }

  createExpenseTotals() {
    var openBalanceTotal = 0.0;
    var debitBalanceTotal = 0.0;
    var creditBalanceTotal = 0.0;
    var closingBalanceTotal = 0.0;

    this.distributionService.pipe(
      map((assets) =>
        assets.filter(
          (asset) => (asset.child > 6000)
        )
      )).pipe(takeUntil(this._unsubscribeAll))

      .subscribe(as => {
        as.forEach(assets => {
          openBalanceTotal = openBalanceTotal + assets.opening_balance;
          debitBalanceTotal = debitBalanceTotal + assets.debit_balance;
          creditBalanceTotal = creditBalanceTotal + assets.credit_balance;
          closingBalanceTotal = closingBalanceTotal + assets.closing_balance;
        })
      });

    var update = {
      child: 1,
      description: 'Expense Totals',
      opening_balance: openBalanceTotal,
      debit_balance: debitBalanceTotal,
      credit_balance: creditBalanceTotal,
      closing_balance: closingBalanceTotal,
    }
    this.expenseTotals.set(update);

  }

  createLiabilityTotals() {
    var openBalanceTotal = 0.0;
    var debitBalanceTotal = 0.0;
    var creditBalanceTotal = 0.0;
    var closingBalanceTotal = 0.0;

    this.distributionService.pipe(
      map((liability) =>
        liability.filter(
          (filter) => (filter.child >= 3000 && filter.child <= 5000)
        )
      )).pipe(takeUntil(this._unsubscribeAll))
      .subscribe(as => {
        as.forEach(assets => {
          openBalanceTotal = openBalanceTotal + assets.opening_balance;
          debitBalanceTotal = debitBalanceTotal + assets.debit_balance;
          creditBalanceTotal = creditBalanceTotal + assets.credit_balance;
          closingBalanceTotal = closingBalanceTotal + assets.closing_balance;
        })
      });

    var update = {
      child: 1,
      description: 'Liability Totals',
      opening_balance: openBalanceTotal,
      debit_balance: debitBalanceTotal,
      credit_balance: creditBalanceTotal,
      closing_balance: closingBalanceTotal,
    }
    this.liabilityTotals.set(update);
  }

  createGrandTotals() {

    const openBalanceTotal = this.assetTotals().opening_balance + this.expenseTotals().opening_balance + this.liabilityTotals().opening_balance + this.incomeTotals().opening_balance;
    const debitBalanceTotal = this.assetTotals().debit_balance + this.expenseTotals().debit_balance + this.liabilityTotals().debit_balance + this.incomeTotals().debit_balance;
    const creditBalanceTotal = this.assetTotals().credit_balance + this.expenseTotals().credit_balance + this.liabilityTotals().credit_balance + this.incomeTotals().credit_balance;
    const closingBalanceTotal = this.assetTotals().closing_balance + this.expenseTotals().closing_balance + this.liabilityTotals().closing_balance + this.incomeTotals().closing_balance;

    var update = {
      child: 1,
      description: 'Totals',
      opening_balance: openBalanceTotal,
      debit_balance: debitBalanceTotal,
      credit_balance: creditBalanceTotal,
      closing_balance: closingBalanceTotal,
    }
    this.grandTotals.set(update);

  }


  onRefresh() {
    this.createLiabilityTotals();
    this.createAssetTotals();
    this.createExpenseTotals();
    this.createIncomeTotals();
    this.createGrandTotals();
  }

  ngOnInit(): void {
    this.onRefresh();    
  }
  onExportCSV() {
    throw new Error('Method not implemented.');
  }

  onExportExcel() {
    throw new Error('Method not implemented.');
  }

}
