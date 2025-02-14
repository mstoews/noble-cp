import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation, inject, signal, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, UntypedFormGroup, Validators, FormControl, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { AUTH } from 'app/app.config';
import { AccountsService } from 'app/services/accounts.service';
import { JournalService } from 'app/services/journal.service';
import { MaterialModule } from 'app/services/material.module';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Observable, ReplaySubject, Subject, Subscription, take, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DndComponent } from 'app/features/drag-n-drop/loaddnd/dnd.component';
import { MatSelect } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { IDropDownAccounts, IFunds } from 'app/models';
import { Detail, IJournalTransactions, IJournalDetail, IJournalDetailUpdate, IJournalHeader, IJournalTemplate } from 'app/models/journals';
import { JournalStore } from 'app/services/journal.store';
import { MatStepperModule } from '@angular/material/stepper';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { IParty } from 'app/models/party';
import { PartyService } from 'app/services/party.service';
import {
    AggregateService, ColumnMenuService,
    EditService,
    FilterService,
    GridComponent,
    GridModule, PageService, ResizeService,
    RowDDService,
    RowDragEventArgs,
    SaveEventArgs, SearchService, SortService, ToolbarService
} from '@syncfusion/ej2-angular-grids';

import { MatDrawer, MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from "@angular/material/card";
import { MatTabsModule } from "@angular/material/tabs";
import { Store } from '@ngrx/store';
import { loadTemplates } from 'app/state/template/Template.Action';
import { getTemplates } from 'app/state/template/Template.Selector';
import { ISubType } from 'app/models/subtypes';
import { ToastrService } from "ngx-toastr";
import { Router } from '@angular/router';


interface ITransactionType {
    value: string;
    viewValue: string;
    checked: boolean;
}

const mods = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    NgxMaskDirective,
    MatInputModule,
    MatSidenavModule,
    MatIconModule,
    MatDatepickerModule,
    NgxMatSelectSearchModule,
    MaterialModule,
    GridModule,
]

