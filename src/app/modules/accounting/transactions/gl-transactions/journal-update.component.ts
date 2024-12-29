import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    inject,
    viewChild,
} from "@angular/core";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";

import {
    debounceTime,
    Observable,
    of,
    ReplaySubject,
    Subject,
    Subscription,
    take,
    takeUntil,
} from "rxjs";
import { CommonModule } from "@angular/common";
import { DndComponent } from "app/modules/drag-n-drop/loaddnd/dnd.component";
import { FundsService } from "app/services/funds.service";
import { AccountsService } from "app/services/accounts.service";
import { GridMenubarStandaloneComponent } from "../../grid-menubar/grid-menubar.component";
import { MaterialModule } from "app/services/material.module";
import { ISubType, SubTypeService } from "app/services/subtype.service";
import { TypeService } from "app/services/type.service";
import { MatDialog } from "@angular/material/dialog";
import { NgxMaskDirective, provideNgxMask } from "ngx-mask";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { MatSnackBar } from "@angular/material/snack-bar";
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
    FilterSettingsModel,
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
} from "@syncfusion/ej2-angular-grids";

import {
    IJournalDetail, IJournalDetailTemplate,
    IJournalHeader, IJournalHeaderUpdate, IJournalTemplate,
} from "app/models/journals";
import { Router, ActivatedRoute, NavigationStart } from "@angular/router";
import { Location } from "@angular/common";
import { MatDrawer } from "@angular/material/sidenav";
import { JournalStore } from "app/services/journal.store";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { Splitter, SplitterComponent, SplitterModule } from '@syncfusion/ej2-angular-layouts';
import { EvidenceCardComponent } from "app/modules/file-manager/file-manager-card/evidence-card.component";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { IParty } from "../../../../models/party";
import { PartyService } from "../../../../services/party.service";
import { JournalTemplateService } from "../../../../services/journal-template.service";
import { Store } from "@ngrx/store";
import { getTemplates } from 'app/state/template/Template.Selector';
import { loadTemplates } from 'app/state/template/Template.Action';


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
    EvidenceCardComponent
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
        RowDDService,
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
    implements OnInit, OnDestroy, AfterViewInit, AfterViewInit {
    [x: string]: any;

    @Output() notifyDrawerClose: EventEmitter<any> = new EventEmitter();

    private _fuseConfirmationService = inject(FuseConfirmationService);
    private fb = inject(FormBuilder);
    private subtypeService = inject(SubTypeService);
    private fundService = inject(FundsService);
    private accountService = inject(AccountsService);
    private snackBar = inject(MatSnackBar);
    private auth = inject(AUTH);
    private activatedRoute = inject(ActivatedRoute);
    private partyService = inject(PartyService);
    private templateService = inject(JournalTemplateService);

    public matDialog = inject(MatDialog);

    // Store
    public store = inject(JournalStore);
    public detailForm!: FormGroup;
    public journalForm!: FormGroup;

    drawer = viewChild<MatDrawer>("drawer");

    @ViewChild("contextmenu")

    private _location = inject(Location);
    private router = inject(Router);

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
    public bDirty = false;
    public bHeaderDirty = false;

    // Datagrid variables
    public accountsListSubject: Subscription;
    public fundListSubject: Subscription;

    // Data grid settings
    public filterOptions?: FilterSettingsModel;
    public editSettings: Object;
    public editArtifactSettings: Object;
    public filterSettings: Object;
    public toolbar: string[];
    public selectionOptions: Object;
    public searchOptions: Object;


    // Global Journal header
    public description: string;
    public transaction_date: string;
    public amount: number;
    public journalType: string;
    public sTitle = "Transaction Detail Update";
    public journal_id: number;

    // drop down searchable list
    public accountList: IDropDownAccounts[] = [];
    public subtypeList: ISubType[] = [];
    public fundList: IFunds[] = [];

    public selectOptions?: Object;
    public message?: string;

    @ViewChild("grid")
    public grid!: GridComponent;
    public gridControl = viewChild<GridComponent>("grid");
    public selectedItemKeys: any;
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

    @ViewChild("singleDebitSelect", { static: true }) singleDebitSelect: MatSelect;
    @ViewChild("singleTemplateSelect", { static: true }) singleTemplateSelect!: MatSelect;
    @ViewChild("singlePartySelect", { static: true }) singlePartySelect!: MatSelect;
    @ViewChild('splitterInstance') splitterObj?: SplitterComponent;

    subscription: Subscription;

    public tmpLst: Observable<IJournalTemplate[]>;

    Store = inject(Store);

    constructor() {

        this.Store.dispatch(loadTemplates());

    }

    public onCreated() {
        let splitterObj1 = new Splitter({
            height: '100%',
            separatorSize: 3,
            paneSettings: [
                { size: '65%' },
                { size: '35%' }
            ],
            orientation: 'Vertical'
        });
        splitterObj1.appendTo('#vertical_splitter');
    }

    ngOnInit(): void {

        this.createEmptyForm();
        this.createEmptyDetailForm();
        this.initialDatagrid();

        this.tmpLst = this.Store.select(getTemplates);


        this.accountsListSubject = this.dropDownChildren$.subscribe((accounts) => {
            accounts.forEach((acct) => {
                let list = {
                    childName: Number(acct.child),
                    descriptionName: acct.description,
                };
                this.accountsGrid.push(list);
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
        });

        this.templateFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroyTemplateFilter)).subscribe(() => {
            this.filterTemplate();
        });

        this.partyFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroyTemplateFilter))
            .subscribe(() => {
                this.filterParty();
            });

        this.activatedRoute.data.subscribe((data) => {
            this.journal_id = data.journal.journal_id;
            this.store.loadDetails(this.journal_id);
            this.store.loadArtifactsByJournalId(this.journal_id);
            this.journalData = data.journal;
            this.refreshHeader(this.journalData);

            this.onChanges();
            this.router.navigate(["journals/gl", this.journal_id]);
        });

        this.tmpLst.subscribe((templates) => {
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

    }

    public createJournalDetailsFromTemplate(value: IJournalTemplate) {
        console.log('Template : ', value);
        if (value === null || value === undefined) {
            return;
        }
        this.transactionType = value.journal_type;
        // this.store.loadTemplateDetails(value.journal_no.toString());
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
                    if (this.singleDebitSelect != null || this.singleDebitSelect != undefined)
                        this.singleDebitSelect.compareWith = (
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

    }


    public openDrawer() {
        this.bDirty = false;
        this.drawer().open();
    }

    public closeDrawer() {
        this.bDirty = false;
        this.drawer().close();
    }

    public onRowSelected(args: RowSelectEventArgs): void {
        const queryData: any = args.data;
        this.key = queryData.journal_id;
        this.refreshHeader(queryData);
        this.closeDrawer();
        this.store.loadDetails(this.key);
        this.store.loadArtifactsByJournalId(this.key);
        this.router.navigate(["journals/gl", this.key]);
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

        this.templateCtrl.setValue(
            this.templateList.find((x) => x.template_name === this.currentRowData.template_name)
        );

        this.partyCtrl.setValue(
            this.partyList.find((x) => x.party_id === this.currentRowData.party_id)
        );
        //this.currentRowData = JournalDetail;
        this.createDetailForm(JournalDetail);
        this.onChanges();
    }

    private createDetailForm(journalDetail: IJournalDetail) {
        const accountString = journalDetail.child.toString();

        this.debitCtrl.setValue(
            this.debitAccounts.find((x) => x.child === accountString)
        );

        this.detailForm = this.fb.group({
            debitAccountFilterCtrl: [journalDetail.child.toString(), Validators.required],
            description: [journalDetail.description, Validators.required],
            sub_type: [journalDetail.sub_type, Validators.required],
            debit: [journalDetail.debit, Validators.required],
            credit: [journalDetail.credit, Validators.required],
            reference: [journalDetail.reference, Validators.required],
            fund: [journalDetail.fund, Validators.required],
        });

        this.openDrawer();
    }

    public onChanges(): void {
        this.journalForm.valueChanges.subscribe((dirty) => {
            if (this.journalForm.dirty) {
                this.bHeaderDirty = true;
            }
        });

        this.detailForm.valueChanges.subscribe((dirty) => {
            if (this.detailForm.dirty) {
                this.bDirty = true;
            }
        });
        this.debitCtrl.valueChanges.subscribe((value) => {
            this.bDirty = true;
        });

        this.templateCtrl.valueChanges.subscribe((value) => {
            this.createJournalDetailsFromTemplate(value);
            this.bDirty = true;
        });

        this.partyCtrl.valueChanges.subscribe((value) => {
            this.bDirty = true;
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

    public actionBegin(args: SaveEventArgs): void {
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
        this.message = `rowDrag event triggered ${JSON.stringify(args.data)}`;
        console.debug(this.message);
        (args.rows as Element[]).forEach((row: Element) => {
            row.classList.add("drag-limit");
        });
    }

    public rowDrop(args: RowDragEventArgs): void {
        this.message = `Drop  ${args.originalEvent} ${JSON.stringify(args.data)}`;
        console.debug(this.message);
        const value = [];
        for (let r = 0; r < (args.rows as Element[]).length; r++) {
            value.push((args.fromIndex as number) + r);
        }

        this.gridControl().reorderRows(value, args.dropIndex as number);
        this.onSaved(args.data[0]);
    }

    public saveArtifacts(e: any) {
        this.bDirty = true;
        this.store.updateArtifacts(e);
        this.bDirty = false;

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
        this.onChanges()
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
            partyFilterCtrl: ["", Validators.required],
            invoice_no: ["", Validators.required]
        });

        this.detailForm = this.fb.group({
            debitAccountFilterCtrl: ["", Validators.required],
            description: ["", Validators.required],
            child: ["", Validators.required],
            fund: ["", Validators.required],
            sub_type: ["", Validators.required],
            reference: [""],
            amount: ["", Validators.required],
        });
        this.onChanges()
    }


    public exitWindow() {
        if (this.bDirty === false) {
            this.journalForm.reset();
            this.router.navigate(["journals"]);

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
            this.onChanges()
        }
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
                this.bDirty = false;
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
                this.bDirty = false;
            }
        });
    }


    // add a new line entry
    public onAddLineJournalDetail() {
        const updateDate = new Date().toISOString().split("T")[0];
        const email = this.auth.currentUser?.email;
        var max = 0;

        this.store.details().forEach((details) => {
            if (details.journal_subid > max) {
                max = details.journal_subid;
            }
        });

        if (this.journal_id === 0) {
            return;
        }

        if (this.store.details().length > 0) {
            const journalCopy = this.store.details().slice();
            const journalDetail = {
                journal_id: this.journal_id,
                journal_subid: max + 1,
                account: journalCopy[0].account,
                child: journalCopy[0].child,
                description: journalCopy[0].description,
                create_date: updateDate,
                create_user: email,
                sub_type: journalCopy[0].sub_type,
                debit: 0,
                credit: 0,
                reference: journalCopy[0].reference,
                fund: journalCopy[0].fund,
            }
            this.store.createJournalDetail(journalDetail);
        } else {
            const journalDetail = {
                journal_id: this.journal_id,
                journal_subid: 1,
                account: 0,
                child: 0,
                description: "",
                create_date: updateDate,
                create_user: email,
                sub_type: "",
                debit: 0,
                credit: 0,
                reference: "",
                fund: "",
            };
            this.store.createJournalDetail(journalDetail);

        }
        this.bDirty = true;
    }

    journalEntryCleanUp() {
        this.detailForm.reset();
        this.debitCtrl.reset();
        this.store.renumberJournalDetail(this.journal_id);
    }

    // Update journal header
    onUpdateJournalEntry() {

        if (this.bHeaderDirty === false) {
            this.snackBar.open("Journal details have nothing to update ... ", "OK", {
                verticalPosition: "top",
                horizontalPosition: "right",
                duration: 2000,
            });
            return;
        }

        let header = this.journalForm.getRawValue();
        const dDate = new Date().toISOString().split("T")[0];
        let template = this.templateCtrl.value;
        const partyID = this.partyCtrl.value;

        if (template.journal_type === 'GL') {
            partyID.party_id = ''
        }

        const journalHeaderUpdate: IJournalHeaderUpdate = {
            journal_id: this.journal_id,
            type: this.journalData.type,
            description: header.description,
            transaction_date: header.transaction_date,
            amount: Number(header.amount),
            template_name: template.template_name,
            party_id: partyID.party_id,
            invoice_no: header.invoice_no
        };

        console.log('Journal Header Update : ', JSON.stringify(journalHeaderUpdate));

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
            this.snackBar.open("Please select a row to edit", "OK", {
                verticalPosition: "top",
                horizontalPosition: "right",
                duration: 2000,
            });
            return;
        }
        0
        var debit = Number(detail.debit);
        var credit = Number(detail.credit);

        if (debit > 0 && credit > 0) {
            this.snackBar.open(
                "Only one of the debit field and credit field may be greater than zero!",
                "OK",
                {
                    verticalPosition: "top",
                    horizontalPosition: "right",
                    duration: 2000,
                }
            );
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

        this.store.updateJournalDetail(journalDetail);

        this.snackBar.open(
            "Journal details updated",
            "",
            {
                verticalPosition: "top",
                horizontalPosition: "right",
                duration: 2000,
            }
        );

        this.debitCtrl.reset();
    }

    onUpdateJournalDetail() {
        var header = this.journalForm.getRawValue();
        var detail = this.detailForm.getRawValue();
        const dDate = new Date();
        const updateDate = dDate.toISOString().split("T")[0];
        const email = this.auth.currentUser?.email;
        var debit = Number(detail.debit);
        var credit = Number(detail.credit);
        var childAccount = this.debitCtrl.getRawValue();
        var child_desc = this.store.accounts().find((x) => x.child === Number(childAccount.child)).description;


        if (debit > 0 && credit > 0) {
            this.snackBar.open(
                "Only one of the debit field and credit field may be greater than zero!",
                "OK",
                {
                    verticalPosition: "top",
                    horizontalPosition: "right",
                    duration: 2000,
                }
            );
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

        this.snackBar.open("Journal Entry Updated", "OK", {
            verticalPosition: "top",
            horizontalPosition: "right",
            duration: 2000,
        });

        this.bDirty = false;
    }

    ngOnDestroy(): void {
        if (this.accountsListSubject) {
            this.accountsListSubject.unsubscribe();
        }
        if (this.fundListSubject) {
            this.fundListSubject.unsubscribe();
        }

        this._onDestroy.next();
        this._onDestroy.complete();
    }
}
