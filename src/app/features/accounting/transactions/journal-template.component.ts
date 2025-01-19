import { Component, inject, OnInit, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountsService } from 'app/services/accounts.service';
import { GridMenubarStandaloneComponent } from '../grid-components/grid-menubar.component';
import { MaterialModule } from 'app/services/material.module';
import { ExcelExportService, PdfExportService } from '@syncfusion/ej2-angular-grids';
import { getTemplates } from 'app/state/template/Template.Selector';
import { loadTemplates } from 'app/state/template/Template.Action';
import { GLGridComponent } from '../grid-components/gl-grid.component';
import { MatDrawer } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';


const imports = [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    GridMenubarStandaloneComponent,
    GLGridComponent
];

@Component({
    selector: 'journal-template',
    imports: [imports],
    template: `
        <mat-drawer class="lg:w-[400px] md:w-full bg-white-100" #drawer [opened]="false" mode="over" [position]="'end'"
        [disableClose]="false">
        <div class="flex flex-col w-full text-gray-700 max-w-140 filter-article filter-interactive">
            <div class="h-10 pt-2 text-2xl text-justify text-black bg-slate-100" mat-dialog-title>
                Template Update
            </div>
            <div mat-dialog-content>
                <form [formGroup]="templateForm" class="flex flex-col">

                    <div class="flex flex-col m-1">
                        
                        <div class="flex flex-col grow">
                            <mat-label class="ml-2 text-base"> Name </mat-label>
                            <mat-form-field class="m-1 form-element grow" appearance="outline">
                                <input matInput placeholder="Name" formControlName="template_name" />
                            </mat-form-field>
                        </div>
                        
                        <div class="flex flex-col grow">
                            <mat-label class="ml-2 text-base">Description</mat-label>
                            <mat-form-field class="m-1 form-element" appearance="outline">
                                <input matInput placeholder="Description" formControlName="description" />
                            </mat-form-field>
                        </div>

                        <div class="flex flex-col grow">
                            <mat-label class="ml-2 text-base">Journal Type</mat-label>
                            <mat-form-field class="m-1 form-element" appearance="outline">
                                <input matInput placeholder="Journal Type" formControlName="journal_type" />
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
    </mat-drawer>
    <mat-drawer-container class="flex-col">
    <div class="sm:hide md:visible">
    <grid-menubar class="pl-5 pr-5" 
        [inTitle]="'Journal Booking Rules'" 
        (notifyParentRefresh)="onRefresh()"
        (notifyParentAdd)="onAdd()" 
        (notifyParentDelete)="onDeleteSelection()"
        (notifyParentUpdate)="onUpdateSelection()">
    </grid-menubar>
    </div>

    <div class="flex flex-col min-w-0 overflow-y-auto -px-10" cdkScrollable>
        <div class="flex-auto">
            <div class="h-full border-gray-300 rounded-2xl">                                      
            <div  class="flex flex-1 flex-col">   
                @if (detailsList | async;  as List) {        
                <gl-grid 
                (onUpdateSelection)="onUpdateSelection($event)"
                [data]="List" 
                [columns]="columns">
                </gl-grid>    
                }
            </div> 
        </div>
    </div>
    </div>
    </mat-drawer-container>
    `,
    providers: [PdfExportService, ExcelExportService]
})

export class JournalTemplateComponent implements OnInit {
    
    private accountService = inject(AccountsService);
    
    drawer = viewChild<MatDrawer>('drawer');

    // templateStore = inject(TemplateStore);
    store = inject(Store);
    fb = inject(FormBuilder);
    // templateStore = inject(TemplateStore);
    accounts$ = this.accountService.readChildren(); // retrieves only the child accounts which can be used for booking
    templateForm!: FormGroup;
    selectedItemKeys: any[] = [];
    public currentDate: string;
    public journal_details: any[];
    public bOpenDetail: boolean = false;
    readonly allowedPageSizes = [10, 20, 'all'];
    currentRowData: any;

    readonly displayModes = [{ text: "Display Mode 'compact'", value: 'compact' }];
    displayMode = 'compact';
    showPageSizeSelector = true;
    showInfo = true;
    showNavButtons = true;
    public formatoptions: Object;
    public template_list: any;

