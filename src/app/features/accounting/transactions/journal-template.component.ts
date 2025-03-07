import { Component, inject, OnInit, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GridMenubarStandaloneComponent } from '../grid-components/grid-menubar.component';
import { MaterialModule } from 'app/services/material.module';
import { AggregateService, ColumnMenuService, ContextMenuService, EditEventArgs, EditService, ExcelExportService, FilterService, GridComponent, GridModule, GroupService, PdfExportService, ResizeService, RowDDService, RowDragEventArgs, SearchService, SortService, ToolbarService } from '@syncfusion/ej2-angular-grids';

import { getDetailTemplates, getTemplates } from './state/template/Template.Selector';
import { loadTemplates, loadTemplatesDetails } from './state/template/Template.Action';

import { GLGridComponent } from '../grid-components/gl-grid.component';
import { MatDrawer } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IJournalDetailTemplate, IJournalTemplate } from 'app/models/journals';
import { JournalStore } from 'app/services/journal.store';


const imports = [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    GridMenubarStandaloneComponent,
    GLGridComponent,
    GridModule,
];

@Component({
    selector: 'journal-template',
    imports: [imports],
    template: `
    <mat-drawer class="md:w-4/5 sm:w-full bg-white-100" #drawer [opened]="false" mode="over" [position]="'end'" [disableClose]="false">
        <mat-card elevated-container-elevation="4" class="m-2">
                
                <div class="flex flex-col w-full filter-article filter-interactive text-gray-700 rounded-lg">
                    <div class="text-3xl gap-2 m-1 text-gray-100 p-2 bg-slate-600 rounded-md" mat-dialog-title>
                     {{ "Journal Update" }}
                    </div>
                </div>
            
                <div mat-dialog-content>
                    <form [formGroup]="templateForm" class="flex flex-col sm:flex-row gap-1 overflow-hidden">
                            
                                <!-- Name -->
                                <div class="flex flex-col grow">
                                    <mat-label class="ml-2 text-base"> Name </mat-label>                            
                                    <mat-form-field class="m-1 form-element grow" appearance="outline">
                                        <input matInput placeholder="Name" formControlName="template_name" />
                                    </mat-form-field>
                                </div>
                            
                                <!-- Description -->
                                <div class="flex flex-col grow"> 
                                    <mat-label class="ml-2 text-base">Description</mat-label>
                                    <mat-form-field class="m-1 form-element" appearance="outline">
                                        <input matInput placeholder="Description" formControlName="description" />
                                    </mat-form-field>
                                </div>
                            
                                <!-- Journal Type -->
                                <div class="flex flex-col grow">
                                    <mat-label class="ml-2 text-base">Journal Type</mat-label>
                                    <mat-form-field class="m-1 form-element" appearance="outline">                    
                                        <mat-select class="text-gray-800" placeholder="Journal Type" formControlName="journal_type">
                                        @for (item of TransTypes; track item) {
                                            <mat-option [value]="item.trans_type"> {{ item.trans_type }} - {{item.description}} </mat-option>  }
                                        </mat-select>
                                    </mat-form-field>
                                </div>
                    
                    </form>
                    @if (templateDetailList | async;  as details) {
                    <ng-container >

                                    <div class="text-3xl gap-2 m-1 text-gray-100 p-2 bg-slate-600 rounded-md">
                                        Template Details
                                    </div>
                                
                                    <ejs-grid class="m-1"                                                
                                            [dataSource]="details" 
                                            [allowFiltering]="false" 
                                            [allowPaging]="false"                                            
                                            [gridLines]="'Both'"                                            
                                            [allowRowDragAndDrop]='true'
                                            showColumnMenu='false'
                                            (onRowDrop)="rowDrop($event)"
                                            (actionComplete)="actionComplete($event)"
                                            (actionBegin)="actionBegin($event)"
                                            allowSorting=true>

                                        <e-columns>
                                            <e-column field='journal_subid' headerText='ID'          [visible]='false' isPrimaryKey='true' width='100'></e-column>
                                            <e-column field='child'         headerText='Account'     width='100' ></e-column>
                                            <e-column field='fund'          headerText='Fund'        width='90'></e-column>
                                            <e-column field='sub_type'      headerText='Sub Type'    [visible]='true' width='90'></e-column>
                                            <e-column field='description'   headerText='Description' width='150'></e-column>
                                            <e-column field='reference'     headerText='Reference'   [visible]='true' width=120></e-column>
                                            <e-column field='debit'         headerText='Debit'       textAlign='Right' width='100' format="P"></e-column>
                                            <e-column field='credit'        headerText='Credit'      textAlign='Right' width='100' format="P"></e-column>
                                        </e-columns>

                                        <e-aggregates>
                                            <e-aggregate>
                                                <e-columns>
                                                    <e-column type="Sum" field="debit" format="P">
                                                        <ng-template #footerTemplate let-data>{{data.Sum}}</ng-template>
                                                    </e-column>
                                                    <e-column type="Sum" field="credit" format="P">
                                                        <ng-template #footerTemplate let-data>{{data.Sum}}</ng-template>
                                                    </e-column>
                                                </e-columns>
                                            </e-aggregate>
                                        </e-aggregates>
                                    </ejs-grid>

                                </ng-container>
                    }
                </div>
                                    
                <div mat-dialog-actions>
                        @if (bHeaderDirty == true) {
                                <button mat-icon-button color="primary" class="hover:bg-slate-400 ml-1"
                                            (click)="onUpdate()" matTooltip="Save"
                                            aria-label="hovered over">                                    
                                        <span class="e-icons e-save"></span>
                                </button>
                        }
                        
                        <button mat-icon-button color="primary" 
                                class=" hover:bg-slate-400 ml-1" color="primary" (click)="onAdd()" matTooltip="New" aria-label="hovered over">                        
                                <span class="e-icons e-circle-add"></span>
                        </button>

                        <button mat-icon-button color="primary" 
                                class=" hover:bg-slate-400 ml-1" color="primary" (click)="onDelete($event)" matTooltip="Delete" aria-label="hovered over">                        
                                <span class="e-icons e-trash"></span>
                        </button>

                        <button mat-icon-button color="primary"
                                class=" hover:bg-slate-400 ml-1" color="primary"  (click)="onCancel()" matTooltip="Close"
                                aria-label="hovered over">
                                <span class="e-icons e-circle-close"></span>
                        </button>
                        
                </div>
            
        </mat-card>
    </mat-drawer>
    <mat-drawer-container class="flex-col">
    <div class="sm:hide md:visible">
    <grid-menubar class="pl-5 pr-5" 
        [inTitle]="'Journal Booking Rules'" 
        (notifyParentRefresh)="onRefresh()"
        (notifyParentAdd)="onAdd()" 
        (notifyParentDelete)="onDeleteSelection()"
        (notifyParentUpdate)="onUpdateSelection($event)">
    </grid-menubar>
    </div>
        <div class="flex flex-col min-w-0 overflow-y-auto -px-10" cdkScrollable>
            <div class="flex-auto">
                <div class="h-full border-gray-300 rounded-2xl">                                      
                <div  class="flex flex-1 flex-col" height="400px">   
                    @if (templateList$ | async;  as templates) {        
                        <gl-grid  (onUpdateSelection)="onUpdateSelection($event)"  [data]="templates"  [columns]="columns"></gl-grid>    
                    }
                </div> 
            </div>
        </div>
    </div>
    </mat-drawer-container>
    `,
    providers: [
            PdfExportService, 
            ExcelExportService, 
            SortService,
            FilterService,
            ToolbarService,
            EditService,
            RowDDService,
            SearchService,
            AggregateService,
            GroupService,
            RowDDService,
            ResizeService,
            ContextMenuService,
            JournalStore,
            ColumnMenuService]
})

