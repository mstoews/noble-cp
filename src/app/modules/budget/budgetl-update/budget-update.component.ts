import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IJournalDetail, IJournalDetailDelete, IJournalHeader, JournalService } from 'app/services/journal.service';
import { Observable, ReplaySubject, Subject, Subscription, interval, map, startWith, take, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DndComponent } from 'app/modules/drag-n-drop/loaddnd/dnd.component';
import { FundsService } from 'app/services/funds.service';
import { GLAccountsService } from 'app/services/accounts.service';
import { GridMenubarStandaloneComponent } from '../../accounting/grid-menubar/grid-menubar.component';

import { MaterialModule } from 'app/services/material.module';
import { SubTypeService } from 'app/services/subtype.service';
import { TypeService } from 'app/services/type.service';
import { BudgetEditComponent } from './budget-edit.component';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComboBoxModule } from '@syncfusion/ej2-angular-dropdowns';
import { FileManagerComponent } from 'app/modules/file-manager/file-manager.component';
import { AUTH } from 'app/app.config';
import { MatSelect } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { IDropDownAccounts } from 'app/models';
import { BudgetDetailComponent } from '../budget-detail/budget-detail.component';
import { BudgetTableComponent } from '../budget-table/budget-table.component';


const imports = [
  CommonModule,
  ReactiveFormsModule,
  MaterialModule,
  ComboBoxModule,
  FormsModule,
  BudgetDetailComponent,
  DndComponent,
  GridMenubarStandaloneComponent,
  BudgetEditComponent,
  BudgetTableComponent,
  NgxMaskDirective,
  NgxMaskPipe,
  FileManagerComponent,
  NgxMatSelectSearchModule
];

