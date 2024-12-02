import {CommonModule} from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    inject,
    signal,
    viewChild
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    FormBuilder,
    UntypedFormGroup,
    Validators,
    FormControl,
    FormGroup
} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {fuseAnimations} from '@fuse/animations';
import {AUTH} from 'app/app.config';
import {GLAccountsService} from 'app/services/accounts.service';
import {FundsService} from 'app/services/funds.service';
import {JournalService} from 'app/services/journal.service';
import {MaterialModule} from 'app/services/material.module';
import {SubTypeService} from 'app/services/subtype.service';
import {NgxMaskDirective, NgxMaskPipe, provideNgxMask} from 'ngx-mask';
import {ReplaySubject, Subject, Subscription, take, takeUntil} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {DndComponent} from 'app/modules/drag-n-drop/loaddnd/dnd.component';
import {MatSelect} from '@angular/material/select';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {IDropDownAccounts} from 'app/models';
import {
    IJournalDetail,
    IJournalDetailTemplate,
    IJournalHeader,
    IJournalTemplate,
    ITransactionDate
} from 'app/models/journals';
import {JournalStore} from 'app/services/journal.store';
import {JournalTemplateService} from 'app/services/journal-template.service';
import {MatStepperModule} from '@angular/material/stepper';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {IParty} from 'app/models/party';
import {PartyService} from 'app/services/party.service';
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
import {TuiAlertService} from '@taiga-ui/core';
import {MatDrawer, MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import {MatCardModule} from "@angular/material/card";
import {MatTableModule} from "@angular/material/table";
import {MatTab, MatTabsModule} from "@angular/material/tabs";


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
    standalone: true,
    imports: [mods],
    templateUrl: './wizard-entry.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    providers: [
        {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
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
        JournalStore],
})
export class EntryWizardComponent implements OnInit, OnDestroy, AfterViewInit {
    onDeleteDetail() {
        throw new Error('Method not implemented.');
    }

    closeDrawer() {
        this.drawer().close();
    }

    private journalService = inject(JournalService);
    private partyService = inject(PartyService);
    private subtypeService = inject(SubTypeService);
    private fundService = inject(FundsService);
    private accountService = inject(GLAccountsService);
    private snackBar = inject(MatSnackBar);
    private formBuilder = inject(FormBuilder);
    private changeDescriptionRef = inject(ChangeDetectorRef);
    private templateService = inject(JournalTemplateService);
    public auth = inject(AUTH);
    public matDialog = inject(MatDialog);

    public journalDetailSignal = signal<IJournalDetail[]>(null);


    public journalDetailEditForm?: FormGroup;

    public journalEntryForm: UntypedFormGroup;
    public detailForm: FormGroup
    public description: string;
    public transactionType = 'GL';
    public isVerified= false;

    private subAccountDebit: Subscription;
    private subAccountCredit: Subscription;

    public journalHeader: IJournalHeader;

    public journal_id = 0;
    public editSettings: Object;

    public headerAmount = 0;
    public message?: string;
    public bDirty = false;
    public currentPeriod: string;
    public currentYear: string;

    public templateList: IJournalTemplate[] = [];
    public templateDetailList: IJournalDetailTemplate[] = [];
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
    funds$ = this.fundService.read();
    subtype$ = this.subtypeService.read();
    accounts$ = this.accountService.readDropDownChild();
    private readonly alerts = inject(TuiAlertService);
    drawer = viewChild<MatDrawer>("drawer");

    @ViewChild("singleDebitSelect", {static: true}) singleDebitSelect: MatSelect;
    @ViewChild("singleCreditSelect", {static: true}) singleCreditSelect: MatSelect;
    @ViewChild("singleTemplateSelect", {static: true}) singleTemplateSelect: MatSelect;
    @ViewChild("singlePartySelect", {static: true}) singlePartySelect: MatSelect;

    bNewTransaction: any;
    public selectedOption: string;

    types: ITransactionType[] = [
        {value: "GL", viewValue: "General", checked: true},
        {value: "AP", viewValue: "Payments", checked: false},
        {value: "AR", viewValue: "Receipts", checked: false},
    ];

