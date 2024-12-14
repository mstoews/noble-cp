import { Component, OnInit, ViewChild, inject, viewChild } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

import { MatDrawer } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { GridMenubarStandaloneComponent } from '../../grid-menubar/grid-menubar.component';
import { MaterialModule } from 'app/services/material.module';
import { EditService, FilterService, FilterSettingsModel, GridModule, PageService, SearchSettingsModel, SelectionSettingsModel, SortService, ToolbarItems, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { FundsStore } from 'app/services/funds.store';
import { GLGridComponent } from "../../grid-menubar/gl-grid.component";
import { IFunds } from 'app/models';


const imports = [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    GridModule,
    GridMenubarStandaloneComponent,    
];

@Component({
    selector: 'funds',
    imports: [imports, GLGridComponent],
    template: `
        <mat-drawer class="lg:w-1/3 sm:w-full bg-white-100" #drawer [opened]="false" mode="over" [position]="'end'"  [disableClose]="false">
        <mat-card class="m-2 p-2 mat-elevation-z8">
                <div class="flex flex-col w-full text-gray-700 max-w-140 filter-article filter-interactive">
                    <div class="h-12 m-2 rounded-lg p-2 text-2xl text-justify text-gray-200 bg-slate-600" mat-dialog-title> {{ sTitle }} </div>
                    <div mat-dialog-content>
                    <form [formGroup]="fundsForm">
                        <div class="flex flex-col m-1">
                            
                            <div class="flex flex-col grow">
                                <mat-form-field class="mt-1 ml-1 mr-1 flex-start">
                                    <mat-label class="ml-2 text-base dark:text-gray-200">Fund</mat-label>
                                    <input matInput placeholder="Fund" formControlName="fund" readonly/>
                                    <mat-icon class="icon-size-5" matPrefix [svgIcon]="'heroicons_solid:document'"></mat-icon>
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
                            <button mat-icon-button color="primary" class="bg-green-200 text-green-800 hover:bg-slate-400 ml-1"
                                        (click)="onUpdate()" matTooltip="Save"
                                        aria-label="hovered over">                                    
                                    <span class="e-icons e-save"></span>
                            </button>
                     }
                    <button mat-icon-button color="primary" 
                            class="bg-green-200 text-green-800 hover:bg-slate-400 ml-1" (click)="onAdd($event)" matTooltip="New" aria-label="hovered over">                        
                        <span class="e-icons e-circle-add"></span>
                    </button>
                                                            

                    <button mat-icon-button color="primary"
                            class="bg-green-200 text-green-800 hover:bg-slate-400 ml-1"  (click)="onCancel($event)" matTooltip="Close"
                            aria-label="hovered over">
                            <span class="e-icons e-circle-close"></span>
                    </button>
                    

                    </div>
                    
                </div>
            </mat-card>
        </mat-drawer>

        <mat-drawer-container class="flex-col h-full">    
        <ng-container>
            @if (store.funds()) 
            {
                <grid-menubar [inTitle]="'Fund Maintenance'"></grid-menubar>        
                <gl-grid 
                    (openTradeId)="update($event)"
                    [data]="store.funds()" 
                    [columns]="columns">
                </gl-grid>
            
            }
        </ng-container>
        </mat-drawer-container>
`,
    providers: [FundsStore, SortService, PageService, FilterService, ToolbarService, EditService],
})
export class FundsComponent implements OnInit {
    
    private confirmation = inject(FuseConfirmationService);
    public store = inject(FundsStore);
    private fb = inject(FormBuilder);    
    
    drawer = viewChild<MatDrawer>('drawer');

    public sTitle = 'Reserve Funds';
    public fundsForm!: FormGroup;
    public bDirty = false;
    public formdata: any = {};

    // definition of the columns if you want to change the default

    public columns = [
        { field: 'fund',        headerText: 'Fund', width: 80, textAlign: 'Left' },
        { field: 'description', headerText: 'Description', width: 200, textAlign: 'Left' },
        { field: 'create_date', headerText: 'Create Date', width: 80, textAlign: 'Left' },
        { field: 'create_user', headerText: 'Create User', width: 80, textAlign: 'Left' }
    ];

    ngOnInit() {
        this.createEmptyForm();
        this.onChanges();
    }

    public onChanges(): void {
        this.fundsForm.valueChanges.subscribe((dirty) => {
            if (this.fundsForm.dirty === true) {
                this.bDirty = true;
            }
            else
            {
                this.bDirty = false;
            }
        });
    }
    
    public createEmptyForm() {
        // this.fundsForm = this.fb.group({
        //     fund: ['', Validators.required],
        //     description: ['', Validators.required]
        // });

        this.fundsForm = new FormGroup({
            fund: new FormControl(null, [Validators.required]),
            description : new FormControl(null, [Validators.required])            
        });
    }
    
    public onAdd($event: any) {
        const dDate = new Date();
        const updateDate = dDate.toISOString().split('T')[0];
        const fund = { ...this.fundsForm.value } as IFunds;
        const rawData = {
            fund: fund.fund,
            description: fund.description,
            create_date: updateDate,
            create_user: '@admin',            
        } as IFunds;
        this.store.addFund(rawData);
        this.bDirty = false;
        this.closeDrawer();
    }

    public onCancel($event: any) {
        if (this.bDirty === true) {
            const confirm = this.confirmation.open({
                title: 'Fund Modified',
                message: 'Are you sure you want to exit without saving? ',
                actions: {
                    confirm: {
                        label: 'Confirm',
                    },
                },
            });
        
            confirm.afterClosed().subscribe((result) => {
                // If the confirm button pressed...
                if (result === 'confirmed') {
                    this.closeDrawer();
                    this.fundsForm.reset();                    
                }
            });
        } else {
           this.closeDrawer();
           this.bDirty = false;
           return;
        }        
    }

        
    update($event: any) {
        this.fundsForm.setValue({
            fund: [$event.fund],
            description: [$event.description]
        });
        this.openDrawer();
    }

    
    onDelete(e: any) {        
        const confirmation = this.confirmation.open({
            title: 'Delete Fund?',
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

    closeDrawer() {
        const opened = this.drawer().opened;
        if (opened === true) {
            this.drawer().toggle();
        } else {
            return;
        }
    }

    onUpdate() {        
        const updateDate = new Date().toISOString().split('T')[0];  
        const fund = this.fundsForm.value;
        this.formdata = this.fundsForm.value;
        console.log('rawData', JSON.stringify(this.formdata));
        const rawData = {
            fund: fund.fund[0],
            description: fund.description,
            create_date: updateDate,
            create_user: '@admin'
        } as IFunds;
        
        this.store.updateFund(rawData);
        this.fundsForm.reset();
        this.closeDrawer();
    }
}
