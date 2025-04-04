import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, inject, signal, viewChild } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ReplaySubject, Subject, Subscription, take, takeUntil } from "rxjs";
import { CommonModule } from "@angular/common";
import { DndComponent } from "app/features/drag-n-drop/loaddnd/dnd.component";
import { GridMenubarStandaloneComponent } from "../../../grid-components/grid-menubar.component";
import { MaterialModule } from "app/shared/material.module";
import { MatDialog } from "@angular/material/dialog";
import { NgxMaskDirective, provideNgxMask } from "ngx-mask";
import { FuseConfirmationService } from "@fuse/services/confirmation";

import { DropDownListAllModule } from "@syncfusion/ej2-angular-dropdowns";

import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { IDropDownAccounts, IDropDownAccountsGridList, IFunds, IJournalParams } from "app/models";

import { AUTH } from "app/app.config";

import { loadTemplates } from "./Template.Action";

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
    load,
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
} from "app/models/journals";

import { Router, ActivatedRoute, NavigationStart } from "@angular/router";
import { Location } from "@angular/common";
import { MatDrawer } from "@angular/material/sidenav";
import { JournalStore } from "app/store/journal.store";
import { Splitter, SplitterComponent, SplitterModule } from '@syncfusion/ej2-angular-layouts';
import { EvidenceCardComponent } from "app/features/file-manager/file-manager-card/evidence-card.component";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";

import { ToastrService } from "ngx-toastr";
import { JournalService } from "app/services/journal.service";
import { accountsFeature } from "../../../static/accts/Accts.state";
import { accountPageActions } from "../../../static/accts/Accts-page.actions";
import { DropDownAccountComponent } from "../../../grid-components/drop-down-account.component";
import { Store } from '@ngrx/store';
import { subTypePageActions } from "../../../static/subtype/sub-type-page.actions";
import { FundsActions } from "../../../static/funds/Funds.Action";
import { subtypeFeature } from "../../../static/subtype/sub-type.state";
import { FundsDropDownComponent } from "../../../grid-components/drop-down.funds.component";
import { SubtypeDropDownComponent } from "../../../grid-components/drop-down.subtype.component";
import { isFundsLoading, selectFunds } from "../../../static/funds/Funds.Selector";
import { PartyDropDownComponent } from "../../../grid-components/drop-down-party.component";
import { getTemplates, isTemplateLoading } from "./Template.Selector";
import { partyFeature } from "../../../static/party/party.state";
import { partyPageActions } from "../../../static/party/party-page.actions";

import { IParty } from "app/models/party";
import { MatSelect } from "@angular/material/select";

import { ISubType } from "app/models/subtypes";

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
    EvidenceCardComponent,
    DropDownAccountComponent,
    SubtypeDropDownComponent,
    FundsDropDownComponent,

];

interface journalData {
    currentJournal: IJournalHeader;
    templates: IJournalTemplate[];
    parties: IParty[];
    accounts: IDropDownAccounts[];
    subtypes: ISubType[];
    funds: IFunds[];
    details: IJournalDetail[];
    artifacts: IArtifacts[];
}