export class JournalTemplateComponent implements OnInit {
    
    //private accountService = inject(AccountsService);
    public Store = inject(JournalStore);
    public gridControl = viewChild<GridComponent>("grid");

    drawer = viewChild<MatDrawer>('drawer');
    store = inject(Store);
    fb = inject(FormBuilder);

    // public accounts$ = this.accountService.readChildren(); // retrieves only the child accounts which can be used for booking
    public templateForm!: FormGroup;
    public selectedItemKeys: any[] = [];
    public currentDate: string;
    public journal_details: any[];
    public bOpenDetail: boolean = false;
    public bHeaderDirty: boolean = false;
    readonly allowedPageSizes = [10, 20, 'all'];
    public currentRowData: any;

    readonly displayModes = [{ text: "Display Mode 'compact'", value: 'compact' }];
    public displayMode = 'compact';
    public showPageSizeSelector = true;
    public showInfo = true;
    public showNavButtons = true;
    public formatoptions: Object;
    public template_list: any;

    drawOpen: 'open' | 'close' = 'open';

    customizeTooltip = (pointsInfo: { originalValue: string; }) => ({ text: `${parseInt(pointsInfo.originalValue)}%` });

    public TransTypes = [
        { trans_type: 'GL', description: 'General Ledger' },
        { trans_type: 'AP', description: 'Accounts Payable' },
        { trans_type: 'AR', description: 'Accounts Receivable' },
        { trans_type: 'INV', description: 'Inventory' },
        { trans_type: 'AST', description: 'Assets' },
    ];

