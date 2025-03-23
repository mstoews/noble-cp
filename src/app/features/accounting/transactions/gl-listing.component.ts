import { Component, inject } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "app/shared/material.module";
import { JournalEntryComponent } from "./journal-listing.component";
import { ToastrService } from "ngx-toastr";
import { GridMenubarStandaloneComponent } from "../grid-components/grid-menubar.component";
import { SummaryCardComponent } from "../../admin/dashboard/summary-card.component";

const imports = [
  CommonModule,
  ReactiveFormsModule,
  MaterialModule,
  FormsModule,
  NgxMatSelectSearchModule,
  JournalEntryComponent,
];

@Component({
  selector: "gl-transactions-list",
  imports: [imports, GridMenubarStandaloneComponent, SummaryCardComponent],
  template: `
    <div id="settings" class="control-section default-splitter flex flex-col overflow-hidden">
    <grid-menubar class="ml-1 mr-1 w-full" [inTitle]="toolbarTitle"></grid-menubar>
    <div class="grid grid-row-3 overflow-hidden">
    <div class="flex flex-col min-w-0 overflow-y-auto -px-10" cdkScrollable>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full min-w-0 overflow-hidden">
            
            <div (click)="onReceipts()" class="flex-auto p-6 bg-card shadow rounded-2xl overflow-hidden m-2 hover:cursor-pointer">
                <summary-card   [mainValue]="150026.00" [caption]="'Receipts'" [title]="'Funds'"
                    [subtitle]="" [subtitle_value]="">
                </summary-card>
            </div>
            <!-- Overdue -->
            <div  class="flex-auto p-6 bg-card shadow rounded-2xl overflow-hidden m-2 hover:cursor-pointer">
                <summary-card  (click)="onReceipts()" [mainValue]="24000.00" [caption]="'Outstanding'" [title]="'30 Days'"
                    [subtitle]="''" [subtitle_value]="">
                </summary-card>
            </div>
            <div class="flex-auto p-6 bg-card shadow rounded-2xl overflow-hidden m-2 hover:cursor-pointer">
                <summary-card  (click)="onReceipts()" [mainValue]="45050.00" [caption]="'Current Receivables'" [title]="'Capital'"
                    [subtitle]="''" [subtitle_value]="">
                </summary-card>
            </div>
            <!-- Issues -->
            <div class="flex-auto p-6 bg-card shadow rounded-2xl overflow-hidden m-2 hover:cursor-pointer">
                <summary-card  (click)="onReceipts()"  [mainValue]="15000.00" [caption]="'Past Due Receipts'" [title]="'Capital'"
                    [subtitle]="''" [subtitle_value]="">
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

})
export class GLTransactionListComponent {

  private toast = inject(ToastrService);
  public transType: string = "all";
  public toolbarTitle = "General Ledger Transactions";


  onNew() {
    this.toast.success('Add new Journal Entry', 'Add');
  }

  onTemplate() {
    this.toast.success('Template', 'Template');
  }

  onClone() {
    this.toast.success('Template Clone', 'Clone');
  }

  openDrawer() {
    this.toast.success('Template');
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
  onPrint() {
    this.toast.success('Template');
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
