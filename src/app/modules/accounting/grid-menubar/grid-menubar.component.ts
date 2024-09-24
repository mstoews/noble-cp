import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { MaterialModule } from 'app/services/material.module';

var modules = [
  MaterialModule,
  CommonModule
]

@Component({
  standalone: true,
  selector: 'grid-menubar',
  styles: [`
      ::ng-deep.mat-menu-panel {
          max-width: none !important;
        }
    `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports:[modules],
  template: ` 
            <mat-toolbar class="text-white font-sans bg-gray-500 text-2xlz rounded-lg">
              {{inTitle}}
              <!-- menu selected -->
              <span class="flex-1"></span>
              
                  
                  <button (click)="onClickRefresh()" color="primary" class="m-1 bg-gray-200 text-gray-100 md:visible" mat-icon-button matTooltip="Back" aria-label="Add">
                      <mat-icon class="flex justify-end text-white" [svgIcon]="'feather:arrow-left'"></mat-icon>
                  </button>
                  

                  <!-- <button (click)="onClickUpdate()" color="primary" class="m-1 bg-gray-200 text-gray-100  md:visible" mat-icon-button matTooltip="Update" aria-label="Update">
                      <mat-icon class="flex justify-end text-white" [svgIcon]="'mat_outline:update'"></mat-icon>
                  </button>

                  <button (click)="onClickRefresh()" color="primary" class="m-1 bg-gray-200 text-gray-100 md:visible" mat-icon-button matTooltip="Refresh" aria-label="Add">
                      <mat-icon class="flex justify-end text-white" [svgIcon]="'mat_outline:refresh'"></mat-icon>
                  </button>

                    <button (click)="onClickDelete()" color="primary" class="m-1 bg-gray-200 text-gray-100 md:visible" mat-icon-button matTooltip="Delete" aria-label="Delete">
                      <mat-icon class="flex justify-end text-white hover:bg-white hover:text-gray-700" [svgIcon]="'heroicons_outline:trash'"></mat-icon>
                    </button> -->
              </mat-toolbar>
  `,
})
export class GridMenubarStandaloneComponent  {
  @Output() notifyParentAdd: EventEmitter<any> = new EventEmitter();
  @Output() notifyParentRefresh: EventEmitter<any> = new EventEmitter();
  @Output() notifyParentDelete: EventEmitter<any> = new EventEmitter();
  @Output() notifyParentClone: EventEmitter<any> = new EventEmitter();
  @Output() notifyMenuItemChanged: EventEmitter<any> = new EventEmitter();

  @Input() public inTitle: string;
  
  constructor() {
    this.inTitle = 'Grid Menu Bar';
    console.debug('Grid Menubar: ',this.inTitle);
  }

    onClickUpdate(): void {    
      this.notifyParentRefresh.emit();
    }

    onClickAdd(): void {
      this.notifyParentAdd.emit();
    }

    onClickDelete(): void {
      this.notifyParentDelete.emit();
    }

    onClickClone(): void {
      this.notifyParentClone.emit();
    }

    onClickRefresh(): void {
      this.notifyParentRefresh.emit();
    }
}
