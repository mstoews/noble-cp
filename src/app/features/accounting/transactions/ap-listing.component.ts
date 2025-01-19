import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  viewChild,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Subject } from "rxjs";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { CommonModule } from "@angular/common";
import { DndComponent } from "app/features/drag-n-drop/loaddnd/dnd.component";

import { MatDrawer } from "@angular/material/sidenav";
import { MaterialModule } from "app/services/material.module";
import {
  DialogEditEventArgs,
  EditService,
  SelectionSettingsModel,
  GroupService,
  FilterService,
  GridModule,
  PageService,
  SaveEventArgs,
  SortService,
  ToolbarService,
  GridComponent,
  AggregateService,
  FilterSettingsModel,
  ToolbarItems,
  SearchSettingsModel,
  GroupSettingsModel,
  ColumnMenuService,
  ResizeService,
  ExcelExport,
  PdfExportService,
  ExcelExportService,
  ReorderService,
} from "@syncfusion/ej2-angular-grids";
import { Browser } from "@syncfusion/ej2-base";
import { Dialog } from "@syncfusion/ej2-popups";

import { DropDownListComponent } from "@syncfusion/ej2-angular-dropdowns";
import { IJournalHeader } from "app/models/journals";

import { JournalStore } from "app/services/journal.store";
import { Router } from "@angular/router";
import { GridMenubarStandaloneComponent } from "../grid-components/grid-menubar.component";
import { SummaryCardComponent } from "../../admin/dashboard/summary-card.component";
import { JournalEntryComponent } from "./journal-listing.component";

const imports = [
  CommonModule,
  ReactiveFormsModule,
  MaterialModule,
  FormsModule,
  NgxMatSelectSearchModule,
  JournalEntryComponent,
  SummaryCardComponent,
  GridMenubarStandaloneComponent
];

@Component({
  selector: "ap-transactions",
  imports: [imports],
  template: `
  <div id="settings" class=" control-section default-splitter flex flex-col overflow-auto">            
    <grid-menubar [inTitle]="toolbarTitle"
                  [prd]="prd"  
                  [prd_year]="prd_year"
                  (openSettings)="openDrawer()" 
                  (onPrint)="onPrint()"                          
                  (exportXL)="exportLX()"
                  (exportPRD)="exportPDF()"
                  (exportCSV)="exportCSV()"
                  (showPrint)="true"
                  (showExportXL)="true"
                  (showExportPDF)="true"
                  (showExportCSV)="true"
                  (showSettings)="true"
                  (showBack)="false" >
                </grid-menubar>  
</div>                
<div class="flex-auto">
    <div class="flex flex-col min-w-0 overflow-y-auto -px-10" cdkScrollable>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full min-w-0">

            <div (click)="onReceipts()" class="flex-auto p-6 bg-card shadow rounded-2xl overflow-hidden m-2 hover:cursor-pointer">
                <summary-card   [mainValue]="23226.00" [caption]="'Payments'" [title]="'Funds'"
                                [subtitle]="" [subtitle_value]="">
                </summary-card>
            </div>
            <!-- Overdue -->
            <div  class="flex-auto p-6 bg-card shadow rounded-2xl overflow-hidden m-2 hover:cursor-pointer">
                <summary-card  (click)="onReceipts()" [mainValue]="23330.15" [caption]="'Outstanding'" [title]="'30 Days'"
                               [subtitle]="'Last Month'" [subtitle_value]="1256">
                </summary-card>
            </div>
            <div class="flex-auto p-6 bg-card shadow rounded-2xl overflow-hidden m-2 hover:cursor-pointer">
                <summary-card  (click)="onReceipts()" [mainValue]="45050.00" [caption]="'Current Accounts Payable'" [title]="'Capital'"
                               [subtitle]="''" [subtitle_value]="">
                </summary-card>
            </div>
            <!-- Issues -->
            <div class="flex-auto p-6 bg-card shadow rounded-2xl overflow-hidden m-2 hover:cursor-pointer">
                <summary-card  (click)="onReceipts()"  [mainValue]="5000.00" [caption]="'Past Due Payments'" [title]="'Capital'"
                               [subtitle]="''" [subtitle_value]="">
                </summary-card>
            </div>
        </div>

        <div class="flex flex-col min-w-0 overflow-y-auto -px-10" cdkScrollable>

        <div class="flex-auto">
          <div class="h-full border-gray-300 rounded-2xl">
            @defer {    
                 <transactions [transactionType]="transType"></transactions>        
            }
            @placeholder(minimum 1000ms) {
                 <div class="flex justify-center items-center">
                    <mat-spinner></mat-spinner>
                 </div>
            }
          </div>
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

  public transType: string = "AP";
  public toolbarTitle = "Accounts Payable Transactions";
  public prd = "1";
  public prd_year = "2024";

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

  

}
