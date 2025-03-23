import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';

import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/shared/material.module';
import { GridMenubarStandaloneComponent } from 'app/features/accounting/grid-components/grid-menubar.component';
import { Subject } from 'rxjs';

import { KanbanService } from '../kanban.service';
import { EditService, ToolbarService, PageService, SortService, FilterService, NewRowPosition, GridModule, DialogEditEventArgs, SaveEventArgs, Resize, AggregateService, ColumnMenuService, ResizeService } from '@syncfusion/ej2-angular-grids';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { Browser } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { IPriority } from 'app/models/kanban';

const imports = [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    GridModule,
    GridMenubarStandaloneComponent
];

@Component({
    selector: 'kanban-priority',
    imports: [imports],
    template: `
    <mat-drawer-container class="flex-col h-full">
    <mat-drawer class="lg:w-[400px] md:w-full bg-white-100" #drawer [opened]="false" mode="over" [position]="'end'"
        [disableClose]="false">
        <mat-card>
            <div class="flex flex-col w-full text-gray-700 max-w-140 filter-article filter-interactive">
                <div class="bg-slate-600 text-justify m-2 p-2 text-white h-10 text-2xl border-l-4 border-gray-400"
                    mat-dialog-title>
                    {{ sTitle }}
                </div>
                <div mat-dialog-content>
                    <form [formGroup]="priorityForm">

                        <div class="flex flex-col m-1">
                            <section class="flex flex-col md:flex-row">
                                <div class="flex flex-col grow">
                                    <mat-label class="ml-2 text-base">Priority</mat-label>
                                    <mat-form-field class="m-1 form-element grow" appearance="outline">
                                        <input matInput placeholder="Priority" formControlName="priority" />
                                    </mat-form-field>
                                </div>

                                <div class="flex flex-col grow">
                                    <mat-label class="ml-2 text-base">Description</mat-label>
                                    <mat-form-field class="m-1 form-element" appearance="outline">
                                        <input matInput placeholder="Description" formControlName="description" />
                                    </mat-form-field>
                                </div>
                            </section>
                        </div>
                    </form>
                </div>
                <div mat-dialog-actions>
                    <button mat-icon-button color="primary" class="m-1" (click)="onUpdate($event)" matTooltip="Update"
                        aria-label="Button that displays a tooltip when focused or hovered over">
                        <mat-icon>update</mat-icon>
                    </button>
                    <button mat-raised-button color="primary" class="m-1" (click)="onCreate($event)" matTooltip="Add"
                        aria-label="Button that displays a tooltip when focused or hovered over">
                        Add
                        <mat-icon>add</mat-icon>
                    </button>
                    <button mat-raised-button color="primary" class="m-1" (click)="onDelete($event)" matTooltip="Delete"
                        aria-label="Button that displays a tooltip when focused or hovered over">
                        Delete
                        <mat-icon>delete</mat-icon>
                    </button>
                    <button mat-raised-button color="primary" class="m-1" (click)="closeDrawer()" matTooltip="Cancel"
                        aria-label="Button that displays a tooltip when focused or hovered over">
                        Cancel
                        <mat-icon>close</mat-icon>
                    </button>
                </div>
            </div>
        </mat-card>
    </mat-drawer>
    <ng-container>
        <grid-menubar [inTitle]="'Kanban Priority Maintenance'"></grid-menubar>
        @if (kanbanService.isLoading() == false ) {
        <div class="flex flex-col h-[600px]">
            <!-- 
            <dx-data-grid id="id" [wordWrapEnabled]="true" [columnHidingEnabled]="true" [columnHidingEnabled]="true"
                [dataSource]="kanbanService.priorityList()" [showColumnLines]="true" [showRowLines]="true"
                [showBorders]="true" [focusedRowEnabled]="true" [focusedRowIndex]="0" keyExpr="priority"
                [repaintChangesOnly]="true">
                <dxi-column dataField="priority" caption="Kanban Type" width="150"></dxi-column>
                <dxi-column dataField="description"></dxi-column>
            </dx-data-grid>  
            -->

            <ejs-grid #normalgrid id='Normalgrid' [dataSource]='kanbanService.priorityList()' allowPaging='true' [rowHeight]='30'
                [allowSorting]='true' [allowFiltering]='true' [filterSettings]='filterSettings'
                [editSettings]='editSettings' [toolbar]='toolbar' [sortSettings]='initialSort'
                (actionBegin)='actionBegin($event)' (actionComplete)='actionComplete($event)'
                [pageSettings]='pageSettings'>
                <e-columns>
                    <e-column field='priority' headerText="Priority" width='140' isPrimaryKey='true'></e-column>
                    <e-column field='description' headerText="Description"></e-column>
                </e-columns>
            </ejs-grid>
        </div>
        } @else
        {
        <div class="flex flex-col items-center justify-center h-screen mat-spinner-color w-full bg-white">
            <mat-spinner class="text-gray-100 bg-white" [diameter]="80"></mat-spinner>
            <p class="text-gray-100 text-2xl">Loading...</p>
        </div>
        }
    </ng-container>
    </mat-drawer-container>
    `,
    providers: [SortService, PageService, FilterService, ToolbarService, EditService, ResizeService, AggregateService, ColumnMenuService],
    styles: `
        .e-grid .e-headercell {
        background-color: #333232; 
        color: #fff;
        }
    `
})
export class KanbanPriorityComponent implements OnInit {

