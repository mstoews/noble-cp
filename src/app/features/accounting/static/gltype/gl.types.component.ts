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
import { Store } from '@ngrx/store';
import { IGLType } from 'app/models/types';
import { Subject, take, takeUntil } from 'rxjs';
import { glTypePageActions } from 'app/state/gltype/gltype.page.actions';
import { gltypeFeature } from 'app/state/gltype/gltype.state';
import { GLTypeDrawerComponent } from './gl.type-drawer.component';
import { ToastrService } from 'ngx-toastr';

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
        <ng-container>         
            @if ((isLoading$ | async) === false)  {
                @if(glTypes$ | async; as glTypes) {                          
                    <gl-grid                             
                        (onUpdateSelection)="onSelection($event)"
                        [data]="glTypes" 
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
    
        <mat-drawer class="lg:w-[400px] h-screen md:w-full bg-white-100" #drawer [opened]="false" mode="over" [position]="'end'" [disableClose]="false">         
                <gltype-drawer
                        [gltype] = "selectedTypes$ | async"
                        (Cancel)="onClose()"
                        (Update)="onUpdate($event)"
                        (Add)="onAdd($event)"
                        (Delete)="onDelete($event)">
                 </gltype-drawer>                         
        </mat-drawer>
    </mat-drawer-container>
    
    `,
    selector: 'gl-types',
    imports: [imports],
    providers: [SortService, GroupService, ExcelExportService, PageService, ResizeService, FilterService, ToolbarService, EditService, AggregateService, ColumnMenuService,]
})
export class GlTypeComponent implements OnInit {

    protected onDestroyLoading = new Subject<void>();

    store = inject(Store);
    bDirty: boolean = false;
    sTitle = 'Financial Statement Mapping';
    drawer = viewChild<MatDrawer>('drawer');
    toast = inject(ToastrService);


    private fuseConfirmationService = inject(FuseConfirmationService);

    isLoading$ = this.store.select(gltypeFeature.selectIsLoading);
    isLoaded$ = this.store.select(gltypeFeature.selectIsLoaded);
    glTypes$ = this.store.select(gltypeFeature.selectGltype);
    selectedTypes$ = this.store.select(gltypeFeature.selectSelectedGLType);

    columns = [
        { field: 'type', headerText: 'FS Type', width: '100', textAlign: 'Left', isPrimaryKey: true },
        { field: 'description', headerText: 'Statement Type', width: '100', textAlign: 'Left' },
        { field: 'create_date', headerText: 'Create Date', width: '100', textAlign: 'Left' },
        { field: 'create_user', headerText: 'Create User', width: '100', textAlign: 'Left' },
        { field: 'update_date', headerText: 'Update Date', width: '100', textAlign: 'Left' },
        { field: 'update_user', headerText: 'Update User', width: '100', textAlign: 'Left' },
    ];


    ngOnInit() {
        this.isLoaded$.pipe(take(1), takeUntil(this.onDestroyLoading)).subscribe((loaded) => {
            if (loaded === false) {
                this.store.dispatch(glTypePageActions.load());
            }
        });
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
                // this.typeApiService.delete(e.type);
            }
        });
        this.onClose();
    }

    selectedRow(e: any) {
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

    onSelection(gltype: IGLType) {
        this.store.dispatch(glTypePageActions.select(gltype));
        this.openDrawer();
    }


    onAdd(gltype: IGLType) {
        this.store.dispatch(glTypePageActions.add({ gltype: gltype }));
        this.toast.success('Mapping Added');
    }

    onUpdate(gltype: IGLType) {
        this.store.dispatch(glTypePageActions.update({ gltype: gltype }));
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