@Component({
    selector: 'entry-wizard',
    imports: [mods],
    template: `
        <mat-drawer class="w-full md:w-[400px]" #drawer [opened]="false" mode="over" [position]="'end'"
                    [disableClose]="true">
            <mat-tab-group>
                <mat-tab label="Details">
                    <mat-card class="">
                        <form [formGroup]="detailForm">
                            <div  class="flex flex-col w-full filter-article filter-interactive text-gray-700 rounded-lg">
                                <div class="text-3xl gap-2 m-1 text-gray-100 p-2 bg-slate-600 rounded-md"
                                    mat-dialog-title>
                                    {{ "Journal Update" }}
                                </div>
                            </div>
                            <section class="flex flex-col gap-1">
                                <!-- Account  -->

                                @if (filteredDebitAccounts | async; as accounts ) {
                                    <mat-form-field class="flex flex-col grow ml-2 mr-2 mt-1 ">
                                        <mat-label class="text-md ml-2">Account</mat-label>
                                        <mat-select [formControl]="debitCtrl" placeholder="Account" #singleDebitSelect  required>
                                            <mat-option>
                                                <ngx-mat-select-search [formControl]="debitAccountFilterCtrl"
                                                                    [noEntriesFoundLabel]="'No entries found'"
                                                                    [placeholderLabel]="'Search'">
                                                </ngx-mat-select-search>
                                            </mat-option>
                                            @for (account of accounts; track account) {
                                                <mat-option [value]="account">{{account.description}}</mat-option>
                                            }
                                        </mat-select>
                                        <mat-icon class="icon-size-5 text-lime-700" matPrefix
                                                [svgIcon]="'heroicons_solid:document-chart-bar'"></mat-icon>

                                    </mat-form-field>
                                }


                                <!-- Sub Type -->

                                @if (subtype$ | async; as subtypes) {
                                    <mat-form-field class="flex-col ml-2 mr-2 mt-1 grow ">
                                        <mat-label class="text-md ml-2">Sub Type</mat-label>
                                        <mat-select class="text-gray-800" placeholder="Sub Type"
                                                    formControlName="sub_type" (selectionChange)="changeSubtype($event)">
                                            @for (item of subtypes; track item)
                                            { <mat-option [value]="item.subtype"> {{ item.subtype }} </mat-option>
                                            }
                                        </mat-select>
                                        <mat-icon class="icon-size-5 text-lime-700" matPrefix
                                                [svgIcon]="'feather:pen-tool'"></mat-icon>
                                    </mat-form-field>
                                }

                                <!-- Funds-->
                                
                                @if (funds$ | async; as funds) {
                                    <mat-form-field class="flex-col ml-2 mr-2 mt-1 grow ">
                                        <mat-label class="text-md ml-2">Funds</mat-label>
                                        <mat-select class="text-gray-800" placeholder="Fund" formControlName="fund"
                                                    (selectionChange)="changeFund($event)">
                                            @for (item of funds; track item)
                                            { <mat-option [value]="item.fund"> {{ item.fund }} - {{item.description}}
                                            </mat-option>
                                            }
                                        </mat-select>
                                        <mat-icon class="icon-size-5 text-lime-700" matPrefix
                                                [svgIcon]="'heroicons_solid:briefcase'"></mat-icon>
                                    </mat-form-field>
                                }
                                

                                <!-- Description  -->

                                <mat-form-field class="flex-auto ml-2 mr-2">
                                    <mat-label class="text-md ml-2">Description</mat-label>
                                    <input matInput [formControlName]="'description'" [placeholder]="'Description'" required>
                                    <mat-icon class="icon-size-5 text-lime-700" matPrefix [svgIcon]="'heroicons_solid:document'"></mat-icon>
                                </mat-form-field>

                                <!-- Reference  -->

                                <mat-form-field class="flex-auto ml-2 mr-2" floatLabel="always">
                                    <mat-label class="text-md ml-2">Reference</mat-label>
                                    <input matInput type="text" [formControlName]="'reference'"  placeholder="" required>
                                    <mat-icon class="icon-size-5 text-lime-700" matPrefix [svgIcon]="'heroicons_solid:clipboard-document-check'"></mat-icon>
                                </mat-form-field>

                            </section>

                            <section class="flex flex-col md:flex-row gap-2 mt-1">
                                <!-- Debit  -->
                                <mat-form-field class="ml-2 mt-1 grow">
                                    <mat-label class="text-md ml-2">Debits</mat-label>
                                    <input type="text" mask="separator.2" [leadZero]="true" thousandSeparator=","
                                        class="text-right" matInput [placeholder]="'Debit'"
                                        formControlName="debit" />
                                    <mat-icon class="icon-size-5 text-lime-700" matPrefix
                                            [svgIcon]="'heroicons_solid:currency-dollar'"></mat-icon>
                                </mat-form-field>

                                <!-- Credit  -->
                                <mat-form-field class="grow mr-2 mt-1">
                                    <mat-label class="text-md ml-2">Credits</mat-label>
                                    <input type="text" mask="separator.2" [leadZero]="true" thousandSeparator=","
                                        class="text-right" matInput [placeholder]="'Credit'"
                                        formControlName="credit" />
                                    <mat-icon class="icon-size-5 text-lime-700" matPrefix
                                            [svgIcon]="'heroicons_solid:currency-dollar'"></mat-icon>
                                </mat-form-field>
                            </section>
                        </form>
                        <div mat-dialog-actions class="gap-2 mb-3 mt-5">
                            @if (bDirty === true) {
                                <button mat-icon-button
                                        class="bg-gray-400 text-white fill-slate-100 hover:bg-slate-400 ml-1"
                                        (click)="onUpdateJournalDetail()" matTooltip="Update Line Item"
                                        aria-label="hover over">
                                    <mat-icon [svgIcon]="'feather:save'"></mat-icon>
                                </button>
                            }

                            <button mat-icon-button color="primary"
                                    class="bg-gray-200 fill-slate-100 hover:bg-slate-400 ml-1"
                                    (click)="onDeleteDetail()" matTooltip="Remove Current Line" aria-label="hover over">

                                <span class="e-icons e-circle-remove"></span>
                            </button>


                            <button mat-icon-button color="primary"
                                    class="bg-gray-200 fill-slate-100  hover:bg-slate-400 ml-1"
                                    (click)="closeDrawer()" matTooltip="Cancel" aria-label="hovered over">
                                <!-- <mat-icon [svgIcon]="'mat_outline:close'"></mat-icon> -->
                                <span class="e-icons e-circle-close"></span>
                            </button>

                        </div>

        <!--                <section class=" text-gray-700" [formGroup]="detailForm">-->
        <!--                    {{detailForm.value | json}}-->
        <!--                </section>-->

                    </mat-card>
                </mat-tab>
                <mat-tab label="Artifacts">
                    <mat-card>
                        @if (store.artifacts().length > 0) {
                            <ul>
                                <li class="grid grid-cols-1 gap-y-10 gap-x-6 ">
                                    @for (evidence of store.artifacts(); track evidence.id) {
                                        <evidence-card [evidence]="evidence"></evidence-card>
                                    }
                                </li>
                            </ul>
                        }
                        <div mat-dialog-actions class="gap-2 mb-3 mt-5">
                            @if (bDirty === true) {
                                <button mat-icon-button color="warm"
                                        class="bg-gray-200 fill-slate-100 text-white hover:bg-slate-400 ml-1"
                                        (click)="onUpdateJournalDetail()" matTooltip="Update Transaction"
                                        aria-label="hover over">
                                    <mat-icon [svgIcon]="'feather:save'"></mat-icon>
                                </button>
                            }

                            <button mat-icon-button color="warn"
                                    class="bg-gray-200 fill-slate-100 text-white hover:bg-slate-400 ml-1"
                                    (click)="closeDrawer()" matTooltip="Cancel" aria-label="hovered over">
                                <mat-icon [svgIcon]="'mat_outline:close'"></mat-icon>
                            </button>

                        </div>

                    </mat-card>
                </mat-tab>
            </mat-tab-group>
        </mat-drawer>
        <mat-drawer-container id="target"
                class=" control-section default-splitter flex flex-col overflow-auto h-[calc(100vh-14rem)] ml-5 mr-5"
                [hasBackdrop]="'false'">
            <div class="flex flex-col flex-auto min-w-0">
                @defer (on viewport; on timer(5s)) {    
                    <div class="md:max-w-7xl max-w-4xl">
                        <form class="p-4 bg-card shadow rounded overflow-hidden" [formGroup]="journalEntryForm">                
                            <mat-vertical-stepper [linear]="true" #verticalStepper>
                            <mat-step [formGroupName]="'step1'" [stepControl]="journalEntryForm.get('step1')" #verticalStepperStep1>
                                <ng-template matStepLabel>Transaction Template</ng-template>
                                <section class="flex flex-col md:flex-col w-[400px] ">
                                    
                                        @if (templateFilter | async; as templates ) {
                                            <mat-form-field class="mt-2">
                                                <mat-label class="text-md ml-2">Template</mat-label>
                                                <mat-select [formControl]="templateCtrl" placeholder="Journal Template"
                                                    #singleTemplateSelect required>
                                                    <mat-option>
                                                        <ngx-mat-select-search [formControl]="templateFilterCtrl"
                                                            [noEntriesFoundLabel]="'No entries found'" [placeholderLabel]="'Search'">
                                                        </ngx-mat-select-search>
                                                    </mat-option>
                                                    @for (template of templates; track template) {
                                                    <mat-option [value]="template">{{template.description}}</mat-option>
                                                    }
                                                </mat-select>
                                                <mat-icon class="icon-size-5" matPrefix
                                                    [svgIcon]="'heroicons_solid:document-chart-bar'"></mat-icon>
                                            </mat-form-field>
                                        }       

                                        <mat-form-field class="flex">
                                            <mat-label class="text-md ml-2">Invoice/Reference</mat-label>
                                            <input type="text" class="text-right" matInput [placeholder]="'Reference/Invoice'"
                                                formControlName="invoice_no" />
                                            <mat-icon class="icon-size-5" matPrefix
                                                [svgIcon]="'heroicons_solid:document-chart-bar'"></mat-icon>
                                        </mat-form-field>    

                                    <div class="flex flex-col">
                                        @if (transactionType != 'GL') {
                                        @if (partyFilter | async; as parties ) {
                                        <mat-form-field>
                                            <mat-label class="text-md ml-2">Party</mat-label>
                                            <mat-select [formControl]="partyCtrl" placeholder="Party" #singlePartySelect required>
                                                <mat-option>
                                                    <ngx-mat-select-search [formControl]="partyFilterCtrl"
                                                        [noEntriesFoundLabel]="'No entries found'" [placeholderLabel]="'Search'">
                                                    </ngx-mat-select-search>
                                                </mat-option>
                                                @for (party of parties; track party) {
                                                <mat-option [value]="party">{{party.party_id}}</mat-option>
                                                }
                                            </mat-select>
                                            <mat-icon class="icon-size-5" matPrefix
                                                [svgIcon]="'heroicons_solid:currency-dollar'"></mat-icon>
                                        </mat-form-field>
                                        }
                                        
                                        }
                                    </div>

                                    <mat-form-field class="flex">
                                        <mat-label class="text-md ml-2">Transaction Amount</mat-label>
                                        <input type="text" mask="separator.2" [leadZero]="true" thousandSeparator=","
                                            class="text-right" matInput placeholder="Amount" formControlName="amount"
                                            [placeholder]="'Transaction Total'" />
                                        <mat-icon class="icon-size-5" matPrefix
                                            [svgIcon]="'heroicons_solid:currency-dollar'"></mat-icon>
                                    </mat-form-field>

                                    <mat-form-field class="flex-auto ">
                                        <mat-label class="text-md ml-2">Description</mat-label>
                                        <input matInput [formControlName]="'description'" [placeholder]="'Description'" required>
                                        <mat-icon class="icon-size-5" matPrefix [svgIcon]="'heroicons_solid:document'"></mat-icon>
                                    </mat-form-field>

                                    <mat-form-field class="flex-auto  grow">
                                        <mat-label class="text-md ml-2">Transaction Date</mat-label>
                                        <input matInput formControlName="transaction_date" [matDatepicker]="picker"
                                            [placeholder]="'Transaction Date'">
                                        <mat-datepicker-toggle matIconPrefix [for]="picker"></mat-datepicker-toggle>
                                        <mat-datepicker #picker></mat-datepicker>
                                    </mat-form-field>

                                </section>

                                <div class="flex justify-end">
                                    <button mat-icon-button color="primary" class="bg-gray-200  hover:bg-slate-400 ml-1" (click)="updateHeaderData()"
                                        [disabled]="verticalStepperStep1.stepControl.pristine || verticalStepperStep1.stepControl.invalid"
                                        type="button" matTooltip="Create Journal" matStepperNext>
                                        <mat-icon [svgIcon]="'feather:arrow-right'"></mat-icon>
                                    </button>
                                </div>
                            </mat-step>


                            <mat-step [formGroupName]="'step2'" [stepControl]="journalEntryForm.get('step2')" #verticalStepperStep2>
                                <ng-template matStepLabel>Post/Edit Transaction</ng-template>
                                @if (journalHeader) {

                                <ng-container>

                                    <div class="text-3xl gap-2 m-1 text-gray-100 p-2 bg-slate-600 rounded-md">
                                        Journal Details
                                    </div>
                                
                                    <ejs-grid class="m-1"                                     
                                            [dataSource]="journalDetailSignal()" 
                                            [allowFiltering]="false" 
                                            [allowPaging]="false"
                                            [allowMenuItems]="false"
                                            [gridLines]="'Both'"
                                            [editSettings]='editSettings'                                                                         
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
                                            <e-column field='debit'         headerText='Debit'       textAlign='Right' width='100' format="N2"></e-column>
                                            <e-column field='credit'        headerText='Credit'      textAlign='Right' width='100' format="N2"></e-column>
                                        </e-columns>

                                        <e-aggregates>
                                            <e-aggregate>
                                                <e-columns>
                                                    <e-column type="Sum" field="debit" format="N2">
                                                        <ng-template #footerTemplate let-data>{{data.Sum}}</ng-template>
                                                    </e-column>
                                                    <e-column type="Sum" field="credit" format="N2">
                                                        <ng-template #footerTemplate let-data>{{data.Sum}}</ng-template>
                                                    </e-column>
                                                </e-columns>
                                            </e-aggregate>
                                        </e-aggregates>
                                    </ejs-grid>




                                <!-- 
                                        <button mat-icon-button color="primary" class="bg-gray-200 hover:bg-slate-400 ml-1"
                                            (click)="onAddEvidence()" matTooltip="Evidence" aria-label="Evidence">
                                        <span class="e-icons e-text-alternative"></span>
                                        </button> 
                                    -->

                                </ng-container>
                                <div class="flex justify-end mt-8">
                                    <button mat-icon-button color="primary" class="bg-gray-200  hover:bg-slate-400 ml-1"
                                        type="button" matTooltip="Back to Entry" aria-label="Template" matStepperPrevious>
                                        <mat-icon [svgIcon]="'feather:arrow-left'"></mat-icon>
                                    </button>

                                    <button mat-icon-button color="primary" class="bg-gray-200  hover:bg-slate-400 ml-1" (click)="onUpdate()"
                                        type="button" matTooltip="Post Transaction" aria-label="Template" matStepperNext>
                                        <mat-icon [svgIcon]="'feather:arrow-right'"></mat-icon>
                                    </button>

                                </div>
                            }
                            </mat-step>

                            <mat-step>
                                <ng-template matStepLabel>Completed</ng-template>

                                <ng-container>
                                    <div class="flex flex-col h-full mb-2">
                                        <mat-icon class="icon-size-20 text-green-700" matPrefix
                                            [svgIcon]="'feather:check'"></mat-icon>
                                    </div>
                                </ng-container>
                                @if (journalHeader) {
                                    
                                    <div class="text-gray-800 text-bold text-3xl m-1">Transaction Confirmed</div>
                                    <div class="flex">
                                        <div class="text-gray-600 m-1">Description : {{journalHeader.description}}</div>
                                    </div>
                                    <div class="flex">
                                        <div class="text-gray-600 m-1">Transaction Date : {{journalHeader.transaction_date}}</div>
                                    </div>
                                    <div class="flex">
                                        <div class="text-gray-600 m-1">Amount : {{journalHeader.amount | number: '1.2-2'}}</div>
                                    </div>

                                    <div class="flex">
                                        <div class="text-gray-600 m-1">The transaction has been completed. Please add a digital artifact
                                            to confirm the transaction.</div>
                                    </div>
                                
                                }
                                <div class="flex justify-end mt-8">
                                    <button class="px-8 mr-2" mat-flat-button [color]="'accent'" type="button"
                                    (click)="editTransaction()">
                                        Edit Transaction
                                    </button>
                                    <button class="px-8 mr-2" mat-flat-button [color]="'accent'" type="button"
                                        (click)="onAddArtifact()">
                                        Add an Artifact
                                    </button>
                                    <button class="px-8" mat-flat-button [color]="'primary'" type="reset" (click)="verticalStepper.reset()">
                                        Clear and Restart
                                    </button>
                                </div>
                            </mat-step>
                        </mat-vertical-stepper>
                    </form>
                </div>
            }
            @placeholder(minimum 1000ms) {
                <div class="flex justify-center items-center">
                <mat-spinner></mat-spinner>
                </div>
        }
        </div>
        </mat-drawer-container>
    `,
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    providers: [
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
        provideNgxMask(),
        SortService,
        FilterService,
        ToolbarService,
        EditService,
        SearchService,
        AggregateService,
        PageService,
        ColumnMenuService,
        ResizeService,
        RowDDService,
        JournalStore
    ]
})
export class EntryWizardComponent implements OnInit, OnDestroy, AfterViewInit {

