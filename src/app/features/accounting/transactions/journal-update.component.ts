import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, OnDestroy, OnInit, Output, ViewChild, inject, signal, viewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ReplaySubject, Subject, Subscription, take, takeUntil } from "rxjs";
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
import { IDropDown, IDropDownAccounts, IDropDownAccountsGridList } from "app/models";
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
    IJournalDetail,
    IJournalDetailTemplate,
    IJournalHeader,
    IJournalTemplate,
    IArtifacts,
    ITemplateParams,
} from "app/models/journals";

import { Router, ActivatedRoute } from "@angular/router";
import { MatDrawer } from "@angular/material/sidenav";

import { Splitter, SplitterComponent, SplitterModule } from '@syncfusion/ej2-angular-layouts';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { IParty } from "../../../models/party";
import { ISubType } from "app/models/subtypes";
import { ToastrService } from "ngx-toastr";
import { JournalService } from "app/services/journal.service";
import { accountsFeature } from "../static/accts/Accts.state";
import { accountPageActions } from "../static/accts/Accts-page.actions";
import { DropDownAccountComponent } from "../grid-components/drop-down-account.component";
import { Store } from '@ngrx/store';
import { FundsActions } from "../static/funds/Funds.Action";
import { subtypeFeature } from "../static/subtype/sub-type.state";
import { SubtypeDropDownComponent } from "../grid-components/drop-down.subtype.component";
import { JournalStore } from "app/store/journal.store";
import { MaterialModule } from "app/shared/material.module";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import html2PDF from "jspdf-html2canvas";


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
            [showBack]="true" 
            (print)="onPrint()"
            (period)="onPeriod($event)"
            (back)="onBack()"  
            (clone)="onClone('GL')"           
            [inTitle]="'General Ledger Transactions Update'" 
            [prd]="journalStore.currentPeriod()"
            [prd_year]="journalStore.currentYear()">
        </grid-menubar>
     </div>
     <mat-drawer class="w-full md:w-[450px] bg-white-100" #drawer [opened]="false" mode="push" [position]="'end'" [disableClose]="false">
                <mat-card class="">
                    <form [formGroup]="detailForm">
                        <div class="flex flex-col w-full filter-article filter-interactive text-gray-700 rounded-lg">
                            <div class="text-3xl gap-2 m-1 text-gray-100 p-2 bg-slate-600 rounded-md" mat-dialog-title> {{ "Journal Update" }} </div>
                        </div>
                        <section class="flex flex-col gap-1">
                            <!-- Drop down accounts list -->                                        
                            @if ((isLoading$ | async) === false) {
                                @if ( accounts$ | async; as accounts) {
                                    <account-drop-down [dropdownList]="accounts" controlKey="account" label="Account" #accountDropDown></account-drop-down>
                                }
                            }
                                
                            <!-- Sub Type  -->                                        
                            @if (subtypeList.length > 0 ) {
                                <subtype-drop-down [dropdownList]="subtypeList" controlKey="subtype" label="Sub Type" #subtypeDropDown></subtype-drop-down>
                            }
                                                                    
                            <!-- Funds  -->                                        
                            @if (funds$ | async; as funds) {
                            <mat-form-field class="flex-col ml-2 mr-2 mt-1 grow ">
                                <mat-label class="text-md ml-2">Funds</mat-label>
                                <mat-select class="text-gray-800 dark:text-gray-100"  placeholder="Fund" formControlName="fund">
                                    @for (item of journalStore.funds(); track item) {
                                    <mat-option [value]="item.fund"> {{ item.fund }} - {{ item.description }}
                                    </mat-option>
                                    }
                                </mat-select>
                                <mat-icon class="icon-size-5 text-lime-700" matSuffix
                                    [svgIcon]="'heroicons_solid:briefcase'"></mat-icon>
                            </mat-form-field>
                            } 

                            <!-- Reference  -->

                            <mat-form-field class="flex-col ml-2 mr-2 mt-1 grow">
                                <mat-label class="text-md ml-2">Reference</mat-label>
                                <input matInput placeholder="Reference" formControlName="reference" [placeholder]="'Reference'" />
                                <mat-icon class="icon-size-5 text-lime-700" matSuffix  [svgIcon]="'heroicons_solid:calculator'"></mat-icon>
                            </mat-form-field> 
                            
                            
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
                        
                        <button mat-icon-button color="primary" class="bg-gray-200 fill-slate-100 hover:bg-slate-400 ml-1"
                                (click)="onUpdateJournalDetail()" matTooltip="Update Line Item"
                                aria-label="hover over">
                                <mat-icon [svgIcon]="'feather:save'"></mat-icon>
                        </button>
                        

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
                <ejs-splitter #splitterInstance id="nested-splitter" (created)='onCreated()' class="h-[calc(100vh-14rem)]" separatorSize=3 width='100%'>
                    <e-panes>
                        <e-pane min='60px' size='30%' class="w-72 relative">                                                                    
                            <ng-template #content>                                
                            <mat-card class="mat-elevation-z8 h-[calc(100vh-14.2rem)]">                                                                                
                                    <div class="text-3xl gap-2 m-1 text-gray-100 p-2 bg-slate-600 rounded-md sticky z-10">
                                        Transaction List
                                    </div>                        
                                    <div>
                                        <ejs-grid id="grid-journal-list" 
                                            [dataSource]='journalStore.gl()'
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
                                            <e-column field='journal_id'  headerText='ID' [visible]='false' isPrimaryKey='true' width='80'></e-column>
                                            <e-column field="type" headerText="ID" width="120">
                                                <ng-template #template let-data>                                                                
                                                    @switch (data.type) 
                                                    {                                    
                                                        @case ('GL') {                                        
                                                            <span class="e-badge flex text-md gap-1 items-center w-max bg-transparent">
                                                                <div class="w-4 h-4  rounded-full bg-green-700"></div>
                                                                GL - {{data.journal_id}}
                                                            </span>
                                                        }
                                                        @case ('AP') {
                                                        <span class="e-badge flex text-md  gap-1 items-center w-max bg-transparent">
                                                            <div class="w-4 h-4 rounded-full bg-blue-700"></div>
                                                                AP - {{data.journal_id}}
                                                        </span>
                                                        }                                    
                                                        @case ('AR') {
                                                            <span class="e-badge flex text-md  gap-1 items-center w-max bg-transparent">
                                                                <div class="w-4 h-4 rounded-full bg-cyan-600"></div>
                                                                AR - {{data.journal_id}}
                                                            </span>
                                                        }
                                                        @case ('CL') {
                                                            <span class="e-badge flex  text-md  gap-1 items-center w-max bg-transparent">
                                                                <div class="w-4 h-4 rounded-full bg-purple-700"></div>
                                                                CL - {{data.journal_id}}
                                                            </span>
                                                        }
                                                    }
                                                </ng-template>
                                        </e-column>                                                                
                                                
                                                <e-column field='description' headerText='Journal Description'   [visible]='true'></e-column>
                                                <e-column field='amount'      headerText='Amount' [visible]='true'  textAlign='Right' width='150' format="N2"></e-column>
                                                <e-column field="booked"      headerText="Booked" [visible]='false' width="100" [displayAsCheckBox]='true' type="boolean"></e-column>
                                                <e-column field="amount"      headerText="Amount" [visible]='false' width="150"  format='N2' textAlign="Right"></e-column>
                                                <e-column field="period"      headerText="Prd"    [visible]='false' width="100"></e-column>
                                                <e-column field="period_year" headerText="Yr"     [visible]='false' width="100" ></e-column>
                                            </e-columns>
                                            <e-aggregates>
                                                <e-aggregate>
                                                    <e-columns>
                                                        <e-column type="Sum" field="amount" format="N2"  >
                                                            <ng-template #footerTemplate let-data><span class="customcss">{{data.Sum}}</span>                                                                
                                                            </ng-template>
                                                        </e-column>

                                                    </e-columns>
                                                </e-aggregate>
                                            </e-aggregates>
                                        </ejs-grid>
                                    </div>
                            </mat-card>                                
                            </ng-template>
                        </e-pane>
                        <e-pane>
                            <ng-template #content>
                                <div id='vertical_splitter' class="vertical_splitter overflow-hidden">
                                    <mat-card class="mat-elevation-z8 h-[calc(100vh-14.2rem)]">
                                        <div class="content overflow-hidden">
                                            @if (journalHeader.journal_id > 0) {
                                                <div class="text-3xl gap-2 m-1 text-gray-100 p-2 bg-slate-600 rounded-md">
                                                    @if (journalHeader.type == 'GL') {
                                                        General Ledger : {{ journalHeader.journal_id }}
                                                    } 
                                                    @if (journalHeader.type == 'AP') {
                                                        Accounts Payable : {{ journalHeader.journal_id }}
                                                    }
                                                    @if (journalHeader.type == 'AR') {
                                                        Accounts Receivable : {{ journalHeader.journal_id }}
                                                    }                                                
                                                </div>
                                            } @else {
                                            <div class="text-3xl gap-2 m-1 text-gray-100 p-2 bg-slate-600 rounded-md">
                                                General Ledger
                                            </div>
                                            }
                                            <form [formGroup]="journalForm">
                                                <section class="flex flex-col md:flex-row">
                                                    @if (templateFilter | async; as templates ) {
                                                    <div class="flex flex-col w-[300px]">
                                                        <mat-form-field class="mt-1 ml-1 mr-1 flex-start">
                                                                <mat-select [formControl]="templateCtrl" [placeholder]="'Journal Template'" #singleTemplateSelect required>
                                                                    <mat-option>
                                                                        <ngx-mat-select-search
                                                                            [formControl]="templateFilterCtrl"
                                                                            [noEntriesFoundLabel]="'No entries found'"
                                                                            [placeholderLabel]="'Search'">
                                                                        </ngx-mat-select-search>
                                                                    </mat-option>
                                                                    @for (template of templates; track template) {
                                                                        <mat-option [value]="template">{{template.description}}</mat-option>
                                                                    }
                                                                </mat-select>
                                                                <mat-icon class="icon-size-5" matPrefix [svgIcon]="'heroicons_solid:document-chart-bar'"></mat-icon>
                                                        </mat-form-field>
                                                    </div>
                                                    }
                                                    <div class="flex flex-col grow">
                                                        <mat-form-field class="mt-1 ml-1 mr-1 flex-start">
                                                            <input matInput placeholder="Journal Description"
                                                                formControlName="description" />
                                                            <mat-icon class="icon-size-5" matPrefix
                                                                [svgIcon]="'heroicons_solid:document'"></mat-icon>
                                                        </mat-form-field>
                                                    </div>                                                    
                                                    @if (journalHeader.type == 'GL') {
                                                        <mat-form-field class="mt-1 ml-1 mr-1 w-[250px]">
                                                            <input type="text" class="text-left" matInput
                                                                placeholder="Reference Number" formControlName="invoice_no" />
                                                            <mat-icon class="icon-size-5" matPrefix
                                                                [svgIcon]="'heroicons_solid:clipboard-document-check'"></mat-icon>
                                                        </mat-form-field>
                                                        }
                                                        <div class="flex flex-col w-[150px]">
                                                            <mat-form-field class="mt-1 flex-start mr-1">
                                                                <input type="text" mask="separator.2" [leadZero]="true"
                                                                    thousandSeparator="," class="text-right" matInput
                                                                    placeholder="Amount" formControlName="amount"
                                                                    [placeholder]="'Transaction Total'" />
                                                                <mat-icon class="icon-size-5" matPrefix
                                                                    [svgIcon]="'heroicons_solid:currency-dollar'"></mat-icon>
                                                            </mat-form-field>
                                                        </div>
                                                        <div class="flex flex-col w-[150px]">
                                                            <mat-form-field class="mt-1 flex-start mr-1">
                                                                <input matInput (dateChange)="onHeaderDateChanged($event)"
                                                                    formControlName="transaction_date"
                                                                    [matDatepicker]="picker" />
                                                                <mat-datepicker-toggle matIconPrefix
                                                                    [for]="picker"></mat-datepicker-toggle>
                                                                <mat-datepicker #picker></mat-datepicker>
                                                            </mat-form-field>
                                                        </div>
                                                    </section>

                                                    <section class="flex flex-col md:flex-row">
                                                        @if (journalHeader.type != 'GL') {
                                                            @if (partyFilter | async; as parties ) {
                                                            <div class="flex flex-col w-[300px]">
                                                                <mat-form-field class="mt-1 ml-1 mr-1 flex-start">
                                                                    <mat-select [formControl]="partyCtrl" placeholder="Party" #singlePartySelect required>
                                                                        <mat-option>
                                                                            <ngx-mat-select-search [formControl]="partyFilterCtrl"
                                                                                [noEntriesFoundLabel]="'No entries found'"
                                                                                [placeholderLabel]="'Search'">
                                                                            </ngx-mat-select-search>
                                                                        </mat-option>
                                                                        @for (party of parties; track party) {
                                                                        <mat-option [value]="party">{{party.party_id}}</mat-option>
                                                                        }
                                                                    </mat-select>
                                                                    <mat-icon class="icon-size-5" matPrefix [svgIcon]="'heroicons_solid:user'"></mat-icon>
                                                                </mat-form-field>
                                                            </div>
                                                            <mat-form-field class="mt-1 ml-1 mr-1 grow">
                                                                <input type="text" class="text-left" matInput
                                                                    placeholder="Reference Number" formControlName="invoice_no" />
                                                                <mat-icon class="icon-size-5" matPrefix
                                                                    [svgIcon]="'heroicons_solid:clipboard-document-check'"></mat-icon>
                                                            </mat-form-field>
                                                        }
                                                    }
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
                                                    (click)="onAddEvidence()"
                                                    matTooltip="Evidence" aria-label="Evidence">
                                                    <span class="e-icons e-text-alternative"></span>
                                                </button>


                                                <button mat-icon-button color="primary"
                                                    class="bg-slate-200  hover:bg-slate-400 ml-1"
                                                    (click)="onCloseTransaction()" matTooltip="Lock Transaction"
                                                    aria-label="complete">
                                                    <span class="e-icons e-lock"></span>
                                                </button>

                                                <button mat-icon-button color="primary"
                                                    class="bg-slate-200 text-gray-100 hover:bg-slate-400 ml-1"
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
                                                        [dataSource]="journalStore.details()" 
                                                        [allowFiltering]="false" 
                                                        [gridLines]="'Both'"
                                                        [allowColumnMenu]="false"
                                                        [rowHeight]="30"
                                                        [allowSorting]='true'
                                                        [sortSettings]= 'detailSort'
                                                        [editSettings]='editSettings' 
                                                        [allowRowDragAndDrop]='true'
                                                        [showColumnMenu]='false' 
                                                        (actionBegin)="detailRowDoubleClick($event)"
                                                        allowSorting=true>
                                                        <e-columns>
                                                            <e-column field='journal_subid' headerText='ID' [visible]='false' isPrimaryKey='true'  width='100'></e-column> 
                                                            <e-column field='child' headerText='Account'  width='100'></e-column>
                                                            <e-column field='fund' headerText='Fund' width='90'></e-column>
                                                            <e-column field='sub_type' headerText='Sub Type' [visible]='true' width='90'></e-column>
                                                            <e-column field='description' headerText='Description' width='150'></e-column>
                                                            <e-column field='reference' headerText='Reference' [visible]='true' width=120></e-column>
                                                            <e-column field='debit' headerText='Debit' textAlign='Right' width='100' format="N2"></e-column>
                                                            <e-column field='credit' headerText='Credit' textAlign='Right' width='100' format="N2"></e-column>
                                                        </e-columns>
                                                        <e-aggregates>
                                                            <e-aggregate>
                                                                <e-columns>
                                                                    <e-column type="Sum" field="debit" format="N2">
                                                                    <ng-template #footerTemplate let-data><span class="customcss">{{data.Sum}}</span> </ng-template>
                                                                    </e-column>
                                                                    <e-column type="Sum" field="credit" format="N2">
                                                                    <ng-template #footerTemplate let-data><span class="custom_no_paddingcss">{{data.Sum}}</span> </ng-template>
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
                                    
                                        <div>
                                            <div class="content overflow-hidden">
                                                @defer () {
                                                <div class="text-3xl m-1 text-gray-100 p-2 bg-slate-600 rounded-md">Transaction
                                                    Artifacts
                                                </div>
                                                <div class="flex flex-col h-full ml-1 mr-1 text-gray-800">

                                                    <ejs-grid id="grid" #grid [dataSource]="journalStore.artifacts()" [rowHeight]="30"
                                                        allowEditing='false' [editSettings]='editArtifactSettings'
                                                        [allowFiltering]='false' [allowRowDragAndDrop]='false'
                                                        [gridLines]="'Both'" (actionBegin)="actionSelectJournal($event)"
                                                        (rowDrop)="rowDrop($event)" (rowDrag)="rowDrag($event)">

                                                        <e-columns>
                                                            <e-column field='id' headerText='ID' [visible]='false'
                                                                isPrimaryKey='true' width='100'></e-column>
                                                            <e-column field='description' headerText='Description'
                                                                width='300'></e-column>
                                                            <e-column field='location' headerText='Location'
                                                                [visible]='false'></e-column>
                                                            <e-column field='reference' headerText='Reference'></e-column>

                                                        </e-columns>
                                                    </ejs-grid>

                                                    <ng-template #template let-data>
                                                        <img [src]="data.location" alt="Noble Ledger v 0.0.1 logo" />
                                                    </ng-template>

                                                    <ng-template #buttonTemplate let-data>
                                                        <button mat-flat-button class="bg-slate-500 text-gray-100"
                                                            (click)="handleClick(data)">Details
                                                        </button>
                                                    </ng-template>
                                                </div>
                                                }
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
                                        </div>
                                    </mat-card>
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
    selector: "gl-journal",
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
export class JournalUpdateComponent implements OnInit, OnDestroy, AfterViewInit {