    fuseConfirmationService = inject(FuseConfirmationService);
    fb = inject(FormBuilder);
    kanbanService = inject(KanbanService)

    @ViewChild('drawer') drawer!: MatDrawer;

    public sTitle = 'Priority';
    public priorityForm!: FormGroup;

    public selectedItemKeys: string[] = [];
    public dropDown: DropDownListComponent;
    public submitClicked: boolean = false;
    public PriorityForm: FormGroup;


    // datagrid settings start
    public pageSettings: Object;
    public formatoptions: Object;
    public initialSort: Object;
    public filterSettings: Object;
    public editSettings: Object;

    initialDatagrid() {
        this.pageSettings = { pageCount: 10 };
        this.formatoptions = { type: 'dateTime', format: 'M/d/y hh:mm a' }
        this.filterSettings = { type: 'Excel' };
        this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true };
    }


    actionBegin(args: SaveEventArgs): void {
        if (args.requestType === 'beginEdit' || args.requestType === 'add') {
            this.submitClicked = false;
            var priority: IPriority = {
                priority: '',
                description: '',
                updatedte: '',
                updateusr: ''
            }
            this.PriorityForm = this.createFormGroup(priority);
        }
        if (args.requestType === 'save') {
            console.log(JSON.stringify(args.data));
            var data = args.data as IPriority;
            this.kanbanService.updateTaskPriority(data)
            this.submitClicked = true;
            if (this.PriorityForm.valid) {
                args.data = this.PriorityForm.value;
            } else {
                args.cancel = true;
            }
        }
    }

    actionComplete(args: DialogEditEventArgs): void {
        if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
            if (Browser.isDevice) {
                args.dialog.height = window.innerHeight - 90 + 'px';
                (<Dialog>args.dialog).dataBind();
            }
            // Set initial Focus
            if (args.requestType === 'beginEdit') {
                // (args.form.elements.namedItem('CustomerName') as HTMLInputElement).focus();
            } else if (args.requestType === 'add') {
                // (args.form.elements.namedItem('OrderID') as HTMLInputElement).focus();
            }
        }
    }

    dateValidator() {
        return (control: FormControl): null | Object => {
            return control.value && control.value.getFullYear &&
                (1900 <= control.value.getFullYear() && control.value.getFullYear() <= 2099) ? null : { OrderDate: { value: control.value } };
        }
    }

    // datagrid settings end 

    ngOnInit() {
        var priority: IPriority = {
            priority: '',
            description: '',
            updatedte: '',
            updateusr: ''
        }
        this.createEmptyForm(priority);
        // this.kanbanService.readPriority();
        this.initialDatagrid();
    }


    createFormGroup(data: IPriority): FormGroup {
        return new FormGroup({
            Priority: new FormControl(data.priority, Validators.required),
            Description: new FormControl(data.description, this.dateValidator()),
        });
    }

    onCreate(e: any) {
        var priority: IPriority = {
            priority: '',
            description: '',
            updatedte: '',
            updateusr: ''
        }
        this.createEmptyForm(priority);
        this.openDrawer();
    }

    deleteRecords() {
        this.selectedItemKeys.forEach((key) => {

        });
        this.kanbanService.readTypes();
    }

    onDelete(e: any) {
        console.debug(`onDelete ${JSON.stringify(e)}`);
        const confirmation = this.fuseConfirmationService.open({
            title: 'Delete Period?',
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

    createEmptyForm(priority: IPriority) {
        this.priorityForm = this.fb.group({
            priority: [''],
            description: [''],
        });
    }


    openDrawer() {
        const opened = this.drawer.opened;
        if (opened !== true) {
            this.drawer.toggle();
        } else {
            return;
        }
    }

    closeDrawer() {
        const opened = this.drawer.opened;
        if (opened === true) {
            this.drawer.toggle();
        } else {
            return;
        }
    }

    onUpdate(e: any) {
        const dDate = new Date();
        const updateDate = dDate.toISOString().split('T')[0];
        const priority = { ...this.priorityForm.value } as IPriority;
        const rawData = {
            Priority: priority.priority,
            Description: priority.description
        };

        // this.kanbanService.updatePriority(rawData)

        this.closeDrawer();
    }

}
