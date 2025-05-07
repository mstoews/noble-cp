import { Component, OnInit, inject, viewChild, output, HostListener } from '@angular/core';
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
import { MaterialModule } from 'app/shared/material.module';
import { EditService, FilterService, GridComponent, GridModule, PageService, SortService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { GLGridComponent } from "../../grid-components/gl-grid.component";

import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-navigations';
import { IFunds } from 'app/models';
import { FundsStore } from 'app/store/funds.store';


const imports = [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    GridModule,
    GridMenubarStandaloneComponent,
    GLGridComponent
];

@Component({
    selector: 'funds',
    imports: [imports],
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
                                    <mat-label class="ml-2 text-base text-gray-800 dark:text-gray-200">Fund</mat-label>
                                    <input matInput placeholder="Fund" formControlName="fund"/>
                                    <mat-icon class="icon-size-5" matPrefix [svgIcon]="'heroicons_solid:document-check'"></mat-icon>
                                </mat-form-field>
                            </div> 
                            
                            <div class="flex flex-col grow">
                                <mat-form-field class="mt-1 ml-1 mr-1 flex-start">
                                    <mat-label class="ml-2 text-base text-gray-800 dark:text-gray-200">Description</mat-label>
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
                    <button mat-icon-button color="primary" class="bg-slate-200 hover:bg-slate-400 ml-1" (click)="onUpdate()"
                      matTooltip="Save" aria-label="hovered over">
                      <span class="e-icons e-save"></span>
                    </button>
                    }

                    @if (bDirty === false) {
                        <button mat-icon-button color="primary" 
                            class=" hover:bg-slate-400 ml-1" (click)="onAdd()" matTooltip="New" aria-label="hovered over">                        
                        <span class="e-icons e-circle-add"></span>
                        </button>
                    }

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
            <!-- @if (funds$ | async; as funds ) { -->
             @if (fundStore.isLoading() === false) {
            <grid-menubar [showPeriod]="false"   [inTitle]="sTitle" [showNew]=true [showSettings]=false (new)="onAddNew()"></grid-menubar>        
            <gl-grid 
               (onUpdateSelection)="onSelection($event)"
               [data]="fundStore.funds()" 
               [columns]="columns">
            </gl-grid>            
            }
        </ng-container>
        </mat-drawer-container>
    `,
    providers: [
        SortService,
        PageService,
        FilterService,
        ToolbarService,
        EditService        
    ],
})
export class FundsComponent implements OnInit {

    private confirmation = inject(FuseConfirmationService);
    public sTitle = 'Reserve Funds';
    public fundsForm!: FormGroup;
    public formdata: any = {};
    public drawer = viewChild<MatDrawer>('drawer');

    grid = viewChild<GridComponent>('grid');

    fundStore = inject(FundsStore);

    notifyFundUpdate = output();
    bDirty: boolean = false;
    // funds$ = this.fundStore.selected;

    public columns = [
        { field: 'id', headerText: 'id', visible: false, isPrimaryKey: true,   width: 80, textAlign: 'Left' },
        { field: 'fund', headerText: 'Fund', width: 80, textAlign: 'Left' },
        { field: 'description', headerText: 'Description', width: 200, textAlign: 'Left' },
        { field: 'create_date', headerText: 'Create Date', width: 80, textAlign: 'Left' },
        { field: 'create_user', headerText: 'Create User', width: 80, textAlign: 'Left' }
    ];


    ngOnInit() {
        this.createEmptyForm();
        this.onChanges();
    }


    onSelection(data: IFunds) {
        const dDate = new Date();
        const updateDate = dDate.toISOString().split('T')[0];
        this.bDirty = false;
        this.fundsForm.patchValue({
            id: [data.id],
            fund: [data.fund],
            description: [data.description]
        });
        this.openDrawer();
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
            description: fund.description            
        } as IFunds;

        this.fundStore.addFund(rawData);
        this.bDirty = false;
        this.closeDrawer();
    }

    public onAddNew() {
        this.createEmptyForm();
        this.openDrawer();        
    }

    public onCancel() {
        this.closeDrawer();
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
                this.fundStore.removeFund(data.fund);
            }
        });
        this.closeDrawer();
    }


    public onUpdateSelection(data: IFunds) {
        // 
        const dDate = new Date();
        const updateDate = dDate.toISOString().split('T')[0];
        this.bDirty = false;

        const rawData = {
            fund: data.fund,
            description: data.description,
            create_date: updateDate,
            create_user: '@admin',
        } as IFunds;

        this.openDrawer();
    }


    public onUpdate() {
        const updateDate = new Date().toISOString().split('T')[0];
        const fund = this.fundsForm.value;
        const rawData = {            
            fund: fund.fund,
            description: fund.description,            
        } as IFunds;

        this.fundStore.updateFund(rawData);
        this.bDirty = false;
        this.closeDrawer();
    }

    public menuItems: MenuItemModel[] = [
        {
            id: 'Edit',
            text: 'Update Account',
            iconCss: 'e-icons e-edit-2'
        },
        {
            id: 'Create',
            text: 'Create Account',
            iconCss: 'e-icons e-circle-add'
        },
        {
            id: 'Copy',
            text: 'Clone Account',
            iconCss: 'e-icons e-copy'
        },
        {
            id: 'Delete',
            text: 'Deactivate Account',
            iconCss: 'e-icons e-delete-1'
        },
        {
            separator: true
        },
        {
            id: 'Settings',
            text: 'Settings',
            iconCss: 'e-icons e-settings'
        },

    ];

    public itemSelect(args: MenuEventArgs): void {

        switch (args.item.id) {
            case 'Edit':
                //this.onSelection("");
                break;
            case 'Create':
                this.onAdd();
                break;
            case 'Clone':
                this.onClone("");
                break;
            case 'Delete':
                //this.onDelete("");
                break;
            case 'Settings':
                //this.onOpenSettings();
                break;
        }
    }
    public onClone(arg0: string) {

    }

    @HostListener("window:exit")
    public exit() {
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
            return;
        }
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


    

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.adjustHeight();
    }

    ngAfterViewInit() {
        this.adjustHeight();
    }

    adjustHeight() {
        if (this.grid()) {
            this.grid().height = (window.innerHeight - 450) + 'px'; // Adjust as needed
        }
    }

}
