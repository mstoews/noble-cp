import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, HostListener, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, inject, viewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ReplaySubject, Subject, Subscription, take, takeUntil } from "rxjs";
import { CommonModule } from "@angular/common";
import { DndComponent } from "app/features/drag-n-drop/loaddnd/dnd.component";
import { FundsService } from "app/services/funds.service";
import { AccountsService } from "app/services/accounts.service";
import { GridMenubarStandaloneComponent } from "../../grid-components/grid-menubar.component";
import { MaterialModule } from "app/services/material.module";
import { SubTypeService } from "app/services/subtype.service";
import { MatDialog } from "@angular/material/dialog";
import { NgxMaskDirective, provideNgxMask } from "ngx-mask";
import { FuseConfirmationService } from "@fuse/services/confirmation";

import { DropDownListAllModule } from "@syncfusion/ej2-angular-dropdowns";
import { AUTH } from "app/app.config";
import { MatSelect } from "@angular/material/select";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { IDropDownAccounts, IDropDownAccountsGridList, IFunds, IJournalParams } from "app/models";

import {
    ClickEventArgs,
    ContextMenuComponent,
    ContextMenuModule,
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
} from "@syncfusion/ej2-angular-grids";

import { 
    IJournalDetail, 
    IJournalDetailTemplate,
    IJournalHeader, 
    IJournalTemplate,
} from "app/models/journals";

import { Router, ActivatedRoute, NavigationStart } from "@angular/router";
import { Location } from "@angular/common";
import { MatDrawer } from "@angular/material/sidenav";
import { JournalStore } from "app/services/journal.store";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { Splitter, SplitterComponent, SplitterModule } from '@syncfusion/ej2-angular-layouts';
import { EvidenceCardComponent } from "app/features/file-manager/file-manager-card/evidence-card.component";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { IParty } from "../../../../models/party";
import { PartyService } from "../../../../services/party.service";
import { ISubType } from "app/models/subtypes";
import { TemplateService } from "app/services/template.service";
import { ToastrService } from "ngx-toastr";
import { JournalService } from "app/services/journal.service";
import { FilterTypePipe } from "app/filter-type.pipe";


const imports = [
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
    MatTableModule,
    MatSortModule,
    SplitterModule,
    EvidenceCardComponent,
    FilterTypePipe
];