@Component({
  selector: 'journal-update',
  standalone: true,
  imports: [imports],
  templateUrl: './budget-update.component.html',
  providers: [provideNgxMask()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: ``,
})
export class BudgetUpdateComponent implements OnInit, OnDestroy, AfterViewInit {

  @Output() notifyDrawerClose: EventEmitter<any> = new EventEmitter();
  @Input() public sTitle: string;
  @Input() public journal_id: number;
  @Input() public description: string;
  @Input() public transaction_date: string;
  @Input() public amount: string;
  @Input() public bNewTransaction = true;



  private fb = inject(FormBuilder);
  private journalService = inject(JournalService);
  private typeService = inject(TypeService);
  private subtypeService = inject(SubTypeService);
  private fundService = inject(FundsService);
  private accountService = inject(GLAccountsService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private _change = inject(ChangeDetectorRef);
  private _fuseConfirmationService = inject(FuseConfirmationService);
  private auth = inject(AUTH);
  public currentDate: string;
  public journal_details: any[];
  public journalForm!: FormGroup;
  public journalDetailForm!: FormGroup;
  public matDialog = inject(MatDialog);
  public localFields: Object = { text: 'description', value: 'child' };
  public localWaterMark: string = 'Select an account';

  public value = 0;
  public loading = false;
  public height: string = '250px';

  funds$ = this.fundService.read();
  subtype$ = this.subtypeService.read();
  accounts$ = this.accountService.readChildren();
  dropDownChildren$ = this.accountService.readChildren()

  detailsListSignal = this.journalService.getJournalDetail(0);

  private fuseConfirmationService = inject(FuseConfirmationService);

  // header$ = this.journalService.readJournalHeader();
  types$ = this.typeService.read();
  subtypes$ = this.subtypeService.read();
  currentRowData: any;
  journalHeaderData: any;
  journal_subid: any;
  editing = false;
  child = new FormControl('');
  myControl = new FormControl('');
  accountOptions: Observable<string[]>;

  public journalDetailList = [];
  public accountsListSubject: Subscription;
  public detailsSubject: Subscription;
  private journalDetailUpdateSubject: Subscription;
  private journalDetailDeleteSubject: Subscription;

  // drop down searchable list
  public accountList: IDropDownAccounts[] = [];
  public accountCtrl: FormControl<IDropDownAccounts> = new FormControl<IDropDownAccounts>(null);
  public accountFilterCtrl: FormControl<string> = new FormControl<string>('');
  public filteredAccounts: ReplaySubject<IDropDownAccounts[]> = new ReplaySubject<IDropDownAccounts[]>(1);

  @ViewChild('singleSelect', { static: true })
  singleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();

  ngOnInit(): void {
    this.accountsListSubject = this.dropDownChildren$.subscribe(accounts => {
      accounts.forEach(acct => {
        var list = {
          account: acct.account,
          child: acct.child,
          description: acct.description
        }
        this.accountList.push(list)
      })
      this.filteredAccounts.next(this.accountList.slice());
      console.debug('Length of array: ', this.accountList.length)
    });

    this.updateDetailList();
    this.createEmptyForm();
    this.refresh(this.journal_id, this.description, this.transaction_date, this.amount);

    this.accountFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAccounts();
      });
  }

  protected setInitialValue() {
    this.detailsListSignal = this.journalService.getJournalDetail(this.journal_id);
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  protected filterAccounts() {
    if (!this.accountList) {
      return;
    }
    // get the search keyword
    let search = this.accountFilterCtrl.value;
    if (!search) {
      this.filteredAccounts.next(this.accountList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredAccounts.next(
      this.accountList.filter(account => account.description.toLowerCase().indexOf(search) > -1)
    );
  }

  onFocusedDetailRowChanged(e: any) {
    this.currentRowData = e.row.data;
    this.journal_subid = e.row.data.journal_subid;
    this.updateForm(e.row.data)
    this.editing = true;
    this.journalHeaderData = this.journalService.readJournalHeaderById(this.journal_id);
  }


  updateForm(row: any) {
    this.journalForm.reset();
    this.journalForm = this.fb.group({
      description: [this.description, Validators.required],
      amount: [this.amount, Validators.required],
      transaction_date: [this.transaction_date, Validators.required]
    });

    this.journalDetailForm = this.fb.group({
      detail_description: [row.description, Validators.required],
      child: [row.child, Validators.required],
      fund: [row.fund, Validators.required],
      sub_type: [row.sub_type, Validators.required],
      reference: [row.reference],
      debit: [row.debit, Validators.required],
      credit: [row.credit, Validators.required]
    });

    const index = this.accountList.findIndex(account => account.child == row.child);
    this.accountCtrl.setValue(this.accountList[index]);

  }

  updateDetailList() {
    // this.detailsSubject = this.detailsListSignal.subscribe(details => {
    //   this.journalDetailList = details;
    // })
  }

  public refresh(journal_id: number, description: string, transaction_date: string, amount: string) {

    this.description = description;
    this.transaction_date = transaction_date;
    this.amount = amount;

    this.journalForm = this.fb.group({
      description: [this.description, Validators.required],
      header_amount: [this.amount, Validators.required],
      transaction_date: [this.transaction_date, Validators.required]
    });

    if (journal_id === undefined) {
      this.description = '';
      this.transaction_date = '';
      this.detailsListSignal = this.journalService.getJournalDetail(0);

      return;
    }
    else if (journal_id > 0) {
      //this.detailsListSignal = this.journalService.getJournalDetail(this.journal_id);
    }
    else {
      this.description = '';
      this.transaction_date = '';
      this.detailsListSignal = this.journalService.getJournalDetail(0);
      this.journalForm = this.fb.group({
        description: [this.description, Validators.required],
        header_amount: [this.amount, Validators.required],
        transaction_date: [this.transaction_date, Validators.required],
      });
    }

  }

  changeSubtype(e: any) {
    console.debug('Subytype :', e.value);
  }


  onCreateTemplate() {
    const confirmation = this.fuseConfirmationService.open({
      title: 'Create Template',
      message: 'Would you like to create a template based upon the current transaction? ',
      actions: {
        confirm: {
          label: 'Journal Template',
        },
      },
    });

    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === 'confirmed') {
        // Delete the list
        // this.journalService.cre
      }
    });

  }

  onAddEvidence() {
    const dialogRef = this.matDialog.open(DndComponent, {
      width: '600px',
      data: {
        journal_id: this.journal_id,
        reference_no: this.journal_id,
        description: this.description,
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

  createEmptyForm() {
    this.journalForm = this.fb.group({
      description: [this.description, Validators.required],
      header_amount: [this.amount, Validators.required],
      transaction_date: [this.transaction_date, Validators.required]
    });
    this.journalDetailForm = this.fb.group({
      detail_description: ['', Validators.required],
      child: ['', Validators.required],
      fund: ['', Validators.required],
      sub_type: ['', Validators.required],
      reference: [''],
      debit: ['', Validators.required],
      credit: ['', Validators.required]
    });
    this._change.markForCheck();
  }

  closeDrawer() {
    this.journalDetailForm.reset();
    this.journalForm.reset();
    this._change.markForCheck();
    this.notifyDrawerClose.emit();
  }

  onDelete() {
    var journalDetail = {
      "journal_id": this.currentRowData.journal_id,
      "journal_subid": this.currentRowData.journal_subid,
    }
    const confirmation = this._fuseConfirmationService.open({
      title: `Delete  transaction number : ${journalDetail.journal_id}-${journalDetail.journal_subid} `,
      message: 'Are you sure you want to delete this line entry? ',
      actions: {
        confirm: {
          label: 'Delete',
        },
      },
    });

    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === 'confirmed') {
        // Delete the list
        this.delete(journalDetail);

      }
    });
  }

  delete(journal: IJournalDetailDelete) {
    this.journalService.deleteJournalDetail(journal);
  }

  onAddLineJournalDetail() {
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    const email = this.auth.currentUser?.email;
    var debit: number;
    var credit: number;

    this.editing = false;

    var detail = this.journalDetailForm.getRawValue();

    var journal_subid = this.detailsListSignal().length + 1;

    if (detail.detail_description === '' || detail.detail_description === undefined || detail.detail_description === null) {
      this.snackBar.open('Please select a row to edit', 'OK', {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        duration: 2000,
      });
      return;
    }

    debit = Number(detail.debit);
    credit = Number(detail.credit);

    if (debit > 0 && credit > 0) {
      this.snackBar.open('Only one of debit and credit fields updated', 'OK', {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        duration: 2000,
      });
      return;
    }

    var journalDetail: IJournalDetail;

    var acct = this.accountList.find(x => x.child == detail.child);

    if (journal_subid === this.journalDetailList.length) {
      return;
    }

    if (debit !== undefined && credit !== undefined) {
      journalDetail = {
        "journal_id": this.currentRowData.journal_id,
        "journal_subid": journal_subid,
        "account": Number(acct.account),
        "child": Number(acct.child),
        "description": detail.detail_description,
        "create_date": updateDate,
        "create_user": email,
        "sub_type": detail.sub_type,
        "debit": debit,
        "credit": credit,
        "reference": detail.reference,
        "fund": detail.fund
      }
    }

    if (journalDetail !== undefined) {
      this.journalService.createJournalDetail(journalDetail)
      this.journalDetailForm.reset()
    }

  }

  onUpdateJournalEntry() {
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    const email = this.auth.currentUser?.email;
    var debit: number;
    var credit: number;


    this.editing = false;
    var header = this.journalForm.getRawValue();
    var detail = this.journalDetailForm.getRawValue();

    if (detail.detail_description === '' || detail.detail_description === undefined || detail.detail_description === null) {

      const journalHeader: any = {
        journal_id: this.journal_id,
        description: header.description,
        transaction_date: header.transaction_date,
        amount: header.header_amount
      }

      if (journalHeader !== undefined) {

        this.journalService.updateJournalHeader(journalHeader);
        this.snackBar.open('Journal header details updated ... ', 'OK', {
          verticalPosition: 'top',
          horizontalPosition: 'right',
          duration: 2000,
        });
        return
      }
      else {
        this.snackBar.open('Please select a row to edit', 'OK', {
          verticalPosition: 'top',
          horizontalPosition: 'right',
          duration: 2000,
        });
      }
      return;
    }

    debit = Number(detail.debit);
    credit = Number(detail.credit);

    if (debit > 0 && credit > 0) {
      this.snackBar.open('Only one of debit and credit fields updated', 'OK', {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        duration: 2000,
      });
      return;
    }

    var journalDetail: IJournalDetail;

    var childAccount = this.accountCtrl.getRawValue()

    if (debit !== undefined && credit !== undefined) {
      journalDetail = {
        "journal_id": this.currentRowData.journal_id,
        "journal_subid": this.currentRowData.journal_subid,
        "account": Number(childAccount.account),
        "child": Number(childAccount.child),
        "description": detail.detail_description,
        "create_date": updateDate,
        "create_user": email,
        "sub_type": detail.sub_type,
        "debit": debit,
        "credit": credit,
        "reference": detail.reference,
        "fund": detail.fund
      }
    }

    console.debug('Journal Details : \n', JSON.stringify(journalDetail));

    this.journalService.updateJournalDetail(journalDetail);

    const journalHeader: any = {
      journal_id: this.journalHeaderData.journal_id,
      description: header.description,
      transaction_date: header.transaction_date,
      amount: header.header_amount
    }

    this.journalService.updateJournalHeader(journalHeader);


    this.snackBar.open('Journal Entry Updated', 'OK', {
      verticalPosition: 'top',
      horizontalPosition: 'right',
      duration: 2000,
    });

    this.journalDetailForm.reset()
    //this.loadContent();
    //this.detailsListSignal = this.journalService.getJournalDetail(this.currentRowData.journal_id);
    this.editing = false;
    this._change.markForCheck();

  }

  onCreate() {
    var header = this.journalForm.getRawValue();
    var detail = this.journalDetailForm.getRawValue();
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    const email = this.auth.currentUser?.email;


    if (detail.detail_description === '' || detail.detail_description === undefined || detail.detail_description === null) {
      this.snackBar.open('Please select a row to edit', 'OK', {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        duration: 2000,
      });
      return;
    }

    var debit: number;
    var credit: number;

    debit = Number(detail.debit);
    credit = Number(detail.credit);

    if (debit > 0 && credit > 0) {
      this.snackBar.open('Only one of the debit field and credit field may be greater than zero!', 'OK', {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        duration: 2000,
      });
      return;
    }


    const journalDetail = {
      "journal_id": this.currentRowData.journal_id,
      "journal_subid": this.currentRowData.journal_subid,
      "account": this.currentRowData.account,
      "child": detail.child,
      "description": detail.detail_description,
      "create_date": updateDate,
      "create_user": email,
      "sub_type": detail.sub_type,
      "debit": debit,
      "credit": credit,
      "reference": detail.reference,
      "fund": detail.fund
    }

    const journalHeader: any = {
      description: header.description,
      transaction_date: header.transaction_date,
      amount: header.amount
    }

    var rc = this.journalService.updateJournalDetail(journalDetail);

    this.snackBar.open('Journal Entry Updated', 'OK', {
      verticalPosition: 'top',
      horizontalPosition: 'right',
      duration: 2000,
    });


    // this.loadContent();

    this.journalDetailForm.reset()
    this.detailsListSignal = null;
    this.detailsListSignal = this.journalService.getJournalDetail(this.journal_id);

  }


  loadContent() {
    this.loading = true;
    var value = 0;
    const numbers = interval(300);
    const take4 = numbers.pipe(take(6))
    const subs$: Subscription = take4.subscribe(res => {
      value = value + 20;
      console.debug('spinner  :', value);
      if (value === 120) {
        this.loading = false;
        subs$.unsubscribe();
        this._change.markForCheck();

      }
    });
  }

  onUpdate(e: any) {
    if (e.data === undefined) {
      return;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = e.data;
    dialogConfig.width = "450px";

    const dialogRef = this.dialog.open(BudgetEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      val => {
        console.debug("Dialog output:", val)
        this.refresh(this.journal_id, this.description, this.transaction_date, this.amount);
      }
    );

  }

  changeFund($event: any) {

  }

  changeChildAccount($event: any) {

  }

  formatNumber(e: any) {
    const options = {
      style: 'decimal',  // Other options: 'currency', 'percent', etc.
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };
    if (e.value === null)
      e.value = 0.0;
    const formattedWithOptions = e.value.toLocaleString('en-US', options);
    return formattedWithOptions;
  }

  ngOnDestroy(): void {
    if (this.accountsListSubject) {
      this.accountsListSubject.unsubscribe();
    }
    if (this.detailsSubject) {
      this.detailsSubject.unsubscribe();
    }
    if (this.journalDetailUpdateSubject) {
      this.journalDetailUpdateSubject.unsubscribe();
    }
    if (this.journalDetailDeleteSubject) {
      this.journalDetailDeleteSubject.unsubscribe();
    }

    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
