
import { Component, inject, viewChild } from '@angular/core';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/shared/material.module';
import { GridMenubarStandaloneComponent } from '../../grid-components/grid-menubar.component';
import { AggregateService, ColumnMenuService, EditService, FilterService, GridComponent, GridModule, GroupService, PageService, PdfExportProperties, PdfExportService, ResizeService, SortService, ToolbarService } from '@syncfusion/ej2-angular-grids';

import { GLGridComponent } from '../../grid-components/gl-grid.component';
import { IParty } from 'app/models/party';

import { ToastrService } from 'ngx-toastr';
import { PartyDrawerComponent } from './party.drawer.component';
import { PartyStore } from 'app/store/party.store';
import { PrintService } from '@syncfusion/ej2-angular-schedule';

const imports = [
    CommonModule,
    FormsModule,    
    MaterialModule,
    ReactiveFormsModule,    
    GLGridComponent,
    PartyDrawerComponent,
    GridMenubarStandaloneComponent,
];

@Component({
    selector: 'party',
    imports: [imports],
    template: `        
        <mat-drawer class="lg:w-1/3 sm:w-full bg-white-100" #drawer [opened]="false" mode="over" [position]="'end'" [disableClose]="false">
            <party-drawer 
              [party]="selectedParty" 
              [bDirty]=bDirty               
              (Cancel)="onClose()" 
              (Update)="onUpdate($event)" 
              (Add)="onAdd($event)" 
              (Delete)="onDelete($event)">
            </party-drawer>                 
        </mat-drawer>
        <grid-menubar [showPeriod]="false"  [inTitle]="sTitle" [showNew]=true (new)="onAddNew()" (print)="onPrint()" [showSettings]="false"/>
        <mat-drawer-container class="flex-col h-screen">                
                <ng-container>
                    <div class="border-1 border-gray-500">                                                              
                        @if(store.isLoading() === false) {                          
                            <gl-grid #grid id="party_grid"                           
                                (onUpdateSelection)="onSelection($event)"
                                [data]="store.party()" 
                                [columns]="columns">
                            </gl-grid>                        
                         }
                        @else
                        {
                            <div class="flex justify-center items-center mt-20">
                                <mat-spinner></mat-spinner>
                            </div>
                        }                    
                    </div>       
                </ng-container> 
          
        </mat-drawer-container>                     
    `,
    providers: [SortService, PdfExportService, GroupService, PageService, PrintService, ResizeService, FilterService, ToolbarService, EditService, AggregateService, ColumnMenuService,]
})
export class PartyComponent  {

    sTitle = 'Vendor/Customer Party';    
    drawer = viewChild<MatDrawer>("drawer");
    grid = viewChild<GLGridComponent>('party_grid');
    bDirty = false;
    selectedParty: IParty | null;
    store = inject(PartyStore);
    toast = inject(ToastrService);
    

    private _fuseConfirmationService = inject(FuseConfirmationService);
    
    
    columns = [
        { field: 'party_id', headerText: 'Party', width: 100, textAlign: 'Left', isPrimaryKey: true },
        { field: 'name', headerText: 'Name', width: 150, textAlign: 'Left' },
        { field: 'party_type', headerText: 'Party Type', width: 70 },
        { field: 'address_id', headerText: 'Address Code', width: 100, visible: false },
        { field: 'update_date', headerText: 'Update Date', width: 100 },
        { field: 'update_user', headerText: 'Update User', width: 100 },
    ];

    onClose() {
        this.closeDrawer();
    }

    onPrint() {        
        const pdfExportProperties: PdfExportProperties = {
        exportType: 'CurrentPage'
        };
        (this.grid() as any as GridComponent).pdfExport(pdfExportProperties);        
    }
    onAddNew() {     
        const party = {
            party_id :'',
            name:  '',
            address_id: 0,
            party_type : '',            
            update_date : new Date().toISOString().split('T')[0],
            update_user : '@admin',
            create_date : new Date().toISOString().split('T')[0],
            create_user : '@admin',
        };
        this.selectedParty = party;
        this.bDirty = false;
        this.openDrawer();
    }
    
    onSelection(party: IParty) {
        this.selectedParty = party;
        this.bDirty = true;                
        this.openDrawer();
    }

    opPrint() {
        const pdfExportProperties: PdfExportProperties = {
            exportType: 'CurrentPage'
        };
        (this.grid() as any as GridComponent).pdfExport(pdfExportProperties);
    }
    

    onAdd(party: IParty) {
        this.store.addParty(party);
        this.closeDrawer();
        this.toast.success('Party Added');        
    }

    onUpdate(party: IParty) {        
        const pt = this.store.updateParty(party);        
        this.closeDrawer();
    }

    onDelete(e: IParty) {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete party?',
            message: 'Are you sure you want to delete this party_type? ',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {                
                this.store.removeParty(e);
              this.toast.success('Party Deleted');
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

    closeDrawer() {
        const opened = this.drawer().opened;
        if (opened === true) {
            this.drawer().toggle();
        } else {
            return;
        }
    }
}