    private journalService = inject(JournalService);
    private accountsService = inject(AccountsService);
    private formBuilder = inject(FormBuilder);
    private partyService = inject(PartyService);
    private router = inject(Router);
    public auth = inject(AUTH);
    public matDialog = inject(MatDialog);
    private toastr = inject(ToastrService);

    public journalDetailSignal = signal<IJournalDetail[]>(null);
    public journalDetailEditForm?: FormGroup;

    public journalEntryForm: UntypedFormGroup;
    public detailForm: FormGroup

    public transactionType = 'GL';
    public isVerified = false;


    public journalHeader: IJournalHeader;

    public journal_id = 0;
    public editSettings: Object;

    public message?: string;
    public bDirty = false;
    public currentPeriod: number;
    public currentYear: number;

    public templateList: IJournalTemplate[] = [];
    public templateCtrl: FormControl<IJournalTemplate> = new FormControl<IJournalTemplate>(null);
    public templateFilterCtrl: FormControl<string> = new FormControl<string>(null);
    public templateFilter: ReplaySubject<IJournalTemplate[]> = new ReplaySubject<IJournalTemplate[]>(1);

    public partyList: IParty[] = [];
    public partyCtrl: FormControl<IParty> = new FormControl<IParty>(null);
    public partyFilterCtrl: FormControl<string> = new FormControl<string>(null);
    public partyFilter: ReplaySubject<IParty[]> = new ReplaySubject<IParty[]>(1);