@Component({
    selector: "gl-journal",
    imports: [imports],
    templateUrl: "./journal-update.component.html",
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
        ColumnMenuService,
        JournalStore,
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
export class JournalUpdateComponent
    implements OnInit, OnDestroy, AfterViewInit {
    
    [x: string]: any;

    @Output() notifyDrawerClose: EventEmitter<any> = new EventEmitter();

    private _fuseConfirmationService = inject(FuseConfirmationService);
    private fb = inject(FormBuilder);
    private subtypeService = inject(SubTypeService);
    private fundService = inject(FundsService);
    private accountService = inject(AccountsService);
    private auth = inject(AUTH);
    private activatedRoute = inject(ActivatedRoute);
    private partyService = inject(PartyService);
    private templateService = inject(TemplateService);  
    private toastr = inject(ToastrService);
    
    public matDialog = inject(MatDialog);
    public journalForm!: FormGroup;
    public detailForm!: FormGroup;
    public toolbarTitle: string = "General Ledger Transactions Update";
    public bDetailDirty = false;
    public transaction!: string;
    
    // create template details only one
    bTemplateDetails = false;

    drawer = viewChild<MatDrawer>("drawer");

    @ViewChild("contextmenu")

    private _location = inject(Location);
    private router = inject(Router);

    public store = inject(JournalStore);

    public contextmenu: ContextMenuComponent;
    public value = 0;
    public loading = false;
    public height: string = "250px";

    public funds$ = this.fundService.read();
    public subtype$ = this.subtypeService.read();
    public dropDownChildren$ = this.accountService.readChildren();
    public fuseConfirmationService = inject(FuseConfirmationService);

    // Internal control variables
    public currentRowData: any;
    public journal_subid: any;
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
    public initialSort: Object;

    // drop down searchable list
    public accountList: IDropDownAccounts[] = [];
    public subtypeList: ISubType[] = [];
    public fundList: IFunds[] = [];


    public message?: string;

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

    public Accounts: IDropDownAccounts[] = [];
    public accountsGrid: IDropDownAccountsGridList[] = [];
    public dFields = { text: "child", value: "child" };

    public debitAccounts: IDropDownAccounts[] = [];
    public debitCtrl: FormControl<IDropDownAccounts> = new FormControl<IDropDownAccounts>(null);
    public debitAccountFilterCtrl: FormControl<string> = new FormControl<string>(null);
    public filteredDebitAccounts: ReplaySubject<IDropDownAccounts[]> = new ReplaySubject<IDropDownAccounts[]>(1);

    public journalData: IJournalHeader;

    protected _onCreditDestroy = new Subject<void>();
    protected _onDebitDestroy = new Subject<void>();
    protected _onDestroyDebitAccountFilter = new Subject<void>();
    protected _onDestroyCreditAccountFilter = new Subject<void>();
    protected _onDestroy = new Subject<void>();

    columnsToDisplay: string[] = ["journal_id", "description"];
    toolbarOptions = ['Search']
    
    @ViewChild('splitterInstance') splitterObj?: SplitterComponent;

    singleDebitSelection = viewChild<MatSelect>("singleDebitSelection");
    singleTemplateSelect = viewChild<MatSelect>("singleTemplateSelect");
    singlePartySelect = viewChild<MatSelect>("singlePartySelect");
    
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
        console.log('change fund: ' , e);
        this.bDetailDirty = true;
    }

    changeSubtype(e: any) {
        console.log('change subtype: ', e);
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

    ngOnInit(): void {
        this.createEmptyForm();
        this.createEmptyDetailForm();
        this.initialDatagrid();

        this.activatedRoute.data.subscribe((data) => {
            this.journal_id = data.journal.journal_id;
            this.store.loadDetails(this.journal_id);
            this.store.loadArtifactsByJournalId(this.journal_id);                        
            this.journalData = data.journal;
            this.refreshHeader(this.journalData);
            
            this.router.navigate(["journals/gl", this.journal_id]);                        
        });


            this.accountsListSubject = this.dropDownChildren$.subscribe((accounts) => {
                accounts.forEach((acct) => {
                    let list = {
                        childName: Number(acct.child),
                        descriptionName: acct.description,
                    };
                    this.accountsGrid.push(list);
                });
            });

            this.fundListSubject = this.funds$.subscribe((funds) => {
                    funds.forEach((fund) => {
                        var list = {
                            fund: fund.fund,
                            description: fund.description,
                        };
                        this.fundList.push(list);
                    });
            });
        
        this.initialDatagrid();
    }


    public createJournalDetailsFromTemplate(value: IJournalTemplate) {
        console.log('Template : ', value);
        if (value === null || value === undefined) {
            return;
        }
        this.transactionType = value.journal_type;
        this.store.loadTemplateDetails(value.journal_no.toString());        
        this.bHeaderDirty = false;
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
        if (!this.store.templates()) {
            return;
        }
        // get the search keyword
        let search = this.templateFilterCtrl.value;
        if (!search) {
            this.templateFilter.next(this.store.templates().slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.templateFilter.next(
            this.store.templates().filter(template => template.description.toLowerCase().indexOf(search) > -1)
        );
    }



    public ngAfterViewInit() {

        this.templateService.read().pipe(takeUntil(this._onDestroy)).subscribe((templates) => {
            this.templateList = templates;
            this.templateFilter.next(this.templateList.slice());
            if (this.journalData.template_name != null) {
                this.templateCtrl.setValue(
                    this.templateList.find((x) => x.template_name === this.journalData.template_name)
                );
            }
        });


        this.partyService.read().pipe(takeUntil(this._onDestroy)).subscribe((party) => {
            this.partyList = party;            
            this.partyFilter.next(this.partyList.slice());
            if (this.journalData.template_name != null) {
                this.partyCtrl.setValue(
                    this.partyList.find((x) => x.party_id === this.journalData.party_id)
                );
            }
        });

        if (this.templateFilter && this.singleTemplateSelect() != null)
                this.templateFilter
                    .pipe(take(1), takeUntil(this._onTemplateDestroy))
                    .subscribe(() => {
                        if (this.singleTemplateSelect() != null || this.singleTemplateSelect() != undefined)
                            this.singleTemplateSelect().compareWith = (a: IJournalTemplate, b: IJournalTemplate) => a && b && a.template_ref === b.template_ref;
        });
    
        if (this.partyFilter && this.singlePartySelect() != null)
                this.partyFilter
                    .pipe(take(1), takeUntil(this._onTemplateDestroy))
                    .subscribe(() => {
                       if (this.singlePartySelect() != null || this.singlePartySelect() != undefined)
                       this.singlePartySelect().compareWith = (a: IParty, b: IParty) => a && b && a.party_id === b.party_id;
        });

        
        
        this.accountService
            .readChildren()
            .pipe(takeUntil(this._onDestroy))
            .subscribe((accounts) => {
                this.debitAccounts = accounts;
                this.filteredDebitAccounts.next(this.debitAccounts.slice());
            });

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


        this.partyCtrl.setValue(
            this.partyList.find((x) => x.party_id === this.journalData.party_id)
        );

        this.templateCtrl.setValue(
            this.templateList.find((x) => x.template_name === this.journalData.template_name)
        );

        if (this.journalData.template_name != null) {
            this.templateCtrl.setValue(
                this.templateList.find((x) => x.template_name === this.journalData.template_name)
            );
        }
        this.onChanges();
        this.bHeaderDirty = false;

        this.partyCtrl.valueChanges.subscribe((value) => {                        
            this.bHeaderDirty = true;
            console.log('Header is true 2 from party change');                
        });        

        this.templateCtrl.valueChanges.subscribe((value) => {
            this.beHeaderDirty = true;
            this.createJournalDetailsFromTemplate(value);
            console.log('Header is true 2 from party change');                                                    
        });

        console.log('NG After View Init completed');

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
        this.key = queryData.journal_id;
        this.refreshHeader(queryData);        
        this.store.loadDetails(this.key);
        this.store.loadArtifactsByJournalId(this.key);
        this.router.navigate(["journals/gl", this.key]);
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

    }

    public onEditJournal(id: number) {
        this.journal_id = id;
        this.store.loadDetails(id);
        this.journalData = this.store.gl().find((x) => x.journal_id === id);
        this.refreshHeader(this.journalData);
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

    public OnCardClick(data: any): void {
        this.currentRowData = data;
        const name = this.auth.currentUser.email.split("@")[0];
        const dDate = new Date();
        let currentDate = dDate.toISOString().split("T")[0];
        const dataDetail = this.store
            .details()
            .find((x) => x.journal_subid === data.journal_subid);

        const JournalDetail = {
            journal_id: dataDetail.journal_id,
            journal_subid: dataDetail.journal_subid,
            account: dataDetail.account,
            child: dataDetail.child,
            child_desc: dataDetail.child_desc,
            description: dataDetail.description,
            create_date: currentDate,
            create_user: '@' + name,
            sub_type: dataDetail.sub_type,
            debit: dataDetail.debit,
            credit: dataDetail.credit,
            reference: dataDetail.reference,
            fund: dataDetail.fund,
        } as IJournalDetail;

        this.createDetailForm(JournalDetail);
        
    }

    private createDetailForm(journalDetail: IJournalDetail) {
        const accountString = journalDetail.child.toString();

        this.debitCtrl.setValue(
            this.debitAccounts.find((account) => account.child === accountString)
        );

        this.detailForm.patchValue({
            debitAccountFilterCtrl: journalDetail.child.toString(),
            description: journalDetail.description, 
            sub_type: journalDetail.sub_type,
            debit: journalDetail.debit, 
            credit: journalDetail.credit, 
            reference: journalDetail.reference, 
            fund: journalDetail.fund 
        });
        this.bHeaderDirty = false;
        this.openDrawer();
    }

    public onChanges(): void {
                
        // this.journalForm.controls['description'].valueChanges.subscribe((value) => {            
        //         this.bHeaderDirty = true;                             
        // });

        // this.journalForm.controls['invoice_no'].valueChanges.subscribe((value) => {            
        //     this.bHeaderDirty = true;                             
        // });

        // this.journalForm.controls['debit'].valueChanges.subscribe((value) => {            
        //     this.bHeaderDirty = true;                             
        // });

        this.journalForm.valueChanges.subscribe((value) => {
            this.bHeaderDirty = true;            
        });

                
        this.detailForm.valueChanges.subscribe((value) => {            
                this.bDetailDirty = true;            
        });

        this.debitCtrl.valueChanges.subscribe((value) => {
            this.bDetailDirty = true;
        });
    }


    public createEmptyDetailForm() {
        this.detailForm = this.fb.group({
            account: ["", Validators.required],
            debitAccountFilterCtrl: ["", Validators.required],
            description: ["", Validators.required],
            sub_type: ["", Validators.required],
            debit: ["", Validators.required],
            credit: ["", Validators.required],
            reference: ["", Validators.required],
            fund: ["", Validators.required],
        });
        //this.openDrawer();
    }

    public detailRowDoubleClick(args: SaveEventArgs): void {
        if (args.requestType === "beginEdit" || args.requestType === "add") {
            args.cancel = true;
            this.OnCardClick(args.rowData);
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


    public refreshHeader(header: IJournalHeader) {
        this.journalForm.patchValue({
            description: header.description,
            amount: header.amount,
            transaction_date: header.transaction_date,
            templateFilterCtrl: header.template_name,
            partyFilterCtrl: header.party_id,
            invoice_no: header.invoice_no
        });


        this.templateCtrl.setValue(
            this.templateList.find((x) => x.template_name === header.template_name)
        );

        this.journal_id = header.journal_id;

        this.partyCtrl.setValue(
            this.partyList.find((x) => x.party_id === header.party_id)
        );
        
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
                    child: this.journalData.journal_id,
                    period: this.journalData.period,
                    period_year: this.journalData.period_year
                };
                this.store.createJournalTemplate(journalParam);
            }
        });
    }

    // Add evidence 
    public onAddEvidence() {
        const dialogRef = this.matDialog.open(DndComponent, {
            width: "600px",
            data: {
                journal_id: this.journal_id,
                reference_no: this.journal_id,
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
                    this.store.loadArtifactsByJournalId(this.journal_id);
                    break;
                case "Cancel":
                    break;
            }
        });

    }

    public onCloseTransaction(e: any) {
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


    public createEmptyForm() {
        this.journalForm = this.fb.group({
            description: ["", Validators.required],
            amount: ["", Validators.required],
            transaction_date: ["", Validators.required],
            templateFilterCtrl: ["", Validators.required],
            partyFilterCtrl: [""],
            invoice_no : ["",Validators.required],            
        });

        this.detailForm = this.fb.group({
            debitAccountFilterCtrl: ["", Validators.required],
            description: ["", Validators.required],
            child: ["", Validators.required],
            fund: ["", Validators.required],
            sub_type: ["", Validators.required],
            invoice_no: [""],
            amount: ["", Validators.required],
        });
        
        this.bHeaderDirty = false;
    }

    

    // On delete journal detail
    public onDeleteDetail() {

        var journalDetail = {
            journal_id: this.journal_id,
            journal_subid: this.currentRowData.journal_subid,
        };

        const confirmation = this._fuseConfirmationService.open({
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
                this.store.loadDetails(this.journal_id);
                this.store.loadArtifactsByJournalId(this.journal_id);
                this.bDetailDirty = false;
                this.closeDrawer();
            }
        });


    }

    // On delete journal detail
    public onDelete(args: any) {
        const index = (this.grid as GridComponent).getSelectedRowIndexes();
        const rowData = this.grid.getCurrentViewRecords().at(index[0]) as any;
        var journalDetail = {
            journal_id: this.journal_id,
            journal_subid: rowData.journal_subid,
        };
        const confirmation = this._fuseConfirmationService.open({
            title: `Delete  transaction number : ${this.journal_id}-${rowData.journal_subid} `,
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
        this.createEmptyDetailForm();
        this.openDrawer();
    }

    // add a new line entry
    public onNewLineItem() {
        const updateDate = new Date().toISOString().split("T")[0];        
        var max = 0;

        this.store.details().forEach((details) => {
            if (details.journal_subid > max) {
                max = details.journal_subid;
            }
        });

        if (this.journal_id === 0) {
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
        var child_desc = this.store.accounts().find((x) => x.child === Number(childAccount.child)).description;


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
        this.detailForm.reset();
        this.debitCtrl.reset();
        this.store.renumberJournalDetail(this.journal_id);
    }

    public onHeaderDateChanged(event: any): void {
        this.transactionDate = event.value;
        this.bHeaderDirty = true; 
        console.log('Header is true 4'); 
    }


    // Update journal header
    onUpdateJournalHeader() {

        if (this.bHeaderDirty === false) {
            this.toastr.show('Journal Entry Created', 'Failed');
            return;
        }

        var partyId= '';

        let header = this.journalForm.getRawValue();
        const dDate = new Date().toISOString().split("T")[0];
        let template = this.templateCtrl.value;
        
        if (template.journal_type !== 'GL') {
            if(this.partyCtrl !== null || this.partyCtrl !== undefined) {
                 this.partyId = this.partyCtrl.value.party_id;                 
            }            
        }
        else {
            this.partyId = '';
        }

        if(this.transactionDate !== undefined) {
            header.transaction_date = this.transactionDate.toISOString().split("T")[0];
        }

        const journalHeaderUpdate: IJournalHeader = {
            journal_id: this.journal_id,
            type: this.journalData.type,
            booked: this.journalData.booked,
            period: this.journalData.period,
            period_year: this.journalData.period_year,
            booked_user: this.journalData.booked_user,
            description: header.description,
            transaction_date: header.transaction_date,
            amount: Number(header.amount),
            template_name: template.template_name,
            party_id: this.partyId,
            invoice_no: header.invoice_no            
        };

        this.store.updateJournalHeader(journalHeaderUpdate);
        this.bHeaderDirty = false;
    }
    // Create or new journal entry
    public onCreate() {
        var header = this.journalForm.getRawValue();
        var detail = this.detailForm.getRawValue();
        const dDate = new Date();
        const updateDate = dDate.toISOString().split("T")[0];
        const email = this.auth.currentUser?.email;

        if (
            detail.detail_description === "" ||
            detail.detail_description === undefined ||
            detail.detail_description === null
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
            child: detail.child,
            description: detail.description,
            create_date: updateDate,
            create_user: email,
            sub_type: detail.sub_type,
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

        // this.store.updateJournalDetail(journalDetail);

        // const prd = {
        //     period: this.currentPeriod,
        //     period_year: this.currentYear
        // }

        // this.store.updateDistributionListing(prd)
        
        this.toastr.success('Journal details updated');

        this.bHeaderDirty = false;
        this.debitCtrl.reset();
    }

    onAddLineItem() {
        this.onNewLineItem();
    }

    onUpdateJournalDetail() {
        var header = this.journalForm.getRawValue();
        var detail = this.detailForm.getRawValue();
        const dDate = new Date();
        const updateDate = dDate.toISOString().split("T")[0];
        const email = '@' + this.auth.currentUser?.email.split("@")[0];
        var debit = Number(detail.debit);
        var credit = Number(detail.credit);
        var childAccount = this.debitCtrl.getRawValue();
        var child_desc = this.store.accounts().find((x) => x.child === Number(childAccount.child)).description;


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
            create_user: email,
            sub_type: detail.sub_type,
            debit: debit,
            credit: credit,
            reference: detail.reference,
            fund: detail.fund,
        };

        this.store.updateJournalDetail(journalDetail);

        // const currentPeriod = this.store.currentPeriod();
        // const currentYear = this.store.currentYear();
        // const prd = {
        //     period: currentPeriod,
        //     period_year: currentYear
        // }
        // this.store.updateDistributionListing(prd )
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
    }

    @HostListener("window:exit")
    public exitWindow() {

        const prd = {
            period: this.journalData.period,
            period_year: this.journalData.period_year,
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

}
