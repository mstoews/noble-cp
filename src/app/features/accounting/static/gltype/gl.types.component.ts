import {
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';

import { Component, OnInit, ViewChild, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { GridMenubarStandaloneComponent } from '../../grid-components/grid-menubar.component';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/shared/material.module';
import { AggregateService, ColumnMenuService, DialogEditEventArgs, EditService, ExcelExportService, FilterService, GridModule, GroupService, PageService, ResizeService, SaveEventArgs, SortService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { GLGridComponent } from '../../grid-components/gl-grid.component';
import { IGLType } from 'app/models/types';
import { GLTypeDrawerComponent } from './gl.type-drawer.component';
import { ToastrService } from 'ngx-toastr';
import { GLTypeStore } from 'app/store/gltype.store';


const imports = [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    GridMenubarStandaloneComponent,
    GLGridComponent,
    GLTypeDrawerComponent
];

@Component({
    template: `
     <grid-menubar [showPeriod]="false"  [inTitle]="sTitle"> </grid-menubar>                         
     <mat-drawer-container class="flex-col h-screen">         
        <mat-drawer class="lg:w-[400px] h-screen md:w-full bg-white-100" id="gl_type"  #gl_type [opened]="false" mode="side" [position]="'end'" [disableClose]="false">  
            <gltype-drawer
                [gltype]="selectedType"
                (Cancel)="onClose()"
                (Update)="onUpdate($event)"
                (Add)="onAdd($event)"
                (Delete)="onDelete($event)">
            </gltype-drawer>                         
        </mat-drawer>
        <ng-container>         
            @if ((glTypeStore.isLoading()) === false)  {                
                <gl-grid                                                 
                    (onUpdateSelection)="onSelection($event)"
                    (onSelection)="selectedRow($event)"                    
                    [data]="glTypeStore.types()" 
                    [columns]="columns">
                </gl-grid>                        
                }
                @else {
                <div class="flex justify-center items-center mt-20">
                    <mat-spinner></mat-spinner>
                </div>
                 }                                                          
        </ng-container>         
    </mat-drawer-container>    
    `,
    selector: 'gl-types',
    imports: [imports],
    providers: [SortService, GroupService, ExcelExportService, PageService, ResizeService, FilterService, ToolbarService, EditService, AggregateService, ColumnMenuService,]
})
export class GlTypeComponent implements OnInit {

    glTypeStore = inject(GLTypeStore); 
    toast = inject(ToastrService);
    fuseConfirmationService = inject(FuseConfirmationService);

    bDirty: boolean = false;
    sTitle = 'Mapping';
    drawer = viewChild<MatDrawer>('gl_type');
    selectedType: IGLType;
    
    columns = [
        { field: 'type', headerText: 'FS Type', width: '100', textAlign: 'Left', isPrimaryKey: true },
        { field: 'description', headerText: 'Statement Type', width: '100', textAlign: 'Left' },
        { field: 'create_date', headerText: 'Create Date', width: '100', textAlign: 'Left' },
        { field: 'create_user', headerText: 'Create User', width: '100', textAlign: 'Left' },
        { field: 'update_date', headerText: 'Update Date', width: '100', textAlign: 'Left' },
        { field: 'update_user', headerText: 'Update User', width: '100', textAlign: 'Left' },
    ];


    ngOnInit(): void {
        // this.glTypeStore.isLoaded() === true ? console.log('Types : ', this.glTypeStore.types()) : console.log('Loading Types');
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
                this.glTypeStore.removeType(e);
            }
        });
        this.onClose();
    }

    selectedRow(e: IGLType) {
        this.selectedType = e;        
        this.openDrawer();
    }
    onSelection(gltype: IGLType) {
        this.selectedType = gltype;
        this.openDrawer();
    }
    openDrawer() {
        const opened = this.drawer().opened;
        if (opened !== true) {
            this.drawer().toggle();
        } else {
            return;
        }
    }
    
    onAdd(gltype: IGLType) {
        this.glTypeStore.addType(gltype); 
        this.toast.success('Mapping Added');
    }
    onUpdate(gltype: IGLType) {     
        this.glTypeStore.updateType(gltype);
        this.toast.success('Mapping Updated');
        this.onClose();
    }

    onClose() {
        const opened = this.drawer().opened;
        if (opened === true) {
            this.drawer().toggle();
        } else {
            return;
        }
    }

}
