import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/shared/material.module';

import { JournalStore } from 'app/store/journal.store';
import { SummaryCardComponent } from 'app/features/admin/dashboard/summary-card.component';
import { FuseAlertType } from '@fuse/components/alert';
import { GridMenubarStandaloneComponent } from '../grid-components/grid-menubar.component';
import { JournalEntryComponent } from "./journal-listing.component";

const imports = [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    SummaryCardComponent,
    JournalEntryComponent
];

@Component({
    selector: 'ar-transactions',
    imports: [imports, GridMenubarStandaloneComponent],
    template: `
    <div id="settings" class="control-section default-splitter flex flex-col overflow-hidden">

    <grid-menubar class="ml-1 mr-1 mb-2 w-full" [inTitle]="toolbarTitle" (openSettings)=onOpenSettings()></grid-menubar>
    </div>                
    <div class="flex-auto">
            <div class="flex flex-col min-w-0 overflow-y-auto -px-10" cdkScrollable>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full min-w-0">
            
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
        
        <div class="h-full border-gray-300 rounded-2xl">
                <ng-container>                    
                    @defer {
                        <transactions [transactionType]="'AR'" 
                            [openDrawers]="openDrawer" 
                            (onCloseDrawer)="onOpenSettings()"              
                        ></transactions>
                    }                
                    @placeholder(minimum 200ms) {
                        <div class="flex justify-center items-center">
                            <mat-spinner></mat-spinner>
                        </div>
                    }
                </ng-container>                                                 
        </div>
    </div>
    
    </div>
    `,
})
export class ARTransactionComponent {

    public prd = "1";
    public prd_year = "2024";

    public openDrawer = false;

    onOpenSettings() {      
        if (this.openDrawer === false)
          this.openDrawer = true;
        else
          this.openDrawer = false;
      }
      
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    toolbarTitle = "Accounts Receivable Transactions";

    onReceipts() {
    }

    onRefresh() {
    }
    onAdd() {
    }

    onDeleteSelection() {

    }
    onUpdateSelection() {
    }

    
    onPrint() {

    }
    exportLX() {

    }
    exportPDF() {

    }
    exportCSV() {

    }

}
