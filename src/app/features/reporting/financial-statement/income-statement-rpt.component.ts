import { Component, ViewEncapsulation, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DistributionLedgerService } from 'app/services/distribution.ledger.service';
import { StatementLineComponent } from './statement-line.component';
import { map, Subject } from 'rxjs';

import { StatementTotalComponent } from './statement-totals.component';
import html2PDF from 'jspdf-html2canvas'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf';
import { GridMenubarStandaloneComponent } from 'app/features/accounting/grid-components/grid-menubar.component';


const imports = [
  StatementLineComponent,
  StatementTotalComponent,
  GridMenubarStandaloneComponent,
  CommonModule
]

@Component({
  selector: 'income-statement-rpt',
  imports: [imports],
  encapsulation: ViewEncapsulation.None,
  template: `
  <div class="flex flex-col min-w-0 overflow-y-auto overflow-x-auto" cdkScrollable >
  <!-- Main -->
  <div id="statement" class="flex-auto p-2 sm:p-10 bg-white">
      <div class="h-max border-gray-300 rounded-2xl">   
        <grid-menubar (print)="onPrint()"></grid-menubar>             
          
      </div>
      <div id="income-statement" class="pl-20 pt-2 pb-14 mat-elevation-z8 mt-4 bg-white font-gray-900 p-2">

          <div class="text-gray-800 text-2xl mt-3">{{sCompanyName}}</div>
          <div class="text-gray-800  text-2xl mt-1">Income Statement Details</div>
          <div class="text-gray-800  text-2xl mt-1">Reporting Date : {{dReportDate}}</div>
          
          <section class="grid grid-cols-1 mt-10 ">      
          <div class="grid grid-cols-12 gap-2 bg-slate-400 p-2 rounded-lg">
            <div class="col-start-5  text-gray-700 text-bold text-right">Opening</div>
            <div class="col-start-7  text-gray-700 text-bold text-right">Debit</div>
            <div class="col-start-9  text-gray-700 text-bold text-right">Credit</div>
            <div class="col-start-11 text-gray-700 text-bold text-right">Closing</div>            
          </div>
        </section>
            
          <div class="text-gray-800  text-xl mt-5 mb-2 ">Revenues</div>
          <div class="grid grid-cols-1 ">
            @if (revenue$ | async; as header) {              
                @for (item of header; track item){                   
                    <statement-line-item class=" font-gray-800" [item]=item></statement-line-item>                                                       
                }              
            }
            @if (revenue$ | async; as data) {
              <statement-line-totals class=" font-gray-900 bg-slate-400 rounded-lg mt-1 mb-1" [header]="'Revenue Total'" [item]=data></statement-line-totals>
            }
            
          </div>                    
          
          <div class="text-gray-800  text-xl mt-10 mb-2 ">Expenses</div>
          <div class="grid grid-cols-1 ">
            @if (expense$ | async; as header) {              
                @for (item of header; track item){                   
                    <statement-line-item class=" font-gray-800" [item]=item></statement-line-item>                                                       
                }              
            }
            @if (expense$ | async; as data) {
              <statement-line-totals class="font-gray-900 bg-slate-400 rounded-lg" [header]="'Expense Total'" [item]=data></statement-line-totals>
            }
           <br>
            @if (revenueReport$ | async; as data) {
              <statement-line-totals class="font-gray-900 bg-slate-400 rounded-lg" [header]="'Grand Total'" [item]=data></statement-line-totals>
            }            
          </div>                    
          
          <!-- Totals -->
          
        
      </div>
  
  </div>
    
  </div>    
  `,
  providers: []
})

export class IncomeStatementRptComponent {

  public currentPeriod = signal(1);
  public currentYear = signal(2025);
  public dReportDate = new Date().toISOString().split('T')[0];

  // public balanceSheetReport! : Observable<IDistributionLedgerReport[]>
  public distributionService = inject(DistributionLedgerService)

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  

  sCompanyName = "Noble Ledger Ltd."

  params = {
    period: this.currentPeriod(),
    period_year: this.currentYear()
  }

  revenueReport$ = this.distributionService.getDistributionByPrdAndYear(this.params).pipe(map(expense => expense.filter(ex => ex.child > 5000)));
  revenue$ = this.revenueReport$.pipe(map(expense => expense.filter(ex => ex.child > 5000 && ex.child < 6000)));
  expense$ = this.revenueReport$.pipe(map(expense => expense.filter(ex => ex.child > 6000)));


  onYearChanged(e: any) {
    this.currentYear.set(Number(e));
    this.onRefresh();
  }

  onRefresh() {
    this.revenueReport$ = this.distributionService.getDistributionByPrdAndYear(this.params).pipe(map(expense => expense.filter(ex => ex.child > 5000)));
    this.revenue$ = this.revenueReport$.pipe(map(expense => expense.filter(ex => ex.child > 5000 && ex.child < 6000)));
    this.expense$ = this.revenueReport$.pipe(map(expense => expense.filter(ex => ex.child > 6000)));

  }

  onPeriodChanged(e: any) {
    this.currentPeriod.set(Number(e));
    this.onRefresh();
  }

  public scrollSettings: {
    isFinite: true,
    enableVirtualization: false,
  }

  capturedImage;

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  onExportPDF() {
    let income = document.getElementById('income-statement');

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
        scale: 3
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
      init: function () { },
      success: function (pdf) {
        var dReportDate = new Date();
        pdf.save(`IncomeStatementDetails${dReportDate}.pdf`);
      }
    });

  }

  onPrint() {
    this.onExportPDF();    
  }
    
  // onExportExcel() {
  //   const is: any = document.getElementById('income-statement');
  //   html2canvas(is, { scale: 2 }).then((canvas) => {
  //     const doc = new jsPDF();
  //     doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 200, 200);
  //     doc.setFontSize(10);
  //     doc.save(`IncomeStatementDetails.${this.dReportDate}.pdf`)
  //   });

  // }
}


