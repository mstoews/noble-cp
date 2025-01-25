import {
  Component,
} from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "app/services/material.module";
import { JournalEntryComponent } from "./journal-listing.component";
import { GridMenubarStandaloneComponent } from "../grid-components/grid-menubar.component";

const imports = [
  CommonModule,
  ReactiveFormsModule,
  MaterialModule,
  FormsModule,
  NgxMatSelectSearchModule,
  JournalEntryComponent,
  GridMenubarStandaloneComponent
];

@Component({
  selector: "gl-transactions-list",
  imports: [imports],
  template: `
  <div id="settings" class=" control-section default-splitter flex flex-col overflow-auto">            
    <grid-menubar class="ml-1 mr-1" [inTitle]="toolbarTitle" 
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

        </div>

        <div class="flex flex-col min-w-0 overflow-y-auto -px-10" cdkScrollable>

        <div class="flex-auto">
        <div class="h-full border-gray-300 rounded-2xl">
            @defer {
                 <mat-card class="m-1">    
                   <transactions [transactionType]="transType"></transactions>        
                 </mat-card>
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

})
export class GLTransactionListComponent {

  public transType: string = "GL";
  public toolbarTitle = "General Ledger Transactions";
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
