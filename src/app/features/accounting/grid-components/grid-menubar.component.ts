import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, output, input, inject, OnInit, viewChild, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ICurrentPeriod } from "app/models/period";

import { MatMenuModule } from '@angular/material/menu';
import { MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { PeriodStore } from "app/store/periods.store";
import { CalendarModule } from "@syncfusion/ej2-angular-calendars";
import { MatDatepickerInputEvent, MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormControl, FormGroup } from "@angular/forms";


let modules = [
  CalendarModule, 
  MatFormFieldModule, 
  MatInputModule, 
  MatDatepickerModule,
  MatToolbarModule, 
  MatIconModule, 
  MatButtonModule, 
  CommonModule, 
  MatTooltipModule, 
  MatSelectModule, 
  MatMenuModule];

@Component({
  standalone: true,
  selector: "grid-menubar",
  styles: [`       
      :host ::ng-deep .mat-datepicker-toggle {
        color: green !important;
      }      
    `,
  ],

  imports: [modules],
  template: `
    <mat-toolbar class="text-white font-sans bg-gray-500 text-2xl rounded-lg mr-5">  {{ inTitle() }} 
    <span class="flex-1"></span>      
    
    @if (showPeriod()) {
           <div class="flex flex-row items-center w-[180px] text-white border-gray-200">        
              <mat-select class="w-[180px] text-white border-gray-200" [value]="_currentPeriod" #periodDropdownSelection (selectionChange)="onSelectionChange($event)">
                  @for ( period of _currentActivePeriods ; track period.description ) {
                    <mat-option [value]="period.description">
                        {{ period.description }}
                    </mat-option>
                  }             
              </mat-select>           
           </div>      
    }


      @if (showCalendar()) {
        <mat-form-field color="primary" class="w-[200px] mt-5 mr-3 p-1 text-green-800 ">         
          <mat-date-range-input color="primary" [formGroup]="range" [rangePicker]="picker"  >
              <input (dateChange)="setStartDate('change', $event)"  color="primary" matStartDate formControlName="start" placeholder="Start date">
              <input (dateChange)="setEndDate('change', $event)" matEndDate formControlName="end" placeholder="End date">
          </mat-date-range-input>          
              <!-- <mat-datepicker-toggle color="primary" [for]="picker" class="text-green-800"> </mat-datepicker-toggle>  -->
          <mat-date-range-picker   #picker></mat-date-range-picker>
        </mat-form-field> 
        <button mat-icon-button  (click)="picker.open()" color="primary" class="m-1 bg-gray-200 md:visible" matTooltip="Save"  aria-label="Save" >
        <mat-icon [svgIcon]="'feather:calendar'"></mat-icon>
        </button>      
            
      } 

    

      @if (showSave()) {
        <button mat-icon-button  (click)="onSave()" color="primary" class="m-1 bg-gray-200 md:visible" matTooltip="Save"  aria-label="Save" >
          <span class="e-icons text-bold e-save"></span>
        </button>
      }
      
      @if (showSave()) {
        <button mat-icon-button  (click)="onSave()" color="primary" class="m-1 bg-gray-200 md:visible" matTooltip="Save"  aria-label="Save" >
          <span class="e-icons text-bold e-save"></span>
        </button>
      }
      
      @if (showNew()) {
        <button mat-icon-button  (click)="onNew()" color="primary" class="m-1 bg-gray-200 md:visible" matTooltip="Add"  aria-label="Add" >
          <span class="e-icons text-bold e-circle-add"></span>
        </button>
      }
      
      @if (showDelete()) {
        <button mat-icon-button  (click)="onDelete()" color="primary" class="m-1 bg-gray-200 md:visible" matTooltip="Delete"  aria-label="Delete" >          
          <mat-icon [svgIcon]="'feather:trash-2'"></mat-icon>
        </button>
      }


      @if (showClone()) {
        <button mat-icon-button  (click)="onClone()" color="primary" class="m-1 bg-gray-200 md:visible" matTooltip="Clone"  aria-label="Clone" >        
          <span class="e-icons e-copy"></span>
        </button>
      }  

      @if (showTemplate()) {
        <button mat-icon-button  (click)="onTemplate()" color="primary" class="m-1 bg-gray-200 md:visible" matTooltip="Create Template"  aria-label="Create" >        
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
  delete = output<string>();
  save = output<string>();
  template = output<string>();
  onCopy = output<string>();
  inTitle = input<string>("General Ledger Journals");
  prd = input<string>();
  prd_year = input<string>();

  periods = input<ICurrentPeriod[]>();
  showBack = input<boolean>(true);
  showPeriod = input<boolean>(false);
  showExportXL = input<boolean>(true);
  showExportPDF = input<boolean>(false);
  showExportCSV = input<boolean>(false);
  showPrint = input<boolean>(true);
  showSettings = input<boolean>(false);
  showNew = input<boolean>(false);
  showClone = input<boolean>(false);
  showTemplate = input<boolean>(false);
  showDelete = input<boolean>(false);  
  showSave = input<boolean>(false);
  showCalendar = input<boolean>(false);
  showCalendarButton = input<boolean>(false);

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  

  period = output<string>();
  selectedPeriod = output<string>();

  periodStore = inject(PeriodStore);
  periodsDropdown = viewChild<MatSelect>("periodDropdownSelection");

  _currentPeriod: string;
  _currentActivePeriods: ICurrentPeriod[];
  periodDropdownSelect = viewChild<MatSelect>("periodDropdownSelection");

  ngOnInit() {
    var _currentActivePeriods = localStorage.getItem('activePeriod');

    if (_currentActivePeriods) {
      this._currentActivePeriods = JSON.parse(_currentActivePeriods) as ICurrentPeriod[];      
    }

    this._currentPeriod = localStorage.getItem('currentPeriod');
    
    this.loadPeriods();    
        
  }

  setStartDate(type: string, event: MatDatepickerInputEvent<Date>) {    
    if (event.value === null) {
      return;
    }
    console.debug("addEvent", type, event.value.toISOString().slice(0, 10));
  }

  setEndDate(type: string, event: MatDatepickerInputEvent<Date>) {  
    if (event.value === null) {
      return;
    }
    console.debug("addEvent", type, event.value.toISOString().slice(0, 10));
  }

  public openCalendar() {  
    this.range.setValue({
      start: new Date(this.range.value.start),
      end: new Date(this.range.value.end)
    });    
    console.debug("openCalendar", this.range.value);
  }

  public loadPeriods () {
    if (this.periodStore.isActiveLoaded() === false)
      this.periodStore.loadActivePeriods();
     
    if (this.periodStore.isLoaded() === false) {
      this.periodStore.loadPeriods();
    }
    
    if (this.periodStore.currentPeriod() === '') {
      this.periodStore.loadCurrentPeriod();
    }   
  
  }

  public onSelectionChange(event: MatSelectChange) {
    var currentPrd = event.value as string;
    localStorage.setItem('currentPeriod', currentPrd);        
    this.period.emit(currentPrd);
  }

  public onCalendar() {
      
  }

  public onNew() {
    this.new.emit('add');
  }

  public onClone() {
    this.clone.emit('clone');
  }

  public onSave() {
    this.save.emit('save');
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

  public onDelete() {
    this.delete.emit('delete');
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