    @Output() notifyDrawerClose: EventEmitter<any> = new EventEmitter();

    accountDropDown = viewChild<DropDownAccountComponent>("accountDropDown");
    subtypeDropDown = viewChild<SubtypeDropDownComponent>("subtypeDropDown");

    private _fuseConfirmationService = inject(FuseConfirmationService);
    
    
    private readonly destroyJournalForm$ = new Subject<void>();
    private readonly destroyDetailForm$ = new Subject<void>();

    private auth = inject(AUTH);
    private activatedRoute = inject(ActivatedRoute);
    private toastr = inject(ToastrService);

    public fuseConfirmationService = inject(FuseConfirmationService);
    public matDialog = inject(MatDialog);
    
    
    public toolbarTitle: string = "General Ledger Transactions Update";
    public bDetailDirty = false;
    public transaction: string = '';
    public transactionDate: Date = new Date();
    public partyId: string = '';

    public bDirty = false;

    // create template details only one
    bTemplateDetails = false;

    drawer = viewChild<MatDrawer>("drawer");


    public animation = {
        effect: 'FadeIn',
        duration: 800
    };

    private router = inject(Router);
    public journalStore = inject(JournalStore);
    private cd = inject(ChangeDetectorRef);

    public contextmenu: ContextMenuComponent;
    public value = 0;
    public loading = false;
    public height: string = "250px";