    public debitAccounts: IDropDownAccounts[] = [];
    public debitCtrl: FormControl<IDropDownAccounts> = new FormControl<IDropDownAccounts>(null);
    public debitAccountFilterCtrl: FormControl<string> = new FormControl<string>(null);
    public filteredDebitAccounts: ReplaySubject<IDropDownAccounts[]> = new ReplaySubject<IDropDownAccounts[]>(1);

    public creditAccounts: IDropDownAccounts[] = [];
    public creditCtrl: FormControl<IDropDownAccounts> = new FormControl<IDropDownAccounts>(null);
    public creditAccountFilterCtrl: FormControl<string> = new FormControl<string>('');
    public filteredCreditAccounts: ReplaySubject<IDropDownAccounts[]> = new ReplaySubject<IDropDownAccounts[]>(1);

    protected _onCreditDestroy = new Subject<void>();
    protected _onDebitDestroy = new Subject<void>();
    protected _onTemplateDestroy = new Subject<void>();
    protected _onDestroyDebitAccountFilter = new Subject<void>();
    protected _onDestroyCreditAccountFilter = new Subject<void>();
    protected _onDestroyTemplateFilter = new Subject<void>();
    protected _onDestroy = new Subject<void>();

    // Grid Options
    public selectionOptions: Object;
    public journalDetails: IJournalDetail[] = [];

