import { Component, inject, input, OnInit, output, signal, viewChild } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "app/shared/material.module";
import { JournalEntryComponent } from "./journal-listing.component";
import { ToastrService } from "ngx-toastr";
import { GridMenubarStandaloneComponent } from "../grid-components/grid-menubar.component";
import { SummaryCardComponent } from "../../admin/dashboard/summary-card.component";
import { PeriodStore } from "app/store/periods.store";
import { ActivatedRoute } from "@angular/router";
import { JournalStore } from "app/store/journal.store";

const imports = [
  CommonModule,
  ReactiveFormsModule,
  MaterialModule,
  FormsModule,
  NgxMatSelectSearchModule,
  JournalEntryComponent,
  GridMenubarStandaloneComponent, 
  SummaryCardComponent
];

@Component({
  selector: "gl-transactions-list",
  imports: [imports] ,
  template: `

    <grid-menubar #menubar id="menubar" class="ml-1 mr-1 w-full " 
        [inTitle]="toolbarTitle" 
        (period)="onPeriod($event)"
        (openSettings)=onOpenSettings()
        (print)=onPrinting()>
      </grid-menubar>

    <div id="settings" class="control-section default-splitter flex flex-col overflow-hidden">
      
       
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
                    [transactionType]="transtype()"
                    [currentPrd]="currentPeriod()"
                    [activePeriods]="activePeriods"  
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

})
export class GLTransactionListComponent implements OnInit {

  private activatedRoute = inject(ActivatedRoute);

  transtype = input("all");

  currentPeriod = signal('');

  private toast = inject(ToastrService); 
  private periodStore = inject(PeriodStore);

  activePeriods = this.periodStore.activePeriods();
  toolbarTitle = "General Ledger";

  transactionGrid = viewChild<JournalEntryComponent>("transaction");
  menubar = viewChild<GridMenubarStandaloneComponent>("menubar");
  journalStore = inject(JournalStore);
  
  journalHeader: any;
  accountList: any;
  subtypeList: any;
  templateList: any;
  partyList: any;
  
  ngOnInit() {  
   
  }
  
  public openDrawer = false;

  onPeriod(event: any) {
    this.currentPeriod.set(event);
    this.toast.success(event, 'Period changed to: ');
    this.transactionGrid().updateTransactionPeriod(event);
  }

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
