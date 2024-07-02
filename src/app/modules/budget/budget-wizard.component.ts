import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, UntypedFormGroup, Validators, FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { AUTH } from 'app/app.config';
import { GLAccountsService } from 'app/services/accounts.service';
import { FundsService } from 'app/services/funds.service';
import { JournalService } from 'app/services/journal.service';
import { MaterialModule } from 'app/services/material.module';
import { SubTypeService } from 'app/services/subtype.service';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ReplaySubject, Subject, Subscription, take, takeUntil } from 'rxjs';
import { BudgetUpdateComponent } from './budgetl-update/budget-update.component';
import { MatDialog } from '@angular/material/dialog';
import { DndComponent } from 'app/modules/drag-n-drop/loaddnd/dnd.component';
import { MatSelect } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { IDropDownAccounts } from 'app/models';
import { filter } from 'lodash';
import { IJournalDetail, IJournalHeader, ITransactionDate } from 'app/models/journals';


const imports = [
  CommonModule,
  MatIconModule,
  FormsModule,
  ReactiveFormsModule,
  MaterialModule,
  NgxMaskDirective,
  NgxMaskPipe,
  BudgetUpdateComponent,
  DndComponent,
  NgxMatSelectSearchModule
]

@Component({
  selector: 'budget-wizard',
  standalone: true,
  imports: [imports],
  templateUrl: './budget-wizard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
  styles: ``,
  providers: [provideNgxMask()]
})
export class BudgetWizardComponent implements OnInit, OnDestroy, AfterViewInit {
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

  journalEntryForm: UntypedFormGroup;
  private journalService = inject(JournalService);
  private subtypeService = inject(SubTypeService);
  private fundService = inject(FundsService);
  private accountService = inject(GLAccountsService);
  private snackBar = inject(MatSnackBar);
  private formBuilder = inject(FormBuilder);
  private changeDesctionRef = inject(ChangeDetectorRef);
  public matDialog = inject(MatDialog);
  public description: string;

  private subAccountDebit: Subscription;
  private subAccountCredit: Subscription;

  public journalHeader: IJournalHeader;
  private auth = inject(AUTH);
  public journal_id = 0;
  public accountList = [];
  public headerAmount = 0;

  // IDropDownAccounts drop down 

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
  protected _onDestroyDebitAccountFilter = new Subject<void>();
  protected _onDestroyCreditAccountFilter = new Subject<void>();
  protected _onDestroy = new Subject<void>();

  public journalDetails?: IJournalDetail[];
  public accountsListSubject: Subscription;

  funds$ = this.fundService.read();
  subtype$ = this.subtypeService.read();
  accounts$ = this.accountService.readDropDownChild();

