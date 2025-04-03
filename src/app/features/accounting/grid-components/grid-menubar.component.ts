import { CommonModule } from "@angular/common";
import {
  Component,
  ChangeDetectionStrategy,
  output,
  input,
  inject,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ToastrService } from "ngx-toastr";

let modules = [MatToolbarModule, MatIconModule, MatButtonModule, CommonModule,  MatTooltipModule];

@Component({
    standalone: true,
    selector: "grid-menubar",
    styles: [
        ` ::ng-deep.mat-menu-panel {
        max-width: none !important;
      }
    `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [modules],
    template: `
    <mat-toolbar class="text-white font-sans bg-gray-500 text-2xl rounded-lg">  {{ inTitle() }} {{ prd() }}  {{prd_year()}}

      <span class="flex-1"></span>

      
      @if (showNew()) {
        <button mat-icon-button  (click)="onNew()" color="primary" class="m-1 bg-gray-200 md:visible" matTooltip="Create New Journal"  aria-label="NEW" >
          <span class="e-icons text-bold e-circle-add"></span>
        </button>
      }  


      @if (showClone()) {
        <button mat-icon-button  (click)="onClone()" color="primary" class="m-1 bg-gray-200 md:visible" matTooltip="Clone Current Journal"  aria-label="NEW" >        
          <span class="e-icons e-copy"></span>
        </button>
      }  

      @if (showTemplate()) {
        <button mat-icon-button  (click)="onTemplate()" color="primary" class="m-1 bg-gray-200 md:visible" matTooltip="Create Template From Current Journal"  aria-label="NEW" >        
          <span class="e-icons e-table-overwrite-cells"></span>
        </button>
      }  

      @if (showPrint()) {
        <button  (click)="onPrint()" color="primary" class="m-1 bg-gray-200 md:visible" mat-icon-button  matTooltip="Print"  aria-label="Print" >
          <span class="e-icons e-print-2"></span>
        </button>
      }
      
      @if (showExportPDF()) {
        <button  (click)="onPDF()" color="primary" class="m-1 bg-gray-200 md:visible" mat-icon-button  matTooltip="Export PDF"  aria-label="PDF" >
          <span class="e-icons e-export-pdf"></span>
        </button>
      }
      
      @if (showExportXL()) {
        <button  (click)="onXL()" color="primary" class="m-1 bg-gray-200 md:visible" mat-icon-button  matTooltip="Export XL"  aria-label="XL" >
          <span class="e-icons e-export-excel"></span>
        </button>
      }

      @if (showExportCSV()) {
        <button  (click)="onCSV()" color="primary" class="m-1 bg-gray-200 md:visible" mat-icon-button  matTooltip="Export CSV"  aria-label="CSV" >
          <span class="e-icons text-bold e-export-csv"></span>
        </button>
      }  

      @if (showSettings()) {
        <button mat-icon-button  (click)="onOpenSettings()" color="primary" class="m-1 bg-gray-200 md:visible" matTooltip="Table Settings"  aria-label="CSV" >
          <span class="e-icons text-bold e-settings"></span>
        </button>
      }  

      
      @if (showBack()) {
        <button (click)="onBack()" color="primary" class="m-1 bg-gray-200 md:visible"  mat-icon-button  matTooltip="Back"  aria-label="Back"  >
          <span class="e-icons e-chevron-left"></span>
        </button>
      }
    </mat-toolbar>
  `
})


export class GridMenubarStandaloneComponent {

  private toast = inject(ToastrService);  

  public exportXL = output<string>();
  public exportPRD = output<string>();
  public exportCSV = output<string>();
  public openSettings = output<string>();
  public print = output<string>();
  public back = output<string>();
  public new = output<string>();
  public clone = output<string>();
  public template = output<string>();
  public onCopy = output<string>();

  public inTitle = input<string>("General Ledger Transactions");
  public prd = input<string>();
  public prd_year = input<string>();

  public showBack = input<boolean>(false);
  public showExportXL = input<boolean>(false);
  public showExportPDF = input<boolean>(false);
  public showExportCSV = input<boolean>(false);
  public showPrint = input<boolean>(true);
  public showSettings = input<boolean>(true);
  public showNew = input<boolean>(false);
  public showClone = input<boolean>(false);
  public showTemplate = input<boolean>(false);
  public period = output<string>();

  public changePeriod() {    
    this.period.emit('change');
  }

  public onNew() {
    
    this.new.emit('add');
  }

  public onClone() {
    
    this.clone.emit('clone');
  }

  public onTemplate() {
    this.template.emit('template');
  }
  
  public onBack() {
    this.back.emit('back');
  }

  public onPrint() {
    this.print.emit('print');
  }

  public onPDF() {
    this.exportPRD.emit('pdf');
  }

  public onXL() {
    this.exportXL.emit('xl');
  }

  public onCSV() {
    this.exportCSV.emit('csv');
  }

  public onOpenSettings() {
    this.openSettings.emit('settings');
  }

}
