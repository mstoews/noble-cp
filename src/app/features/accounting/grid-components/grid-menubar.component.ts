import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, output, input, inject, OnInit, viewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ICurrentPeriod } from "app/models/period";

import { FormControl, FormGroup } from "@angular/forms";
import { MatMenuModule } from '@angular/material/menu';
import { MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { PeriodStore } from "app/store/periods.store";


let modules = [MatToolbarModule, MatIconModule, MatButtonModule, CommonModule, MatTooltipModule, MatSelectModule, MatMenuModule];

@Component({
  standalone: true,
  selector: "grid-menubar",
  styles: [` 
      :host ::ng-deep .mdc-text-field--outlined ng-deep.mdc-notched-outline__leading {        
        border-color: #33beff  !important;
        color: red !important;
      }
      
      :host ::ng-deep .mdc-text-field--outlined ng-deep.mdc-notched-outline__notch {        
        border-color: #33beff  !important;
        color: red !important;
      }
      
      :host ::ng-deep .mdc-text-field--outlined ng-deep.mdc-notched-outline__trailing {        
        border-color: #33beff  !important;
        color: red !important;
      }
    `,
  ],

  imports: [modules],
  template: `
    <mat-toolbar class="text-white font-sans bg-gray-500 text-2xl rounded-lg mr-5">  {{ inTitle() }} 
    <span class="flex-1"></span>      
      
    <mat-form-field class="rounded-lg w-[200px] mt-5">              
              <mat-select [value]="_currentPeriod" #periodDropdownSelection (selectionChange)="onSelectionChange($event)">
                  @for ( period of _currentActivePeriods ; track period.description ) {
                    <mat-option [value]="period.description">
                        {{ period.description }}
                    </mat-option>
                  }             
              </mat-select>                        
    </mat-form-field>  
      
      
      @if (showNew()) {
        <button mat-icon-button  (click)="onNew()" color="primary" class="m-1 bg-gray-200 md:visible" matTooltip="Add"  aria-label="NEW" >
          <span class="e-icons text-bold e-circle-add"></span>
        </button>
      }  


      @if (showClone()) {
        <button mat-icon-button  (click)="onClone()" color="primary" class="m-1 bg-gray-200 md:visible" matTooltip="Clone"  aria-label="NEW" >        
          <span class="e-icons e-copy"></span>
        </button>
      }  

      @if (showTemplate()) {
        <button mat-icon-button  (click)="onTemplate()" color="primary" class="m-1 bg-gray-200 md:visible" matTooltip="Create Template"  aria-label="NEW" >        
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridMenubarStandaloneComponent implements OnInit {

  exportXL = output<string>();
  exportPRD = output<string>();
  exportCSV = output<string>();
  openSettings = output<string>();
  print = output<string>();
  back = output<string>();
  new = output<string>();
  clone = output<string>();
  template = output<string>();
  onCopy = output<string>();
  inTitle = input<string>("General Ledger Transactions");
  prd = input<string>();
  prd_year = input<string>();
  
  periods = input<ICurrentPeriod[]>();

  showBack = input<boolean>(true);
  showPeriod = input<boolean>(true);
  showExportXL = input<boolean>(true);
  showExportPDF = input<boolean>(false);
  showExportCSV = input<boolean>(false);
  showPrint = input<boolean>(true);
  showSettings = input<boolean>(false);
  showNew = input<boolean>(false);
  showClone = input<boolean>(false);
  showTemplate = input<boolean>(false);
  
  period = output<string>();
  selectedPeriod = output<string>();

  periodStore = inject(PeriodStore);
  periodsDropdown = viewChild<MatSelect>("periodDropdownSelection");
  
  _currentPeriod: string;


  _currentActivePeriods : ICurrentPeriod[];


  periodDropdownSelect = viewChild<MatSelect>("periodDropdownSelection");

  ngOnInit() {        
    var _currentActivePeriods = localStorage.getItem('activePeriod');
    
    if (_currentActivePeriods) {
      this._currentActivePeriods = JSON.parse(_currentActivePeriods) as ICurrentPeriod[];
    } 
    this._currentPeriod = localStorage.getItem('currentPeriod');    
  }
  public onSelectionChange(event: MatSelectChange) {
     var currentPrd = event.value as string;    
     localStorage.setItem('currentPeriod', currentPrd);
     this.periodStore.updateCurrentPeriod(currentPrd);        
     this.period.emit(currentPrd);
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
    console.debug("onPrint from GridMenubarStandaloneComponent");
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
