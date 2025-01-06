import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';

import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { GridMenubarStandaloneComponent } from '../../grid-components/grid-menubar.component';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { TypeService, TypeStore } from 'app/services/type.service';
import { AggregateService, ColumnMenuService, DialogEditEventArgs, EditService, ExcelExportService, FilterService, GridModule, GroupService, PageService, ResizeService, SaveEventArgs, SortService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { IAccounts } from 'app/models/journals';
import { GLGridComponent } from '../../grid-components/gl-grid.component';

const imports = [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    GridMenubarStandaloneComponent,
    GLGridComponent
];

@Component({
    template: `<mat-drawer-container class="flex-col h-full">
    <mat-drawer class="lg:w-[400px] md:w-full bg-white-100" #drawer [opened]="false" mode="over" [position]="'end'" [disableClose]="false">
        <mat-card>
            <div class="flex flex-col w-full text-gray-700 max-w-140 filter-article filter-interactive">
            <div class="bg-slate-600 text-justify m-2 p-2 text-white h-10 text-2xl border-l-4 border-gray-400"
            mat-dialog-title>
            {{ inTitle }}
        </div>
            <div mat-dialog-content>
                <form [formGroup]="accountsForm">
                    <div class="flex flex-col m-1">
                        <section class="flex flex-col md:flex-row">
                            <div class="flex flex-col grow">
                                <mat-label class="ml-2 text-base">Account Type</mat-label>
                                <mat-form-field class="m-1 form-element grow" appearance="outline">
                                    <input matInput placeholder="Type" formControlName="type" />
                                </mat-form-field>
                            </div>
                        </section>


                        <div class="flex flex-col grow">
                            <mat-label class="ml-2 text-base">Description</mat-label>
                            <mat-form-field class="m-1 form-element" appearance="outline">
                                <input matInput placeholder="Type Description"
                                    formControlName="description" />
                            </mat-form-field>
                        </div>

                    </div>
                </form>
            </div>
            <div mat-dialog-actions>
                <button mat-raised-button color="primary" class="m-1" (click)="onUpdate($event)"
                    matTooltip="Update"
                    aria-label="Button that displays a tooltip when focused or hovered over">
                    Update
                    <mat-icon>update</mat-icon>
                </button>
                <button mat-raised-button color="primary" class="m-1" (click)="onCreate($event)"
                    matTooltip="Add"
                    aria-label="Button that displays a tooltip when focused or hovered over">
                    Add
                    <mat-icon>add</mat-icon>
                </button>
                <button mat-raised-button color="primary" class="m-1" (click)="onDelete($event)"
                    matTooltip="Delete"
                    aria-label="Button that displays a tooltip when focused or hovered over">
                    Delete
                    <mat-icon>delete</mat-icon>
                </button>
                <button mat-raised-button color="primary" class="m-1" (click)="closeDrawer()"
                    matTooltip="Cancel"
                    aria-label="Button that displays a tooltip when focused or hovered over">
                    Cancel
                    <mat-icon>close</mat-icon>
                </button>
            </div>
            </div>
        </mat-card>
    </mat-drawer>
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
                            [data]="store.type()" 
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
    `,
    selector: 'gl-types',
    imports: [imports],
    providers: [TypeStore, SortService, GroupService, ExcelExportService, PageService, ResizeService, FilterService, ToolbarService, EditService, AggregateService, ColumnMenuService,]
})
export class GlTypeComponent implements OnInit {

    private fuseConfirmationService = inject(FuseConfirmationService);
    private fb = inject(FormBuilder);
    private typeApiService = inject(TypeService);

    @ViewChild('drawer') drawer!: MatDrawer;
    typeStore = inject(TypeStore);

    inTitle = 'Financial Statement Mapping';
    accountsForm!: FormGroup;
    store = inject(TypeStore);

    columns = [
        { field: 'type', headerText: 'Type', width: '100', textAlign: 'Left', isPrimaryKey: true },
        { field: 'description', headerText: 'Description', width: '100', textAlign: 'Left' },
        { field: 'create_date', headerText: 'Create Date', width: '100', textAlign: 'Left' },
        { field: 'create_user', headerText: 'Create User', width: '100', textAlign: 'Left' },
        { field: 'update_date', headerText: 'Update Date', width: '100', textAlign: 'Left' },
        { field: 'update_user', headerText: 'Update User', width: '100', textAlign: 'Left' },
    ];

    ngOnInit() {
        this.createEmptyForm();
    }

    onCreate(e: any) {
        this.createEmptyForm();
        this.openDrawer();
    }

    onDelete(e: any) {
        console.debug(`onDelete ${JSON.stringify(e)}`);
        const confirmation = this.fuseConfirmationService.open({
            title: 'Delete Type?',
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
                this.typeApiService.delete(e.type);
            }
        });
        this.closeDrawer();
    }

    createEmptyForm() {
        this.accountsForm = this.fb.group({
            type: [''],
            description: [''],
            create_date: [''],
            create_user: [''],
            update_date: [''],
            update_user: [''],
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

    actionBegin(args: SaveEventArgs): void {
        var data = args.rowData as IAccounts;

        if (args.requestType === 'beginEdit' || args.requestType === 'add') {
            args.cancel = true;
            // this.createForm(data);
            this.openDrawer();

        }
        if (args.requestType === 'save') {
            args.cancel = true;
            console.log(JSON.stringify(args.data));
            var data = args.data as IAccounts;
        }
    }

    actionComplete(args: DialogEditEventArgs): void {
        if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
            if (args.requestType === 'beginEdit') {
                // (args.form.elements.namedItem('CustomerName') as HTMLInputElement).focus();
            } else if (args.requestType === 'add') {
                // (args.form.elements.namedItem('OrderID') as HTMLInputElement).focus();
            }
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
        const account = { ...this.accountsForm.value };
        const rawData = {
            type: account.type,
            description: account.description,
            update_date: updateDate,
            update_user: 'admin_update',
        };

        this.closeDrawer();
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


}
