import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, HostListener, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, inject, signal, viewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ReplaySubject, Subject, Subscription, take, takeUntil, timeout } from "rxjs";
import { CommonModule } from "@angular/common";
import { DndComponent } from "app/features/drag-n-drop/loaddnd/dnd.component";
import { GridMenubarStandaloneComponent } from "../grid-components/grid-menubar.component";

import { MatDialog } from "@angular/material/dialog";
import { NgxMaskDirective, provideNgxMask } from "ngx-mask";
import { FuseConfirmationService } from "@fuse/services/confirmation";

import { DropDownListAllModule } from "@syncfusion/ej2-angular-dropdowns";
import { AUTH } from "app/app.config";
import { MatSelect } from "@angular/material/select";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { IDropDown, IDropDownAccounts, IDropDownAccountsGridList, IFunds, IJournalParams } from "app/models";
import * as fromFunds from "app/features/accounting/static/funds/Funds.Selector";

import {
    ContextMenuComponent,
    ContextMenuModule,
    MenuEventArgs,
    MenuItemModel,
} from "@syncfusion/ej2-angular-navigations";

import {
    AggregateService,
    EditService,
    FilterService,
    GridModule,
    RowDDService,
    SaveEventArgs,
    RowDragEventArgs,
    SortService,
    ToolbarService,
    GridComponent,
    DialogEditEventArgs,
    SearchService,
    RowSelectEventArgs,
    GroupService,
    ColumnMenuService,
    ResizeService,
    ContextMenuService,
} from "@syncfusion/ej2-angular-grids";

import {
    Detail,
    IJournalTransactions,
    IJournalDetail,
    IJournalDetailTemplate,
    IJournalDetailUpdate,
    IJournalHeader,
    IJournalTemplate,
    IArtifacts,
    ITemplateParams,
} from "app/models/journals";

import { Router, ActivatedRoute, NavigationStart } from "@angular/router";
import { Location } from "@angular/common";
import { MatDrawer } from "@angular/material/sidenav";

import { Splitter, SplitterComponent, SplitterModule } from '@syncfusion/ej2-angular-layouts';
import { EvidenceCardComponent } from "app/features/file-manager/file-manager-card/evidence-card.component";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { IParty } from "../../../models/party";
import { ISubType } from "app/models/subtypes";
import { ToastrService } from "ngx-toastr";

import { accountsFeature } from "../static/accts/Accts.state";
import { accountPageActions } from "../static/accts/Accts-page.actions";
import { DropDownAccountComponent } from "../grid-components/drop-down-account.component";
import { Store } from '@ngrx/store';
import { FundsActions } from "../static/funds/Funds.Action";
import { subtypeFeature } from "../static/subtype/sub-type.state";
import { SubtypeDropDownComponent } from "../grid-components/drop-down.subtype.component";
import { MaterialModule } from "app/shared/material.module";
import { TemplateStore } from "app/store/template.store";
import { SubTypeService } from "app/services/subtype.service";


const imp = [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    GridMenubarStandaloneComponent,
    NgxMaskDirective,
    NgxMatSelectSearchModule,
    ContextMenuModule,
    GridModule,
    DropDownListAllModule,
    SplitterModule,
    DropDownAccountComponent,
    SubtypeDropDownComponent,
];