    // Internal control variables
    public currentRowData: IJournalDetail;
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
    public templateDetailList: IJournalDetailTemplate[] = [];
    public templateCtrl: FormControl<IJournalTemplate> = new FormControl<IJournalTemplate>(null);
    public templateFilterCtrl: FormControl<string> = new FormControl<string>(null);
    public templateFilter: ReplaySubject<IJournalTemplate[]> = new ReplaySubject<IJournalTemplate[]>(1);

    public partyList: IParty[] = [];
    public partyCtrl: FormControl<IParty> = new FormControl<IParty>(null);
    public partyFilterCtrl: FormControl<string> = new FormControl<string>(null);
    public partyFilter: ReplaySubject<IParty[]> = new ReplaySubject<IParty[]>(1);

    public accountsGrid: IDropDownAccountsGridList[] = [];
    public dFields = { text: "child", value: "child" };

    public debitAccounts: IDropDownAccounts[] = [];
    public debitCtrl: FormControl<IDropDownAccounts> = new FormControl<IDropDownAccounts>(null);
    public debitAccountFilterCtrl: FormControl<string> = new FormControl<string>(null);
    public filteredDebitAccounts: ReplaySubject<IDropDownAccounts[]> = new ReplaySubject<IDropDownAccounts[]>(1);

