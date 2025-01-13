import { Component, OnInit, ViewChild, inject, viewChild, input, output } from '@angular/core';
import {
    FormControl,    
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

import { MatDrawer } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { GridMenubarStandaloneComponent } from '../../grid-components/grid-menubar.component';
import { MaterialModule } from 'app/services/material.module';
import { EditService, FilterService, FilterSettingsModel, GridModule, PageService, SearchSettingsModel, SelectionSettingsModel, SortService, ToolbarItems, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { GLGridComponent } from "../../grid-components/gl-grid.component";
import { IFunds } from 'app/models';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { addFunds, deleteFunds, loadFunds, updateFunds } from 'app/state/funds/Funds.Action';
import { selectFunds } from 'app/state/funds/Funds.Selector';


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
                                    <input matInput placeholder="Fund" formControlName="fund"/>
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
                </div>
                <div mat-dialog-actions class="gap-2 mb-3">
                  @if (bDirty === true) {
                    <button mat-icon-button color="primary" class="bg-slate-200 hover:bg-slate-400 ml-1" (click)="onUpdateJournalEntry()"
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
        </mat-card>
        </mat-drawer>

        <mat-drawer-container class="flex-col h-full">    
        <ng-container>
            @if (funds$ | async; as funds ) {
            <grid-menubar [inTitle]="sTitle" [showNew]=true [showSettings]=false (newRecord)="onAdd()"></grid-menubar>        
            <gl-grid 
               (onUpdateSelection)="onUpdateSelection($event)"
               [data]="funds" 
               [columns]="columns">
            </gl-grid>            
            }
        </ng-container>
        </mat-drawer-container>
`,
    providers: [SortService, PageService, FilterService, ToolbarService, EditService],
})
export class FundsComponent implements OnInit {

    private confirmation = inject(FuseConfirmationService);
    public sTitle = 'Reserve Funds';
    public fundsForm!: FormGroup;
    public formdata: any = {};

    store = inject(Store);    
    notifyFundUpdate = output();    
    bDirty: boolean = false;

    funds$ = this.store.select(selectFunds);
    drawer = viewChild<MatDrawer>('drawer');

    public columns = [
        { field: 'fund', headerText: 'Fund', width: 80, textAlign: 'Left' },
        { field: 'description', headerText: 'Description', width: 200, textAlign: 'Left' },
        { field: 'create_date', headerText: 'Create Date', width: 80, textAlign: 'Left' },
        { field: 'create_user', headerText: 'Create User', width: 80, textAlign: 'Left' }
    ];

    ngOnInit() {
        this.createEmptyForm();
        this.onChanges(); 
        this.store.dispatch(loadFunds());                
    }

    public onChanges(): void {
        this.fundsForm.valueChanges.subscribe((dirty) => {
            if (this.fundsForm.dirty === true) {
                this.bDirty = true;
            }
            else {
                this.bDirty = false;
            }
        });
    }

    public createEmptyForm() {
        this.fundsForm = new FormGroup({
            id: new FormControl(''),
            fund: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required])
        });
    }

    public onAdd() {
        const dDate = new Date();
        const updateDate = dDate.toISOString().split('T')[0];
        const fund = { ...this.fundsForm.value } as IFunds;
        const rawData = {
            fund: fund.fund,
            description: fund.description,
            create_date: updateDate,
            create_user: '@admin',
        } as IFunds;
        
        this.store.dispatch(addFunds({ funds: rawData }));        
        this.bDirty = false;
        this.closeDrawer();
    }

    public onAddNew(e: string) {
        this.createEmptyForm();
        this.openDrawer();
    }

    public onCancel() {
        this.closeDrawer();
    }

    public public() {
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

    public onDelete(e: any) {
        var data = this.fundsForm.value;
        const confirmation = this.confirmation.open({
            title: 'Delete Fund?',
            message: `Are you sure you want to delete the fund: ${data.fund}`,
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
                this.store.dispatch(deleteFunds({ id: data.fund[0] }));
            }
        });
        this.closeDrawer();
    }


    public onUpdateSelection(data: IFunds) {
        // this.store.updateFund(this.fundsForm.value);
        this.bDirty = false;
        this.fundsForm.patchValue({
            id: [data.id],
            fund: [data.fund],
            description: [data.description]
        });

        this.openDrawer();
    }

    public openDrawer() {
        const opened = this.drawer().opened;
        if (opened !== true) {
            this.drawer().toggle();
        } else {
            return;
        }
    }

    public closeDrawer() {
        const opened = this.drawer().opened;
        if (opened === true) {
            this.drawer().toggle();
        } else {
            return;
        }
    }

    public onUpdate() {
        const updateDate = new Date().toISOString().split('T')[0];
        const fund = this.fundsForm.value;
        this.formdata = this.fundsForm.value;
        console.log('rawData', JSON.stringify(this.formdata));
        const rawData = {
            id: fund.id[0],
            fund: fund.fund[0],
            description: fund.description,
            create_date: updateDate,
            create_user: '@admin'
        } as IFunds;
        this.store.dispatch(updateFunds({ funds: rawData }));
        this.bDirty = false;
        this.closeDrawer();
    }
}