    bHeaderDirty: boolean;


    onTransTypeClicked(e: any) {
        this.selectedOption = e;
        console.log(e)
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {

        this.selectedOption = this.types[0].value;

        this.currentPeriod = this.store.currentPeriod();
        this.currentYear = this.store.currentYear();

        this.accountService.readChildren().pipe(takeUntil(this._onDestroy)).subscribe((accounts) => {
            this.debitAccounts = accounts;
            this.creditAccounts = accounts;
            this.filteredDebitAccounts.next(this.debitAccounts.slice());
            this.filteredCreditAccounts.next(this.creditAccounts.slice());

        });

        this.templateService.readTemplates().pipe(takeUntil(this._onDestroy)).subscribe((templates) => {
            this.templateList = templates;
            this.templateFilter.next(this.templateList.slice());
        });


        this.partyService.read().pipe(takeUntil(this._onDestroy)).subscribe((party) => {
            this.partyList = party;
            this.partyFilter.next(this.partyList.slice());
        });

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

        let currentDate = new Date().toISOString().split("T")[0];

        this.journalEntryForm = this.formBuilder.group({
            step1: this.formBuilder.group({
                templateCtrl: [''],
                description: ['', Validators.required],
                amount: ['', Validators.required],
                transaction_date: [currentDate, Validators.required],
                partyCtrl: [''],
                invoice_no: [''],
            }),
            step2: this.formBuilder.group({}),

        });

        this.journalService.getLastJournalNo().subscribe(journal_no => {
            this.journal_id = Number(journal_no) + 1;
        });

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

        this.editSettings = {
            allowEditing: true,
            allowAdding: false,
            allowDeleting: false,
        };

        this.onChanges()

    }

    public updateForm(journalDetail: IJournalDetail) {
        const accountString = journalDetail.child.toString();
        this.debitCtrl.setValue(
            this.debitAccounts.find((x) => x.child === accountString)
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
    }


    openDrawer() {
        this.bDirty = false;
        this.drawer().open();
    }


    public actionBegin(args: SaveEventArgs): void {
        if (args.requestType === "beginEdit" || args.requestType === "add") {
            args.cancel = true;

            const subid = args.rowData as IJournalDetail;

            const currentSub = this.journalDetailSignal()
                .find((x) => x.journal_subid === subid.journal_subid);

            const dDate = new Date();
            const currentDate = dDate.toISOString().split("T")[0];
            const data = args.rowData as IJournalDetail;
            console.log(JSON.stringify(data));
            const email = this.auth.currentUser.email;
            const debit = currentSub.debit;
            const credit = currentSub.credit;


            let JournalDetail: IJournalDetail;
            JournalDetail = {
                journal_id: data.journal_id,
                journal_subid: data.journal_subid,
                account: data.account,
                child: data.child,
                child_desc: data.child_desc,
                description: data.description,
                create_date: currentDate,
                create_user: email,
                sub_type: data.sub_type,
                debit: debit,
                credit: credit,
                reference: '',
                fund: data.fund
            } as IJournalDetail;
            this.updateForm(JournalDetail);
            this.openDrawer();
        }
        if (args.requestType === "save") {
            this.onSaved(args.data);
        }
    }

    public OnCardDoubleClick(data: any): void {
        this.currentRowData = data;
        const email = this.auth.currentUser.email;
        const dDate = new Date();
        const currentDate = dDate.toISOString().split("T")[0];
        console.debug("data :", JSON.stringify(data));
        // data = this.store
        //     .details()
        //     .find((x) => x.journal_subid === data.journal_subid);

        const journalDetail = {
            journal_id: data.journal_id,
            journal_subid: data.journal_subid,
            account: data.account,
            child: data.child,
            child_desc: data.child_desc,
            description: data.description,
            create_date: currentDate,
            create_user: email,
            sub_type: data.sub_type,
            debit:  data.debit,
            credit: data.credit,
            reference: data.reference,
            fund: data.fund,
        } as IJournalDetail;

        this.currentRowData = journalDetail;

        console.log(journalDetail);

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
        // this.grid.reorderRows(value, (args.dropIndex as number));

        this.gridControl().reorderRows(value, (args.dropIndex as number));
        this.onSaved(args.data[0]);
    }


    onSaved(e: any) {
        this.bDirty = true;
        const updateDate = new Date().toISOString().split("T")[0];
        const email = this.auth.currentUser?.email;
        const journalDetail = {
            journal_id: e.journal_id,
            journal_subid: e.journal_subid,
            account: Number(e.account),
            child: Number(e.child),
            child_desc: e.child_desc,
            description: e.description,
            create_date: updateDate,
            create_user: email,
            sub_type: e.sub_type,
            debit: e.debit,
            credit: e.credit,
            reference: e.reference,
            fund: e.fund,
        };
        this.store.updateJournalDetail(journalDetail);
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

    public onCreateHeader() {
        console.log('Create Header');
    }

    public onDelete() {
        throw new Error('Method not implemented.');
    }

    public onChanges(): void {
        this.journalEntryForm.valueChanges.subscribe((dirty) => {
            if (this.journalEntryForm.dirty) {
                this.bHeaderDirty = true;
            }
        });

        this.templateCtrl.valueChanges.subscribe((value) => {
            this.bDirty = true;
            this.createJournalDetailsFromTemplate(value);
        });

    }


    public createJournalDetailsFromTemplate(value: IJournalTemplate) {
        console.log('Template : ', value);
        this.transactionType = value.journal_type;
        this.store.loadTemplateDetails(value.journal_no.toString());
    }

    refresh() {
        this.store.loadTemplateDetails(this.templateCtrl.value.journal_no.toString());
    }


    public onUpdate() {

        const updateDate = new Date().toISOString().split('T')[0];
        const inputs = {...this.journalEntryForm.value}
        const momentDate = new Date(inputs.step1.transaction_date).toISOString().split('T')[0];
        const email = this.auth.currentUser?.email;

        let count: number;

        if (inputs.step1.amount === 0) {
            this.alerts.open("Amount must be greater than zero ...");
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
            status: 'Open',
            type: '',
            sub_type: inputs.step1.sub_type,
            amount: Number(inputs.step1.amount)
        }

        this.journalHeader = journalHeader;

        if (this.journalDetails !== undefined) {
            count = this.journalDetails.length;
            count = count + 1;
        } else {
            count = this.journalDetails.length + 1;
        }

        this.store.templateDetails().forEach((templateDetail) => {
            let journalDetail: IJournalDetail = {
                journal_id: this.journal_id,
                journal_subid: count,
                account: Number(templateDetail.account),
                child: Number(templateDetail.child),
                child_desc: 'Description',
                description: templateDetail.description,
                create_date: updateDate,
                create_user: email,
                sub_type: templateDetail.sub_type,
                debit: templateDetail.debit * journalHeader.amount,
                credit: templateDetail.credit * journalHeader.amount,
                reference: inputs.step1.reference,
                fund: templateDetail.fund,
            }
            this.journalDetails.push(journalDetail);
            count = count + 1;
        });
        this.journalDetailSignal.set(this.journalDetails);

        // this.journalDetailSignal().forEach((journalDetail) => {
        //   console.log(journalDetail);
        // });
        this.alerts.open('Journal Entry Created', {label: 'success'});
    }


    formatNumber(e) {
        if (e.value === null || e.value === undefined) {
            e.value = 0;
        }
        const options = {
            style: 'decimal',  // Other options: 'currency', 'percent', etc.
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        };

        const formattedWithOptions = e.value.toLocaleString('en-US', options);
        console.debug(formattedWithOptions);
        return formattedWithOptions;
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
                result = {event: 'Cancel'};
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

        if (this.accountsListSubject) {
            this.accountsListSubject.unsubscribe();
        }

        if (this.subAccountDebit) {
            this.subAccountDebit.unsubscribe();
        }

        if (this.subAccountCredit) {
            this.subAccountCredit.unsubscribe();
        }

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

    onUpdateJournalEntry() {
        throw new Error('Method not implemented.');
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

}