  @ViewChild('singleDebitSelect', { static: true }) singleDebitSelect: MatSelect;
  @ViewChild('singleCreditSelect', { static: true }) singleCreditSelect: MatSelect;
  bNewTransaction: any;

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------
  ngOnInit(): void {

    this.accountService.readChildren().pipe(takeUntil(this._onDestroy)).subscribe((accounts) => {
      this.debitAccounts = accounts;
      this.creditAccounts = accounts;
      this.filteredDebitAccounts.next(this.debitAccounts.slice());
      this.filteredCreditAccounts.next(this.creditAccounts.slice());

    });

    // Vertical stepper form
    this.journalEntryForm = this.formBuilder.group({
      step1: this.formBuilder.group({
        description: ['', Validators.required],
        transaction_date: ['', Validators.required],
        amount: ['', Validators.required],
      }),
      step2: this.formBuilder.group({
        debitCtrl: [''],
        creditCtrl: [''],
        detail_description: ['', Validators.required],
        reference: ['', Validators.required],
        sub_type: ['', Validators.required],
        fund: ['', Validators.required],
        debit: ['', Validators.required],
        credit: ['', Validators.required],

      }),
      step3: this.formBuilder.group({

      })
    });

    this.journalService.getLastJournalNo().subscribe(journal_no => {
      this.journal_id = Number(journal_no);
    });

    this.debitAccountFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroyDebitAccountFilter))
      .subscribe(() => { this.filterDebitAccounts(); })

    this.creditAccountFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroyCreditAccountFilter))
      .subscribe(() => { this.filterCreditAccounts(); });

  }


  protected setInitialValue() {

    if (this.filteredCreditAccounts)
      this.filteredCreditAccounts
        .pipe(take(1), takeUntil(this._onCreditDestroy))
        .subscribe(() => {
          // setting the compareWith property to a comparison function
          // triggers initializing the selection according to the initial value of
          // the form control (i.e. _initializeSelection())
          // this needs to be done after the filteredBanks are loaded initially
          // and after the mat-option elements are available
          this.singleCreditSelect.compareWith = (a: IDropDownAccounts, b: IDropDownAccounts) => a && b && a.child === b.child;
        });

    if (this.filteredDebitAccounts)
      this.filteredDebitAccounts
        .pipe(take(1), takeUntil(this._onDebitDestroy))
        .subscribe(() => {
          // setting the compareWith property to a comparison function
          // triggers initializing the selection according to the initial value of
          // the form control (i.e. _initializeSelection())
          // this needs to be done after the filteredBanks are loaded initially
          // and after the mat-option elements are available
          this.singleDebitSelect.compareWith = (a: IDropDownAccounts, b: IDropDownAccounts) => a && b && a.child === b.child;
        });
  }


  ngAfterViewInit() {
    //this.setInitialValue();
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


  onUpdateHeader() {

    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    const inputs = { ...this.journalEntryForm.value }
    const email = this.auth.currentUser?.email;

    var journalHeader: IJournalHeader;

    const transactionDate = new Date(inputs.step1.transaction_date).toISOString().split('T')[0];

    journalHeader = {
      journal_id: this.journal_id,
      description: inputs.step1.description,
      booked: false,
      booked_date: updateDate,
      booked_user: email,
      create_date: updateDate,
      create_user: email,
      period: 1,
      period_year: 2024,
      transaction_date: transactionDate,
      status: 'Open',
      sub_type: '',
      type: '',
      amount: inputs.step1.amount
    }
    this.headerAmount = journalHeader.amount;
    this.journalHeader = journalHeader;
    this.journalEntryForm.get('step2').get('debit').setValue(this.headerAmount);
    this.journalEntryForm.get('step2').get('credit').setValue(this.headerAmount);
    this.changeDesctionRef.markForCheck();


    var transaction_period: ITransactionDate = {
      start_date: transactionDate,
      end_date: transactionDate
    }

    // this.journalService.readPeriodFromTransactionDate(transaction_period).subscribe(period =>{
    //     journalHeader.period = period.period_id,
    //     journalHeader.period_year = period.period_year
    // })


  }

  onDelete() {
    throw new Error('Method not implemented.');
  }


  onUpdate() {
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    const inputs = { ...this.journalEntryForm.value }
    const momentDate = new Date(inputs.step1.transaction_date).toISOString().split('T')[0]; // Replace event.value with your date value
    const email = this.auth.currentUser?.email;



    var count: number;

    if (inputs.step1.amount === 0) {
      this.snackBar.open("Amount must be greater than zero ...");
      return;
    }

    var journalHeader: IJournalHeader = {
      journal_id: this.journal_id,
      description: inputs.step1.description,
      booked: false,
      booked_date: updateDate,
      booked_user: email,
      create_date: updateDate,
      create_user: email,
      period: 1,
      period_year: 2024,
      transaction_date: momentDate,
      status: 'Open',
      type: '',
      sub_type: inputs.step1.sub_type,
      amount: Number(inputs.step1.amount)
    }

    this.journalHeader = journalHeader;

    console.debug(JSON.stringify(this.journalHeader));

    this.journalDetails = [];

    if (this.journalDetails !== undefined) {
      count = this.journalDetails.length;
      count = count + 1;
    }
    else {
      count = this.journalDetails.length + 1;
    }

    const debitAccount = this.debitCtrl.getRawValue();
    const creditAccount = this.creditCtrl.getRawValue();

    if (Number(inputs.step2.debit) > 0 && Number(inputs.step2.credit) > 0) {

      const debit = Number(inputs.step2.debit);
      const credit = Number('0');


      if (debitAccount.child === '') {
        this.snackBar.open("Please select a debit account ...");
        return;
      }


      var journalDetail: IJournalDetail = {
        journal_id: this.journal_id,
        journal_subid: count,
        account: Number(debitAccount.account),
        child: Number(debitAccount.child),
        description: inputs.step2.detail_description,
        create_date: updateDate,
        create_user: email,
        sub_type: inputs.step2.sub_type,
        debit: debit,
        credit: credit,
        reference: inputs.step2.reference,
        fund: inputs.step2.fund
      }
      this.journalDetails.push(journalDetail);
    }


    count = count + 1;

    if (creditAccount.child === '') {
      this.snackBar.open("Please select a credit account ...");
      return;
    }


    if (Number(inputs.step2.debit) > 0 && Number(inputs.step2.credit) > 0) {
      const credit = Number(inputs.step2.credit);
      const debit = Number('0');
      var journalDetail: IJournalDetail = {
        journal_id: this.journal_id,
        journal_subid: count,
        account: Number(creditAccount.account),
        child: Number(creditAccount.child),
        description: inputs.step2.detail_description,
        create_date: updateDate,
        create_user: email,
        sub_type: inputs.step2.sub_type,
        debit: debit,
        credit: credit,
        reference: inputs.step2.reference,
        fund: inputs.step2.fund
      }
      this.journalDetails.push(journalDetail);
    }
    this.changeDesctionRef.markForCheck();
  }

  postTransaction() {
    var details: any;
    this.journalService.createJournalHeader(this.journalHeader).subscribe(journal => {
      console.debug(JSON.stringify(journal));
      this.journalDetails.forEach(journalDetail => {
        journalDetail.journal_id = journal.journal_id
        this.journalService.createJournalDetail(journalDetail)
      })
    });

  }


  changeFund(e: any) {
    console.debug('Fund: ', e.value);
  }

  changeSubtype(e: any) {
    console.debug('Subytype :', e.value);
  }

  changeChildAccount($event: any) {

  }

  formatNumber(e) {
    if (e.value === null) {
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

    this._onDestroy.next();
    this._onDestroy.complete();
  }


}
