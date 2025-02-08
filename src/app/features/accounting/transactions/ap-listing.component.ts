import {
  Component,
  inject,
} from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { CommonModule } from "@angular/common";

import { MaterialModule } from "app/services/material.module";
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


import { JournalStore } from "app/services/journal.store";
import { SummaryCardComponent } from "../../admin/dashboard/summary-card.component";
import { JournalEntryComponent } from "./journal-listing.component";
import { AppStore } from "app/services/application.state.service";
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
        <div (click)="onReceipts()" class="flex-auto p-6 bg-card shadow rounded-2xl overflow-hidden m-2 hover:cursor-pointer">
                  <summary-card 
                    [mainValue]="store.cashAccount().closingBalance" 
                    [caption]="'Total Cash on Hand'" 
                    [title]="'Funds'"
                    [chart]="'donut'"   
                    [subtitle]="'Current Funds'">
                  </summary-card>
              </div>              
              <div  class="flex-auto p-6 bg-card shadow rounded-2xl overflow-hidden m-2 hover:cursor-pointer">
                  <summary-card  
                  (click)="onReceipts()" 
                  [mainValue]="23330.15" 
                  [caption]="'Year to Date'" 
                  [chart]="'chart-legend-right'"   
                  [title]="'30 Days'"
                  [subtitle]="'January to Current Date'" 
                  [subtitle_value]="1256">
                  </summary-card>
              </div>
              <div class="flex-auto p-6 bg-card shadow rounded-2xl overflow-hidden m-2 hover:cursor-pointer">
                  <summary-card  
                  (click)="onReceipts()" [mainValue]="45050.00" 
                  [chart]="'chart-lines'"
                  [caption]="'Current Accounts Payable'" [title]="'Capital'"
                                [subtitle]="'Total Outstanding'" [subtitle_value]="">
                  </summary-card>
              </div>              
              <div class="flex-auto p-6 bg-card shadow rounded-2xl overflow-hidden m-2 hover:cursor-pointer">
                  <summary-card  
                  (click)="onReceipts()"  
                  [mainValue]="5000.00" 
                  [caption]="'Past Due Payments'" 
                  [title]="'Capital'"
                  [chart]="'chart-insert-column'"
                  [subtitle]="'90 Days Outstanding'" 
                  [subtitle_value]="">
                  </summary-card>
              </div>             
        </div>
        <div class="grid grid-cols-1 gap-4 w-full min-w-0 border-gray-300 overflow-hidden">
            <ng-container>                    
                @defer {
                    <transactions [transactionType]="transType"></transactions>
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
export class APTransactionComponent {

  store = inject(AppStore);

  public transType: string = "AP";
  public toolbarTitle = "Accounts Payable Transactions";
  public prd = "1";
  public prd_year = "2024";
  periodParam: any;

  constructor() {
    this.store.setCashAccount({periodYear: 2024, period: 1, account: 1001});
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


