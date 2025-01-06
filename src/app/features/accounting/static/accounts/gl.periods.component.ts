import { Component, OnInit, ViewChild, inject, viewChild } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { GridMenubarStandaloneComponent } from '../../grid-components/grid-menubar.component';
import { AggregateService, ColumnMenuService, EditService, FilterService, FilterSettingsModel, GridModule, GroupService, PageService, ResizeService, SearchSettingsModel, SelectionSettingsModel, SortService, ToolbarItems, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { PeriodStore } from 'app/services/periods.store';
import { GLGridComponent } from '../../grid-components/gl-grid.component';
import { IPeriod } from 'app/models/period';
import { Store } from '@ngrx/store';
import { periodsPageActions } from 'app/state/periods/actions/periods-page.actions';
import { periodsFeature } from 'app/state/periods/periods.state';
import { toSignal } from '@angular/core/rxjs-interop';

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
    template: `
        <div class="h-[calc(100vh)-100px]">
            <mat-drawer class="lg:w-1/3 sm:w-full bg-white-100" #drawer [opened]="false" mode="over" [position]="'end'" [disableClose]="false">
                    <div class="flex flex-col w-full text-gray-700 max-w-140 filter-article filter-interactive">
                        <div class="h-10 pt-2 text-2xl text-justify text-black bg-slate-100" mat-dialog-title> {{ sTitle }} </div>
                        <div mat-dialog-content>
                            <form [formGroup]="periodsForm">

                            <section class="flex flex-col md:flex-row gap-2 m-2">
                                <div class="flex flex-col m-2">

                                    <div class="flex flex-col grow">
                                        
                                        <mat-form-field class="m-1 form-element grow" appearance="fill">
                                            <mat-label class="ml-2 text-base dark:text-gray-200">Period</mat-label>
                                            <input matInput placeholder="Period" formControlName="period_id" />
                                            <mat-icon class="icon-size-5" matPrefix
                                            [svgIcon]="'heroicons_solid:calendar-days'"></mat-icon>
                                        </mat-form-field>
                                    </div>
                                    

                                </div>
                                <div class="flex flex-col grow m-2">
                                    <mat-form-field class="mt-1 flex-start">
                                       <mat-label class="ml-2 text-base dark:text-gray-200">Period Description</mat-label>
                                        <input #myInput matInput placeholder="Description"
                                            formControlName="description" />
                                        <mat-icon class="icon-size-5" matPrefix
                                            [svgIcon]="'heroicons_solid:document'"></mat-icon>
                                    </mat-form-field>
                                </div>
                                </section>
                                <section class="flex flex-col md:flex-row gap-2 ml-4 mr-4">
                                    <mat-form-field class="grow">
                                        <mat-label class="ml-2 text-base dark:text-gray-200">Period Start and End Dates</mat-label>
                                        <mat-date-range-input [rangePicker]="picker">
                                            <input matStartDate formControlName="startdate" placeholder="Start date">
                                            <input matEndDate formControlName="estimatedate" placeholder="End date">
                                        </mat-date-range-input>
                                        <mat-datepicker-toggle matIconPrefix [for]="picker"></mat-datepicker-toggle>
                                        <mat-date-range-picker #picker></mat-date-range-picker>

                                        @if (periodsForm.controls.start_date.hasError('matStartDateInvalid')) {
                                        <mat-error>Invalid start date</mat-error>
                                        }
                                        @if (periodsForm.controls.end_date.hasError('matEndDateInvalid')) {
                                        <mat-error>Invalid end date</mat-error>
                                        }
                                    </mat-form-field>

                                    
                                </section>
                            </form>
                        </div>
                        <div mat-dialog-actions class="gap-2 mb-3 ml-4">
                        @if (bHeaderDirty === true) {
                        <button
                          mat-icon-button
                          color="primary"
                          class="bg-slate-200 hover:bg-slate-400 ml-1"
                          (click)="onUpdateJournalEntry()"
                          matTooltip="Save"
                          aria-label="hovered over"
                        >
                          <span class="e-icons e-save"></span>
                        </button>
                        }
            
                        <button
                          mat-icon-button
                          color="primary"
                          class="bg-slate-200 hover:bg-slate-400 ml-1"
                          (click)="onNew($event)"
                          matTooltip="New"
                          aria-label="hovered over"
                        >
                          <span class="e-icons e-circle-add"></span>
                        </button>
            
                        <button
                          mat-icon-button
                          color="primary"
                          class="bg-slate-200 hover:bg-slate-400 ml-1"
                          (click)="onClone($event)"
                          matTooltip="Clone"
                          aria-label="hovered over"
                        >
                          <span class="e-icons e-copy"></span>
                        </button>
            
                        <button
                          mat-icon-button
                          color="primary"
                          class="bg-slate-200 text-gray-100 hover:bg-slate-400 ml-1"
                          (click)="onDelete($event)"
                          matTooltip="Cancel Transaction"
                          aria-label="hovered over"
                        >
                          <mat-icon [svgIcon]="'feather:trash-2'"></mat-icon>
                        </button>
            
                        <button
                          mat-icon-button
                          color="primary"
                          class="bg-gray-200 hover:bg-slate-400 ml-1"
                          (click)="onAddEvidence()"
                          matTooltip="Evidence"
                          aria-label="Evidence"
                        >
                          <span class="e-icons e-text-alternative"></span>
                        </button>
            
                        <button
                          mat-icon-button
                          color="primary"
                          class="bg-gray-200 hover:bg-slate-400 ml-1"
                          (click)="onCreateTemplate()"
                          matTooltip="Template"
                          aria-label="Template"
                        >
                          <span class="e-icons e-table-overwrite-cells"></span>
                        </button>
            
                        <button
                          mat-icon-button
                          color="primary"
                          class="bg-slate-200  hover:bg-slate-400 ml-1"
                          (click)="onClose()"
                          matTooltip="Lock Transaction"
                          aria-label="complete"
                        >
                          <span class="e-icons e-check-box"></span>
                        </button>
                      </div>
                    </div>
            </mat-drawer>
            <mat-drawer-container class="flex-col">
                
                 <ng-container>
                    <grid-menubar 
                    (notifyParentRefresh)="onRefresh()" 
                    (notifyParentAdd)="onAdd()"
                    (notifyParentDelete)="onDeleteSelection()">
                     </grid-menubar>                         
                     
                     @if ((isLoading$ | async) === false) 
                    {
                        @if(periods$ | async; as periods) {                          
                        <gl-grid                             
                            (onUpdateSelection)="onSelection($event)"
                            [data]="periods" 
                            [columns]="columns">
                        </gl-grid>                        
                    }
                       @else
                    {
                        <div class="fixed z-[1050] -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4">
                            <mat-spinner></mat-spinner>
                        </div>
                    }
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
    public sTitle = 'General Ledger Periods';
    public drawer = viewChild<MatDrawer>("drawer");
    periodsForm!: FormGroup;
    bHeaderDirty: any;
    
    Store = inject(Store);
    periods$= this.Store.select(periodsFeature.selectPeriods);    
    selectedPeriods$ = this.Store.select(periodsFeature.selectSelectedPeriod);    
    isLoading$ = this.Store.select(periodsFeature.selectIsLoading);

    selectPeriod(period: any) {
        var pd = {
            ...period,
            //start_date: new Date(period.start_date),
            //end_date: new Date(period.end_date),
            id: period.period_id
        }
        this.Store.dispatch(periodsPageActions.select(pd));    
    }

    ngOnInit() {
        this.createEmptyForm();        
        this.Store.dispatch(periodsPageActions.load());     
    }

    onClose() {
        this.closeDrawer();
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

    onCreate(e: any) {
        this.createEmptyForm();
        this.openDrawer();
    }

    onSelection(period: IPeriod) {
        this.periodsForm.patchValue(period);        
        this.openDrawer();
        this.selectPeriod(period);
        this.selectedPeriods$.subscribe((period) => {
            
        });
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

    
    onNew($event: any) {
        throw new Error('Method not implemented.');
    }
    onClone($event: any) {
        throw new Error('Method not implemented.');
    }
    onAddEvidence() {
        throw new Error('Method not implemented.');
    }
    onCloseTransaction() {
        throw new Error('Method not implemented.');
    }
    onCreateTemplate() {
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
