import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistMenuStandaloneComponent } from '../distributed-ledger/dist-menubar/grid-menubar.component';
import { IDistributionLedger, IDistributionLedgerReport, IDistributionLedgerRpt } from 'app/models';
import { ReportingToolbarComponent } from '../grid-reporting/grid-menubar.component';
import { DistributionLedgerService } from 'app/services/distribution.ledger.service';
import { SimpleDialogComponent } from "../../../common/simple-dialog.component";
import { StatementLineComponent } from './statement-line.component';
import { BehaviorSubject, map, Subject, takeUntil } from 'rxjs';
import { MaterialModule } from 'app/services/material.module';
import { StatementTotalComponent } from './statement-totals.component';
import { Observable } from '@apollo/client/utilities';
import html2PDF from 'jspdf-html2canvas';


const imports = [
  CommonModule,
  DistMenuStandaloneComponent,
  ReportingToolbarComponent,
  SimpleDialogComponent,
  StatementLineComponent,
  MaterialModule,
  StatementTotalComponent,
  
]

@Component({
  selector: 'balance-sheet-statement-rpt',
  standalone: true,
  imports: [imports],
  encapsulation: ViewEncapsulation.None,
  template: `
  <div class="flex flex-col min-w-0 overflow-y-auto overflow-x-auto" cdkScrollable >
  <!-- Main -->
  <div class="flex-auto p-2 sm:p-10 bg-white">
      <div class="h-max border-gray-300 rounded-2xl">                
          <reporting-toolbar [inTitle]="'Balance Sheet Analysis '"
              (notifyParentRefresh)="onRefresh()"
              (notifyExcel)="onExportExcel()" 
              (notifyCSV)="onExportCSV()" >
          </reporting-toolbar>          
      </div>
      <div id="balance-sheet" class="pl-20 pt-2 pb-14 mat-elevation-z8 mt-4">
          <div class="text-gray-800 text-2xl mt-3">Noble Ledger Ltd.</div>
          <div class="text-gray-800  text-2xl mt-1">Balance Sheet Statement {{currentYear()}} - {{currentPeriod()}}</div>
          
          <div class="text-gray-800  text-2xl mt-1">{{dReportDate}}</div>
          
        <section class="grid grid-cols-1 mt-6">      
          <div class="grid grid-cols-12 gap-2">
            <div class="col-start-5 text-right">Opening</div>
            <div class="col-start-7 text-right">Debit</div>
            <div class="col-start-9 text-right">Credit</div>
            <div class="col-start-11 text-right">Closing</div>            
          </div>
        </section>

        <div class="text-gray-800  text-xl mt-4 mb-2 ">Assets</div>
        <div class="grid grid-cols-1 ">
            @if (assets$ | async; as balance_sheet) {              
                @for (item of balance_sheet; track item){                  
                      <statement-line-item class=" font-gray-800" [item]=item></statement-line-item>                  
                }                              
            }
            @if (assets$ | async; as data) {
              <statement-line-totals class=" font-gray-800" [item]=data></statement-line-totals>
            }
            
          </div>

          <div class="text-gray-800  text-xl mt-10 mb-2 ">Retained Earning</div>
          <div class="grid grid-cols-1 ">          
            @if (revenue$ | async; as data) {
              <statement-line-totals class=" font-gray-800" [item]=data></statement-line-totals>
            }            
          </div>
          
          <div class="text-gray-800  text-xl mt-10 mb-2 ">Liabilities</div>
          <div class="grid grid-cols-1 ">
            @if (liabilities$ | async; as header) {              
                @for (item of header; track item){                   
                    <statement-line-item class=" font-gray-800" [item]=item></statement-line-item>                                                       
                }              
            }
            @if (liabilities$ | async; as data) {
              <statement-line-totals class=" font-gray-800" [item]=data></statement-line-totals>
            }
            
          </div>                    
          @if (balanceSheetReport$ | async; as totals) {
              <statement-line-totals class=" font-gray-800" [item]=totals></statement-line-totals>
          }                                 
      </div>
    
</div>
  `,
  providers: []
})

export class BalanceSheetStatementRptComponent  {

  public currentPeriod = signal(1);
  public currentYear = signal(2024);

  public dReportDate = new Date();

  // public balanceSheetReport! : Observable<IDistributionLedgerReport[]>
  public distributionService = inject(DistributionLedgerService)

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  params = {
    period: this.currentPeriod(),
    period_year: this.currentYear()
  }
    
  balanceSheetReport$ = this.distributionService.getDistributionByPrdAndYear(this.params); 
  assets$ = this.balanceSheetReport$.pipe(map(expense => expense.filter(ex => ex.child < 3000)));   
  liabilities$ = this.balanceSheetReport$.pipe(map(expense => expense.filter(ex => ex.child >= 3000 && ex.child <= 5000)));
  revenue$ = this.balanceSheetReport$.pipe(map(expense => expense.filter(ex => ex.child > 5000)));    
  
  
  onYearChanged(e: any) {
    this.currentYear.set(Number(e));
    this.onRefresh();
  }

  onRefresh() {
    this.assets$ = this.balanceSheetReport$.pipe(map(expense => expense.filter(ex => ex.child < 3000)));   
    this.liabilities$ = this.balanceSheetReport$.pipe(map(expense => expense.filter(ex => ex.child >= 3000 && ex.child <= 5000)));
    this.revenue$ = this.balanceSheetReport$.pipe(map(expense => expense.filter(ex => ex.child > 5000 && ex.child< 6000)));    
    // this.expense$ = this.balanceSheetReport$.pipe(map(expense => expense.filter(ex => ex.child > 6000)));
    
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
  
  onExportCSV() {
    let income = document.getElementById('balance-sheet');

    html2PDF(income, {
      jsPDF: {
        orientation: 'landscape',
        unit: 'pt',
        format: 'a4',
      },
      html2canvas: {        
        imageTimeout: 15000,
        logging: true,
        useCORS: false,
        scale: 2
      },
      imageType: 'image/jpeg',
      imageQuality: 1,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
      watermark: undefined,
      autoResize: true,
      init: function() {},
      success: function(pdf) {
        var dReportDate = new Date();
        pdf.save(`BalanceSheet${dReportDate}.pdf`);
      }
    });

  }

  onExportExcel() {
    alert('not yet implemented')
  }

}
