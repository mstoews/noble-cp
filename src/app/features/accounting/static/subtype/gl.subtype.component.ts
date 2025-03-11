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
import { GridMenubarStandaloneComponent } from '../../grid-components/grid-menubar.component';

import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { SubTypeService } from 'app/services/subtype.service';
import { ISubType } from 'app/models/subtypes';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { subTypePageActions } from 'app/features/accounting/static/subtype/sub-type-page.actions';
import { subtypeFeature } from 'app/features/accounting/static/subtype/sub-type.state';
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
    template: `
    <mat-drawer class="lg:w-[400px] md:w-full bg-white-100" #drawer [opened]="false" mode="over" [position]="'end'"
        [disableClose]="false">
        <div class="flex flex-col w-full text-gray-700 max-w-140 filter-article filter-interactive">
                    <div class="h-12 m-2 rounded-lg p-2 text-2xl text-justify text-gray-200 bg-slate-600" mat-dialog-title> {{ sTitle }} </div>
            <mat-card class="m-2 p-2">
            <div mat-dialog-content>
                <form [formGroup]="subtypeForm" class="flex flex-col">

                    <div class="flex flex-col m-1">
                        
                        <div class="flex flex-col grow">
                               <mat-form-field class="mt-1 ml-1 mr-1 flex-start">
                                    <mat-label class="ml-2 text-base dark:text-gray-200">Sub Type</mat-label>
                                    <input matInput placeholder="Sub Type" formControlName="subtype"/>
                                    <mat-icon class="icon-size-5" matPrefix [svgIcon]="'heroicons_solid:document-check'"></mat-icon>
                                </mat-form-field>
                        </div> 
                        
                        <div class="flex flex-col grow">
                               <mat-form-field class="mt-1 ml-1 mr-1 flex-start">
                                    <mat-label class="ml-2 text-base dark:text-gray-200">Description</mat-label>
                                    <input matInput placeholder="Description" formControlName="description"/>
                                    <mat-icon class="icon-size-5" matPrefix [svgIcon]="'heroicons_solid:document'"></mat-icon>
                                </mat-form-field>
                        </div> 

                    </div>
                </form>
            </div>
            <div mat-dialog-actions>
                @if (bDirty === true) {
                    <button mat-icon-button color="primary" class="hover:bg-slate-400 ml-1" (click)="onUpdate()" matTooltip="Save" aria-label="hovered over">                                    
                        <span class="e-icons e-save"></span>
                    </button>
                }
                 <button mat-icon-button color="primary" 
                         class=" hover:bg-slate-400 ml-1" (click)="onAdd($event)" matTooltip="New" aria-label="hovered over">                        
                     <span class="e-icons e-circle-add"></span>
                 </button>
                 <button mat-icon-button color="primary" 
                         class=" hover:bg-slate-400 ml-1" (click)="onDelete($event)" matTooltip="Delete" aria-label="hovered over">                        
                     <span class="e-icons e-trash"></span>
                 </button>
                 <button mat-icon-button color="primary"
                         class=" hover:bg-slate-400 ml-1"  (click)="onCancel($event)" matTooltip="Close"
                         aria-label="hovered over">
                         <span class="e-icons e-circle-close"></span>
                 </button>
                    
            </div>
            </mat-card>
        </div>
    </mat-drawer>

    <mat-drawer-container class="flex-col h-full">    
            <ng-container>                                 
                    @if ((isLoading$ | async) === false) {
                        @if(subtypes$ | async; as subtypes) {                              
                            <grid-menubar [inTitle]="sTitle" [showNew]=true [showSettings]=false (newRecord)="onAddNew()"></grid-menubar>        
                                <gl-grid 
                                (onUpdateSelection)="onUpdateSelection($event)"
                                [data]="subtypes" 
                                [columns]="columns">
                            </gl-grid>                            
                        }
                    @else
                        {
                            <div class="flex justify-center items-center mt-20">
                                <mat-spinner></mat-spinner>
                            </div>
                        }
                    }
            
            </ng-container> 
    </mat-drawer-container>
    `,
    selector: 'subtypes',
    imports: [imports],
    providers: [imports]
})
export class GlSubTypeComponent implements OnInit {

    fuseConfirmationService = inject(FuseConfirmationService);
    fb = inject(FormBuilder);

    drawer = viewChild<MatDrawer>('drawer');
    sTitle = 'Sub Types';
    bDirty: boolean;

    subtypeForm?: FormGroup | any;

    Store = inject(Store);
    subtypes$ = this.Store.select(subtypeFeature.selectSubtype);
    selectedSubtypes$ = this.Store.select(subtypeFeature.selectSelectedSubtype);
    isLoading$ = this.Store.select(subtypeFeature.selectIsLoading);

    columns = [
        { field: 'subtype', headerText: 'Sub Types ', width: 100, textAlign: 'Left', isPrimaryKey: true },
        { field: 'description', headerText: 'Description', width: 100, textAlign: 'Left' },
        { field: 'create_date', headerText: 'Create Date', width: 100, textAlign: 'RIght' },
        { field: 'create_user', headerText: 'Create User', width: 100, textAlign: 'Right' },
        { field: 'update_date', headerText: 'Update Date', width: 100, textAlign: 'Right' },
        { field: 'update_user', headerText: 'Update User', width: 100, textAlign: 'Right' },
    ];


    createEmptyForm() {
        this.subtypeForm = this.fb.group({
            subtype: ['', Validators.required],
            description: ['', Validators.required],
            create_date: [''],
            create_user: [''],
            update_date: [''],
            update_user: [''],
        });
    }


    selectSubtype(subtype: any) {
        var st = {
            ...subtype,
            //start_date: new Date(period.start_date),
            //end_date: new Date(period.end_date),
            id: subtype.id
        }
        this.Store.dispatch(subTypePageActions.select(st));
    }

    ngOnInit() {
        this.createEmptyForm();
        this.Store.dispatch(subTypePageActions.load());

    }


    onAddNew() {
        this.createEmptyForm();
        this.openDrawer();
    }

    onSelection(e: any) {
        this.selectSubtype(e);
        this.openDrawer();
    }

    onCancel($event: any) {
        this.closeDrawer();
    }

    onDelete(e: any) {
        const confirmation = this.fuseConfirmationService.open({
            title: 'Delete Sub Type?',
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



    openDrawer() {
        const opened = this.drawer().opened;
        if (opened !== true) {
            this.drawer().toggle();
        } else {
            return;
        }
    }

    onRefresh() {

    }

    onAdd(e: any) {

    }

    onDeleteSelection() {

    }

    onUpdateSelection(type: any) {
        this.subtypeForm.patchValue({
            subtype: [type.subtype],
            description: [type.description]
        });
        this.openDrawer()
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
        const subtype = { ...this.subtypeForm.value } as any;
        const rawData = {
            type: subtype.type,
            description: subtype.description,
            update_date: updateDate,
            update_user: 'admin_update',
        };

        this.closeDrawer();
    }

}