    public accountsListSubject: Subscription;
    public gridControl = viewChild<GridComponent>('grid');
    public currentRowData: any;

    store = inject(JournalStore);

    drawer = viewChild<MatDrawer>("drawer");

    @ViewChild("singleDebitSelect", { static: true }) singleDebitSelect: MatSelect;
    @ViewChild("singleCreditSelect", { static: true }) singleCreditSelect: MatSelect;
    @ViewChild("singleTemplateSelect", { static: true }) singleTemplateSelect: MatSelect;
    @ViewChild("singlePartySelect", { static: true }) singlePartySelect: MatSelect;

    bNewTransaction: any;
    public selectedOption: string;

    types: ITransactionType[] = [
        { value: "GL", viewValue: "General", checked: true },
        { value: "AP", viewValue: "Payments", checked: false },
        { value: "AR", viewValue: "Receipts", checked: false },
    ];

    editTransaction() {
        this.router.navigate(["journals/gl", this.journal_id]);
    }

    Store = inject(Store);
    template$: Observable<IJournalTemplate[]>;
    accountsDropdown$: Observable<IDropDownAccounts[]>;
    funds$: Observable<IFunds[]>;
    subtype$: Observable<ISubType[]>;

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {

        this.Store.dispatch(loadTemplates());

        this.Store.select(getTemplates).subscribe((templates) => {
            this.templateList = templates;
            this.templateFilter.next(templates);
        });

        this.accountsService.readAccountDropdown().subscribe((accounts) => {
            this.debitAccounts = accounts;
            this.creditAccounts = accounts;
            this.filteredDebitAccounts.next(this.debitAccounts.slice());
            this.filteredCreditAccounts.next(this.creditAccounts.slice());

        });

        this.selectedOption = this.types[0].value;

        this.currentPeriod = this.store.currentPeriod();
        this.currentYear = this.store.currentYear();

        this.partyService.read().pipe(takeUntil(this._onDestroy)).subscribe((party) => {
            this.partyList = party;
            this.partyFilter.next(this.partyList.slice());
        });


        this.journalService.getLastJournalNo().subscribe(journal_no => {
            this.journal_id = Number(journal_no);
        });


        this.editSettings = {
            allowEditing: true,
            allowAdding: false,
            allowDeleting: false,
        };

        this.createEmptyForms();
        this.onChanges()

    }

    public onClear() {
        this.journalService.getLastJournalNo().subscribe(journal_no => {
            this.journal_id = Number(journal_no);
        });
    }