    public subtypeCtrl: FormControl<string> = new FormControl<string>(null);
    public fundCtrl: FormControl<string> = new FormControl<string>(null);
    public key: number;

    public journalHeader: IJournalHeader;
    public journalDetailSignal = signal<IJournalDetail[]>(null);

    protected _onCreditDestroy = new Subject<void>();
    protected _onDebitDestroy = new Subject<void>();
    protected _onTemplateDestroy = new Subject<void>();
    protected _onDestroyDebitAccountFilter = new Subject<void>();
    protected _onDestroyCreditAccountFilter = new Subject<void>();
    protected _onDestroy = new Subject<void>();

    public changeDetectorRef = inject(ChangeDetectorRef);

    columnsToDisplay: string[] = ["journal_id", "description"];
    toolbarOptions = ['Search']

    @ViewChild('splitterInstance') splitterObj?: SplitterComponent;

    singleDebitSelection = viewChild<MatSelect>("singleDebitSelection");
    singleTemplateSelect = viewChild<MatSelect>("singleTemplateSelect");
    singlePartySelect = viewChild<MatSelect>("singlePartySelect");

    ngrxStore = inject(Store);
    toast = inject(ToastrService);

    accounts$ = this.ngrxStore.select(accountsFeature.selectChildren);
    isLoading$ = this.ngrxStore.select(accountsFeature.selectIsLoading);

