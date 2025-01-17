import { Component, OnInit, inject, viewChild } from '@angular/core';
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
import { MaterialModule } from 'app/services/material.module';
import { GridMenubarStandaloneComponent } from '../../grid-components/grid-menubar.component';
import { AggregateService, ColumnMenuService, EditService, FilterService, GroupService, PageService, ResizeService, SearchSettingsModel, SelectionSettingsModel, SortService, ToolbarItems, ToolbarService } from '@syncfusion/ej2-angular-grids';

import { GLGridComponent } from '../../grid-components/gl-grid.component';
import { IParty } from 'app/models/party';
import { Store } from '@ngrx/store';
import { partyPageActions } from 'app/state/party/actions/party-page.actions';
import { partyFeature } from 'app/state/party/party.state';
import { PartyStore } from 'app/services/party.store';


const imports = [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    GridMenubarStandaloneComponent,
    GLGridComponent
];

@Component({
    selector: 'party',
    imports: [imports],
    template: `
        <div class="h-[calc(100vh)-100px]">
            <mat-drawer class="lg:w-1/3 sm:w-full bg-white-100" #drawer [opened]="false" mode="over" [position]="'end'" [disableClose]="false">
                 <mat-card class="m-2">   
                 <div class="flex flex-col w-full text-gray-700 max-w-140 filter-article filter-interactive">
                    <div class="h-12 m-2 rounded-lg p-2 text-2xl text-justify text-gray-200 bg-slate-600" mat-dialog-title> {{ sTitle }} </div>
                        <div mat-dialog-content>
                            <form [formGroup]="partyForm">
                                <div class="flex flex-col m-1">
                                    
                                    <div class="flex flex-col grow">
                                        <mat-form-field class="mt-1 ml-1 mr-1 flex-start">
                                            <mat-label class="ml-2 text-base dark:text-gray-200">Party</mat-label>
                                            <input matInput placeholder="Party" formControlName="party_id"/>
                                            <mat-icon class="icon-size-5" matPrefix [svgIcon]="'heroicons_solid:document-check'"></mat-icon>
                                        </mat-form-field>
                                    </div> 
                                    
                                    <div class="flex flex-col grow">
                                        <mat-form-field class="mt-1 ml-1 mr-1 flex-start">
                                            <mat-label class="ml-2 text-base dark:text-gray-200">Party Name</mat-label>
                                            <input matInput placeholder="Name" formControlName="name"/>
                                            <mat-icon class="icon-size-5" matPrefix [svgIcon]="'heroicons_solid:document'"></mat-icon>
                                        </mat-form-field>
                                    </div>
                                    
                                    <div class="flex flex-col grow">
                                        <mat-form-field class="mt-1 ml-1 mr-1 flex-start">
                                            <mat-label class="ml-2 text-base dark:text-gray-200">Vendor Type</mat-label>
                                            <input matInput placeholder="Vendor Type" formControlName="party_type"/>
                                            <mat-icon class="icon-size-5" matPrefix [svgIcon]="'heroicons_solid:document'"></mat-icon>
                                        </mat-form-field>
                                    </div>
                                                                        
                                </div>
                            </form>
                            
                            <div mat-dialog-actions class="flew-row gap-2 mb-3">
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
                    </div>      
                
                </mat-card>    
            </mat-drawer>
            <mat-drawer-container class="flex-col">
                
                 <ng-container>
                    <grid-menubar [inTitle]="sTitle" (onCreate)="onCreate($event)">                                        
                    
                     </grid-menubar>                         
                     
                     @if ((isLoading$ | async) === false)  {
                        @if(party$ | async; as party) {                          
                            <gl-grid                             
                                (onUpdateSelection)="onSelection($event)"
                                [data]="party" 
                                [columns]="columns">
                            </gl-grid>                        
                    }
                    @else{
                        <div class="fixed z-[1050] -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4">
                            <mat-spinner></mat-spinner>
                        </div>
                    }
                }
            
                </ng-container> 
            </mat-drawer-container>
        </div>
    `,
    providers: [PartyStore, SortService, GroupService, PageService, ResizeService, FilterService, ToolbarService, EditService, AggregateService, ColumnMenuService,]
})
export class PartyComponent implements OnInit {

    public sTitle = 'Vendor/Customer Party';

    private _fuseConfirmationService = inject(FuseConfirmationService);
    private fb = inject(FormBuilder);

    public drawer = viewChild<MatDrawer>("drawer");
    partyForm!: FormGroup;
    bDirty: boolean = false;

    store = inject(Store);
    party$ = this.store.select(partyFeature.selectParty);
    selectedParty$ = this.store.select(partyFeature.selectSelectedParty);
    isLoading$ = this.store.select(partyFeature.selectIsLoading);

    columns = [
        { field: 'party_id', headerText: 'Party', width: 100, textAlign: 'Left', isPrimaryKey: true },
        { field: 'name', headerText: 'Name', width: 150, textAlign: 'Left' },
        { field: 'party_type', headerText: 'Party Type', width: 70 },
        { field: 'address_id', headerText: 'Ad', width: 50, visible: false },
        { field: 'update_date', headerText: 'Update Date', width: 100 },
        { field: 'update_user', headerText: 'Update User', width: 100 },
    ];

    selectPeriod(party: any) {
        var pd = {
            ...party,
            id: party.party_id
        }
        this.store.dispatch(partyPageActions.select(pd));
    }

    ngOnInit() {
        this.createEmptyForm();
        this.store.dispatch(partyPageActions.load());
        this.onChanges();
    }

    onClose() {
        this.closeDrawer();
    }

    onChanges() {
        this.partyForm.valueChanges.subscribe((value) => {
            this.bDirty = true;
        });
    }

    onCreate(e: any) {
        this.createEmptyForm();
        this.openDrawer();
    }

    onSelection(party: IParty) {
        this.partyForm.patchValue(party);
        this.openDrawer();
        this.selectPeriod(party);
        this.selectedParty$.subscribe((party) => {
            console.log(`selectedParty: ${JSON.stringify(party)}`);
        });
    }

    onCancel() {
        this.closeDrawer();
    }

    onAdd() {
        const dDate = new Date();
        const createDate = dDate.toISOString().split('T')[0];
        const party = { ...this.partyForm.value } as IParty;
        this.store.dispatch(partyPageActions.updateParty({ party: party }));
    }

    onDelete(e: any) {
        console.debug(`onDelete ${JSON.stringify(e)}`);
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
                this.store.dispatch(partyPageActions.deleteParty({ id: e.id }));
            }
        });
        this.closeDrawer();
    }

    createEmptyForm() {
        this.partyForm = this.fb.group({
            party_id: ['', Validators.required],
            name: ['', Validators.required],
            party_type: ['', Validators.required],
            address_id: ['', Validators.required]
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
        const party = { ...this.partyForm.value } as IParty;
        const rawData = {
            party_id: party.party_id,
            name: party.name,
            party_type: party.party_type,
            address_id: party.address_id,
            create_date: party.create_date,
            create_user: party.create_user,
            update_date: dDate,
            update_user: '@admin'
        };

        this.store.dispatch(partyPageActions.updateParty({ party: rawData }));
        this.closeDrawer();
    }

}
