import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Component, OnInit, ViewChild, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { IRole, RoleService } from 'app/services/roles.service';
import { RolesStore } from 'app/services/roles.store';
import { GridMenubarStandaloneComponent } from 'app/features/accounting/grid-components/grid-menubar.component';
import { GLGridComponent } from 'app/features/accounting/grid-components/gl-grid.component';


const imports = [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    GridMenubarStandaloneComponent,
    GLGridComponent
];

@Component({
    template: `
    <div class="h-[calc(100vh)-100px] ">
    <mat-drawer class="w-[450px]" #drawer [opened]="false" mode="over" [position]="'end'" [disableClose]="false">
        <mat-card class="m-2">
            <div class="flex flex-col w-full filter-article filter-interactive text-gray-700">
                <div class="bg-slate-600 text-justify m-2 p-2 text-white h-10 text-2xl border-l-4 border-gray-400"
                    mat-dialog-title>
                    {{ sTitle }}
                </div>
            </div>

            <form [formGroup]="accountsForm" class="form">
                <div class="div flex flex-col grow">
                    <section class="flex flex-col md:flex-row m-1">
                        <div class="flex flex-col grow">
                            <mat-form-field class="m-1 flex-start">
                                <input #myInput matInput placeholder="Account" formControlName="role" />
                                <mat-icon class="icon-size-5 text-teal-800" matPrefix
                                    [svgIcon]="'heroicons_outline:document'"></mat-icon>
                            </mat-form-field>
                        </div>

                    </section>

                    <div class="flex flex-col grow">
                        <mat-form-field class="m-1 flex-start">
                            <input #myInput matInput placeholder="Description" formControlName="description" />
                            <mat-icon class="icon-size-5 text-teal-800" matPrefix
                                [svgIcon]="'heroicons_outline:document-text'"></mat-icon>
                        </mat-form-field>
                    </div>

                </div>
            </form>

            <div mat-dialog-actions>
                <button mat-icon-button color="primary" class="m-1" (click)="onUpdate($event)" matTooltip="Update"
                    aria-label="Button that displays a tooltip when focused or hovered over">
                    <mat-icon>update</mat-icon>
                </button>
                <button mat-icon-button color="primary" class="m-1" (click)="onCreate($event)" matTooltip="Add"
                    aria-label="Button that displays a tooltip when focused or hovered over">
                    <mat-icon>add</mat-icon>
                </button>
                <button mat-icon-button color="primary" class="m-1" (click)="onDelete($event)" matTooltip="Delete"
                    aria-label="Button that displays a tooltip when focused or hovered over">
                    <mat-icon>delete</mat-icon>
                </button>
                <button mat-icon-button color="primary" class="m-1" (click)="closeDrawer()" matTooltip="Close"
                    aria-label="Button that displays a tooltip when focused or hovered over">
                    <mat-icon>close</mat-icon>
                </button>
            </div>
        </mat-card>
    </mat-drawer>

    <mat-drawer-container class="flex-col">

        <ng-container>
            @if (store.isLoading() === false ) {
                <grid-menubar 
                    [inTitle]="'Role Maintenance'"
                    (notifyParentRefresh)="onRefresh()" 
                    (notifyParentAdd)="onAdd()"
                    (notifyParentDelete)="onDeleteSelection()" 
                    (notifyParentUpdate)="onUpdateSelection()">
                </grid-menubar>
                
                    <gl-grid 
                        (openTradeId)="selectedRow($event)"
                        [data]="store.roles()" 
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
    selector: 'roles',
    imports: [imports],
    providers: [RoleService, RolesStore]
})
export class RolesComponent implements OnInit {

    private _fuseConfirmationService = inject(FuseConfirmationService);
    private fb = inject(FormBuilder);
    public sTitle = 'Roles Administration';
    public accountsForm!: FormGroup;
    public drawer = viewChild<MatDrawer>('drawer');

    store = inject(RolesStore);

    columns = [
        { field: 'role', headerText: 'Role', width: 100 },
        { field: 'description', headerText: 'Description', width: 100 },
        { field: 'permission', headerText: 'Permission', width: 100 },
        { field: 'update_date', headerText: 'Update Date', width: 100 },
        { field: 'update_user', headerText: 'Update User', width: 100 }

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
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete Role?',
            message: 'Are you sure you want to delete this type? ',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {

            if (result === 'confirmed') {

            }
        });
        this.closeDrawer();
    }

    createEmptyForm() {
        this.accountsForm = this.fb.group({
            role: ['', Validators.required],
            description: ['', Validators.required],
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

    selectedRow(e: any) {
        console.debug(e);
    }

    onUpdate(e: any) {
        const dDate = new Date();
        const updateDate = dDate.toISOString().split('T')[0];
        const account = { ...this.accountsForm.value } as IRole;
        const rawData = {
            role: account.role,
            description: account.description,
            update_date: updateDate,
            update_user: 'admin_update',
        };

        this.closeDrawer();
    }

    onDoubleClicked(e: any) {
        console.debug(e.data);
        this.openDrawer();
    }

    changeRole(e: any) {
        console.debug(e.data);
    }

}
