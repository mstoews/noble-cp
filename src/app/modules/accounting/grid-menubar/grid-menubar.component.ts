import { CommonModule } from "@angular/common";
import {
  Component,
  ChangeDetectionStrategy,
  output,
  input,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";

let modules = [MatToolbarModule, MatIconModule, MatButtonModule, CommonModule];

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
    <mat-toolbar class="text-white font-sans bg-gray-500 text-2xl rounded-lg">   {{ inTitle() }}

    <span class="flex-1"></span>

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

    @if (showBack()) {
      <button (click)="onBack()" color="primary" class="m-1 bg-gray-200 md:visible"  mat-icon-button  matTooltip="Back"  aria-label="Back"  >
        <span class="e-icons e-chevron-left"></span>
      </button>
    }
    </mat-toolbar>
  `
})


export class GridMenubarStandaloneComponent {

  public exportXL = output<string>();
  public exportPRD = output<string>();
  public exportCSV = output<string>();
  public print = output<string>();
  public back = output<string>();

  public inTitle = input<string>("General Ledger Transactions");

  public showBack = input<boolean>(false);
  public showExportXL = input<boolean>(true);
  public showExportPDF = input<boolean>(true);
  public showExportCSV = input<boolean>(true);
  public showPrint = input<boolean>(true);
  public period = output<string>();

  public changePeriod() {
    this.period.emit('change');
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

}