    funds$ = this.ngrxStore.select(fromFunds.selectFunds);
    isFundsLoading$ = this.ngrxStore.select(fromFunds.isFundsLoading);
    subtypes$ = this.ngrxStore.select(subtypeFeature.selectSubtype);
    isSubtypeLoading$ = this.ngrxStore.select(subtypeFeature.selectIsLoading);
    
    journalForm = new FormGroup({
        templateCtrl : new FormControl({
            dropdown: new FormControl('', Validators.required),
        }),        
        description: new FormControl('', Validators.required),
        invoice_no: new FormControl('', Validators.required),
        amount: new FormControl(0, Validators.required),
        transaction_date: new FormControl('', Validators.required),
        partyCtrl: new FormControl({
            dropdown: new FormControl('', Validators.required),
        })
    });

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

    journalData: IJournalHeader | undefined;

    currentPeriod = '';

    onPeriod(event: any) {
        this.currentPeriod = event;
        localStorage.setItem('currentPeriod', this.currentPeriod);        
        this.journalStore.getJournalListByPeriod({current_period: this.currentPeriod})
        this.toast.info(event, 'Period changed to: ');
        this.changeDetectorRef.detectChanges();
    }
    ngOnInit(): void {

        this.initialDatagrid();

        var currentPeriod = localStorage.getItem('currentPeriod');        
        if (currentPeriod === null) {
            currentPeriod = 'January 2025';
        }

        this.ngrxStore.dispatch(accountPageActions.children());
        this.ngrxStore.dispatch(FundsActions.loadFunds());

        this.activatedRoute.data.pipe(take(1)).subscribe((data) => {            
            this.journalStore.getOpenJournalListByPeriod({current_period: currentPeriod})
            this.journalHeader = data.journal[0];
            this.accountList = data.journal[1];
            this.subtypeList = data.journal[2];
            this.templateList = data.journal[3];
            this.partyList = data.journal[4];            
            this.refreshJournalForm(this.journalHeader);
        });

        this.journalForm.valueChanges.pipe(takeUntil(this.destroyJournalForm$)).subscribe((value) => {
            if (value === undefined) {
                this.bHeaderDirty = false;                
            }
            else {
                this.bHeaderDirty = true;                
                console.debug('Header form : ', JSON.stringify(value));                
            }
        });

        this.partyCtrl.valueChanges.subscribe((value) => {
            if (value === undefined) {
                this.bHeaderDirty = false;
                console.debug('Header is true!! ', value);
            }
            else {
                this.bHeaderDirty = true;
                this.journalHeader.party_id = value.party_id;
                console.debug('Header is false!! ', value);
            }
        });


        this.detailForm.valueChanges.pipe(takeUntil(this.destroyDetailForm$)).subscribe((value) => {
            if (value === undefined) {
                this.bDetailDirty = false;                
            }
            else {
                this.bDetailDirty = true;
                console.debug('Detail form : ', JSON.stringify(value));                
            }
        });

        this.templateCtrl.valueChanges.subscribe((value) => {
            if (value === undefined) {
                this.bHeaderDirty = false;
                console.debug('Header is true!! ', value);
            }
            else {

                this.bHeaderDirty = true;
                this.journalHeader.type = value.journal_type;
                console.debug('Header is false!! ', JSON.stringify(value));
            }
        });

        this.bHeaderDirty = false;                
        this.bDetailDirty = false;      

    }

    public menuItems: MenuItemModel[] = 
    [{
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
    }, ];
    public onEdit() {
        this.drawer().open();
        this.toastr.success('Transaction saved');
    }
    public onSaved(args: any) {
        this.toastr.success('Transaction saved', args);
    }

    onExportPDF() {
        let transaction = document.getElementById('target');
    
        html2PDF(transaction, {
    
          jsPDF: {
            orientation: 'landscape',
            unit: 'pt',
            format: 'a4',
          },
          html2canvas: {
            imageTimeout: 15000,
            logging: true,
            useCORS: false,
            scale: 1
          },
          imageType: 'image/jpeg',
          imageQuality: 2,
          margin: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
          watermark: undefined,
          autoResize: true,
          init: function () { },
          success: function (pdf) {
            var dReportDate = new Date().toISOString().slice(0, 10);   ;
            pdf.save(`JournalTransaction${dReportDate}.pdf`);
          }
        });
    
      }
    
