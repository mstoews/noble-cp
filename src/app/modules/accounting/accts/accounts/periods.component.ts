import { Component, OnInit, ViewChild, inject, viewChild } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { IPeriod, PeriodsService } from 'app/services/periods.service';
import { CommonModule } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { GridMenubarStandaloneComponent } from '../../grid-menubar/grid-menubar.component';
import { AggregateService, ColumnMenuService, EditService, FilterService, FilterSettingsModel, GridModule, GroupService, PageService, ResizeService, SearchSettingsModel, SelectionSettingsModel, SortService, ToolbarItems, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { PeriodStore } from 'app/services/periods.store';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { GLGridComponent } from '../../grid-menubar/gl-grid.component';

const imports = [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    GridMenubarStandaloneComponent,
    GLGridComponent

];

@Component({
    selector: 'periods',
    imports: [imports],
    template: 
    `
        <div class="h-[calc(100vh)-100px]">
            <mat-drawer class="lg:w-1/3 sm:w-full bg-white-100" #drawer [opened]="false" mode="over" [position]="'end'" [disableClose]="false">
                    <div class="flex flex-col w-full text-gray-700 max-w-140 filter-article filter-interactive">
                        <div class="h-10 pt-2 text-2xl text-justify text-black bg-slate-100" mat-dialog-title> {{ sTitle }} </div>
                        <div mat-dialog-content>
                            <form [formGroup]="periodsForm">

                                <div class="flex flex-col m-1">

                                    <div class="flex flex-col grow">
                                        <mat-label class="ml-2 text-base dark:text-gray-200">Fund</mat-label>
                                        <mat-form-field class="m-1 form-element grow" appearance="outline">
                                            <input matInput placeholder="Fund" formControlName="period_id" />
                                        </mat-form-field>
                                    </div>

                                    <div class="flex flex-col grow">
                                        <mat-label class="ml-2 text-base dark:text-gray-200">Description</mat-label>
                                        <mat-form-field class="m-1 form-element" appearance="outline">
                                            <input matInput placeholder="Fund Description"
                                                formControlName="description" />
                                        </mat-form-field>
                                    </div>

                                </div>
                            </form>
                        </div>
                        <div mat-dialog-actions>
                            <button mat-raised-button color="primary" class="m-1" (click)="onUpdate($event)"
                                matTooltip="Save"
                                aria-label="Button that displays a tooltip when focused or hovered over">
                                Update
                                <mat-icon>update</mat-icon>
                            </button>
                            <button mat-raised-button color="primary" class="m-1" (click)="onCreate($event)"
                                matTooltip="Save"
                                aria-label="Button that displays a tooltip when focused or hovered over">
                                Add
                                <mat-icon>add</mat-icon>
                            </button>
                            <button mat-raised-button color="primary" class="m-1" (click)="onDelete($event)"
                                matTooltip="Save"
                                aria-label="Button that displays a tooltip when focused or hovered over">
                                Delete
                                <mat-icon>delete</mat-icon>
                            </button>
                            <button mat-raised-button color="primary" class="m-1" (click)="closeDrawer()"
                                matTooltip="Save"
                                aria-label="Button that displays a tooltip when focused or hovered over">
                                Cancel
                                <mat-icon>close</mat-icon>
                            </button>
                        </div>
                    </div>
            </mat-drawer>
            <mat-drawer-container class="flex-col">
                
                 <ng-container>
                    <grid-menubar 
                    (notifyParentRefresh)="onRefresh()" 
                    (notifyParentAdd)="onAdd()"
                    (notifyParentDelete)="onDeleteSelection()" 
                    (notifyParentUpdate)="onUpdateSelection()">
                     </grid-menubar>                         
                     
                     @if (store.isLoading() === false) 
                    {                            
                        <gl-grid 
                            (openTradeId)="selectedRow($event)"
                            [data]="store.periods()" 
                            [columns]="columns">
                        </gl-grid>                        
                    }
                       @else
                    {
                        <div class="fixed z-[1050] -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4">
                            <mat-spinner></mat-spinner>
                        </div>
                    }
            
                </ng-container> 
            </mat-drawer-container>
        </div>
    `,
    providers: [PeriodStore, SortService, GroupService, PageService, ResizeService, FilterService, ToolbarService, EditService, AggregateService, ColumnMenuService,]
})
export class PeriodsComponent implements OnInit {
    
    public data: any;
    private _fuseConfirmationService = inject(FuseConfirmationService);
    private fb = inject(FormBuilder);
    
    public drawer = viewChild<MatDrawer>("drawer");
        
    periodsForm!: FormGroup;

    public sTitle = 'General Ledger Periods';

    store = inject(PeriodStore);

    ngOnInit() {
        this.createEmptyForm();    
        const period = this.store.periods()
        period.forEach((period: IPeriod) => {
            console.log(`Period: ${period.period_id} ${period.period_year}`);
        });
    }

    columns = [
        { field: 'period_id', headerText: 'Period ID', width: 100, textAlign: 'Right', isPrimaryKey: true },
        { field: 'period_year', headerText: 'Period Year', width: 100, textAlign: 'Right' },
        { field: 'start_date', headerText: 'Start Date', width: 100, textAlign: 'Right' },
        { field: 'end_date', headerText: 'End Date', width: 100, textAlign: 'Right' },
        { field: 'description', headerText: 'Description', width: 100, textAlign: 'Right' },
        { field: 'create_date', headerText: 'Create Date', width: 100, textAlign: 'Right' },
        { field: 'create_user', headerText: 'Create User', width: 100, textAlign: 'Right' },
        { field: 'update_date', headerText: 'Update Date', width: 100, textAlign: 'Right' },
        { field: 'update_user', headerText: 'Update User', width: 100, textAlign: 'Right' },
    ];
    
    selectedRow($event) {
        
    }

    onCreate(e: any) {
        this.createEmptyForm();
        this.openDrawer();
    }

    public selectingEvent(e: any): void {
        console.debug('the row was selected ... ', e);
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


    onDelete(e: any) {
        console.debug(`onDelete ${JSON.stringify(e)}`);
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete period?',
            message: 'Are you sure you want to delete this type? ',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                // Delete the list
                // this.typeApiService.delete(this.typeId);
            }
        });
        this.closeDrawer();
    }

    createEmptyForm() {
        this.periodsForm = this.fb.group({
            period_id: [''],
            period_year: [''],
            start_date: [''],
            end_date: [''],
            description: [''],
            create_date: [''],
            create_user: [''],
            update_date: [''],
            update_user: [''],
        });
    }

    openDrawer() {
        const opened = this.drawer().opened;
        if (opened !== true) {
            this.drawer().toggle();
        } else {
            return;
        }
    }

    closeDrawer() {
        const opened = this.drawer().opened;
        if (opened === true) {
            this.drawer().toggle();
        } else {
            return;
        }
    }

    onUpdate(e: any) {
        const dDate = new Date();
        const updateDate = dDate.toISOString().split('T')[0];
        const periods = { ...this.periodsForm.value } as IPeriod;
        const rawData = {
            period_id: e.data.periods,
            period_year: [''],
            start_date: [''],
            end_date: [''],
            description: [''],
            create_date: [''],
            create_user: [''],
            update_date: [''],
            update_user: [''],
        };

        this.closeDrawer();
    }

    

    
}
