import { Component, ViewEncapsulation, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DistributionLedgerService } from 'app/services/distribution.ledger.service';

import { map, Subject } from 'rxjs';
import { MaterialModule } from 'app/services/material.module';
import { StatementTotalComponent } from './statement-totals.component';
import html2PDF from 'jspdf-html2canvas'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf';
import { GridMenubarStandaloneComponent } from 'app/features/accounting/grid-components/grid-menubar.component';
import { ReportStore } from 'app/services/reports.store';
import { AcademyComponent } from "../../admin/academy/academy.component";
import { StatementComparisonComponent } from './statement-comparison-line-item.component';
import {CdkMenu, CdkMenuItem, CdkContextMenuTrigger} from '@angular/cdk/menu';

const imports = [
  CommonModule,
  StatementComparisonComponent,
  GridMenubarStandaloneComponent, 
  CdkMenu, CdkMenuItem, CdkContextMenuTrigger
]

@Component({
  selector: 'income-statement-comparison-rpt',
  imports: [imports],
  encapsulation: ViewEncapsulation.None,
  template: `
  <div class="flex flex-col min-w-0 overflow-y-auto overflow-x-auto" cdkScrollable [cdkContextMenuTriggerFor]="outer" >
  <!-- Main -->
  <div id="statement" class="flex-auto p-2 sm:p-10 bg-white">
      <div class="h-max border-gray-300 rounded-2xl">                
        <grid-menubar></grid-menubar>          
      </div>
      @if (store.isLoading() == false ) 
      {
        <div id="income-statement" class="pl-10 pr-10 pt-2 pb-14 mat-elevation-z8 mt-4 bg-white font-gray-900" [cdkContextMenuTriggerFor]="inner">

            <div class="text-gray-800 text-2xl mt-3">{{companyName()}}</div>
            <div class="text-gray-800  text-2xl mt-1">{{reportName()}}</div>
            <div class="text-gray-800  text-2xl mt-1">{{dReportDate}}</div>
            
            <section class="grid grid-cols-1 mt-10 text-sm">      
                <div class="grid grid-cols-12 gap-2">
                  <div class="col-start-1  text-gray-900 text-left">Account</div>
                  <div class="col-start-2  text-gray-900 text-left">Description</div>
                  <div class="col-start-5  text-gray-900 text-right">Opening</div>
                  <div class="col-start-6  text-gray-900 text-right">Closing</div>            
                  <div class="col-start-7  text-gray-900 text-right">Change</div>
                  <div class="col-start-8 text-gray-900 text-right">Percentage</div>
                </div>
                        
                @for (item of store.tb(); track item) {                                                         
                   <statement-comparison-item [item]="item" [showHeader]="true"></statement-comparison-item>  
                } 
            </section>            
          </div>          
      }        
  </div>

  <ng-template #outer>
  <div class="inline-flex flex-col min-w-[180px] max-w-[280px] bg-white px-0 py-1.5;" cdkMenu>
    <button class="bg-transparent cursor-pointer select-none min-w-[64px] leading-9 flex items-center flex-row flex-1 px-4 py-0 border-[none] hover:bg-[rgb(208,208,208)] active:bg-[rgb(170,170,170)]" cdkMenuItem>Save</button>
    <button class="bg-transparent cursor-pointer select-none min-w-[64px] leading-9 flex items-center flex-row flex-1 px-4 py-0 border-[none] hover:bg-[rgb(208,208,208)] active:bg-[rgb(170,170,170)]" cdkMenuItem>Exit</button>
  </div>
</ng-template>


<ng-template #inner>
  <div class="inline-flex flex-col min-w-[180px] max-w-[280px] bg-white px-0 py-1.5;" cdkMenu>
    <button class="bg-transparent cursor-pointer select-none min-w-[64px] leading-9 flex items-center flex-row flex-1 px-4 py-0 border-[none] hover:bg-[rgb(208,208,208)] active:bg-[rgb(170,170,170)]" cdkMenuItem>Cut</button>
    <button class="bg-transparent cursor-pointer select-none min-w-[64px] leading-9 flex items-center flex-row flex-1 px-4 py-0 border-[none] hover:bg-[rgb(208,208,208)] active:bg-[rgb(170,170,170)]" cdkMenuItem>Copy</button>
    <button class="bg-transparent cursor-pointer select-none min-w-[64px] leading-9 flex items-center flex-row flex-1 px-4 py-0 border-[none] hover:bg-[rgb(208,208,208)] active:bg-[rgb(170,170,170)]" cdkMenuItem>Paste</button>
  </div>
</ng-template>

  `,
  providers: [ReportStore]
})

export class IncomeStatementComparisonRptComponent {

  public currentPeriod = signal(1);
  public currentYear = signal(2024);

  public dReportDate = new Date();
  public reportName = signal('Income Statement Comparison');
  public companyName = signal('Noble Ledger Ltd.');

  store = inject(ReportStore);

  public periodParams = {
    period: this.currentPeriod(),
    year: this.currentYear(),
  };

  constructor () {
    this.store.loadTB(this.periodParams);
    this.store.tb().forEach((item) => {
      console.log(item);
    });
  }

  onChild(e: any) {
    console.log('child clicked', JSON.stringify(e));
  }
  
  onYearChanged(e: any) {
    this.currentYear.set(Number(e));
    this.onRefresh();
  }

  onRefresh() {
  }

  onPeriodChanged(e: any) {
    this.currentPeriod.set(Number(e));
    this.onRefresh();
  }

  public scrollSettings: {
    isFinite: true,
    enableVirtualization: false,
  }



  onExportCSV() {
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
      init: function () { },
      success: function (pdf) {
        var dReportDate = new Date();
        pdf.save(`IncomeComparisonStatement${dReportDate}.pdf`);
      }
    });

  }

  onExportExcel() {
    const is: any = document.getElementById('income-statement');
    html2canvas(is, { scale: 2 }).then((canvas) => {
      const doc = new jsPDF();
      doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 200, 200);
      doc.setFontSize(12);
      doc.save(`IncomeStatement.${this.dReportDate}.pdf`)
    });

  }

  ngOnDestroy(): void {
  
  }

}


