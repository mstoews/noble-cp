import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild, inject, viewChild } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/shared/material.module';
import { GridMenubarStandaloneComponent } from '../../grid-components/grid-menubar.component';
import { AggregateService, ColumnMenuService, EditService, FilterService, FilterSettingsModel, GridComponent, GridModule, GroupService, PageService, PdfExportService, ResizeService, SearchSettingsModel, SelectionSettingsModel, SortService, ToolbarItems, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { GLGridComponent } from '../../grid-components/gl-grid.component';
import { IPeriod } from 'app/models/period';
import { Store } from '@ngrx/store';
import { periodsPageActions } from 'app/state/periods/periods-page.actions';
import { periodsFeature } from 'app/state/periods/periods.state';
import { PeriodStore } from 'app/store/periods.store';
import { PrintService } from '@syncfusion/ej2-angular-schedule';


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
                 <mat-card class="m-2">   
                    <div class="flex flex-col w-full text-gray-700 max-w-140 filter-article filter-interactive">
                        <div class="h-10 pt-2 text-2xl text-justify text-black bg-slate-100" mat-dialog-title> {{ sTitle }} </div>
                        <div mat-dialog-content>
                            <form [formGroup]="periodsForm">

                            <section class="flex flex-col md:flex-row gap-2 m-2">
                                <div class="flex flex-col m-2">

                                    <div class="flex flex-col grow">
                                        
                                        <mat-form-field class="m-1 form-element grow" appearance="fill">
                                            <mat-label class="ml-2 text-base dark:text-gray-200">Period</mat-label>
                                            <input matInput placeholder="Period" formControlName="period" />
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
                                            <input matStartDate formControlName="start_date" placeholder="Start date">
                                            <input matEndDate formControlName="end_date" placeholder="End date">
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
                        <div mat-dialog-actions class="gap-2 mb-3">
                  @if (bDirty === true) {
                    <button mat-icon-button color="primary" class="bg-slate-200 hover:bg-slate-400 ml-1" (click)="onUpdate($event)"
                      matTooltip="Save" aria-label="hovered over">
                      <span class="e-icons e-save"></span>
                    </button>
                    }

                    <button mat-icon-button color="primary" 
                            class=" hover:bg-slate-400 ml-1" (click)="onAdd()" matTooltip="New" aria-label="hovered over">                        
                        <span class="e-icons e-circle-add"></span>
                    </button>

                    <button mat-icon-button color="primary" 
                            class=" hover:bg-slate-400 ml-1" (click)="onDelete($event)" matTooltip="Delete" aria-label="hovered over">                        
                        <span class="e-icons e-trash"></span>
                    </button>

                    <button mat-icon-button color="primary"
                            class=" hover:bg-slate-400 ml-1"  (click)="onCancel()" matTooltip="Close"
                            aria-label="hovered over">
                            <span class="e-icons e-circle-close"></span>
                    </button>                    
                  </div>
                    </div>
                  </mat-card>    
            </mat-drawer>
            <mat-drawer-container class="flex-col">            
                <grid-menubar [showPeriod]="false"  [inTitle]="sTitle" (onCreate)="onCreate($event)"> </grid-menubar>                         
                 <ng-container>                                         
                        @if (periodStore.isLoading()  === false) {
                            <gl-grid                                                         
                                (onUpdateSelection)="onSelection($event)"
                                [data]="periodStore.periods()"
                                [columns]="columns">
                            </gl-grid>                        
                        }
                        @else {
                            <div class="fixed z-[1050] -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4">
                                <mat-spinner></mat-spinner>
                            </div>
                        }            
                 </ng-container>             
            </mat-drawer-container>
        </div>
    `,
    providers: [SortService, PdfExportService, GroupService, PageService, PrintService, ResizeService, FilterService, ToolbarService, EditService, AggregateService, ColumnMenuService,]
})
export class PeriodsComponent implements OnInit {

    public periodsForm!: FormGroup;
    public bDirty: boolean = false;
    public sTitle = 'General Ledger Periods';
    public drawer = viewChild<MatDrawer>("drawer");
    public grid = viewChild<GridComponent>('grid');
    public periodStore = inject(PeriodStore);
    private fuseConfirmationService = inject(FuseConfirmationService);
    private fb = inject(FormBuilder);

    ngOnInit() {
        this.loadPeriods();
        this.createEmptyForm();
        this.onChanges();
    }

    public loadPeriods() {
        if (this.periodStore.isActiveLoaded() === false)
            this.periodStore.loadActivePeriods();


        if (this.periodStore.isLoaded() === false) {
            this.periodStore.loadPeriods();
        }

        if (this.periodStore.currentPeriod() === '') {
            this.periodStore.loadCurrentPeriod();
        }
    }




    selectPeriod(period: any) {
        var pd = {
            ...period,
            id: period.period_id
        }
        this.periodStore.selected = pd;
    }

    onClose() {
        this.closeDrawer();
    }

    onChanges() {
        this.periodsForm.valueChanges.subscribe((value) => {
            this.bDirty = true;
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

    onCreate(e: any) {
        this.createEmptyForm();
        this.openDrawer();
    }

    onSelection(period: IPeriod) {
        this.periodsForm.patchValue(period);
        this.openDrawer();
        this.selectPeriod(period);
    }

    onCancel() {
        this.closeDrawer();
    }

    onAdd() {
        const dDate = new Date();
        const createDate = dDate.toISOString().split('T')[0];
        const periods = { ...this.periodsForm.value } as IPeriod;
        const rawData = {
            id: periods.id,
            period_id: periods.period_id,
            period_year: periods.period_year,
            start_date: periods.start_date,
            end_date: periods.end_date,
            description: periods.description,
            create_date: periods.create_date,
            create_user: periods.create_user,
            update_date: createDate,
            update_user: '@admin',
            status: periods.status
        };
        this.periodStore.updatePeriod(rawData)
    }


    onDelete(e: any) {
        console.debug(`onDelete ${JSON.stringify(e)}`);
        const confirmation = this.fuseConfirmationService.open({
            title: 'Delete period?',
            message: 'Are you sure you want to delete this type? ',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.periodStore.removePeriod(e.id)
            }
        });
        this.closeDrawer();
    }

    createEmptyForm() {
        this.periodsForm = this.fb.group({
            id: ['', Validators.required],
            period: ['', Validators.required],
            period_year: ['', Validators.required],
            start_date: ['', Validators.required],
            end_date: ['', Validators.required],
            description: ['', Validators.required],
            create_date: ['', Validators.required],
            create_user: ['', Validators.required],
            update_date: ['', Validators.required],
            update_user: ['', Validators.required],
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
            id: periods.id,
            period_id: periods.period_id,
            period_year: periods.period_year,
            start_date: periods.start_date,
            end_date: periods.end_date,
            description: periods.description,
            create_date: periods.create_date,
            create_user: periods.create_user,
            update_date: updateDate,
            update_user: '@admin',
            status: periods.status
        };
        this.periodStore.updatePeriod(rawData);
        this.closeDrawer();
    }
    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.adjustHeight();
    }

    ngAfterViewInit() {
        this.adjustHeight();
    }

    adjustHeight() {
        if (this.grid()) {
            this.grid().height = (window.innerHeight - 450) + 'px'; // Adjust as needed
        }
    }

}