@Component({
    template: `
    <div id="target" class="flex flex-col w-full filter-article filter-interactive text-gray-700 ">
    <div class="sm:hide md:visible ml-5 mr-5">
        <grid-menubar 
            class="pl-5 pr-5"            
            [showBack]="false" 
            [showClone]="true"            
            [showNew]="true"
            [showPrint]="false"
            [showExportXL]="false"
            [showExportPDF]="false"
            [showExportCSV]="false"

            (back)="onBack()"  
            (clone)="onClone('GL')"           
            [inTitle]="'Template Management'" >
        </grid-menubar>
    </div>

    <mat-drawer class="w-full md:w-[450px] bg-transparent" #drawer [opened]="false" mode="over" [position]="'end'" [disableClose]="true">
        <mat-card class="m-2">
            <form [formGroup]="detailForm">
                <div
                    class="flex flex-col w-full filter-article filter-interactive text-gray-700 rounded-lg">
                    <div class="text-3xl gap-2 m-1 text-gray-100 p-2 bg-slate-600 rounded-md"
                        mat-dialog-title>
                        {{ "Journal Update" }}
                    </div>
                </div>
                <section class="flex flex-col gap-1">
                    <!-- Drop down accounts list -->                                        
                    @if ((isLoading$ | async) === false) {
                        @if ( accounts$ | async; as accounts) {
                            <account-drop-down [dropdownList]="accounts" controlKey="account" label="Account" #accountDropDown></account-drop-down>
                        }
                    }
                        
                    <!-- Sub Type  -->                                                            
                    @if (subtype$ | async; as subtypes) {
                        <subtype-drop-down [dropdownList]="subtypes" controlKey="subtype" label="Account Sub Type" #subtypeDropDown></subtype-drop-down>
                    }                    
                                                            
                    <!-- Funds -->
                    @if (funds$ | async; as funds) {
                    <mat-form-field class="flex-col ml-2 mr-2 mt-1 grow ">
                        <mat-label class="text-md ml-2">Funds</mat-label>
                        <mat-select class="text-gray-800 dark:text-gray-100" placeholder="Fund" formControlName="fund">
                            @for (item of store.funds(); track item) {
                            <mat-option [value]="item.fund"> {{ item.fund }} - {{ item.description }}
                            </mat-option>
                            }
                        </mat-select>
                        <mat-icon class="icon-size-5 text-lime-700" matSuffix
                            [svgIcon]="'heroicons_solid:briefcase'"></mat-icon>
                    </mat-form-field>
                    } 
                    <!-- Description  -->

                    <mat-form-field class="flex-col ml-2 mr-2 mt-1 grow">
                        <mat-label class="text-md ml-2">Description</mat-label>
                        <input matInput placeholder="Description" formControlName="description" [placeholder]="'Description'" />
                        <mat-icon class="icon-size-5 text-lime-700" matSuffix [svgIcon]="'heroicons_solid:calculator'"></mat-icon>
                    </mat-form-field>
                    

                </section>

                <section class="flex flex-col md:flex-row gap-2 mt-1">
                    <!-- Debit  -->
                    <mat-form-field class="ml-2 mt-1 grow">
                        <mat-label class="text-md ml-2">Debits</mat-label>
                        <input type="text"  mask="separator.2"
                            [leadZero]="true" thousandSeparator="," class="text-right" matInput
                            [placeholder]="'Debit'" formControlName="debit" />
                        <mat-icon class="icon-size-5 text-lime-700" matPrefix
                            [svgIcon]="'heroicons_solid:currency-dollar'"></mat-icon>
                    </mat-form-field>

                    <!-- Credit  -->
                    <mat-form-field class="grow mr-2 mt-1">
                        <mat-label class="text-md ml-2">Credits</mat-label>
                        <input type="text"  mask="separator.2"
                            [leadZero]="true" thousandSeparator="," class="text-right" matInput
                            [placeholder]="'Credit'" formControlName="credit" />
                        <mat-icon class="icon-size-5 text-lime-700" matPrefix
                            [svgIcon]="'heroicons_solid:currency-dollar'"></mat-icon>
                    </mat-form-field>
                </section>
            </form>
            <div mat-dialog-actions class="gap-2 mb-3 mt-5">
                @if (bDetailDirty === true) {
                    <button mat-icon-button color="primary" class="bg-gray-200 fill-slate-100 hover:bg-slate-400 ml-1"
                        (click)="onUpdateJournalDetail()" matTooltip="Update Line Item"
                        aria-label="hover over">
                        <mat-icon [svgIcon]="'feather:save'"></mat-icon>
                    </button>
                }

                <button mat-icon-button color="primary" class="bg-slate-200 hover:bg-slate-400 ml-1"
                    (click)="onNewLineItem()" matTooltip="Add New Entry" aria-label="hovered over">
                    <span class="e-icons e-circle-add"></span>
                </button>                                

                <button mat-icon-button color="primary"
                    class="bg-gray-200 fill-slate-100 hover:bg-slate-400 ml-1"
                    (click)="onDeleteDetail()" matTooltip="Remove Current Line" aria-label="hover over">
                    <span class="e-icons e-circle-remove"></span>
                </button>

                <button mat-icon-button color="primary"
                    class="bg-gray-200 fill-slate-100  hover:bg-slate-400 ml-1" (click)="closeDrawer()"
                    matTooltip="Close Edit" aria-label="hovered over">                                    
                    <span class="e-icons e-chevron-left"></span>
                </button>

            </div>

        </mat-card>
    </mat-drawer>

    @defer (on viewport; on timer(200ms)) {
    <mat-drawer-container id="target" class="control-section default-splitter flex flex-col  h-[calc(100vh-14rem)] ml-5 mr-5 overview-hidden " [hasBackdrop]="'false'">
            <section class="pane1 overflow-hidden">
                
                <ejs-splitter #splitterInstance id="nested-splitter" class="h-[calc(100vh-24rem)]" separatorSize=3 width='100%'>
                    <e-panes>
                        <e-pane min='60px' size='30%' class="w-72">                                        
                            <ng-template #content>
                                <div class="text-3xl gap-2 m-1 text-gray-100 p-2 bg-slate-600 rounded-md">
                                            Template List
                                </div>
                                    <mat-card class="mat-elevation-z8 h-[calc(100vh-14.2rem)] m-2">                                        
                                        <ejs-grid id="grid-journal-list" 
                                            [dataSource]='store.tmp()'
                                            [selectionSettings]="selectionOptions" 
                                            [allowEditing]='false'
                                            [allowSorting]='true'
                                            [sortSettings]='initialSort'  
                                            [searchSetting]="searchOptions" 
                                            [allowFiltering]='false' 
                                            [rowHeight]="30"
                                            [showColumnMenu]='false'                
                                            [enableStickyHeader]=true 
                                            [toolbar]='toolbarOptions' 
                                            [allowSorting]='true'                                            
                                            (rowSelected)="onRowSelected($event)"
                                            [gridLines]="'Both'">
                                            <e-columns>
                                            <e-column field='template_ref'  headerText='ID' [visible]='true' isPrimaryKey='true' width='70'></e-column>
                                            <!-- <e-column field='template_name'  headerText='Name' [visible]='true' isPrimaryKey='true' width='100'></e-column> -->
                                            <e-column field="journal_type" headerText="Type"   [visible]='true' width="80" dataType="text" textAlign="Center">
                                                <ng-template #template let-data>                       
                                                    @if(data.journal_type === 'GL') {
                                                        <div>                                                        
                                                            <span class="text-gray-300 bg-green-700 p-1 rounded-xl">{{data.journal_type}}</span> 
                                                        </div>
                                                    } 
                                                    @else if (data.journal_type === 'AP'){
                                                        <div>                                                        
                                                            <span class="text-gray-300 bg-blue-800 p-1 rounded-xl">{{data.journal_type}}</span> 
                                                        </div>
                                                    }   
                                                    @else if (data.journal_type === 'AR'){
                                                        <div>                                                        
                                                            <span class="text-gray-300 bg-purple-800 p-1 rounded-xl">{{data.journal_type}}</span> 
                                                        </div>
                                                    }
                                                </ng-template>    
                                                </e-column>                                                
                                                <e-column field='description' headerText='Journal Description'   [visible]='true'></e-column>                                            
                                            </e-columns>
                                        </ejs-grid>
                                    </mat-card>
                                
                            </ng-template>
                        </e-pane>
                        <e-pane>
                        <ng-template #content>
                            <div id='vertical_splitter' class="vertical_splitter overflow-hidden">                                    
                                    
                                    <div class="text-3xl gap-2 m-1 text-gray-100 p-2 bg-slate-600 rounded-md">
                                        Template Editing
                                    </div>
                                    
                                    <form [formGroup]="templateHeaderForm">
                                        <section class="flex flex-col md:flex-row">                                                    
                                                <div class="flex flex-col w-40 grow">
                                                    <mat-form-field class="mt-1 ml-1 mr-1 flex-start " >
                                                        <mat-label class="text-xl ml-2">Name</mat-label>
                                                        <input matInput placeholder="Template Name" formControlName="template_name" />
                                                        <mat-icon class="icon-size-5" matPrefix [svgIcon]="'heroicons_solid:document'"></mat-icon>
                                                    </mat-form-field>
                                                </div>                                                    
                                                <div class="flex flex-col w-40 grow">
                                                    <mat-form-field class="mt-1 ml-1 mr-1 flex-start " >
                                                        <mat-label class="text-xl ml-2">Description</mat-label>
                                                        <input matInput placeholder="Description" formControlName="description" />
                                                        <mat-icon class="icon-size-5" matPrefix [svgIcon]="'heroicons_solid:document'"></mat-icon>
                                                    </mat-form-field>
                                                </div>                                                    
                                                <div class="flex flex-col w-40 grow">
                                                    <mat-form-field class="mt-1 ml-1 mr-1 flex-start " >
                                                        <mat-label class="text-xl ml-2">Transaction Type</mat-label>
                                                        <input matInput placeholder="Type" formControlName="journal_type" />
                                                        <mat-icon class="icon-size-5" matPrefix [svgIcon]="'heroicons_solid:document'"></mat-icon>
                                                    </mat-form-field>
                                                </div>                                                    
                                                                                                                                                        
                                        </section>                                                                                                    
                                    </form>
                                    <div mat-dialog-actions class="gap-2 mb-3">
                                        @if (bHeaderDirty === true) {                                                
                                            <button mat-icon-button color="primary"
                                                class="bg-slate-200 hover:bg-slate-400 ml-1"
                                                (click)="onUpdateJournalHeader($event)" matTooltip="Save Transaction"
                                                aria-label="hovered over">
                                                <span class="e-icons e-save"></span>
                                            </button>
                                        }
                                        
                                        <button mat-icon-button color="primary"
                                            class="bg-gray-200 hover:bg-slate-400 ml-1" 
                                            (click)="onDelete($event)" matTooltip="Cancel Transaction"
                                            aria-label="hovered over">
                                            <mat-icon [svgIcon]="'feather:trash-2'"></mat-icon>
                                        </button>

                                    </div>
                                    @defer () {

                                    <div id="target" class="flex flex-col">
                                        <div class="text-3xl m-1 text-gray-100 p-2 bg-slate-600 rounded-md">Details</div>
                                        <div class="flex flex-col h-full ml-1 mr-1 text-gray-800">
                                            <ejs-grid class="m-1" 
                                                [dataSource]="store.tmp_details()" 
                                                [allowFiltering]="false" 
                                                [gridLines]="'Both'"
                                                [allowColumnMenu]="false"
                                                [allowSorting]='true'
                                                [sortSettings]= 'detailSort'
                                                [editSettings]='editSettings' 
                                                [allowRowDragAndDrop]='true'
                                                [showColumnMenu]='false' 
                                                (actionBegin)="detailRowDoubleClick($event)"
                                                allowSorting=true>
                                                <e-columns>
                                                    <e-column field='child'       headerText='Acct' [visible]='true'  width='50'></e-column>
                                                    <e-column field='description' headerText='Desc' [visible]='true'  width='100'></e-column>
                                                    <e-column field='sub_type'     headerText='Type' [visible]='true'  width='50'></e-column>
                                                    <e-column field='fund'        headerText='Fund' [visible]='true'     width='100'></e-column>
                                                    <e-column field='debit'       headerText='Debit %' [visible]='true' textAlign='Right' format='p2' width='60'></e-column>
                                                    <e-column field='credit'      headerText='Credit %' [visible]='true' textAlign='Right' format='p2' width='60'></e-column>                                                                                                            
                                                </e-columns>
                                                <e-aggregates>
                                                    <e-aggregate>
                                                        <e-columns>
                                                            <e-column type="Sum" field="debit" textAlign='Right' format='p2'>
                                                                <ng-template #footerTemplate 
                                                                    let-data>{{data.Sum}}</ng-template>
                                                            </e-column>
                                                            <e-column type="Sum" field="credit"  textAlign='Right' format='p2'>
                                                                <ng-template #footerTemplate
                                                                    let-data>{{data.Sum}}</ng-template>
                                                            </e-column>
                                                        </e-columns>
                                                    </e-aggregate>
                                                </e-aggregates>
                                            </ejs-grid>
                                        </div>
                                    </div>
                                    }
                                    <!-- Context Menu -->                                    
                                    @placeholder (minimum 200ms) {
                                    <div class="flex justify-center">
                                        <div>
                                            <mat-progress-spinner diameter="60" [value]="value"
                                                mode="indeterminate">
                                            </mat-progress-spinner>
                                        </div>
                                    </div>
                                    } @loading (minimum 200ms) {
                                    <div class="flex justify-center">
                                        <div>
                                            <mat-progress-spinner diameter="60" [value]="value"
                                                mode="indeterminate">
                                            </mat-progress-spinner>
                                        </div>
                                    </div>
                                    }                                
                        </div>
                        </ng-template>                        
                        </e-pane>
                    </e-panes>
                </ejs-splitter>
            </section>
        </mat-drawer-container>
    }
    @placeholder(minimum 200ms) {
    <div class="flex justify-center items-center">
        <mat-spinner></mat-spinner>
    </div>
    }    

    <ejs-contextmenu 
      #contextmenu id='contextmenu'             
      target='#target' 
      (select)="itemSelect($event)"
      [animationSettings]='animation'
      [items]= 'menuItems'> 
    </ejs-contextmenu> 
    
    </div>
    `,
    selector: "gl-journal-template",
    imports: [imp],

    providers: [
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
        provideNgxMask(),
        SortService,
        FilterService,
        ToolbarService,
        EditService,
        SearchService,
        AggregateService,
        GroupService,
        RowDDService,
        ResizeService,
        ContextMenuService,
        ColumnMenuService
    ],
    styles: [
        `
          .mdc-notched-outline__notch {
            border: none !important;
          }

          .mat-mdc-row {
            height: 36px !important;
          }

          .mat-mdc-header {
            height: 36px !important;
          }

          .mat-mdc-form-field {
            height: 72px !important;
          }

          .mat-mdc-table-sticky-border-elem-top {
            height: 36px !important;
            margin-top: 2px !important;
            background: #64748b !important;
            color: white !important;
          }
        `
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class JournalTemplateUpdateComponent
    implements OnInit, OnDestroy, AfterViewInit {

    @Output() notifyDrawerClose: EventEmitter<any> = new EventEmitter();

    accountDropDown = viewChild<DropDownAccountComponent>("accountDropDown");
    subtypeDropDown = viewChild<SubtypeDropDownComponent>("subtypeDropDown");

    private _fuseConfirmationService = inject(FuseConfirmationService);
    private fb = inject(FormBuilder);

    private auth = inject(AUTH);
    private toastr = inject(ToastrService);

    public fuseConfirmationService = inject(FuseConfirmationService);

    public matDialog = inject(MatDialog);
    public templateHeaderForm!: FormGroup;

    public bDetailDirty = false;    
    public partyId: string = '';

    public bDirty = false;

    // create template details only one
    bTemplateDetails = false;

    drawer = viewChild<MatDrawer>("drawer");


    public animation = {
        effect: 'FadeIn',
        duration: 800
    };


    private _location = inject(Location);
    private router = inject(Router);
    public store = inject(TemplateStore);

    public contextmenu: ContextMenuComponent;
    public value = 0;
    public loading = false;
    public height: string = "250px";


    // Internal control variables
    public currentRowData: IJournalDetailTemplate;
    public bHeaderDirty = false;

    // Datagrid variables
    public accountsListSubject: Subscription;
    public fundListSubject: Subscription;

    // Data grid settings

    public editSettings: Object;
    public editArtifactSettings: Object;
    public filterSettings: Object;
    public toolbar: string[];
    public selectionOptions: Object;
    public searchOptions: Object;
    public formatoptions: Object;
    public initialSort: Object;
    public detailSort: Object;

    // drop down searchable list
    public accountList: IDropDownAccounts[] = [];
    public subtypeList: ISubType[] = [];
    public fundList: IDropDown[] = [];

    public message?: string;
    public description?: string;

    @ViewChild("grid")
    public grid!: GridComponent;
    public gridControl = viewChild<GridComponent>("grid");
    public transactionType = 'GL';

    public templateList: IJournalTemplate[] = [];

    public accountsGrid: IDropDownAccountsGridList[] = [];
    public dFields = { text: "child", value: "child" };

    public debitAccounts: IDropDownAccounts[] = [];
    public debitCtrl: FormControl<IDropDownAccounts> = new FormControl<IDropDownAccounts>(null);
    public debitAccountFilterCtrl: FormControl<string> = new FormControl<string>(null);
    public filteredDebitAccounts: ReplaySubject<IDropDownAccounts[]> = new ReplaySubject<IDropDownAccounts[]>(1);

    public subtypeCtrl: FormControl<string> = new FormControl<string>(null);
    public fundCtrl: FormControl<string> = new FormControl<string>(null);
    public key: number;

    public templateHeader: IJournalTemplate;
    public templateDetailSignal = signal<IJournalDetailTemplate[]>(null);

    protected _onDebitDestroy = new Subject<void>();
    protected _onTemplateDestroy = new Subject<void>();
    protected _onDestroyDebitAccountFilter = new Subject<void>();
    protected _onDestroy = new Subject<void>();

    columnsToDisplay: string[] = ["template_ref", "description"];
    toolbarOptions = ['Search']

    @ViewChild('splitterInstance') splitterObj?: SplitterComponent;

    singleDebitSelection = viewChild<MatSelect>("singleDebitSelection");
    singleTemplateSelect = viewChild<MatSelect>("singleTemplateSelect");
    singlePartySelect = viewChild<MatSelect>("singlePartySelect");

    Store = inject(Store);
    toast = inject(ToastrService);
    
    accounts$ = this.Store.select(accountsFeature.selectChildren);
    isLoading$ = this.Store.select(accountsFeature.selectIsLoading);

    funds$ = this.Store.select(fromFunds.selectFunds);
    isFundsLoading$ = this.Store.select(fromFunds.isFundsLoading);

    // subtype$ = this.Store.select(subtypeFeature.selectSubtype);
    // isSubtypeLoading$ = this.Store.select(subtypeFeature.selectIsLoading);

    subtype$ = inject(SubTypeService).read();

    detailForm = new FormGroup({
        accounts: new FormGroup({
            dropdown: new FormControl(0, Validators.required),
        }),
        subtype: new FormGroup({
            dropdown: new FormControl('', Validators.required),
        }),
        fund: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        debit: new FormControl(0, Validators.required),
        credit: new FormControl(0, Validators.required),
        reference: new FormControl('', Validators.required),
    });

    headerTemplateForm = new FormGroup({
        template_name: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        journal_type: new FormControl('', Validators.required),
    });

    
    ngOnInit(): void {

        

        this.Store.dispatch(accountPageActions.children());
        this.Store.dispatch(FundsActions.loadFunds());                
        this.createEmptyForm();
        this.initialDatagrid();

    }

    public menuItems: MenuItemModel[] = [{
        id: 'edit',
        text: 'Edit Line Item',
        iconCss: 'e-icons e-edit-2'
    },
    {
        id: 'evidence',
        text: 'Add Evidence',
        iconCss: 'e-icons e-file-document'
    },
    {
        id: 'lock',
        text: 'Lock Transaction',
        iconCss: 'e-icons e-lock'
    },
    {
        id: 'cancel',
        text: 'Cancel Transaction',
        iconCss: 'e-icons e-table-overwrite-cells'
    },
    {
        separator: true
    },
    {
        id: 'back',
        text: 'Back to Transaction List',
        iconCss: 'e-icons e-chevron-left'
    },

    ];


    public updateData() {

        const updateDate = new Date().toISOString().split('T')[0];
        const inputs = { ...this.templateHeaderForm.value }
        const momentDate = new Date(inputs.step1.transaction_date).toISOString().split('T')[0];
        const email = '@' + this.auth.currentUser?.email.split('@')[0];
        
        var journalDetails: IJournalDetail[] = [];

        let count: number = 1;

        if (inputs.step1.amount === 0) {
            return;
        }

        // let templateHeader: IJournalHeader = {
        //     // journal_id: this.journal_id,
        //     journal_id: inputs.step1.journal_id,
        //     description: inputs.step1.description,
        //     booked: false,
        //     booked_date: updateDate,
        //     booked_user: email,
        //     create_date: updateDate,
        //     create_user: email,
        //     period: Number(this.store.currentPeriod()),
        //     period_year: Number(this.store.currentYear()),
        //     transaction_date: momentDate,
        //     status: 'OPEN',
        //     type: template.journal_type,
        //     sub_type: inputs.step1.sub_type,
        //     amount: Number(inputs.step1.amount),
        //     party_id: party_id,
        //     template_name: template_name,
        //     invoice_no: inputs.step1.invoice_no,
        // }

        // Check for correct child accounts coming from the template

        // this.store.templateDetails().forEach((templateDetail) => {
        //     let journalDetail: IJournalDetailUpdate = {
        //         journal_id: inputs.step1.journal_id,
        //         journal_subid: count,
        //         account: Number(templateDetail.account),
        //         child: Number(templateDetail.child),
        //         description: templateDetail.description,
        //         create_date: updateDate,
        //         create_user: email,
        //         sub_type : templateDetail.subtype,               
        //         debit: templateDetail.debit * templateHeader.amount,
        //         credit: templateDetail.credit * templateHeader.amount,
        //         reference: '',
        //         fund: templateDetail.fund,
        //     }
        //     journalDetails.push(journalDetail);
        //     count = count + 1;
        // });

        // this.journalDetailSignal.set(journalDetails);

        this.bDirty = true;
    }

    public onUpdate() {

        const inputs = { ...this.templateHeaderForm.value }
        if (inputs.step1.amount === 0) {
            return;
        }
        // var detail: Detail[] = this.journalDetailSignal();
        // var journalArray: IJournalTransactions = {

        //     journal_id: this.templateHeader.journal_id,
        //     description: this.templateHeader.description,
        //     type: this.templateHeader.type,
        //     booked_user: this.templateHeader.booked_user,
        //     period: this.templateHeader.period,
        //     period_year: this.templateHeader.period_year,
        //     transaction_date: this.templateHeader.transaction_date,
        //     amount: this.templateHeader.amount,
        //     template_name: this.templateHeader.template_name,
        //     invoice_no: this.templateHeader.invoice_no,
        //     party_id: this.templateHeader.party_id,
        //     subtype: this.templateHeader.sub_type,
        //     details: { detail: detail }
        // }

        // this.journalService.createJournal(journalArray).pipe(takeUntil(this._onDestroy)).subscribe((response) => {
        //     this.ShowAlert(`Journal created  : ${response.description} ID: ${response.journal_id}`, "pass");
        // });
        this.bDirty = false;
    }

    public onEdit() {
        this.drawer().open();
        this.toastr.success('Transaction saved');
    }

    public onSaved(args: any) {
        this.toastr.success('Transaction saved', args);
    }


    public itemSelect(args: MenuEventArgs): void {

        switch (args.item.id) {
            case 'edit':
                this.onEdit();
                break;

            case 'lock':
                this.toastr.success('Transaction locked selected TBD');
                // this.onClose();
                break;
            case 'cancel':
                // this.onCancel();
                this.toastr.success('Transaction Cancelled selected TBD');
                break;
            case 'back':
                this.onBack();
                break;
        }
    }


    onBack() {
        this.router.navigate(["/journals"]);
    }


    public aggregates = [
        {
            columns: [
                {
                    type: ['Sum'],
                    field: 'debit',
                    columnName: 'Debit',
                    format: 'N2',
                    footerTemplate: 'Sum: ${Sum}',
                },
                {
                    type: ['Sum'],
                    field: 'credit',
                    columnName: 'Credit',
                    format: 'N2',
                    footerTemplate: 'Sum: ${Sum}',
                },
            ],
        },
    ];

    changeFund(e: any) {
        console.debug('change fund: ', e);
        this.bDetailDirty = true;
    }

    changeSubtype(e: any) {
        console.debug('change subtype: ', e);
        this.bDetailDirty = true;
    }

    changeTemplate(e: any) {
        console.debug('change template: ', e);
        this.bDetailDirty = true;
    }

    public onCreated() {
        let splitterObj1 = new Splitter({
            height: '100%',
            separatorSize: 3,
            paneSettings: [
                { size: '70%' },
                { size: '30%' }
            ],
            orientation: 'Vertical'
        });
        splitterObj1.appendTo('#vertical_splitter');
    }

    public createJournalDetailsFromTemplate(value: IJournalTemplate) {
        if (value === null || value === undefined) {
            return;
        }
        this.transactionType = value.journal_type;
        // this.store.loadTemplateDetails(value.journal_no.toString());
        this.store.readTemplateDetails(value.journal_no.toString());
        this.bHeaderDirty = false;
    }

    public ngAfterViewInit() {

        this.debitAccountFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroyDebitAccountFilter))
            .subscribe(() => {
                this.filterDebitAccounts();
            });

        if (this.filteredDebitAccounts)
            this.filteredDebitAccounts
                .pipe(take(1), takeUntil(this._onDebitDestroy))
                .subscribe(() => {
                    if (this.singleDebitSelection() != null || this.singleDebitSelection() != undefined)
                        this.singleDebitSelection().compareWith = (
                            a: IDropDownAccounts,
                            b: IDropDownAccounts
                        ) => {
                            return a && b && a.child === b.child;
                        };
                });

        this.searchOptions = { operator: 'contains', ignoreCase: true, ignoreAccent: true };
        this.onChanges();
        this.bHeaderDirty = false;
        console.debug('Header is false now');

    }

    public openDrawer() {
        this.bDetailDirty = false;
        this.drawer().open();
    }

    public closeDrawer() {
        this.bDetailDirty = false;
        this.drawer().close();
    }

    public onRowSelected(args: RowSelectEventArgs): void {
        const queryData: any = args.data;
        this.store.readTemplateDetails(queryData.journal_no.toString());
        this.refreshHeader(queryData);
        this.closeDrawer();
    }

    initialDatagrid() {
        this.formatoptions = { type: "dateTime", format: "M/dd/yyyy" };
        this.selectionOptions = { mode: "Row" };
        this.editSettings = {
            allowEditing: true,
            allowAdding: false,
            allowDeleting: false,
        };
        this.filterSettings = { type: "CheckBox" };
        this.initialSort = {
            columns: [{ field: 'template_ref', direction: 'Descending' },]
        };

        this.detailSort = {
            columns: [{ field: 'debit', direction: 'Descending' },]
        };

    }

    protected filterDebitAccounts() {
        if (!this.debitAccounts) {
            return;
        }

        let search = this.debitAccountFilterCtrl.value;
        if (!search) {
            this.filteredDebitAccounts.next(this.debitAccounts.slice());
            return;
        } else {
            search = search.toLowerCase();
        }

        this.filteredDebitAccounts.next(
            this.debitAccounts.filter(
                (account) => account.description.toLowerCase().indexOf(search) > -1
            )
        );
    }

    public OnDetailSelected(data: IJournalDetailTemplate): void {
        
        const JournalDetail = {
            template_ref: data.template_ref,
            journal_no: data.journal_no,
            journal_sub: data.journal_sub,
            description: data.description,
            account: data.account,
            child: data.child,
            sub_type: data.sub_type,
            fund: data.fund,
            debit: data.debit,
            credit: data.credit
        } as IJournalDetailTemplate;

        this.updateDetailForm(JournalDetail);

    }

    private updateDetailForm(journalTemplateDetail: IJournalDetailTemplate) {
        const accountString = journalTemplateDetail.child.toString();
        
        if (journalTemplateDetail.sub_type === undefined || journalTemplateDetail.sub_type === null) {
            journalTemplateDetail.sub_type = '';
        }   

        const subtypeString = journalTemplateDetail.sub_type;        

        this.detailForm.patchValue({            
            // accounts: {
            //     dropdown: journalDetail.child
            // },
            // subtype: {
            //     dropdown: journalDetail.subtype
            // },
            description: journalTemplateDetail.description,
            fund: journalTemplateDetail.fund,
            debit: journalTemplateDetail.debit,
            credit: journalTemplateDetail.credit,
        });
        
        if (accountString !== undefined || accountString !== null) {
            this.accountDropDown().setDropdownValue(accountString);
        }
        
        if (subtypeString !== undefined || subtypeString !== null) {
            this.subtypeDropDown().setDropdownValue(subtypeString);
        }
        
        this.bHeaderDirty = false;
        this.openDrawer();
    }

    public onChanges(): void {
        this.detailForm.controls['accounts'].valueChanges.subscribe((value) => {
            console.debug('Account changed: ', value);
            this.bDetailDirty = true;
        });

        this.detailForm.valueChanges.subscribe((value) => {
            this.bDetailDirty = true;
        });

        this.debitCtrl.valueChanges.subscribe((value) => {
            this.bDetailDirty = true;
        });

        this.templateHeaderForm.valueChanges.subscribe((value) => {
            if (value === undefined) {
                this.bHeaderDirty = false;
                console.debug('Header is true!! ', value);
            }
            else {
                this.bHeaderDirty = true;
                console.debug('Header is false!! ', value);
            }
        }
        );
    }

    public detailRowDoubleClick(args: SaveEventArgs): void {
        if (args.requestType === "beginEdit" || args.requestType === "add") {
            args.cancel = true;
            this.OnDetailSelected(args.rowData as any);
            this.openDrawer();
        }
        if (args.requestType === "save") {
            this.onSaved(args.data);
        }
    }

    public actionSelectJournal(args: SaveEventArgs): void {
        if (args.requestType === "beginEdit" || args.requestType === "add") {
            const data = args.rowData as IJournalHeader;
        }
        if (args.requestType === "save") {
            this.saveArtifacts(args.data);

        }
    }

    public actionComplete(args: DialogEditEventArgs): void {
        console.debug("args : ", args.requestType);
        if (args.requestType === "beginEdit" || args.requestType === "add") {
            if (args.requestType === "beginEdit") {
            } else if (args.requestType === "add") {
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
        this.onSaved(args.data[0]);
    }

    public saveArtifacts(e: any) {
        this.bHeaderDirty = true;
        console.debug('Header is true 3');
        this.bHeaderDirty = false;

    }


    public refreshHeader(header: IJournalTemplate) {

        this.templateHeader = header;

        this.templateHeaderForm.patchValue({
            description: header.description,
            template_name: header.template_name,
            journal_type: header.journal_type,
            create_date: header.create_date,
            create_user: header.create_user,
            journal_no: header.journal_no,              
        });

        this.store.readTemplateDetails(header.journal_no.toString());

        this.bHeaderDirty = false;

    }

    public onNew(e: any) {
        const confirmation = this.fuseConfirmationService.open({
            title: "Create New Transaction",
            message:
                "Would you like to create a new transaction? ",
            actions: {
                confirm: {
                    label: "New Transaction",
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === "confirmed") {
            }
        });
    }

    public onClone(e: any) {

        this.toastr.success("Journal Cloned", "Success");

        const confirmation = this.fuseConfirmationService.open({
            title: "Clone Current Transaction",
            message:
                "Would you like to clone the current transaction? ",
            actions: {
                confirm: {
                    label: "Clone Transaction",
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === "confirmed") {
            }
        });
    }

    // Create template from the current transaction

    // Add evidence 



    public createEmptyForm() {
        this.templateHeaderForm = this.fb.group({
            description: ["", Validators.required],
            template_name: ["", Validators.required],
        });


        this.bHeaderDirty = false;
    }



    // On delete journal detail
    public onDeleteDetail() {

        const inputs = { ...this.templateHeaderForm.value } as IJournalTemplate

        var journalDetail = {
            journal_id: inputs.template_ref,
        };

        const confirmation = this._fuseConfirmationService.open({
            title: `Delete  transaction detail item : ${journalDetail.journal_id}-${journalDetail.journal_id} `,
            message: "Are you sure you want to delete this line entry? ",
            actions: {
                confirm: {
                    label: "Delete",
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        var sub = confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === "confirmed") {
                this.bDetailDirty = false;
                this.closeDrawer();
            }
        });


    }

    // On delete journal detail
    public onDelete(args: any) {
        const inputs = { ...this.templateHeaderForm.value }
        const index = (this.grid as GridComponent).getSelectedRowIndexes();
        const rowData = this.grid.getCurrentViewRecords().at(index[0]) as any;
        var journalDetail = {
            journal_id: inputs.journal_id,
            journal_subid: rowData.journal_subid,
        };
        const confirmation = this._fuseConfirmationService.open({
            title: `Delete  transaction number : ${rowData.journal_id}-${rowData.journal_subid} `,
            message: "Are you sure you want to delete this line entry? ",
            actions: {
                confirm: {
                    label: "Delete",
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === "confirmed") {
                // Delete the list
                // this.store.deleteJournalDetail(journalDetail);
                this.bDetailDirty = false;
            }
        });
    }

    public onOpenEmptyDrawer() {
        this.openDrawer();
    }

    // add a new line entry
    public onNewLineItem() {
        const inputs = { ...this.templateHeaderForm.value } as IJournalHeader;
        const updateDate = new Date().toISOString().split("T")[0];
        var max = 0;

        this.store.tmp_details().forEach((details) => {
            if (details.journal_sub > max) {
                max = details.journal_sub;
            }
        });

        if (inputs.journal_id === 0) {
            return;
        }

        const name = this.auth.currentUser.email.split("@")[0];
        const dDate = new Date();
        let currentDate = dDate.toISOString().split("T")[0];
        const detail = this.detailForm.getRawValue();

        if (max === 0) {
            max = 1;
        }
        else {
            max = max + 1;
        }

        var debit = Number(detail.debit);
        var credit = Number(detail.credit);
        var childAccount = this.debitCtrl.getRawValue();
        var sub_type = this.subtypeCtrl.value;
        var fund = this.fundCtrl.value;
        var child_desc = this.store.accounts().find((x) => x.child === childAccount.child).description;


        if (debit > 0 && credit > 0) {
            this.toastr.show('Only one of the debit field and credit field may be greater than zero!', 'Failed');
            return;
        }

        const journalDetail = {
            // journal_id: this.currentRowData.journal_id,
            // journal_subid: this.currentRowData.journal_subid,
            account: this.currentRowData.account,
            child: Number(childAccount.child),
            child_desc: child_desc,
            description: detail.description,
            create_date: updateDate,
            create_user: name,
            sub_type: sub_type,
            debit: debit,
            credit: credit,
            reference: detail.reference,
            fund: fund,
        };

        this.bDetailDirty = false;
        this.toastr.success('Journal details added');

    }

    journalEntryCleanUp() {
        const inputs = { ...this.templateHeaderForm.value } as IJournalHeader;
        this.detailForm.reset();
        this.debitCtrl.reset();
        //this.store.renumberJournalDetail(inputs.journal_id);
    }

    public onHeaderDateChanged(event: any): void {        
        this.bHeaderDirty = true;    
    }

    // Update template header
    onUpdateJournalHeader(e: any) {

        let header = this.templateHeaderForm.getRawValue();

        const journalTemplateHeader = {            
            journal_no: this.templateHeader.journal_no,
            description: header.description,
            template_name: header.template_name,
            template_ref: this.templateHeader.template_ref,            
            journal_type: this.templateHeader.journal_type
        } as IJournalTemplate;
                
        this.store.updateTemplate(header);            
        this.toastr.success(`Journal header updated : ${this.templateHeader.template_ref}`);
        this.bHeaderDirty = false;
    }
    // Create or new journal entry
    public onCreate() {

        var header = this.templateHeaderForm.getRawValue();
        var detail = this.detailForm.getRawValue();

        const updateDate = new Date().toISOString().split("T")[0];
        const name = '@' + this.auth.currentUser?.email.split("@")[0];

        if (
            detail.description === "" ||
            detail.description === undefined ||
            detail.description === null
        ) {

            this.toastr.show('Please select a row to edit', 'Failed');
            return;
        }

        var debit = Number(detail.debit);
        var credit = Number(detail.credit);

        if (debit > 0 && credit > 0) {
            this.toastr.show('Only one of the debit field and credit field may be greater than zero!', 'Failed');
            return;
        }

        const journalTemplateDetail = {
            template_ref: this.currentRowData.template_ref,
            journal_no: this.currentRowData.journal_no,
            journal_sub: this.currentRowData.journal_sub,
            account: this.currentRowData.account,
            child: detail.accounts.dropdown,
            description: detail.description,
            sub_type: detail.subtype.dropdown,
            debit: debit,
            credit: credit,
            reference: detail.reference,
            fund: detail.fund,
        } as IJournalDetailTemplate;

        const templateHeader: any = {
            journal_no: header.journal_no,
            description: header.description,
            template_name: header.template_name,
            journal_type: header.journal_type,
            create_date: updateDate,
            create_user: name,
        } as IJournalTemplate;
        
        this.store.updateTemplate(templateHeader);
        this.store.updateTemplateDetail(journalTemplateDetail);
        
        this.toastr.success('Journal details updated');

        this.bHeaderDirty = false;
        this.debitCtrl.reset();
    }

    onAddLineItem() {
        this.onNewLineItem();
    }

    onUpdateJournalDetail() {

        var detail = this.detailForm.getRawValue();
        const dDate = new Date();
        const updateDate = dDate.toISOString().split("T")[0];
        const email = '@' + this.auth.currentUser?.email.split("@")[0];
        var debit = Number(detail.debit);
        var credit = Number(detail.credit);
        var childAccount = detail.accounts.dropdown;
        var child_desc = this.store.accounts().find((x) => x.child === childAccount.toString()).description;
        const subtype = this.subtypeDropDown().getDropdownValue();

        // Check for correct child accounts coming from the template
        // Sum the debits and the credits to make sure they are equal

        if (debit > 0 && credit > 0) {
            this.toastr.show('Only one of the debit field and credit field may be greater than zero!', 'Failed');
            return;
        }

        const templateDetail = {
            template_ref: this.currentRowData.template_ref,
            journal_sub: this.currentRowData.journal_sub,
            account: this.currentRowData.account,

            description: detail.description,
            create_date: updateDate,
            create_user: email,
            sub_type: subtype,
            debit: debit,
            credit: credit,
            reference: detail.reference,
            fund: detail.fund
        };

        this.closeDrawer();

    }

    ngOnDestroy(): void {

        this.exitWindow();

        if (this.accountsListSubject) {
            this.accountsListSubject.unsubscribe();
        }
        if (this.fundListSubject) {
            this.fundListSubject.unsubscribe();
        }

        this._onDestroy.next();
        this._onDestroy.complete();
    }

    @HostListener("window:exit")
    public exitWindow() {



        if (this.bHeaderDirty === false) {


        } else {
            const confirmation = this.fuseConfirmationService.open({
                title: "Unsaved Changes",
                message:
                    "Would you like to save the changes before the edit window is closed and the changes lost?  ",
                actions: {
                    confirm: {
                        label: "Close Without Saving",
                    },
                },
            });
            // Subscribe to the confirmation dialog closed action
            confirmation.afterClosed().subscribe((result) => {
                if (result === "confirmed") {
                    this.detailForm.reset();
                    this.templateHeaderForm.reset();
                    this._location.back();
                }
            });

        }
    }

    ShowAlert(message: string, response: string) {
        if (response == "pass") {
            this.toastr.success(message);
        } else {
            this.toastr.error(message);
        }
        return;
    }

    public gridHeight: number;

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.gridHeight = event.target.innerHeight - 500;
    }

}