    keyField: any;
    templateList$ = this.store.select(getTemplates);
    templateDetailList: Observable <IJournalDetailTemplate[]>;

    columns = [
        { field: 'template_ref',  headerText: 'Ref', width: 100, visible: false, textAlign: 'Left', isPrimaryKey: true },
        { field: 'journal_no',    headerText: 'Original Journal', visible: false, width: 100, textAlign: 'Left' },
        { field: 'template_name', headerText: 'Name', width: 100, textAlign: 'Left' },
        { field: 'description',   headerText: 'Description', width: 400, textAlign: 'Left' },
        { field: 'journal_type',  headerText: 'Journal Type', width: 80, textAlign: 'Left' },
        { field: 'create_date',   headerText: 'Date', width: 100, textAlign: 'Left' },
        { field: 'create_user',   headerText: 'User', width: 100, textAlign: 'Left' },

    ];


    public actionBegin(args: EditEventArgs): void {
            if (args.requestType === "beginEdit" || args.requestType === "add") {
                const data = args.rowData as IJournalTemplate;
            }
            if (args.requestType === "save") {
                
            }
    }
    
    ngOnInit() {
            this.createEmptyForm();
            this.store.dispatch(loadTemplates());
            this.currentDate = new Date().toISOString().split('T')[0];
            this.formatoptions = { type: 'dateTime', format: 'M/dd/yyyy' }
            
            this.templateForm.valueChanges.subscribe((value) => {
                this.bHeaderDirty = true;            
            });   
            this.bHeaderDirty = false;         
    }
        

    onChangeType(e: any) {
        console.debug('onChangeType')
        this.bHeaderDirty = true;
    }
    
    
    public actionComplete(args: any): void {
            console.debug("args : ", args.requestType);
            if (args.requestType === "beginEdit" || args.requestType === "add") {
                    if (args.requestType === "beginEdit") {
                } else if 
                    (args.requestType === "add") {
                }
            }
     }
    
    public rowDrag(args: RowDragEventArgs): void {
    
            (args.rows as Element[]).forEach((row: Element) => {
                row.classList.add("drag-limit");
            });
        }
    
    public rowDrop(args: RowDragEventArgs): void {
    
        const value = [];
        for (let r = 0; r < (args.rows as Element[]).length; r++) {
                value.push((args.fromIndex as number) + r);
            }
        this.gridControl().reorderRows(value, args.dropIndex as number);
            // this.onSaved(args.data[0]);
    }
    

    public onUpdateSelection(e: any) {

        const selectedRow = {
            template_ref: e.template_ref,
            journal_no: e.journal_no,
            template_name: e.template_name,
            description: e.description,
            journal_type: e.journal_type,
            create_date: e.create_date,
            create_user: e.create_user
        } as IJournalTemplate;
        
        this.templateForm.patchValue(selectedRow);            
        this.store.dispatch(loadTemplatesDetails({ ref: e.journal_no }));
        this.templateDetailList = this.store.select(getDetailTemplates);
        this.drawer().toggle();
    }

    createEmptyForm() {
        this.templateForm = this.fb.group({            
            template_ref:  ['', Validators.required],
            journal_no:    ['', Validators.required],
            template_name: ['', Validators.required],
            description:   ['', Validators.required],
            journal_type:  ['', Validators.required],
            create_date:   ['', Validators.required],
            create_user:   ['', Validators.required],            
        });
        this.bHeaderDirty= false;        
    }

    public loadTemplateDetailsFromTemplate(value: string) {
        // this.transactionType = value.journal_type;
        this.Store.loadTemplateDetails(value);
    }


    
    onCellDoubleClicked(e: any) {
        this.bOpenDetail = true;
        // this.openDrawer();
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

    
    onDelete(e: any) {
        console.debug('onDelete')
    }

    onUpdate($event: any) {
        console.debug('onUpdate')
    }

    onBooked(booked: boolean) {
        this.templateForm.patchValue({ booked: booked });
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