@Component({
    template: `
    <div id="target" class="flex flex-col w-full filter-article filter-interactive text-gray-700 ">
    <div class="sm:hide md:visible ml-5 mr-5">
        <grid-menubar 
            class="pl-5 pr-5"            
            [showBack]="true" 
            (back)="onBack()"  
            (clone)="onClone('GL')"           
            [inTitle]="'General Ledger Transactions Update'" 
            [prd]="store.currentPeriod()"
            [prd_year]="store.currentYear()">
        </grid-menubar>
    </div>

    <mat-drawer class="w-full md:w-[450px]" #drawer [opened]="false" mode="over" [position]="'end'" [disableClose]="true">
                    <mat-tab-group>
                        <mat-tab label="Details">
                            <mat-card class="">
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
                                            @if (accounts$ | async; as accounts ) {
                                                <account-drop-down [dropdownList]="accounts" controlKey="account" label="Account" #accountDropDown></account-drop-down>
                                            }
                                        }

                                         <!-- Drop down Sub Type -->
                                        @if((isSubtypeLoading$ | async) === false) {   
                                            @if (subtypes$ | async; as subtypes) {
                                            <subtype-drop-down [dropdownList]="subtypes" controlKey="subtype" label="Sub Type" #subtypeDropDown></subtype-drop-down>
                                            }
                                        }
                                       
                                        <!-- Drop down Funds -->
                                       @if((isFundsLoading$ | async) === false) {   
                                            @if (funds$ | async; as funds) {
                                            <funds-drop-down [dropdownList]="funds" controlKey="fund" label="Funds" #subFundDropDown></funds-drop-down>
                                            } 
                                        }
                                        
                                        
                                        <mat-form-field class="flex-col ml-2 mr-2 mt-1 grow">
                                            <mat-label class="text-md ml-2">Description</mat-label>
                                            <input matInput placeholder="Description" formControlName="description" [placeholder]="'Description'" />
                                            <mat-icon class="icon-size-5 text-lime-700" matSuffix  [svgIcon]="'heroicons_solid:calculator'"></mat-icon>
                                        </mat-form-field>


                                        <!-- Reference  -->
                                        <mat-form-field class="flex-col grow mr-2 ml-2 mt-1">
                                            <mat-label class="text-md ml-2">Reference</mat-label>
                                            <input matInput placeholder="Reference" formControlName="reference" [placeholder]="'Reference'" />
                                            <mat-icon class="icon-size-5 text-lime-700" matSuffix [svgIcon]="'heroicons_solid:document'"></mat-icon>
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

    @defer (on viewport; on timer(200ms)) {
        <mat-drawer-container id="target" class="control-section default-splitter flex flex-col  h-[calc(100vh-14rem)] ml-5 mr-5 overview-hidden " [hasBackdrop]="'false'">
            <section class="pane1 overflow-hidden">
                
                <ejs-splitter #splitterInstance id="nested-splitter" (created)='onCreated()' class="h-[calc(100vh-14rem)]" separatorSize=3 width='100%'>
                    <e-panes>
                        <!-- Transaction List Side Section -->
                        <e-pane min='60px' size='25%' class="w-72">                                        
                            <ng-template #content>
                                <div class="text-3xl gap-2 m-1 text-gray-100 p-2 bg-slate-600 rounded-md">
                                            Transaction List
                                </div>
                                    <mat-card class="mat-elevation-z8 h-[calc(100vh-14.2rem)]">                                        
                                        <ejs-grid id="grid-journal-list" [dataSource]='store.gl()'
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
                                            <e-column field='journal_id'  headerText='ID' [visible]='true' isPrimaryKey='true' width='80'></e-column>
                                            <e-column field="type" headerText="Type"   [visible]='true' width="70" dataType="text" textAlign="Center">
                                                <ng-template #template let-data>                       
                                                    @if(data.type === 'GL') {
                                                        <div>                                                        
                                                            <span class="text-gray-300 bg-green-700 p-1 rounded-xl">{{data.type}}</span> 
                                                        </div>
                                                    } 
                                                    @else {
                                                        <div>                                                        
                                                            <span class="text-gray-300 bg-blue-800 p-1 rounded-xl">{{data.type}}</span> 
                                                        </div>
                                                    }   
                                                </ng-template>    
                                                </e-column>
                                                
                                                <e-column field='description' headerText='Journal Description'   [visible]='true'></e-column>
                                                <e-column field='amount'      headerText='Amount' [visible]='false'  textAlign='Right' width='150' format="N2"></e-column>
                                                <e-column field="booked"      headerText="Booked" [visible]='false' width="100" [displayAsCheckBox]='true' type="boolean"></e-column>
                                                <e-column field="amount"      headerText="Amount" [visible]='false' width="150"  format='N2' textAlign="Right"></e-column>
                                                <e-column field="period"      headerText="Prd"    [visible]='false' width="100"></e-column>
                                                <e-column field="period_year" headerText="Yr"     [visible]='false' width="100"></e-column>
                                            </e-columns>
                                        </ejs-grid>
                                    </mat-card>
                                
                            </ng-template>
                        </e-pane>
                                                
                        <!-- Header Section -->
                        <e-pane>
                            <ng-template #content>
                                <div id='vertical_splitter' class="vertical_splitter overflow-hidden">                                    
                                        <div class="content overflow-hidden">
                                            @if (journalHeader().journal_id > 0) {
                                                <div class="text-3xl gap-2 m-1 text-gray-100 p-2 bg-slate-600 rounded-md">
                                                    @if (journalHeader().type == 'GL') {
                                                        General Ledger : {{ journalHeader().journal_id }}
                                                    } 
                                                    @if (journalHeader().type == 'AP') {
                                                        Accounts Payable : {{ journalHeader().journal_id }}
                                                    }
                                                    @if (journalHeader().type == 'AR') {
                                                        Accounts Receivable : {{ journalHeader().journal_id }}
                                                    }                                                
                                                </div>
                                            } @else {
                                            <div class="text-3xl gap-2 m-1 text-gray-100 p-2 bg-slate-600 rounded-md">
                                                General Ledger
                                            </div>
                                            }
                                            <form [formGroup]="journalForm">
                                                <section class="flex flex-col md:flex-row"> 
                                                    <!-- @if ((isTemplateLoading$ | async) === false) {                                                       
                                                    @if (templateFilter | async; as templates ) {
                                                        <div class="flex flex-col w-[350px] text-green-700">                                                                                                                                 
                                                            <template-drop-down [dropdownList]="templates" controlKey="template" label="Template" #templateDD></template-drop-down> 
                                                        </div> }}  -->

                                                        @if (templateFilter | async; as templates ) {
                                                            <mat-form-field class="mt-1 ml-1 mr-1 flex-start w-[350px]">
                                                                
                                                                <mat-select [formControl]="templateCtrl" placeholder="Journal Template"  #singleTemplateSelect required>
                                                                    <mat-option>
                                                                        <ngx-mat-select-search [formControl]="templateFilterCtrl"
                                                                            [noEntriesFoundLabel]="'No entries found'" [placeholderLabel]="'Search'">
                                                                        </ngx-mat-select-search>
                                                                    </mat-option>
                                                                    @for (template of templates; track template) {
                                                                    <mat-option [value]="template">{{template.description}}</mat-option>
                                                                    }
                                                                </mat-select>
                                                                <mat-icon class="icon-size-5 text-green-700" matPrefix
                                                                    [svgIcon]="'heroicons_solid:document-chart-bar'"></mat-icon>
                                                            </mat-form-field>
                                                        }   

                                                    
                                                    <div class="flex flex-col grow">
                                                        <mat-form-field class="mt-1 ml-1 mr-1 flex-start">
                                                            <input matInput placeholder="Journal Description"
                                                                formControlName="description" />
                                                            <mat-icon class="icon-size-5 text-green-700" matPrefix 
                                                                [svgIcon]="'heroicons_solid:document'"></mat-icon>
                                                        </mat-form-field>
                                                    </div>                                                    
                                                        @if (journalHeader().type === 'GL') {
                                                            <mat-form-field class="mt-1 ml-1 mr-1 w-[250px]">
                                                                <input type="text" class="text-left" matInput
                                                                    placeholder="Reference Number" formControlName="invoice_no" />
                                                                <mat-icon class="icon-size-5 text-green-700" matPrefix
                                                                    [svgIcon]="'heroicons_solid:clipboard-document-check'"></mat-icon>
                                                            </mat-form-field>
                                                        }
                                                        <div class="flex flex-col w-[150px]">
                                                            <mat-form-field class="mt-1 flex-start mr-1">
                                                                <input type="text" mask="separator.2" [leadZero]="true"
                                                                    thousandSeparator="," class="text-right" matInput
                                                                    placeholder="Amount" formControlName="amount"
                                                                    [placeholder]="'Transaction Total'" />
                                                                <mat-icon class="icon-size-5 text-green-700" matPrefix
                                                                    [svgIcon]="'heroicons_solid:currency-dollar'"></mat-icon>
                                                            </mat-form-field>
                                                        </div>
                                                        <div class="flex flex-col w-[150px]">
                                                            <mat-form-field class="mt-1 flex-start mr-1">
                                                                <input matInput (dateChange)="onHeaderDateChanged($event)"
                                                                    formControlName="transaction_date"
                                                                    [matDatepicker]="picker" />
                                                                <mat-datepicker-toggle matIconPrefix class="text-green-700"
                                                                    [for]="picker"></mat-datepicker-toggle>
                                                                <mat-datepicker #picker></mat-datepicker>
                                                            </mat-form-field>
                                                        </div>
                                                </section>

                                                <section class="flex flex-col md:flex-row">
                                                    @if (journalHeader().type !== 'GL') {
                                                        @if (partyFilter | async; as parties ) {
                                                            <mat-form-field class="ml-1 mr-1 flex-start w-[350px]">
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
                                                                <mat-icon class="icon-size-5 text-green-700" matPrefix
                                                                    [svgIcon]="'heroicons_solid:currency-dollar'"></mat-icon>
                                                            </mat-form-field>
                                                        }
                                                        <mat-form-field class="mt-1 ml-1 mr-1 grow">
                                                                <input type="text" class="text-left" matInput
                                                                    placeholder="Reference Number" formControlName="invoice_no" />
                                                                <mat-icon class="icon-size-5 text-green-700" matPrefix
                                                                    [svgIcon]="'heroicons_solid:clipboard-document-check'"></mat-icon>
                                                            </mat-form-field>
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
                                                } @else {
                                                    <button mat-icon-button color="primary"
                                                    class="bg-gray-200 hover:bg-slate-400 ml-1" 
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
                                                        [dataSource]="store.details()" 
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
                                                                        <ng-template #footerTemplate
                                                                            let-data>{{data.Sum}}</ng-template>
                                                                    </e-column>
                                                                    <e-column type="Sum" field="credit" format="N2">
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
                                    
                                    <div>
                                        <div class="content overflow-hidden">
                                            @defer () {
                                            <div class="text-3xl m-1 text-gray-100 p-2 bg-slate-600 rounded-md">Transaction
                                                Artifacts
                                            </div>
                                            <div class="flex flex-col h-full ml-1 mr-1 text-gray-800">

                                                <ejs-grid id="grid" #grid [dataSource]="store.artifacts()" [rowHeight]="30"
                                                    allowEditing='false' [editSettings]='editArtifactSettings'
                                                    [allowFiltering]='false' [allowRowDragAndDrop]='false'
                                                    [gridLines]="'Both'" (actionBegin)="actionSelectJournal($event)"
                                                    (rowDrop)="rowDrop($event)" (rowDrag)="rowDrag($event)">

                                                    <e-columns>
                                                        <e-column field='id' headerText='ID' [visible]='false' isPrimaryKey='true' width='100'></e-column>
                                                        <e-column field='description' headerText='Description' width='300'></e-column>
                                                        <e-column field='location' headerText='Location' [visible]='false'></e-column>
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
export class JournalUpdateComponent_Ngrx implements OnInit, OnDestroy, AfterViewInit {

    @Output() notifyDrawerClose: EventEmitter<any> = new EventEmitter();

    protected _onTemplateDestroy = new Subject<void>();
    protected _onDestroyTemplateFilter = new Subject<void>();

    public accountDropDown = viewChild(DropDownAccountComponent)
    public subtypeDropDown = viewChild(SubtypeDropDownComponent)
    public fundDropDown = viewChild(FundsDropDownComponent)
    public templateDropDown = viewChild<MatSelect>("singleTemplateSelect")
    public partyDropDown = viewChild<PartyDropDownComponent>("partyDropDown")

    public templateList: IJournalTemplate[] = [];
    public templateCtrl: FormControl<IJournalTemplate> = new FormControl<IJournalTemplate>(null);
    public templateFilterCtrl: FormControl<string> = new FormControl<string>(null);
    public templateFilter: ReplaySubject<IJournalTemplate[]> = new ReplaySubject<IJournalTemplate[]>(1);

    public partyList: IParty[] = [];
    public partyCtrl: FormControl<IParty> = new FormControl<IParty>(null);
    public partyFilterCtrl: FormControl<string> = new FormControl<string>(null);
    public partyFilter: ReplaySubject<IParty[]> = new ReplaySubject<IParty[]>(null);

    @ViewChild("singlePartySelect", { static: true }) singleParty: MatSelect;

    public toolbarTitle: string = "General Ledger Transactions Update";
    private fuseConfirmationService = inject(FuseConfirmationService);

    private auth = inject(AUTH);
    private activatedRoute = inject(ActivatedRoute);
    private toastr = inject(ToastrService);
    private journalService = inject(JournalService);
    public matDialog = inject(MatDialog);
    public drawer = viewChild<MatDrawer>("drawer");

    public bDetailDirty = false;
    public transaction: string = '';
    public transactionDate: Date = new Date();
    public partyId: string = '';

    public bDirty = false;

    // create template details only one
    bTemplateDetails = false;

    public animation = {
        effect: 'FadeIn',
        duration: 800
    };


    private _location = inject(Location);
    private router = inject(Router);
    public store = inject(JournalStore);

    public contextmenu: ContextMenuComponent;
    public value = 0;
    public loading = false;
    public height: string = "250px";


    // Internal control variables
    public currentRowData: IJournalDetail;
    public bHeaderDirty = false;


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

    public message?: string;
    public description?: string;

    @ViewChild("grid")
    public grid!: GridComponent;
    public gridControl = viewChild<GridComponent>("grid");
    public transactionType = 'GL';

    public accountsGrid: IDropDownAccountsGridList[] = [];
    public dFields = { text: "child", value: "child" };


    public subtypeCtrl: FormControl<string> = new FormControl<string>(null);
    public fundCtrl: FormControl<string> = new FormControl<string>(null);
    public key: number;

    public journalDetailSignal = signal<IJournalDetail[]>(null);
    public journalHeader = signal<IJournalHeader>(null);
    protected _onDestroy = new Subject<void>();

    columnsToDisplay: string[] = ["journal_id", "description"];
    toolbarOptions = ['Search']

    @ViewChild('splitterInstance') splitterObj?: SplitterComponent;

    Store = inject(Store);

    // Accounts
    accounts$ = this.Store.select(accountsFeature.selectChildren);
    isLoading$ = this.Store.select(accountsFeature.selectIsLoading);

    // Funds
    funds$ = this.Store.select(selectFunds);
    isFundsLoading$ = this.Store.select(isFundsLoading);

    // Templates    
    //template$ = this.Store.select(getTemplates);     
    isTemplateLoading$ = this.Store.select(isTemplateLoading);

    toast = inject(ToastrService);

    // Subtypes
    subtypes$ = this.Store.select(subtypeFeature.selectSubtype);
    isSubtypeLoading$ = this.Store.select(subtypeFeature.selectIsLoading);

    // Party    
    // party$ = this.Store.select(partyFeature.selectParty);
    partyLoading$ = this.Store.select(partyFeature.selectIsLoading);

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    // Forms
    journalForm = new FormGroup({
        journal_id: new FormControl(0),
        description: new FormControl('', Validators.required),
        amount: new FormControl(0, Validators.required),
        transaction_date: new FormControl('', Validators.required),
        invoice_no: new FormControl(''),
        booked: new FormControl(false),
        booked_user: new FormControl(''),
        period: new FormControl(0),
        period_year: new FormControl(0),
        type: new FormControl(''),
        template_name: new FormControl(''),
        subtype: new FormControl(''),
        party_id: new FormControl(''),
        partyFilterCtrl: new FormControl(''),
        templateFilterCtrl: new FormControl(''),
    });

    detailForm = new FormGroup({
        journal_id: new FormControl(0),
        journal_subid: new FormControl(0),
        accounts: new FormGroup({
            dropdown: new FormControl(0, Validators.required),
        }),
        subtype: new FormGroup({
            dropdown: new FormControl('', Validators.required),
        }),
        fund: new FormGroup({
            dropdown: new FormControl('', Validators.required),
        }),
        description: new FormControl('', Validators.required),
        debit: new FormControl(0, Validators.required),
        credit: new FormControl(0, Validators.required),
        reference: new FormControl('', Validators.required),
    });

    constructor() {
        this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, newRowPosition: 'Top' };
        this.editArtifactSettings = { allowEditing: false, allowAdding: false, allowDeleting: false, newRowPosition: 'Top' };
        this.filterSettings = { type: 'Menu' };
        this.toolbar = ['Search'];
        this.selectionOptions = { type: 'Single' };
        this.searchOptions = { fields: ['description'], operator: 'contains', key: '', ignoreCase: true };
        this.formatoptions = { type: 'date', format: 'dd/MM/yyyy' };
        this.initialSort = { columns: [{ field: 'journal_id', direction: 'Descending' }] };
        this.detailSort = { columns: [{ field: 'journal_subid', direction: 'Ascending' }] };
    }
    ngOnInit(): void {

        this.Store.select(getTemplates).pipe(takeUntil(this._unsubscribeAll)).subscribe((templates) => {
            this.templateList = templates;
            this.templateFilter.next(templates);
        });

        this.Store.select(partyFeature.selectParty).pipe(takeUntil(this._unsubscribeAll)).subscribe((parties) => {
            this.partyList = parties;
            this.partyFilter.next(parties);
        });

        this.Store.dispatch(accountPageActions.children());
        this.Store.dispatch(subTypePageActions.load());
        this.Store.dispatch(FundsActions.loadFunds());
        this.Store.dispatch(partyPageActions.load());
        this.Store.dispatch(loadTemplates());



        this.onChanges();
        this.bHeaderDirty = false;
    }

    public ngAfterViewInit() {

        if (this.templateFilter)
            this.templateFilter
                .pipe(take(1), takeUntil(this._onTemplateDestroy))
                .subscribe(() => {
                    if (this.templateDropDown() != null || this.templateDropDown != undefined)
                        this.templateDropDown().compareWith = (a: IJournalTemplate, b: IJournalTemplate) => a && b && a.template_name === b.template_name;
                });

        if (this.partyFilter)
            this.partyFilter
                .pipe(take(1), takeUntil(this._onTemplateDestroy))
                .subscribe(() => {
                    if (this.singleParty != null || this.singleParty != undefined)
                        this.singleParty.compareWith = (a: IParty, b: IParty) => a && b && a.party_id === b.party_id;
                });

        this.activatedRoute.data.subscribe((data) => {
            const header = data.journal as IJournalHeader;
            this.store.loadDetails(data.journal.journal_id);
            this.store.loadArtifactsByJournalId(data.journal.journal_id);
            this.journalHeader.set(header);
            this.refreshHeader(header);
        });

    }

    public refreshHeader(header: IJournalHeader) {
        if (header === null || header === undefined) {
            return;
        }

        this.journalForm.patchValue({
            templateFilterCtrl: header.template_name,
            description: header.description,
            amount: header.amount,
            transaction_date: header.transaction_date,
            subtype: header.sub_type,
            invoice_no: header.invoice_no,
        });

        this.templateCtrl.setValue(this.templateList.find((x) => x.template_name === header.template_name));

        this.partyCtrl.setValue(
            this.partyList.find((x) => x.party_id === header.party_id)
        );

        this.bHeaderDirty = false;
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


    public updateHeaderData() {

        const updateDate = new Date().toISOString().split('T')[0];
        const inputs = { ...this.journalForm.value }
        const momentDate = new Date(inputs.transaction_date).toISOString().split('T')[0];
        const email = '@' + this.auth.currentUser?.email.split('@')[0];

        var party_id: string;
        var journalDetails: IJournalDetail[] = [];


        let count: number = 1;

        if (inputs.amount === 0) {
            return;
        }

        let journalHeader: IJournalHeader = {
            journal_id: inputs.journal_id,
            description: inputs.description,
            booked: false,
            booked_date: updateDate,
            booked_user: email,
            create_date: updateDate,
            create_user: email,
            period: Number(this.store.currentPeriod()),
            period_year: Number(this.store.currentYear()),
            transaction_date: momentDate,
            status: 'OPEN',
            type: inputs.type,
            sub_type: inputs.subtype,
            amount: Number(inputs.amount),
            party_id: party_id,
            template_name: inputs.template_name,
            invoice_no: inputs.invoice_no,
        }

        // Check for correct child accounts coming from the template

        this.store.templateDetails().forEach((templateDetail) => {
            let journalDetail: IJournalDetailUpdate = {
                journal_id: inputs.journal_id,
                journal_subid: count,
                account: Number(templateDetail.account),
                child: Number(templateDetail.child),
                description: templateDetail.description,
                create_date: updateDate,
                create_user: email,
                sub_type: templateDetail.subtype,
                debit: templateDetail.debit * journalHeader.amount,
                credit: templateDetail.credit * journalHeader.amount,
                reference: '',
                fund: templateDetail.fund,
            }
            journalDetails.push(journalDetail);
            count = count + 1;
        });

        this.journalDetailSignal.set(journalDetails);

        this.bDirty = true;
    }

    public onUpdate() {

        const inputs = { ...this.journalForm.value }
        if (inputs.amount === 0) {
            return;
        }
        var detail: Detail[] = this.journalDetailSignal();
        var journalArray: IJournalTransactions = {
            journal_id: this.journalHeader().journal_id,
            description: this.journalHeader().description,
            type: this.journalHeader().type,
            booked_user: this.journalHeader().booked_user,
            period: this.journalHeader().period,
            period_year: this.journalHeader().period_year,
            transaction_date: this.journalHeader().transaction_date,
            amount: this.journalHeader().amount,
            template_name: this.journalHeader().template_name,
            invoice_no: this.journalHeader().invoice_no,
            party_id: this.journalHeader().party_id,
            subtype: this.journalHeader().sub_type,
            details: { detail: detail }
        }

        this.journalService.createJournal(journalArray).pipe(takeUntil(this._onDestroy)).subscribe((response) => {
            this.ShowAlert(`Journal created  : ${response.description} ID: ${response.journal_id}`, "pass");
        });
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
        console.log('change fund: ', e);
        this.bDetailDirty = true;
    }

    changeSubtype(e: any) {
        console.log('change subtype: ', e);
        this.bDetailDirty = true;
    }

    changeTemplate(e: any) {
        console.log('change template: ', e);
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
        this.store.loadTemplateDetails(value.journal_no.toString());
        this.bHeaderDirty = false;
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
        this.router.navigate(["journals/gl", queryData.journal_id]);
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
        this.store.loadDetails(id);
        this.journalHeader.set(this.store.gl().find((x) => x.journal_id === id));
        this.refreshHeader(this.journalHeader());
        this.closeDrawer();
    }



    public OnDoubleClick(data: any): void {
        this.currentRowData = data;
        const name = this.auth.currentUser.email.split("@")[0];
        const dDate = new Date();
        let currentDate = dDate.toISOString().split("T")[0];

        const JournalDetail = {
            journal_id: data.journal_id,
            journal_subid: data.journal_subid,
            account: data.account,
            child: data.child,
            child_desc: data.child_desc,
            description: data.description,
            create_date: currentDate,
            create_user: '@' + name,
            sub_type: data.sub_type,
            debit: data.debit,
            credit: data.credit,
            reference: data.reference,
            fund: data.fund,
        } as IJournalDetail;

        this.updateDetailForm(JournalDetail);

    }


    private updateDetailForm(journalDetail: IJournalDetail) {
        const accountString = journalDetail.child.toString();
        const subtype = journalDetail.sub_type
        this.detailForm.patchValue({
            accounts: {
                dropdown: journalDetail.child
            },
            subtype: {
                dropdown: journalDetail.sub_type
            },
            fund: {
                dropdown: journalDetail.fund,
            },
            debit: journalDetail.debit,
            credit: journalDetail.credit,
            reference: journalDetail.reference,
            description: journalDetail.description,
        });

        this.accountDropDown().setDropdownValue(accountString);
        this.subtypeDropDown().setDropdownValue(subtype);

        this.bHeaderDirty = false;
        this.openDrawer();
    }

    public onChanges(): void {

        this.journalForm.valueChanges.subscribe((value) => {
            //this.bHeaderDirty = true;
        });

        this.templateFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroyTemplateFilter))
            .subscribe(() => {
                this.filterTemplate();
            });

        this.partyFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroyTemplateFilter))
            .subscribe(() => {
                this.filterParty();
            });

        this.detailForm.controls['accounts'].valueChanges.subscribe((value) => {
            console.log('Account changed: ', value);
            this.bDetailDirty = true;
        });

        this.detailForm.valueChanges.subscribe((value) => {
            this.bDetailDirty = true;
        });

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



    public detailRowDoubleClick(args: SaveEventArgs): void {
        if (args.requestType === "beginEdit" || args.requestType === "add") {
            args.cancel = true;
            this.OnDoubleClick(args.rowData);
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
        console.log('Header is true 3');
        this.store.updateArtifacts(e);
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
        confirmation.afterClosed().subscribe((result) => {
            if (result === "confirmed") {
                var journalParam = {
                    child: this.journalHeader().journal_id,
                    period: this.journalHeader().period,
                    period_year: this.journalHeader().period_year
                };
                //this.store.createJournalTemplate(journalParam);
            }
        });
    }

    // Add evidence 
    public onAddEvidence() {
        const inputs = { ...this.journalForm.value } as IJournalHeader;
        const dialogRef = this.matDialog.open(DndComponent, {
            width: "600px",
            data: {
                journal_id: inputs.journal_id,
                reference_no: inputs.invoice_no,
                description: this.description,
            },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (result === undefined) {
                result = { event: "Cancel" };
            }

            switch (result.event) {
                case "Create":
                    console.debug(result.data);
                    this.store.loadArtifactsByJournalId(inputs.journal_id);
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

        confirmation.afterClosed().subscribe((result) => {
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

        const confirmation = this.fuseConfirmationService.open({
            title: `Delete  transaction detail item : ${journalDetail.journal_id}-${journalDetail.journal_subid} `,
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
                this.store.deleteJournalDetail(journalDetail);
                this.store.loadDetails(inputs.journal_id);
                this.store.loadArtifactsByJournalId(inputs.journal_id);
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
            journal_id: inputs.journal_id,
            journal_subid: rowData.journal_subid,
        };
        const confirmation = this.fuseConfirmationService.open({
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
                this.store.deleteJournalDetail(journalDetail);
                this.bDetailDirty = false;
            }
        });
    }

    public onOpenEmptyDrawer() {
        this.openDrawer();
    }

    // add a new line entry
    public onNewLineItem() {
        const inputs = { ...this.journalForm.value } as IJournalHeader;
        const updateDate = new Date().toISOString().split("T")[0];
        var max = 0;

        this.store.details().forEach((details) => {
            if (details.journal_subid > max) {
                max = details.journal_subid;
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
        var childAccount = detail.accounts.dropdown;
        // var childAccount = this.debitCtrl.getRawValue();

        var sub_type = this.subtypeCtrl.value;
        var fund = this.fundCtrl.value;
        // var child_desc = this.store.accounts().find((x) => x.child === Number(childAccount.child)).description;
        var child_desc = '';


        if (debit > 0 && credit > 0) {
            this.toastr.show('Only one of the debit field and credit field may be greater than zero!', 'Failed');
            return;
        }

        const journalDetail = {
            journal_id: this.currentRowData.journal_id,
            journal_subid: this.currentRowData.journal_subid,
            account: this.currentRowData.account,
            child: Number(childAccount),
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
        //this.debitCtrl.reset();
        this.store.renumberJournalDetail(inputs.journal_id);
    }

    public onHeaderDateChanged(event: any): void {
        this.transactionDate = event.value;
        this.bHeaderDirty = true;
        console.log('Header is true 4');
    }


    // AIzaSyDi2tojVzbLApe5ddEx_OI5n9JIB5w9S3Y

    // Update journal header
    onUpdateJournalHeader(e: any) {

        if (this.journalForm.invalid) {
            this.toastr.show('Journal Form is invalid. All fields must be completed!', 'Failed');
            return;
        }

        const header = this.journalForm.getRawValue();
        const dDate = new Date().toISOString().split("T")[0];
        // const template = this.templateDropDown().getDropdown();
        const template = this.templateCtrl.getRawValue();
        const party = this.partyDropDown().getDropdown();


        if (template === null) {
            this.toastr.show('Select a template type', 'Failed');
            return;
        }

        if (party === null) {
            this.toastr.show('Select a party', 'Failed');
            return;
        }


        if (this.transactionDate !== undefined) {
            header.transaction_date = this.transactionDate.toISOString().split("T")[0];
        }

        const journalHeaderUpdate: IJournalHeader = {
            journal_id: this.journalHeader().journal_id,
            type: template.journal_type,
            booked: this.journalHeader().booked,
            period: this.journalHeader().period,
            period_year: this.journalHeader().period_year,
            booked_user: this.journalHeader().booked_user,
            description: header.description,
            transaction_date: header.transaction_date,
            amount: Number(header.amount),
            template_name: template.template_name,
            party_id: party.party_id,
            sub_type: header.subtype,
            invoice_no: header.invoice_no
        };

        this.store.updateJournalHeader(journalHeaderUpdate);
        this.toastr.success(`Journal header updated : ${this.journalHeader().journal_id} `);
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
            child_desc: this.store.accounts().find((x) => x.child === Number(detail.accounts.dropdown)).description,
            description: detail.description,
            create_date: updateDate,
            create_user: name,
            sub_type: detail.subtype.dropdown,
            debit: debit,
            credit: credit,
            reference: detail.reference,
            fund: detail.fund.dropdown,
        };

        const journalHeader: any = {
            description: header.description,
            transaction_date: header.transaction_date,
            amount: header.amount,
        };

        this.toastr.success('Journal details updated');

        this.bHeaderDirty = false;
        // this.debitCtrl.reset();
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
        var child_desc = this.store.accounts().find((x) => x.child === Number(childAccount)).description;
        const subtype = this.subtypeDropDown().getDropdownValue();

        // Check for correct child accounts coming from the template
        // Sum the debits and the credits to make sure they are equal

        if (debit > 0 && credit > 0) {
            this.toastr.show('Only one of the debit field and credit field may be greater than zero!', 'Failed');
            return;
        }

        const journalDetail = {
            journal_id: this.currentRowData.journal_id,
            journal_subid: this.currentRowData.journal_subid,
            account: this.currentRowData.account,
            child: Number(childAccount),
            child_desc: child_desc,
            description: detail.description,
            create_date: updateDate,
            create_user: email,
            sub_type: detail.subtype.dropdown,
            fund: detail.fund.dropdown,
            debit: debit,
            credit: credit,
            reference: detail.reference,
        };

        this.store.updateJournalDetail(journalDetail);

        this.toastr.success(`Journal details updated:  ${journalDetail.journal_id} - ${journalDetail.journal_subid} `);

        this.closeDrawer();

    }

    ngOnDestroy(): void {

        this.exitWindow();
        this._onDestroy.next();
        this._onDestroy.complete();

        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

    }

    @HostListener("window:exit")
    public exitWindow() {

        const prd = {
            period: this.journalHeader().period,
            period_year: this.journalHeader().period_year,
        }

        if (this.bHeaderDirty === false) {

            this.store.updateDistributionListing(prd);

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
                    this.journalForm.reset();
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

}