    public createEmptyForms() {
        let currentDate = new Date().toISOString().split("T")[0];

        this.detailForm = this.formBuilder.group({
            debitAccountFilterCtrl: ["", Validators.required],
            description: ["", Validators.required],
            child: ["", Validators.required],
            fund: ["", Validators.required],
            sub_type: ["", Validators.required],
            party: ["", Validators.required],
            reference: ["", Validators.required],
            debit: ["", Validators.required],
            credit: ["", Validators.required],
        });



        this.journalEntryForm = this.formBuilder.group({
            step1: this.formBuilder.group({
                templateCtrl: [''],
                description: ['', Validators.required],
                amount: ['', Validators.required],
                transaction_date: [currentDate, Validators.required],
                partyCtrl: [''],
                invoice_no: ['', Validators.required],
            }),
            step2: this.formBuilder.group({}),

        });

    }

    public onChanges(): void {
        this.debitAccountFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroyDebitAccountFilter))
            .subscribe(() => {
                this.filterDebitAccounts();
            })

        this.creditAccountFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroyCreditAccountFilter))
            .subscribe(() => {
                this.filterCreditAccounts();
            });

        this.templateFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroyTemplateFilter))
            .subscribe(() => {
                this.filterTemplate();
            });

        this.partyFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroyTemplateFilter))
            .subscribe(() => {
                this.filterParty();
            });

        this.journalEntryForm.valueChanges.subscribe((dirty) => {
            if (this.journalEntryForm.dirty) {
                this.bDirty = true;
            }
        });

        this.templateCtrl.valueChanges.subscribe((value) => {
            this.bDirty = true;
            this.createJournalDetailsFromTemplate(value);
        });

    }


    public onTransTypeClicked(e: any) {
        this.selectedOption = e;
        console.log(e)
    }

    public updateForm(journalDetail: IJournalDetail) {
        const accountString = journalDetail.child.toString();
        this.debitCtrl.setValue(
            this.debitAccounts.find((x) => x.child === accountString)
        );

        this.detailForm.patchValue({
            debitAccountFilterCtrl: journalDetail.child.toString(),
            description: journalDetail.description,
            sub_type: journalDetail.subtype,
            debit: journalDetail.debit,
            credit: journalDetail.credit,
            reference: journalDetail.reference,
            fund: journalDetail.fund
        });
    }


    openDrawer() {
        this.bDirty = false;
        this.drawer().open();
    }

    onDeleteDetail() {
        throw new Error('Method not implemented.');
    }

    closeDrawer() {
        this.drawer().close();
    }

    public actionBegin(args: SaveEventArgs): void {
        if (args.requestType === "refresh") {
            args.cancel = true;
            return;
        }

        if (args.requestType === "beginEdit" || args.requestType !== "delete") {
            args.cancel = true;
            const subid = args.rowData as IJournalDetail;

            const currentSub = this.journalDetailSignal().find((x) => x.journal_subid === subid.journal_subid);

            const currentDate = new Date().toISOString().split("T")[0];
            const data = args.rowData as IJournalDetail;
            console.log(JSON.stringify(data));
            const email = '@' + this.auth.currentUser.email.split('@')[0];
            const debit = currentSub.debit;
            const credit = currentSub.credit;

            let JournalDetail = {
                journal_id: data.journal_id,
                journal_subid: data.journal_subid,
                account: data.account,
                child: data.child,
                child_desc: data.child_desc,
                description: data.description,
                create_date: currentDate,
                create_user: email,
                subtype: data.subtype,
                debit: debit,
                credit: credit,
                reference: '',
                fund: data.fund
            } as IJournalDetail;

            this.updateForm(JournalDetail);
            this.openDrawer();
        }

        if (args.requestType === "save") {
            args.cancel = true;

            const subid = args.rowData as IJournalDetail;
            const currentSub = this.journalDetailSignal().find((x) => x.journal_subid === subid.journal_subid);

            const currentDate = new Date().toISOString().split("T")[0];
            const data = args.rowData as IJournalDetail;
            const email = '@' + this.auth.currentUser.email.split('@')[0];
            const debit = currentSub.debit;
            const credit = currentSub.credit;

            let JournalDetail = {
                journal_id: data.journal_id,
                journal_subid: data.journal_subid,
                account: data.account,
                child: data.child,
                child_desc: data.child_desc,
                description: data.description,
                create_date: currentDate,
                create_user: email,
                subtype: data.subtype,
                debit: debit,
                credit: credit,
                reference: data.reference,
                fund: data.fund
            } as IJournalDetail;


            this.onSavedDetails(JournalDetail);
        }
    }

    public OnCardDoubleClick(data: any): void {
        this.currentRowData = data;
        const email = this.auth.currentUser.email;
        const dDate = new Date();
        const currentDate = dDate.toISOString().split("T")[0];
        console.debug("data :", JSON.stringify(data));

        const journalDetail = {
            journal_id: data.journal_id,
            journal_subid: data.journal_subid,
            account: data.account,
            child: data.child,
            child_desc: data.child_desc,
            description: data.description,
            create_date: currentDate,
            create_user: email,
            subtype: data.subtype,
            debit: data.debit,
            credit: data.credit,
            reference: data.reference,
            fund: data.fund,
        } as IJournalDetail;

        this.currentRowData = journalDetail;

        this.updateForm(journalDetail);
        this.onChanges();
    }


    rowDrag(args: RowDragEventArgs): void {
        this.message = `rowDrag event triggered ${JSON.stringify(args.data)}`;
        console.debug(this.message);
        (args.rows as Element[]).forEach((row: Element) => {
            row.classList.add('drag-limit');
        });
    }

    rowDrop(args: RowDragEventArgs): void {

        this.message = `Drop  ${args.originalEvent} ${JSON.stringify(args.data)}`;
        console.debug(this.message);
        const value = [];
        for (let r = 0; r < (args.rows as Element[]).length; r++) {
            value.push((args.fromIndex as number) + r);
        }

        this.gridControl().reorderRows(value, (args.dropIndex as number));

        // this.onSavedDetails(args.data[0]);
    }

    actionComplete($event) {
        if ($event.requestType === "save") {
            this.onSavedDetails($event.data);
        }
    }

    onSavedDetails(e: IJournalDetail) {
        this.store.createJournalDetail(e);
    }

    protected setInitialValue() {

        if (this.templateFilter)
            this.templateFilter
                .pipe(take(1), takeUntil(this._onTemplateDestroy))
                .subscribe(() => {
                    if (this.singleTemplateSelect != null || this.singleTemplateSelect != undefined)
                        this.singleTemplateSelect.compareWith = (a: IJournalTemplate, b: IJournalTemplate) => a && b && a.template_ref === b.template_ref;
                });

        if (this.partyFilter)
            this.partyFilter
                .pipe(take(1), takeUntil(this._onTemplateDestroy))
                .subscribe(() => {
                    if (this.singlePartySelect != null || this.singlePartySelect != undefined)
                        this.singlePartySelect.compareWith = (a: IParty, b: IParty) => a && b && a.party_id === b.party_id;
                });


        if (this.filteredDebitAccounts)
            this.filteredDebitAccounts
                .pipe(take(1), takeUntil(this._onDebitDestroy))
                .subscribe(() => {

                    if (this.singleDebitSelect != null || this.singleDebitSelect != undefined)
                        this.singleDebitSelect.compareWith = (a: IDropDownAccounts, b: IDropDownAccounts) => a && b && a.child === b.child;
                });

        if (this.filteredCreditAccounts)
            this.filteredCreditAccounts
                .pipe(take(1), takeUntil(this._onCreditDestroy))
                .subscribe(() => {
                    if (this.singleCreditSelect != null || this.singleCreditSelect != undefined)
                        this.singleCreditSelect.compareWith = (a: IDropDownAccounts, b: IDropDownAccounts) => a && b && a.child === b.child;
                });

    }


    ngAfterViewInit() {
        this.setInitialValue();
    }

    protected filterCreditAccounts() {
        if (!this.creditAccounts) {
            return;
        }
        // get the search keyword
        let search = this.creditAccountFilterCtrl.value;
        if (!search) {
            this.filteredCreditAccounts.next(this.creditAccounts.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredCreditAccounts.next(
            this.creditAccounts.filter(account => account.description.toLowerCase().indexOf(search) > -1)
        );
    }

    protected filterDebitAccounts() {
        if (!this.debitAccounts) {
            return;
        }
        // get the search keyword
        let search = this.debitAccountFilterCtrl.value;
        if (!search) {
            this.filteredDebitAccounts.next(this.debitAccounts.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredDebitAccounts.next(
            this.debitAccounts.filter(account => account.description.toLowerCase().indexOf(search) > -1)
        );
    }

    protected filterParty() {
        if (!this.partyList) {
            return;
        }
        // get the search keyword
        let search = this.partyFilterCtrl.value;
        if (!search) {
            this.partyFilter.next(this.partyList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.partyFilter.next(
            this.partyList.filter(party => party.party_id.toLowerCase().indexOf(search) > -1)
        );
    }


    protected filterTemplate() {
        if (!this.templateList) {
            return;
        }
        // get the search keyword
        let search = this.templateFilterCtrl.value;
        if (!search) {
            this.templateFilter.next(this.templateList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.templateFilter.next(
            this.templateList.filter(template => template.description.toLowerCase().indexOf(search) > -1)
        );
    }


    public createJournalDetailsFromTemplate(value: IJournalTemplate) {
        this.transactionType = value.journal_type;
        this.store.loadTemplateDetails(value.journal_no.toString());
    }

    refresh() {
        this.store.loadTemplateDetails(this.templateCtrl.value.journal_no.toString());
    }

    public updateHeaderData() {

        const updateDate = new Date().toISOString().split('T')[0];
        const inputs = { ...this.journalEntryForm.value }
        const momentDate = new Date(inputs.step1.transaction_date).toISOString().split('T')[0];
        const email = '@' + this.auth.currentUser?.email.split('@')[0];



        var party: any;
        var party_id: string;

        const template = this.templateCtrl.value;
        const template_name = this.templateList.find((x) => x.template_name === template.template_name).template_name;

        this.journalDetails = [];

        if (template.journal_type !== 'GL') {
            party = this.partyCtrl.getRawValue();
            party_id = this.partyList.find((x) => x.party_id === party.party_id).party_id;
        }
        else {
            party_id = '';
        }

        let count: number = 1;

        if (inputs.step1.amount === 0) {
            return;
        }

        let journalHeader: IJournalHeader = {
            journal_id: this.journal_id,
            description: inputs.step1.description,
            booked: false,
            booked_date: updateDate,
            booked_user: email,
            create_date: updateDate,
            create_user: email,
            period: Number(this.currentPeriod),
            period_year: Number(this.currentYear),
            transaction_date: momentDate,
            status: 'OPEN',
            type: template.journal_type,
            sub_type: inputs.step1.sub_type,
            amount: Number(inputs.step1.amount),
            party_id: party_id,
            template_name: template_name,
            invoice_no: inputs.step1.invoice_no,
        }

        this.journalHeader = journalHeader;

        this.store.templateDetails().forEach((templateDetail) => {
            let journalDetail: IJournalDetailUpdate = {
                journal_id: this.journal_id,
                journal_subid: count,
                account: Number(templateDetail.account),
                child: Number(templateDetail.child),
                description: templateDetail.description,
                create_date: updateDate,
                create_user: email,
                subtype: templateDetail.sub_type,
                debit: templateDetail.debit * journalHeader.amount,
                credit: templateDetail.credit * journalHeader.amount,
                reference: '',
                fund: templateDetail.fund,
            }
            this.journalDetails.push(journalDetail);
            count = count + 1;
        });

        this.journalDetailSignal.set(this.journalDetails);

        this.bDirty = true;
    }

    public onUpdate() {

        const inputs = { ...this.journalEntryForm.value }

        if (inputs.step1.amount === 0) {
            return;
        }

        var detail: Detail[] = this.journalDetailSignal();

        var journalArray: IJournalTransactions = {
            journal_id: this.journalHeader.journal_id,
            description: this.journalHeader.description,
            type: this.journalHeader.type,
            booked_user: this.journalHeader.booked_user,
            period: this.journalHeader.period,
            period_year: this.journalHeader.period_year,
            transaction_date: this.journalHeader.transaction_date,
            amount: this.journalHeader.amount,
            template_name: this.journalHeader.template_name,
            invoice_no: this.journalHeader.invoice_no,
            party_id: this.journalHeader.party_id,
            subtype: '',
            details: { detail: detail }
        }


        this.journalService.createJournal(journalArray).pipe(takeUntil(this._onDestroy)).subscribe((response) => {
            console.log(response);
            this.ShowAlert(`Journal created  : ${response.description} ID: ${response.journal_id}`, "pass");
        });

        this.bDirty = false;
    }

    onAddArtifact() {
        const dialogRef = this.matDialog.open(DndComponent, {
            width: '600px',
            data: {
                journal_id: this.journalHeader.journal_id,
                reference_no: this.journalHeader.journal_id,
                description: this.journalHeader.description,
            },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (result === undefined) {
                result = { event: 'Cancel' };
            }
            switch (result.event) {
                case 'Create':
                    console.debug(result.data);
                    break;
                case 'Cancel':
                    break;
            }
        });

    }

    ngOnDestroy(): void {

        if (this._onDestroyDebitAccountFilter) {
            this._onDestroyDebitAccountFilter.unsubscribe();
        }

        if (this._onDestroyCreditAccountFilter) {
            this._onDestroyCreditAccountFilter.unsubscribe();
        }

        if (this._onDestroyTemplateFilter) {
            this._onDestroyTemplateFilter.unsubscribe();
        }

        this._onDestroy.next();
        this._onDestroy.complete();
    }


    onAddLineJournalDetail() {
        throw new Error('Method not implemented.');
    }

    onAddEvidence() {
        throw new Error('Method not implemented.');
    }

    onCreateTemplate() {
        throw new Error('Method not implemented.');
    }

    ShowAlert(message: string, response: string) {
        if (response == "pass") {
            this.toastr.success(message);
        } else {
            this.toastr.error(message);
        }
        return;
    }

}





//{"headers":{"normalizedNames":{},"lazyUpdate":null},"status":200,"statusText":"OK","url":"http://localhost:8080/v1/create_journal",
// "ok":false,"name":"HttpErrorResponse","message":"Http failure during parsing for http://localhost:8080/v1/create_journal",
// "error":{"error":{},"text":"
// 
//{\"journal_id\":204,\"journal_subid\":1,\"account\":1000,\"child\":1001,\"sub_type\":\"Operating\",\"description\":\"Office Expenses\",\"debit\":0,\"credit\":5000.00,\"create_date\":\"2025-02-01\",\"create_user\":\"@mstoews.10.14\",\"fund\":\"Reserve\",\"reference\":\"\"}{\"journal_id\":204,\"journal_subid\":2,\"account\":6000,\"child\":6030,\"sub_type\":\"Operating\",\"description\":\"Office Expenses\",\"debit\":5000.00,\"credit\":0,\"create_date\":\"2025-02-01\",\"create_user\":\"@mstoews.10.14\",\"fund\":\"Reserve\",\"reference\":\"\"}"}}