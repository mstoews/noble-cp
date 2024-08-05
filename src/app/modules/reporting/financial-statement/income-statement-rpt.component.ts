import { Component, OnInit, ViewEncapsulation, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistMenuStandaloneComponent } from '../distributed-ledger/dist-menubar/grid-menubar.component';
import { ReportingToolbarComponent } from '../grid-reporting/grid-menubar.component';
import { DistributionLedgerService } from 'app/services/distribution.ledger.service';
import { SimpleDialogComponent } from "../../../common/simple-dialog.component";
import { StatementLineComponent } from './statement-line.component';

@Component({
  selector: 'income-statement-rpt',
  standalone: true,
  imports: [CommonModule, DistMenuStandaloneComponent, ReportingToolbarComponent, SimpleDialogComponent, StatementLineComponent],
  encapsulation: ViewEncapsulation.None,
  template: `
  <div class="flex font-serif flex-col min-w-0 overflow-y-auto overflow-x-auto" cdkScrollable >
  <!-- Main -->
  <div class="flex-auto p-2 sm:p-10 bg-white">
      <div class="h-max border-gray-300 rounded-2xl">                
          <reporting-toolbar 
              (notifyParentRefresh)="onRefresh()"
              (notifyExcel)="onExportExcel()" 
              (notifyCSV)="onExportCSV()" >
          </reporting-toolbar>          
      </div>
      <div class="text-gray-800 font-serif text-2xl mt-10" >Noble Ledger Ltd.</div>
      <div class="text-gray-800 font-serif text-2xl mt-1" >Income Statement</div>
      <div class="text-gray-800 font-serif text-2xl mt-1" >{{dReportDate}}</div>
      
      <div class="text-gray-800 font-serif text-xl mt-10 mb-2 ">Revenue</div>
      <div class="grid grid-cols-1 ">

      @if (distributionService | async; as header) {
          <statement-line-item class="font-serif font-gray-800" [item]=item [showHeader]="true"></statement-line-item>                
          @for (item of header; track item){
             @if (item.child >= 5000 && item.child < 6000) {                
                <statement-line-item class="font-serif font-gray-800" [item]=item></statement-line-item>
             }                                       
          }          
          <statement-line-item class="font-serif font-gray-800" [item]=revenueTotal></statement-line-item>
          <div class="text-xl mt-2 font-serif">Expense</div>
          @for (item of header; track item){
            @if (item.child >= 6000) {
              <statement-line-item class="font-serif font-gray-800" [item]=item></statement-line-item>
           }            
         }
         <statement-line-item class="font-serif font-gray-800" [item]=expenseTotal></statement-line-item>
      }
    </div>
    
</div>
  `,
  providers: []
})

export class IncomeStatementRptComponent implements OnInit {

  // currentPeriod = signal(1);
  // currentYear = signal(2024);
  args$: any;
  dReportDate = new Date();



  distributionService = inject(DistributionLedgerService).getDistributionReportByPrdAndYear({ period: 1, period_year: 2024 });

  onYearChanged(e: any) {
    //this.currentYear.set(Number(e));
    this.onRefresh();
  }

  onPeriodChanged(e: any) {
    //this.currentPeriod.set(Number(e));
    this.onRefresh();
  }

  public scrollSettings: {
    isFinite: true,
    enableVirtualization: false,
  }

  onRefresh() {
    var params = {
      //period: this.currentPeriod(),
      //period_year: this.currentYear()
    }

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
