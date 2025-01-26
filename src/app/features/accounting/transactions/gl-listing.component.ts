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
import { JournalEntryComponent } from "./journal-listing.component";
import { ToastrService } from "ngx-toastr";

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
  imports: [imports],
  template: `
    <div id="settings" class=" control-section default-splitter flex flex-col overflow-auto">            
        <div class="h-full border-gray-300 rounded-2xl">
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
  public transType: string = "GL";
  public toolbarTitle = "General Ledger Transactions";
  

  onNew() {
    this.toast.success('Add new Journal Entry','Add');
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
