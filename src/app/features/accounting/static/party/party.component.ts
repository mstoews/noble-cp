import { Component, inject, viewChild } from '@angular/core';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/shared/material.module';
import { GridMenubarStandaloneComponent } from '../../grid-components/grid-menubar.component';
import { AggregateService, ColumnMenuService, EditService, FilterService, GroupService, PageService, ResizeService, SortService, ToolbarService } from '@syncfusion/ej2-angular-grids';

import { GLGridComponent } from '../../grid-components/gl-grid.component';
import { IParty } from 'app/models/party';

import { ToastrService } from 'ngx-toastr';
import { PartyDrawerComponent } from './party-drawer.component';
import { PartyStore } from 'app/store/party.store';


const imports = [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    GridMenubarStandaloneComponent,
    GLGridComponent,
    PartyDrawerComponent
];

@Component({
    selector: 'party',
    imports: [imports],
    template: `
        <grid-menubar [inTitle]="sTitle"> </grid-menubar>                         
        
          <mat-drawer-container class="flex-col h-screen">                
                <ng-container>
                    <div class="border-1 border-gray-500">                                                              
                        @if(store.isLoading() === false) {                          
                            <gl-grid                             
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
                <mat-drawer class="lg:w-1/3 sm:w-full bg-white-100" #drawer [opened]="false" mode="over" [position]="'end'" [disableClose]="false">
                   <party-drawer
                        [party] = "selectedParty"
                        (Cancel)="onClose()"
                        (Update)="onUpdate($event)"
                        (Add)="onAdd($event)"
                        (Delete)="onDelete($event)">
                    </party-drawer>                 
                </mat-drawer>
          </mat-drawer-container>             
        
    `,
    providers: [SortService, GroupService, PageService, ResizeService, FilterService, ToolbarService, EditService, AggregateService, ColumnMenuService,]
})
export class PartyComponent  {

    public sTitle = 'Vendor/Customer Party';
    private _fuseConfirmationService = inject(FuseConfirmationService);
    public drawer = viewChild<MatDrawer>("drawer");

    store = inject(PartyStore);
    selectedParty: IParty | null;

    toast = inject(ToastrService);

    columns = [
        { field: 'party_id', headerText: 'Party', width: 100, textAlign: 'Left', isPrimaryKey: true },
        { field: 'name', headerText: 'Name', width: 150, textAlign: 'Left' },
        { field: 'party_type', headerText: 'Party Type', width: 70 },
        { field: 'address_id', headerText: 'Ad', width: 50, visible: false },
        { field: 'update_date', headerText: 'Update Date', width: 100 },
        { field: 'update_user', headerText: 'Update User', width: 100 },
    ];

    onClose() {
        this.closeDrawer();
    }

    onSelection(party: IParty) {
        this.selectedParty = party;
        this.openDrawer();
    }

    onAdd(party: IParty) {
        this.store.addParty(party);
        this.toast.success('Party Added');
    }

    onUpdate(party: IParty) {

        this.store.updateParty(party);
        this.toast.success('Party Updated');
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
            }
        });
        this.closeDrawer();
        this.toast.success('Party Deleted');
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
