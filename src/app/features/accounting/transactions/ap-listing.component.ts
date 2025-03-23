import {
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { CommonModule } from "@angular/common";

import { MaterialModule } from "app/shared/material.module";
import {
  EditService,
  GroupService,
  FilterService,
  PageService,
  SortService,
  ToolbarService,
  AggregateService,
  ColumnMenuService,
  ResizeService,
  PdfExportService,
  ExcelExportService,
  ReorderService,
} from "@syncfusion/ej2-angular-grids";


import { JournalStore } from "app/store/journal.store";
import { SummaryCardComponent } from "../../admin/dashboard/summary-card.component";
import { JournalEntryComponent } from "./journal-listing.component";
import { ApplicationStore } from "app/store/application.store";
import { GridMenubarStandaloneComponent } from "../grid-components/grid-menubar.component";

const imports = [
  CommonModule,
  ReactiveFormsModule,
  MaterialModule,
  FormsModule,
  NgxMatSelectSearchModule,
  JournalEntryComponent,
  SummaryCardComponent
];

@Component({
  selector: "ap-transactions",
  imports: [imports, GridMenubarStandaloneComponent],
  template: `
   <div id="settings" class="control-section default-splitter flex flex-col overflow-hidden">
    <grid-menubar class="ml-1 mr-1 w-full" [inTitle]="toolbarTitle"></grid-menubar>
    <div class="grid grid-row-3 overflow-hidden">
    <div class="flex flex-col min-w-0 overflow-y-auto -px-10" cdkScrollable>
      
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full min-w-0 overflow-hidden">                      
              
             <div  class="flex-auto p-6 bg-card shadow rounded-2xl overflow-hidden m-2 hover:cursor-pointer">
                  <summary-card  (click)="onReceipts()" [mainValue]="cash()" [caption]="'Total Cash on Hand'" [title]="'Funds'"[chart]="'donut'"   [subtitle]="">
                  </summary-card>
              </div>              
              <div  class="flex-auto p-6 bg-card shadow rounded-2xl overflow-hidden m-2 hover:cursor-pointer">
                  <summary-card  (click)="onReceipts()" [mainValue]="ap()" [caption]="'Accounts Payable'" [chart]="'chart-legend-right'" [subtitle]="" [subtitle_value]="1256">
                  </summary-card>
              </div>
              <div class="flex-auto p-6 bg-card shadow rounded-2xl overflow-hidden m-2 hover:cursor-pointer">
                  <summary-card  (click)="onReceipts()" [mainValue]="liabilities()" [chart]="'chart-lines'"[caption]="'Current Liabilities'" [title]="'Liabilities'"[subtitle]="" [subtitle_value]="">
                  </summary-card>
              </div>              
              <div class="flex-auto p-6 bg-card shadow rounded-2xl overflow-hidden m-2 hover:cursor-pointer">
                  <summary-card  (click)="onReceipts()"  [mainValue]="5000.00" [caption]="'Past Due Payments'" [title]="'Capital'"[chart]="'chart-insert-column'"[subtitle]="" [subtitle_value]="">
                  </summary-card>
              </div>             
            
          </div>
          
        <div class="grid grid-cols-1 gap-4 h-full w-full min-w-0 border-gray-300 overflow-hidden">
            <ng-container>                    
                @defer {
                    <transactions 
                    class="group relative flex flex-col overflow-hidden rounded-lg  pb-2 flex-grow"
                    [transactionType]="transType">
                    </transactions>
                }                
                @placeholder(minimum 200ms) {
                    <div class="flex justify-center items-center">
                        <mat-spinner></mat-spinner>
                    </div>
                }
            </ng-container>                                          
        </div>    
    </div>        
  `,
  providers: [
    JournalStore,
    ResizeService,
    SortService,
    ReorderService,
    ExcelExportService,
    PdfExportService,
    PageService,
    ResizeService,
    GroupService,
    FilterService,
    ToolbarService,
    EditService,
    AggregateService,
    ColumnMenuService,
  ]
})
export class APTransactionComponent implements OnInit {

  public store = inject(ApplicationStore);

  public transType: string = "AP";
  public toolbarTitle = "Accounts Payable Transactions";
  public prd = 1;
  public prd_year = 2024;

  public cash = signal<number>(0);
  public ap = signal<number>(0);
  public liabilities = signal<number>(0);
  public operating = signal<number>(0);

  ngOnInit(): void {
    this.loadCash();
    this.loadAP();
    this.loadLiability();
  }

  loadAP() {
    // var tb = this.store.trialBalance().filter((tb) => tb.child == 3010);
    // if (tb.length > 0) {
    //   console.debug('TrialBalance : ', tb[0].closingBalance);
    //   this.ap.set(Math.abs(tb[0].closingBalance));
    // }
  }

  loadLiability() {
    // var tb = this.store.trialBalance().filter((tb) => tb.child == 3020);
    // if (tb.length > 0) {
    //   console.debug('TrialBalance : ', tb[0].closingBalance);
    //   this.liabilities.set(Math.abs(tb[0].closingBalance));
    // }
  }

  loadCash() {
    // var tb = this.store.trialBalance().filter((tb) => tb.child == 1001);
    // if (tb.length > 0) {
    //   console.debug('TrialBalance : ', tb[0].closingBalance);
    //   this.cash.set(Math.abs(tb[0].closingBalance));
    // }
  }

  openDrawer() {
    throw new Error('Method not implemented.');
  }
  exportLX() {
    throw new Error('Method not implemented.');
  }
  exportPDF() {
    throw new Error('Method not implemented.');
  }
  exportCSV() {
    throw new Error('Method not implemented.');
  }
  onPrint() {
    throw new Error('Method not implemented.');
  }

  onRefresh() {
    throw new Error('Method not implemented.');
  }
  onAdd() {
    throw new Error('Method not implemented.');
  }
  onDeleteSelection() {
    throw new Error('Method not implemented.');
  }
  onUpdateSelection() {
    throw new Error('Method not implemented.');
  }
  onReceipts() {
    throw new Error('Method not implemented.');
  }
  onClone() {
    throw new Error('Method not implemented.');
  }

  onTemplate() {
    throw new Error('Method not implemented.');
  }

}