      onPrint() {
        this.onExportPDF();    
      }
      
    public itemSelect(args: MenuEventArgs): void {
        switch (args.item.id) {
            case 'edit':
                this.onEdit();
                break;
            case 'evidence':
                this.onAddEvidence();
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
        var rc = false;
        if (this.bHeaderDirty === false || this.bDetailDirty === false) {            
            this.router.navigate(["/journals"]);                    
        } else {
            const confirmation = this.fuseConfirmationService.open({
                title: "Unsaved Changes",
                message:
                    "Would you like to save the changes before the edit window is closed and the changes lost?  ",
                actions: {
                    confirm: {
                        label: "Save and Close",
                    },
                },
            });
            // Subscribe to the confirmation dialog closed action
            confirmation.afterClosed().subscribe((result) => {
                if (result === "confirmed") {
                    this.onUpdateJournalHeader(this.journalHeader.journal_id);                    
                }                
                this.router.navigate(["/journals"]);                                                           
            });
        }
                
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

    changeAccount(e: any) {
        console.debug('change Account: ', e);
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
        this.journalStore.loadTemplateDetails(value.journal_no.toString());
        this.bHeaderDirty = false;
    }

    protected filterParty() {
        if (!this.partyList) {
            return;
        }
        let search = this.partyFilterCtrl.value;
        if (!search) {
            this.partyFilter.next(this.partyList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        this.partyFilter.next(
            this.partyList.filter(party => party.party_id.toLowerCase().indexOf(search) > -1)
        );
    }


    protected filterTemplate() {
        if (!this.journalStore.templates()) {
            return;
        }
        // get the search keyword
        let search = this.templateFilterCtrl.value;
        if (!search) {
            this.templateFilter.next(this.journalStore.templates().slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.templateFilter.next(
            this.journalStore.templates().filter(template => template.description.toLowerCase().indexOf(search) > -1)
        );
    }



    
    public ngAfterViewInit() {

        this.templateFilter.next(this.templateList.slice());

        this.partyFilter.next(this.partyList.slice())

        if (this.templateFilter && this.singleTemplateSelect() != null)
            this.templateFilter
                .pipe(take(1), takeUntilDestroyed())
                .subscribe(() => {
                    if (this.singleTemplateSelect() != null || this.singleTemplateSelect() != undefined)
                        this.singleTemplateSelect().compareWith = (a: IJournalTemplate, b: IJournalTemplate) => a && b && a.template_ref === b.template_ref;
                });

        if (this.partyFilter && this.singlePartySelect() != null)
            this.partyFilter
                .pipe(take(1), takeUntilDestroyed())
                .subscribe(() => {
                    if (this.singlePartySelect() != null || this.singlePartySelect() != undefined)
                        this.singlePartySelect().compareWith = (a: IParty, b: IParty) => a && b && a.party_id === b.party_id;
                });

        

        if (this.filteredDebitAccounts)
            this.filteredDebitAccounts
                .pipe(take(1) ).pipe(takeUntil(this._onDestroyDebitAccountFilter))
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
        const urlTree = this.router.createUrlTree(["journals/gl", queryData.journal_id]);
        this.refreshJournalForm(queryData);
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
        this.editArtifactSettings = {
            allowEditing: true,
            allowAdding: false,
            allowDeleting: false,
        };
        this.filterSettings = { type: "CheckBox" };
        this.initialSort = {
            columns: [{ field: 'journal_id', direction: 'Descending' },]
        };

        this.detailSort = {
            columns: [{ field: 'debit', direction: 'Descending' },]
        };

    }

    public onEditJournal(id: number) {
        this.journalStore.loadDetails(id);
        this.journalHeader = this.journalStore.gl().find((x) => x.journal_id === id);
        this.refreshJournalForm(this.journalHeader);
        this.closeDrawer();
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

    public OnDoubleClick(data: IJournalDetail): void {
        this.currentRowData = data;
        const name = this.auth.currentUser.email.split("@")[0];
        const dDate = new Date();
        let currentDate = dDate.toISOString().split("T")[0];

        const JournalDetail = {
            ...data,
            create_date: currentDate,
            create_user: '@' + name,
        } as IJournalDetail;

        this.updateDetailForm(JournalDetail);

    }

    private updateDetailForm(journalDetail: IJournalDetail) {
        const accountString = journalDetail.child.toString();

        this.detailForm.patchValue({
            description: journalDetail.description,
            accounts: {
                dropdown: journalDetail.child
            },
            subtype: {
                dropdown: journalDetail.sub_type
            },
            fund: journalDetail.fund,
            debit: journalDetail.debit,
            credit: journalDetail.credit,
            reference: journalDetail.reference,

        });
        this.bHeaderDirty = false;

        this.accountDropDown().setDropdownValue(accountString);
        this.subtypeDropDown().setDropdownValue(journalDetail.sub_type);

        this.openDrawer();
    }

    public detailRowDoubleClick(args: SaveEventArgs): void {
        if (args.requestType === "beginEdit" || args.requestType === "add") {
            args.cancel = true;
            var rowData = args.rowData as IJournalDetail;
            this.OnDoubleClick(rowData);
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
        this.journalStore.updateArtifacts(e);
        this.bHeaderDirty = false;

    }


    public refreshJournalForm(header: IJournalHeader) {

        

        this.journalForm.patchValue({
            description: header.description,
            amount: header.amount,
            transaction_date: header.transaction_date,
            invoice_no: header.invoice_no
        });


        this.templateCtrl.setValue(
            this.templateList.find((x) => x.template_name === header.template_name)
        );

        this.partyCtrl.setValue(
            this.partyList.find((x) => x.party_id === header.party_id)
        );


        this.journalStore.loadDetails(header.journal_id);
        this.journalStore.loadArtifactsByJournalId(header.journal_id);

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

        confirmation.afterClosed().pipe(takeUntilDestroyed()).subscribe((result) => {
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

        confirmation.afterClosed().pipe(takeUntilDestroyed()).subscribe((result) => {
            if (result === "confirmed") {
            }
        });
    }

    // Create template from the current transaction
    public onCreateTemplate() {
        const confirmation = this.fuseConfirmationService.open({
            title: "Create Template",
            message:
                "Would you like to create a template based upon the current transaction? ",
            actions: {
                confirm: {
                    label: "Journal Template",
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().pipe(takeUntilDestroyed()).subscribe((result) => {
            if (result === "confirmed") {
                var journalParam: ITemplateParams = {
                    journal_id: this.journalHeader.journal_id,
                    template_description: this.journalHeader.description,
                    templateType: this.journalHeader.type,
                };
                this.journalStore.createJournalTemplate(journalParam);
            }
        });
    }

    // Add evidence 
    public onAddEvidence() {

        const dialogRef = this.matDialog.open(DndComponent, {
            width: "450px",
            data: {
                journal_id: this.journalHeader.journal_id,
                reference: this.journalHeader.invoice_no,
                description: this.journalHeader.description,
                location: '',
                date_created: new Date().toISOString().split('T')[0],
                user_created: '@' + this.auth.currentUser.email.split('@')[0],
            } as IArtifacts,
        });

        dialogRef.afterClosed().pipe(takeUntilDestroyed()).subscribe((result: any) => {
            if (result === undefined) {
                result = { event: "Cancel" };
            }
            switch (result.event) {
                case "Create":
                    this.journalStore.createArtifacts(result.data);
                    break;
                case "Cancel":
                    break;
            }
        });

    }

    public onCloseTransaction() {
        const confirmation = this.fuseConfirmationService.open({
            title: "Close Transaction",
            message:
                "Closing the transaction will commit the transaction and no longer to be edited. Are you sure you want to close the transaction? ",
            actions: {
                confirm: {
                    label: "Commit Transaction",
                },
            },
        });

        confirmation.afterClosed().pipe(takeUntilDestroyed()).subscribe((result) => {
            if (result === "confirmed") {
            }
        });
    }


    // On delete journal detail
    public onDeleteDetail() {

        const inputs = { ...this.journalForm.value } as IJournalHeader

        var journalDetail = {
            journal_id: inputs.journal_id,
            journal_subid: this.currentRowData.journal_subid,
        };

        const confirmation = this._fuseConfirmationService.open({
            title: `Delete transaction detail item: ${journalDetail.journal_id}-${journalDetail.journal_subid} `,
            message: "Are you sure you want to delete this line entry? ",
            actions: {
                confirm: {
                    label: "Delete",
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        var sub = confirmation.afterClosed().pipe(takeUntilDestroyed()).subscribe((result) => {
            // If the confirm button pressed...
            if (result === "confirmed") {
                this.journalStore.deleteJournalDetail(journalDetail);
                this.journalStore.loadDetails(inputs.journal_id);
                this.journalStore.loadArtifactsByJournalId(inputs.journal_id);
                this.bDetailDirty = false;
                this.closeDrawer();
            }
        });


    }

    // On delete journal detail
    public onDelete(args: any) {
        const inputs = { ...this.journalForm.value }
        const index = (this.grid as GridComponent).getSelectedRowIndexes();
        const rowData = this.grid.getCurrentViewRecords().at(index[0]) as any;
        var journalDetail = {
            journal_id: this.currentRowData.journal_id,
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

        confirmation.afterClosed().pipe(takeUntilDestroyed()).subscribe((result) => {
            if (result === "confirmed") {
                this.journalStore.deleteJournalDetail(journalDetail);
                this.bDetailDirty = false;
            }
        });
    }

    public onOpenEmptyDrawer() {
        this.openDrawer();
    }

    // add a new line entry
    public onNewLineItem() 
    {
        
        const updateDate = new Date().toISOString().split("T")[0];
        var max = 0;

        this.journalStore.details().forEach((details) => {
            if (details.journal_subid > max) {
                max = details.journal_subid;
            }
        });

        if (this.currentRowData.journal_id === 0) {
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

        const debit = Number(detail.debit);
        const credit = Number(detail.credit);
        const childAccount = this.debitCtrl.getRawValue();
        const sub_type = this.subtypeCtrl.value;
        const fund = this.fundCtrl.value;
        const child_desc = this.journalStore.accounts().find((x) => x.child === Number(childAccount.child)).description;


        if (debit > 0 && credit > 0) {
            this.toastr.show('Only one of the debit field and credit field may be greater than zero!', 'Failed');
            return;
        }

        const journalDetail = {
            journal_id: this.currentRowData.journal_id,
            journal_subid: this.currentRowData.journal_subid,
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
        const inputs = { ...this.journalForm.value } as IJournalHeader;
        this.detailForm.reset();
        this.debitCtrl.reset();
        this.journalStore.renumberJournalDetail(inputs.journal_id);
    }

    public onHeaderDateChanged(event: any): void {
        this.transactionDate = event.value;
        this.bHeaderDirty = true;
        console.debug('Header is true 4');
    }

    onUpdateJournalHeader(e: any) {

        let header = this.journalForm.getRawValue();
        let template = this.templateCtrl.value;
        var partyId: string = '';

        if (template.journal_type !== 'GL') {
            var party = this.partyCtrl.getRawValue();
            partyId = this.partyList.find((x) => x.party_id === party.party_id).party_id;
        }
        else {
            this.partyId = '';
        }

        if (this.transactionDate !== undefined) {
            header.transaction_date = this.transactionDate.toISOString().split("T")[0];
        }

        const journalHeaderUpdate: IJournalHeader = {
            journal_id: this.journalHeader.journal_id,
            type: this.journalHeader.type,
            booked: this.journalHeader.booked,
            period: this.journalHeader.period,
            period_year: this.journalHeader.period_year,
            booked_user: this.journalHeader.booked_user,
            description: header.description,
            transaction_date: header.transaction_date,
            amount: Number(header.amount),
            template_name: template.template_name,
            party_id: partyId,
            invoice_no: header.invoice_no
        };

        this.journalStore.updateJournalHeader(journalHeaderUpdate);
        this.toastr.success(`Journal header updated : ${this.journalHeader.journal_id}`);
        this.bHeaderDirty = false;
    }
    // Create or new journal entry
    public onCreate() {

        var header = this.journalForm.getRawValue();
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

        const journalDetail = {
            journal_id: this.currentRowData.journal_id,
            journal_subid: this.currentRowData.journal_subid,
            account: this.currentRowData.account,
            child: detail.accounts.dropdown,
            child_desc: this.journalStore.accounts().find((x) => x.child === Number(detail.accounts.dropdown)).description,
            description: detail.description,
            create_date: updateDate,
            create_user: name,
            sub_type: detail.subtype.dropdown,
            debit: debit,
            credit: credit,
            reference: detail.reference,
            fund: detail.fund,
        };

        const journalHeader: any = {
            description: header.description,
            transaction_date: header.transaction_date,
            amount: header.amount,
        };

        this.toastr.success('Journal details updated');

        this.bHeaderDirty = false;
        this.debitCtrl.reset();
    }

    onAddLineItem() {
        this.onNewLineItem();
    }

    onUpdateJournalDetail() {

        const detail = this.detailForm.getRawValue();
        const dDate = new Date();
        const updateDate = dDate.toISOString().split("T")[0];
        const userName = '@' + this.auth.currentUser?.email.split("@")[0];
        const credit = Math.abs(Number(detail.credit));
        const debit = Math.abs(Number(detail.debit));
        const subtype = this.subtypeDropDown().getDropdownValue();
        const child = this.accountDropDown().getDropdownValue();

        // Check for correct child accounts coming from the template
        // Sum the debits and the credits to make sure they are equal

        if (debit > 0 && credit > 0) {
            this.toastr.show('Only one of the debit field and credit field may be greater than zero!', 'Failed');
            return;
        }

        const journalDetail = {
            journal_id: this.currentRowData.journal_id,
            journal_subid: this.currentRowData.journal_subid,
            account: Number(child.account),
            child: Number(child.child),
            child_desc: child.description,
            description: detail.description,
            create_date: updateDate,
            create_user: userName,
            sub_type: subtype,
            debit: debit,
            credit: credit,
            reference: detail.reference,
            fund: detail.fund
        };

        const details$ = this.journalStore.updateJournalDetail(journalDetail);

        this.toastr.success(`Journal details updated:  ${journalDetail.journal_id} - ${journalDetail.journal_subid} `);

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
        this.destroyJournalForm$.next()
        this.destroyJournalForm$.complete();
        this.destroyDetailForm$.next();
        this.destroyDetailForm$.complete();
    }

    @HostListener("window:exit")
    public  exitWindow(): boolean {
        var rc = false;
     
        // if (this.bHeaderDirty === false || this.bDetailDirty === false) {            
        //     rc = true;
        // } else {
        //     const confirmation = this.fuseConfirmationService.open({
        //         title: "Unsaved Changes",
        //         message:
        //             "Would you like to save the changes before the edit window is closed and the changes lost?  ",
        //         actions: {
        //             confirm: {
        //                 label: "Close Without Saving",
        //             },
        //         },
        //     });
        //     // Subscribe to the confirmation dialog closed action
        //     confirmation.afterClosed().pipe(takeUntilDestroyed()).subscribe((result) => {
        //         if (result === "confirmed") {
        //             this.journalStore.updateJournalHeader(this.journalHeader);
    
        //             const prd = {
        //                 period: this.journalHeader.period,
        //                 period_year: this.journalHeader.period_year
        //             }                    
        //             this.journalStore.updateDistributionListing(prd);
        //             return rc
        //         }               
        //     });
        //  return rc;

        // }
        return rc;
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
