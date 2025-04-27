import {
  Component,
  inject,
  input,
  OnInit,
  signal,
  viewChild,
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
import { GridMenubarStandaloneComponent } from "../grid-components/grid-menubar.component";
import { ToastrService } from "ngx-toastr";

import { AppService } from "app/store/main.panel.store";
import { map } from "rxjs";
import { ApplicationStore } from "app/store/application.store";

const imports = [
  CommonModule,
  ReactiveFormsModule,
  MaterialModule,
  FormsModule,
  NgxMatSelectSearchModule,
  JournalEntryComponent,
  GridMenubarStandaloneComponent, 
  SummaryCardComponent,
  JournalEntryComponent
];
@Component({
  selector: "ap-transactions",
  imports: [imports, ],
  template: `
   <div id="settings" class="control-section default-splitter flex flex-col overflow-hidden">
      <grid-menubar #menubar id="menubar" class="ml-1 mr-1 w-full" [inTitle]="toolbarTitle" 
        (openSettings)=onOpenSettings()
        (print)=onPrinting()        
      ></grid-menubar>
      <div class="grid grid-row-3 overflow-hidden">
      <div class="flex flex-col min-w-0 overflow-y-auto -px-10" cdkScrollable>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full min-w-0 overflow-hidden">
            
            <div (click)="onReceipts()" class="flex-auto p-6 bg-card shadow rounded-2xl overflow-hidden m-2 hover:cursor-pointer">
                <summary-card class="min-h-48" [mainValue]="150026.00" [caption]="'Receipts'" [title]="'Funds'" [chart]="'1'"
                    [subtitle]="" [subtitle_value]="">
                </summary-card>
            </div>
            <!-- Overdue -->
            <div  class="flex-auto p-6 bg-card shadow rounded-2xl overflow-hidden m-2 hover:cursor-pointer">
                <summary-card class="min-h-32" (click)="onReceipts()" [mainValue]="24000.00" [caption]="'Outstanding'" [title]="'30 Days'"
                    [subtitle]="''" [subtitle_value]="">
                </summary-card>
            </div>
            <div class="flex-auto p-6 bg-card shadow rounded-2xl overflow-hidden m-2 hover:cursor-pointer">
                <summary-card  class="min-h-32" (click)="onReceipts()" [mainValue]="45050.00" [caption]="'Current Receivables'" [title]="'Capital'"
                    [subtitle]="''" [subtitle_value]="">
                </summary-card>
            </div>
            <!-- Issues -->
            <div class="flex-auto p-6 bg-card shadow rounded-2xl overflow-hidden m-2 hover:cursor-pointer">
                <summary-card  class="min-h-32" (click)="onReceipts()"  [mainValue]="15000.00" [caption]="'Past Due Receipts'" [title]="'Capital'"
                    [subtitle]="''" [subtitle_value]="">
                </summary-card>
            </div>
        </div>
        <div class="grid grid-cols-1 gap-4 w-full min-w-0 border-gray-300 overflow-hidden">
            <ng-container>                    
                @defer {
                  <transactions #transaction
                    [transactionType]="transactionType"                     
                    [openDrawers]="openDrawer"                     
                    (onCloseDrawer)="onOpenSettings()">
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

  private toast = inject(ToastrService);

  public transactionType = "AP";
  // public applicationService = inject(AppService);

  public toolbarTitle = "Accounts Payable Transactions";

  transactionGrid = viewChild<JournalEntryComponent>("transaction");
  menubar = viewChild<GridMenubarStandaloneComponent>("menubar");

  public openDrawer = false;

  onNew() {
    this.toast.success('Add new Journal Entry', 'Add');
  }

  onTemplate() {
    this.toast.success('Template', 'Template');
  }

  onClone() {
    this.toast.success('Template Clone', 'Clone');
  }

  onOpenSettings() {
    if (this.openDrawer === false)
      this.openDrawer = true;
    else
      this.openDrawer = false;
  }

  exportLX() {
    this.toast.success('Template');
  }
  exportPDF() {
    this.toast.success('Template');
  }
  exportCSV() {
    this.toast.success('Template');
  }
  onPrinting() {
    this.transactionGrid().onPrint();
  }

  onRefresh() {
    this.toast.success('Template');
  }
  onDeleteSelection() {
    this.toast.success('Template');
  }
  onUpdateSelection() {
    this.toast.success('Template');
  }
  onReceipts() {
    this.toast.success('Template');
  }
}



