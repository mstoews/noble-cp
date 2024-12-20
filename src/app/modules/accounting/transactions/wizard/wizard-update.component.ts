import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, inject, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { JournalService } from 'app/services/journal.service';
import { Observable, ReplaySubject, Subject, Subscription, interval, map, startWith, take, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DndComponent } from 'app/modules/drag-n-drop/loaddnd/dnd.component';
import { FundsService } from 'app/services/funds.service';
import { GLAccountsService } from 'app/services/accounts.service';

import { MaterialModule } from 'app/services/material.module';
import { SubTypeService } from 'app/services/subtype.service';
import { TypeService } from 'app/services/type.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComboBoxModule, DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { AUTH } from 'app/app.config';
import { MatSelect } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { IDropDownAccounts } from 'app/models';
import { AggregateService, EditService, FilterService, GridModule, PageService, RowDDService, SortService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { IJournalDetailDelete, IJournalHeaderUpdate } from 'app/models/journals';
import { JournalStore } from 'app/services/journal.store';


declare var __moduleName: string;

const imports = [
  CommonModule,
  ReactiveFormsModule,
  MaterialModule,
  ComboBoxModule,
  FormsModule,
  NgxMaskDirective,
  NgxMatSelectSearchModule,
  GridModule,
  DropDownListAllModule,
];

@Component({
    selector: 'wizard-update',
    imports: [imports],
    templateUrl: './wizard-update.component.html',
    providers: [provideNgxMask(), SortService,
        PageService,
        FilterService,
        ToolbarService,
        EditService,
        AggregateService,
        RowDDService],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: `
  ::ng-deep .label {
    color: #767676;
  }
  `,
    moduleId: __moduleName
})
export class WizardUpdateComponent implements OnInit, OnDestroy, AfterViewInit {

  items: Record<any, unknown>[];

  @Output() notifyDrawerClose: EventEmitter<any> = new EventEmitter();
  @Input() public sTitle: string;
  @Input() public journal_id: number;
  @Input() public description: string;
  @Input() public transaction_date: string;
  @Input() public amount: number;
  @Input() public bNewTransaction = true;



  public GL = 'GL';
  public AP = 'AP';
  public AR = 'AR';


  private fb = inject(FormBuilder);
  private journalService = inject(JournalService);
  private typeService = inject(TypeService);
  private subtypeService = inject(SubTypeService);
  private fundService = inject(FundsService);
  private accountService = inject(GLAccountsService);
  private snackBar = inject(MatSnackBar);
  private _change = inject(ChangeDetectorRef);
  private _fuseConfirmationService = inject(FuseConfirmationService);
  private auth = inject(AUTH);


  public journalForm!: FormGroup;
  public journalDetailForm!: FormGroup;
  public matDialog = inject(MatDialog);



  public value = 0;
  public loading = false;
  public height: string = '250px';

  funds$ = this.fundService.read();
  subtype$ = this.subtypeService.read();
  accounts$ = this.accountService.readChildren();
  dropDownChildren$ = this.accountService.readChildren()
  store = inject(JournalStore);

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
  bDirty = false;

  public accountsListSubject: Subscription;

  // drop down searchable list
  public accountList: IDropDownAccounts[] = [];
  public accountCtrl: FormControl<IDropDownAccounts> = new FormControl<IDropDownAccounts>(null);
  public accountFilterCtrl: FormControl<string> = new FormControl<string>('');
  public filteredAccounts: ReplaySubject<IDropDownAccounts[]> = new ReplaySubject<IDropDownAccounts[]>(1);

  @ViewChild('singleSelect', { static: true })
  singleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();


  onSelectionChanged(e: any) {
    console.log(JSON.stringify(e));
  }

  onEditingStart(e: any) {
    console.log(e);
  }

  onEditingEnd(e: any) {
    console.log(e);
  }

  // Update only the signal and mark as dirty. When completed update the whole signal. 
  onSaved(e: any) {
    this.bDirty = true;
    const updateDate = new Date().toISOString().split('T')[0];
    const email = this.auth.currentUser?.email;
    const changes = e.changes[0].data;
    console.log('onSaved ', changes);
    const journalDetail = {
      "journal_id": changes.journal_id,
      "journal_subid": changes.journal_subid,
      "account": Number(changes.account),
      "child": Number(changes.child),
      "child_desc": changes.child_desc,
      "description": changes.description,
      "create_date": updateDate,
      "create_user": email,
      "sub_type": changes.sub_type,
      "debit": changes.debit,
      "credit": changes.credit,
      "reference": changes.reference,
      "fund": changes.fund
    }
    this.store.updateJournalDetail(journalDetail);
  }

  ngOnInit(): void {
    this.createEmptyForm();

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

    this.refresh(this.journal_id, this.description, this.transaction_date, this.amount);

    this.accountFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAccounts();
      });
  }

  protected setInitialValue() {
    this.store.loadDetails(this.journal_id);
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
    // this.journalHeaderData = this.journalService.readJournalHeaderById(this.journal_id);
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


  public refresh(journal_id: number, description: string, transaction_date: string, amount: number) {

    this.description = description;
    this.transaction_date = transaction_date;
    this.amount = Number(amount);

    this.journalForm = this.fb.group({
      description: [this.description, Validators.required],
      amount: [this.amount, Validators.required],
      transaction_date: [this.transaction_date, Validators.required]
    });

    if (journal_id === undefined) {
      this.description = '';
      this.transaction_date = '';
      // this.detailsListSignal = this.journalService.getJournalDetail(0);

      return;
    }
    else if (journal_id > 0) {
      //this.detailsListSignal = this.journalService.getJournalDetail(this.journal_id);
    }
    else {
      this.description = '';
      this.transaction_date = '';
      // this.detailsListSignal = this.journalService.getJournalDetail(0);
      this.journalForm = this.fb.group({
        description: [this.description, Validators.required],
        amount: [this.amount, Validators.required],
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
      amount: [this.amount, Validators.required],
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
    if (this.bDirty === false) {
      this.journalDetailForm.reset();
      this.journalForm.reset();
      this._change.markForCheck();
      this.notifyDrawerClose.emit();
    }
    else {
      const confirmation = this.fuseConfirmationService.open({
        title: 'Unsaved Changes',
        message: 'Would you like to save the changes before the edit window is closed and the changes lost?  ',
        actions: {
          confirm: {
            label: 'Close Without Saving',
          },
        },
      });

      // Subscribe to the confirmation dialog closed action
      confirmation.afterClosed().subscribe((result) => {

        if (result === 'confirmed') {
          this.journalDetailForm.reset();
          this.journalForm.reset();
          this._change.markForCheck();
          this.notifyDrawerClose.emit();
        }
      });
    }
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
    // this.journalService.deleteJournalDetail(journal);
    this.bDirty = true;
    this.journalService.reNumberJournalDetail(this.journal_id);
  }

  onAddLineJournalDetail() {

    const updateDate = new Date().toISOString().split('T')[0];
    const email = this.auth.currentUser?.email;
    var max = 0;

    // for (let i = 0; i < this.detailsListSignal().length; i++) {
    //   if (this.detailsListSignal()[i].journal_subid > max)
    //     max = this.detailsListSignal()[i].journal_subid
    // }

    this.store.loadDetails(this.journal_id);

    if (this.store.details().length > 0) {
      const sub = this.store.details().length + 1;
      const journalCopy = this.store.details()
      const journalDetail = {
        "journal_id": this.journal_id,
        "journal_subid": max + 1,
        "account": journalCopy[0].account,
        "child": journalCopy[0].child,
        "description": journalCopy[0].description,
        "create_date": updateDate,
        "create_user": email,
        "sub_type": journalCopy[0].sub_type,
        "debit": 0,
        "credit": 0,
        "reference": journalCopy[0].reference,
        "fund": journalCopy[0].fund
      }
      this.store.createJournalDetail(journalDetail);

    }
    else {
      const journalDetail = {
        "journal_id": this.journal_id,
        "journal_subid": 1,
        "account": 0,
        "child": 0,
        "description": '',
        "create_date": updateDate,
        "create_user": email,
        "sub_type": '',
        "debit": 0,
        "credit": 0,
        "reference": '',
        "fund": ''
      }
      this.store.createJournalDetail(journalDetail);

    }
    this.bDirty = true;

  }

  journalEntryCleanUp() {
    this.journalDetailForm.reset();
    this.accountCtrl.reset();
    this.journalService.reNumberJournalDetail(this.journal_id);
  }


  onUpdateJournalEntry() {
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    const email = this.auth.currentUser?.email;
    var debit: number;
    var credit: number;

    if (this.bDirty === false) {
      this.snackBar.open('Journal details have nothing to update ... ', 'OK', {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        duration: 2000,
      });
      return
    }

    this.editing = false;
    var header = this.journalForm.getRawValue();

    header.header_amount = 0.0;
    var journal_subid = 1;
    var journal_id = 0;

    this.store.details().forEach(details => {
      header.header_amount = Number(details.debit) + header.header_amount;
      journal_id = details.journal_id;


      debit = Number(details.debit);
      credit = Number(details.credit);

      if (debit > 0 && credit > 0) {
        this.snackBar.open('Only one of debit and credit fields updated', 'OK', {
          verticalPosition: 'top',
          horizontalPosition: 'right',
          duration: 2000,
        });
        return;
      }
      details.journal_subid = journal_subid;
      this.store.updateJournalDetail(details);

      journal_subid++;
    })

    const journalHeaderUpdate: IJournalHeaderUpdate = {
      journal_id: journal_id,
      description: header.description,
      transaction_date: header.transaction_date,
      amount: Number(header.header_amount)
    }

    this.journalForm = this.fb.group({
      description: [this.description, Validators.required],
      amount: [Number(header.header_amount), Validators.required],
      transaction_date: [this.transaction_date, Validators.required]
    });

    this.journalService.updateJournalHeader(journalHeaderUpdate);

    this.bDirty = false
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
      "child_desc": this.accountCtrl.value.description,
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

    this.store.updateJournalDetail(journalDetail);

    this.snackBar.open('Journal Entry Updated', 'OK', {
      verticalPosition: 'top',
      horizontalPosition: 'right',
      duration: 2000,
    });

    this.accountCtrl.reset();
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

    //const dialogRef = this.dialog.open(JournalEditComponent, dialogConfig);

    // dialogRef.afterClosed().subscribe(
    //   val => {
    //     this.refresh(this.journal_id, this.description, this.transaction_date, this.amount);
    //   }
    // );

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
    if (e.value === null || e.value === undefined)
      e.value = 0.0;
    const formattedWithOptions = e.value.toLocaleString('en-US', options);
    return formattedWithOptions;
  }

  ngOnDestroy(): void {
    if (this.accountsListSubject) {
      this.accountsListSubject.unsubscribe();
    }
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