    drawOpen: 'open' | 'close' = 'open';

    customizeTooltip = (pointsInfo: { originalValue: string; }) => ({ text: `${parseInt(pointsInfo.originalValue)}%` });
    journalForm!: FormGroup;
    keyField: any;
    detailsList: any

    columns = [
        { field: 'template_ref', headerText: 'Ref', width: 100, visible: false, textAlign: 'Left', isPrimaryKey: true },
        { field: 'journal_no', headerText: 'Original Journal', visible: false, width: 100, textAlign: 'Left' },
        { field: 'template_name', headerText: 'Name', width: 100, textAlign: 'Left' },
        { field: 'description', headerText: 'Description', width: 100, textAlign: 'Left' },
        { field: 'journal_type', headerText: 'Journal Type', width: 100, textAlign: 'Left' },
        { field: 'create_date', headerText: 'Date', width: 100, textAlign: 'Left' },
        { field: 'create_user', headerText: 'User', width: 100, textAlign: 'Left' },

    ];

    bDirty: boolean = false;

    ngOnInit() {
        this.store.dispatch(loadTemplates());
        this.detailsList = this.store.select(getTemplates);
        const dDate = new Date();
        this.currentDate = dDate.toISOString().split('T')[0];
        this.formatoptions = { type: 'dateTime', format: 'M/dd/yyyy' }
        this.createEmptyForm();
    }

    createEmptyForm() {
        this.templateForm = this.fb.group({
            template_ref: [''],
            template_name: [''],
            description: [''],
            journal_type: [''],
            create_date: [''],
            create_user: [''],
        });
    }

    onCellDoubleClicked(e: any) {
        this.bOpenDetail = true;
        // this.openDrawer();
    }

    changeType(e) {
        console.debug('changeType ', JSON.stringify(e));
    }

    changeSubType(e) {
        console.debug('changeType ', JSON.stringify(e));
    }


    changeFund(e) {
        console.debug('changeType ', JSON.stringify(e));
    }

    changeChildAccount(e) {
        console.debug('changeType ', JSON.stringify(e));
    }


    onAdd() {
        this.bOpenDetail = true;
        // this.openDrawer()
    }

    onRefresh() {
        console.debug('Refresh')
    }

    onCancel() {
        this.drawer().toggle();
    }

    onDeleteSelection() {
        console.debug('Delete Selection')
    }

    onUpdateSelection() {
        this.drawer().toggle();
    }

    onDelete(e: any) {
        console.debug('onDelete')
    }

    onUpdate($event: any) {
        console.debug('onUpdate')
    }

    onBooked(booked: boolean) {
        this.journalForm.patchValue({ booked: booked });
    }

    formatNumber(e) {
        const options = {
            style: 'decimal',  // Other options: 'currency', 'percent', etc.
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        };
        const formattedWithOptions = e.value.toLocaleString('en-US', options);
        return formattedWithOptions;
    }

    onCreate() {
        // this.openDrawer();
    }


    selectionChanged(data: any) {
        console.debug(`selectionChanged ${JSON.stringify(data.data)}`);
        this.selectedItemKeys = data.selectedRowKeys;
    }

    onEdit() {
        this.bOpenDetail = true;
        // this.refresh(this.hJournal, this.description, this.transaction_date);
        // this.openDrawer();
    }


    onFocusedDetailRowChanged(e: any) {

        this.currentRowData = e.row.data;
    }

    onFocusedRowChanged(e: any) {
        console.debug('onFocusRowChanged :', JSON.stringify(e.row.data))
    }

    // openDrawer() {
    //     const opened = this.drawer.opened;
    //     if (opened !== true) {
    //         this.drawer.toggle();
    //     } else {
    //         return;
    //     }
    // }

    // closeDrawer() {
    //     this.bOpenDetail = true;
    //     const opened = this.drawer.opened;
    //     if (opened === true) {
    //         this.drawer.toggle();
    //     } else {
    //         return;
    //     }
    // }

}
