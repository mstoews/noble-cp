import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { MaterialModule } from 'app/services/material.module';

var modules = [
  MaterialModule
]

@Component({
  standalone: true,
  selector: 'reporting-toolbar',
  template: 
  `
  <mat-toolbar class="text-white font-sans bg-gray-500 mb-1 text-2xl">  {{inTitle}} <span class="flex-1"></span>

      <button (click)="onClickExcel()" color="primary" class="m-1 bg-gray-200 text-gray-100" mat-icon-button matTooltip="Export Excel" aria-label="Add">
        <mat-icon class="flex justify-end text-white" [svgIcon]="'mat_outline:note_add'"></mat-icon>
      </button>

      <button (click)="onClickCSV()" color="primary" class="m-1 bg-gray-200 text-gray-100" mat-icon-button matTooltip="Export CSV" aria-label="Update">
        <mat-icon class="flex justify-end text-white" [svgIcon]="'mat_outline:update'"></mat-icon>
      </button>

      <button (click)="onClickRefresh()" color="primary" class="m-1 bg-gray-200 text-gray-100" mat-icon-button matTooltip="Refresh" aria-label="Add">
        <mat-icon class="flex justify-end text-white" [svgIcon]="'mat_outline:refresh'"></mat-icon>
      </button>

  </mat-toolbar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [modules]
})
export class ReportingToolbarComponent  {
  
  @Output() notifyParentRefresh: EventEmitter<any> = new EventEmitter();
  @Output() notifyExcel: EventEmitter<any> = new EventEmitter();
  @Output() notifyCSV: EventEmitter<any> = new EventEmitter();
  
  @Input() public inTitle: string;


  constructor() {
    this.inTitle = 'Reporting';
  }

  onClickRefresh(): void { this.notifyParentRefresh.emit(); }

  onClickExcel(): void {  this.notifyExcel.emit();  }

  onClickCSV(): void {   this.notifyCSV.emit(); }

}
