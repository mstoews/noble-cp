import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
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
import { loadSubType } from 'app/state/subtype/sub-type.effects';
import { subtypePageActions } from 'app/state/subtype/actions/sub-type.page.actions';
import { subtypeAPIActions } from 'app/state/subtype/actions/sub-type.actions';
import { subtypeFeature } from 'app/state/subtype/sub-type.state';
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
            <div class="h-10 pt-2 text-2xl text-justify text-black bg-slate-100" mat-dialog-title>
                {{ sTitle }}
            </div>
            <div mat-dialog-content>
                <form [formGroup]="subtypeForm" class="flex flex-col">

                    <div class="flex flex-col m-1">
                        
                        <div class="flex flex-col grow">
                            <mat-label class="ml-2 text-base">Sub Type</mat-label>
                            <mat-form-field class="m-1 form-element grow" appearance="outline">
                                <input matInput placeholder="Type" formControlName="sub_type" />
                            </mat-form-field>
                        </div>
                        
                        <div class="flex flex-col grow">
                            <mat-label class="ml-2 text-base">Description</mat-label>
                            <mat-form-field class="m-1 form-element" appearance="outline">
                                <input matInput placeholder="Type Description" formControlName="description" />
                            </mat-form-field>
                        </div>

                    </div>
                </form>
            </div>
            <div mat-dialog-actions>
            @if (bDirty === true) {
                            <button mat-icon-button color="primary" class="hover:bg-slate-400 ml-1"
                                        (click)="onUpdate()" matTooltip="Save"
                                        aria-label="hovered over">                                    
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
        </div>
    </mat-drawer>

<mat-drawer-container class="flex-col h-full">
    
            <ng-container>
            
                     
                     @if ((isLoading$ | async) === false) 
                    {
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
                        <div class="fixed z-[1050] -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4">
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
    sTitle = 'Transaction Sub Types';
    bDirty: boolean;

    subtypeForm?: FormGroup | any;
    
    Store = inject(Store);
    subtypes$= this.Store.select(subtypeFeature.selectSubtype);    
    selectedSubtypes$ = this.Store.select(subtypeFeature.selectSelectedSubtype);        
    isLoading$ = this.Store.select(subtypeFeature.selectIsLoading);

    columns = [
        { field: 'subtype',     headerText: 'Sub Type ',   width: 100, textAlign: 'Left', isPrimaryKey: true },
        { field: 'description', headerText: 'Description', width: 100, textAlign: 'Left' },
        { field: 'create_date', headerText: 'Create Date', width: 100, textAlign: 'RIght' },
        { field: 'create_user', headerText: 'Create User', width: 100, textAlign: 'Right' },
        { field: 'update_date', headerText: 'Update Date', width: 100, textAlign: 'Right' },
        { field: 'update_user', headerText: 'Update User', width: 100, textAlign: 'Right' },
    ];

    
    selectSubtype(subtype: any) {
            var st = {
                ...subtype,
                //start_date: new Date(period.start_date),
                //end_date: new Date(period.end_date),
                id: subtype.id
            }
            this.Store.dispatch(subtypePageActions.select(st));    
    }
        
    ngOnInit() {        
        this.createEmptyForm();
        this.Store.dispatch(subtypePageActions.load());    
                        
    }


    onAddNew() {
        this.createEmptyForm();
        this.openDrawer();
    }

    onSelection(e: any) {
        this.selectSubtype(e);
        this.openDrawer();
    }

    onCreate(e: any) {
        this.createEmptyForm();
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

        
    createEmptyForm() {
        this.subtypeForm = this.fb.group({
            sub_type: [''],
            description: [''],
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


    onRefresh() {
        throw new Error('Method not implemented.');
    }
    onAdd(e: any) {
        throw new Error('Method not implemented.');
    }
    onDeleteSelection() {
        throw new Error('Method not implemented.');
    }
    onUpdateSelection() {
        throw new Error('Method not implemented.');
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
