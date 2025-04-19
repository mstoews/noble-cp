import { CommonModule   } from "@angular/common";
import {
  Component,
  ChangeDetectionStrategy,
  output,
  input,
  inject,
  OnInit,
  AfterViewInit
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ToastrService } from "ngx-toastr";
import { IPeriod, IPeriodParam } from "app/models/period";
import { Store } from '@ngrx/store';
import { periodsFeature } from 'app/features/accounting/static/periods/periods.state';
import { periodsPageActions } from 'app/features/accounting/static/periods/periods-page.actions';
import { FormControl, FormGroup } from "@angular/forms";
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { map } from "rxjs";
import { SettingsService } from "app/services/settings.service";

let modules = [MatToolbarModule, MatIconModule, MatButtonModule, CommonModule,  MatTooltipModule, MatSelectModule, MatMenuModule ];

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
    <mat-toolbar class="text-white font-sans bg-gray-500 text-2xl rounded-lg">  {{ inTitle() }} 
      
      @if ((isLoading$ | async) === false)  {
        @if(periods$ | async; as periods) {   
          <!-- <button mat-icon-button [matMenuTriggerFor]="menu" color="primary"  class="m-1 bg-gray-200 md:visible" matTooltip="Periods"  >
          <span class="e-icons text-bold e-timeline-agenda"></span>
          </button> -->
          <!-- <mat-menu #menu="matMenu">
            @for ( period of periods; track period) {
              <button mat-menu-item (selectionChange)="onSelectionChange($event)" [value]="period.description">{{ period.description }}</button>
            }        
          </mat-menu>       -->
          <mat-select class="w-40 text-2xl ml-10" (selectionChange)="onSelectionChange($event)">
          @for ( period of periods; track period) {
             <mat-option [value]="period.description">
                {{ period.description }}
             </mat-option>
          }
          </mat-select>
        }                    
      }  

      <span class="flex-1"></span>

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
  `
})


export class GridMenubarStandaloneComponent implements OnInit, AfterViewInit  {

  private toast = inject(ToastrService);  
  private settingsService = inject(SettingsService);

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
  public periods = input<IPeriod[]>();

  menuForm = new FormGroup({    
    subtype: new FormControl('')    
  });

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

  store = inject(Store);
  periods$ = this.store.select(periodsFeature.selectPeriods).pipe(
    map((periods) => periods.filter((period) => period.status === 'OPEN')),    
    map((periods) => periods.slice(0, 12)) // Limit to 12 items
  );

  selectedPeriods$ = this.store.select(periodsFeature.selectSelectedPeriod);
  isLoading$ = this.store.select(periodsFeature.selectIsLoading);

  currentPeriod = 'January 2025';

  ngOnInit() {    
      this.store.dispatch(periodsPageActions.load()); 
  }

  ngAfterViewInit() {
    this.periods$.subscribe((periods) => {
      if (periods.length > 0) {
         this.currentPeriod = periods[0].description; 
      }
    });
  }
  public onSelectionChange(event:  MatSelectChange) {            
    this.toast.success('Period Updated : ' + event.value, 'Success' );
    this.period.emit('changed period ' + event.value);
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
