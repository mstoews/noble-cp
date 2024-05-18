import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IAccounts, IJournalDetail, IJournalHeader, JournalService } from 'app/services/journal.service';
import { Observable, Subscription, interval, map, startWith, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DndComponent } from 'app/modules/drag-n-drop/loaddnd/dnd.component';
import { FundsService } from 'app/services/funds.service';
import { GLAccountsService } from 'app/services/accounts.service';
import { GridMenubarStandaloneComponent } from '../../grid-menubar/grid-menubar.component';
import { JournalDetailComponent } from '../journal-detail/journal-detail.component';
import { MaterialModule } from 'app/services/material.module';
import { SubTypeService } from 'app/services/subtype.service';
import { TypeService } from 'app/services/type.service';
import { JournalEditComponent } from './journal-edit.component';
import { JournalTableComponent } from '../journal-table/journal-table.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComboBoxModule } from '@syncfusion/ej2-angular-dropdowns';
import { FileManagerComponent } from 'app/modules/file-manager/file-manager.component';


const imports = [
  CommonModule,
  DxDataGridModule,
  DxTemplateModule,
  ReactiveFormsModule,
  MaterialModule,
  ComboBoxModule, 
  FormsModule,
  JournalDetailComponent,
  DndComponent,
  GridMenubarStandaloneComponent,
  JournalEditComponent,
  JournalTableComponent,
  NgxMaskDirective,
  NgxMaskPipe,
  FileManagerComponent

];


@Component({
  selector: 'journal-update',
  standalone: true,
  imports: [imports],
  templateUrl: './journal-update.component.html',
  providers: [provideNgxMask()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: ``,
})
export class JournalUpdateComponent implements OnInit {


  @Output() notifyDrawerClose: EventEmitter<any> = new EventEmitter();
  @Input() public sTitle: string;
  @Input() public journal_id: number;
  @Input() public description: string;
  @Input() public transaction_date:string;
  @Input() public bNewTransaction = true;

  @Input() details$: Observable<IJournalDetail[]>;

  private fb = inject(FormBuilder);
  private journalService = inject(JournalService);
  private typeService = inject(TypeService);
  private subtypeService = inject(SubTypeService);
  private fundService = inject(FundsService);
  private accountService = inject(GLAccountsService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private _change = inject(ChangeDetectorRef);0
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
  accounts$ = this.accountService.read().pipe(map((child) => child.filter((parent) => parent.parent_account === false)));
  private fuseConfirmationService = inject(FuseConfirmationService);

  // header$ = this.journalService.readJournalHeader();
  types$ = this.typeService.read();
  subtypes$ = this.subtypeService.read();
  currentRowData: any;
  journal_subid: any;
  editing = false;
  child = new FormControl('');

  myControl = new FormControl('');
  accounts: IAccounts[];
  accountOptions:  Observable<string[]>;
  

  ngOnInit(): void {
    this.createEmptyForm();
    this.refresh(this.journal_id, this.description, this.transaction_date);
    
  }


  onFocusedDetailRowChanged(e: any) {
    this.currentRowData = e.row.data;
    this.journal_subid = e.row.data.journal_subid;
    this.updateForm(e.row.data)
    this.editing = true;
  }


  updateForm(row: any) {
    this.journalForm.reset();       
    this.journalForm = this.fb.group({
      description: [this.description, Validators.required],
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
  }

  public refresh(journal_id: number, description: string, transaction_date: string) {

    this.description = description;
    this.transaction_date = transaction_date;

    this.journalForm = this.fb.group({
      description: [this.description, Validators.required],
      transaction_date: [this.transaction_date, Validators.required]
    });
    
    if (journal_id === undefined) {
      this.description = '';
      this.transaction_date = '';
      this.details$ = this.journalService.getJournalDetail(0);
      
      return;
    }
    else if (journal_id > 0) {      
      //this.details$ = this.journalService.getJournalDetail(this.journal_id);
    }
    else {
      this.description = '';
      this.transaction_date = '';
      this.details$ = this.journalService.getJournalDetail(0);
      this.journalForm = this.fb.group({
        description: [this.description, Validators.required],
        transaction_date: [this.transaction_date, Validators.required],
      });
    }
  
  }

  changeSubtype(e: any) {
    console.log('Subytype :', e.value);
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
        //this.transactionService.bookJournal(this.key);
      }
    });

  }

  onAddEvidence() {
    const dialogRef = this.matDialog.open(DndComponent, {
      width: '600px',
      data: {
        journal_id : this.journal_id,
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
          console.log(result.data);
          break;
        case 'Cancel':
          break;
      }
    });

  }

  createEmptyForm() {
    this.journalForm = this.fb.group({
      description: [this.description, Validators.required],
      transaction_date: [this.transaction_date, Validators.required],
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

  onDelete($event: any) {

  }

  onAddLineJournalDetail() {    
    this.editing = true;

    var header = this.journalForm.getRawValue();
    var detail = this.journalDetailForm.getRawValue();

    if (detail.detail_description === '' || detail.detail_description === undefined || detail.detail_description === null)
      {
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
    var journalDetail: IJournalDetail;
    

    if (debit && credit){
      if (detail.journal_subid === undefined)
        detail.journal_subid = 1
       journalDetail = {
          "journal_id": header.journal_id,
          "journal_subid": detail.journal_subid,
           "account": detail.account,
           "child": detail.child,
           "description": detail.detail_description,
           "create_date":"2024-02-12",	
           "create_user":"mstoews@hotmail.com",
           "sub_type": detail.sub_type,
           "debit": debit,
           "credit": credit,
           "reference": detail.reference,
           "fund": detail.fund
         }
    }
    
    const journalHeader: IJournalHeader = {
        journal_id: header.journal_id,
        description: header.description,
        booked: false,
        booked_date: header.booked_date,
        booked_user: header.booked_user,
        create_date: header.create_date,
        create_user: header.create_user,
        period: header.period,
        period_year: header.period_year,
        transaction_date: header.transaction_date,
        status: header.status,
        type: header.type,
        sub_type: header.sub_type,
        amount: header.amount
    }
      
    
    this.journalService.updateJournalHeader(journalHeader);
    this.currentRowData.journal_subid
    
    this.snackBar.open('Journal Entry Updated', 'OK', {
      verticalPosition: 'top',
      horizontalPosition: 'right',
      duration: 2000,
    });

    this.journalDetailForm.reset()    
    this.loadContent();
    this.details$ = this.journalService.getJournalDetail(this.journal_id);

  }


  onUpdateJournalEntry() {
    this.editing = false;
    var header = this.journalForm.getRawValue();
    var detail = this.journalDetailForm.getRawValue();

    if (detail.detail_description === '' || detail.detail_description === undefined || detail.detail_description === null)
      {
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
    var journalDetail: IJournalDetail;
    
    // if (this.currentRowData) {
    // const journalDetail = {
    //   "journal_id": this.currentRowData.journal_id ,
    //   "journal_subid": this.currentRowData.journal_subid,
    //   "account": this.currentRowData.account,
    //   "child": detail.child,
    //   "description": detail.detail_description,
    //   "create_date":"2024-02-12",	
    //   "create_user":"mstoews@hotmail.com",
    //   "sub_type": detail.sub_type,
    //   "debit": debit,
    //   "credit": credit,
    //   "reference": detail.reference,
    //   "fund": detail.fund
    //   }
    // }

    if (debit && credit){
      if (detail.journal_subid === undefined)
        detail.journal_subid = 1
       journalDetail = {
          "journal_id": header.journal_id ,
          "journal_subid": detail.journal_subid,
           "account": detail.account,
           "child": detail.child,
           "description": detail.detail_description,
           "create_date":"2024-02-12",	
           "create_user":"mstoews@hotmail.com",
           "sub_type": detail.sub_type,
           "debit": debit,
           "credit": credit,
           "reference": detail.reference,
           "fund": detail.fund
         }
    }
    
    const journalHeader: IJournalHeader = {
        journal_id: header.journal_id,
        description: header.description,
        booked: false,
        booked_date: header.booked_date,
        booked_user: header.booked_user,
        create_date: header.create_date,
        create_user: header.create_user,
        period: header.period,
        period_year: header.period_year,
        transaction_date: header.transaction_date,
        status: header.status,
        type: header.type,
        sub_type: header.sub_type,
        amount: header.amount
    }
      
    
    this.journalService.updateJournalHeader(journalHeader);
    this.currentRowData.journal_subid
    
    this.snackBar.open('Journal Entry Updated', 'OK', {
      verticalPosition: 'top',
      horizontalPosition: 'right',
      duration: 2000,
    });

    this.journalDetailForm.reset()    
    this.loadContent();
    this.details$ = this.journalService.getJournalDetail(this.journal_id);

  }

  onCreate() {
    var header = this.journalForm.getRawValue();
    var detail = this.journalDetailForm.getRawValue();

    if (detail.detail_description === '' || detail.detail_description === undefined || detail.detail_description === null)
      {
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
    
    const journalDetail = {
      "journal_id": this.currentRowData.journal_id ,
      "journal_subid": this.currentRowData.journal_subid,
      "account": this.currentRowData.account,
      "child": detail.child,
      "description": detail.detail_description,
      "create_date":"2024-02-12",	
      "create_user":"mstoews@hotmail.com",
      "sub_type": detail.sub_type,
      "debit": debit,
      "credit": credit,
      "reference": detail.reference,
      "fund": detail.fund
    }
    
    const journalHeader: IJournalHeader = {
        journal_id: header.journal_id,
        description: header.description,
        booked: false,
        booked_date: header.booked_date,
        booked_user: header.booked_user,
        create_date: header.create_date,
        create_user: header.create_user,
        period: header.period,
        period_year: header.period_year,
        transaction_date: header.transaction_date,
        status: header.status,
        type: header.type,
        sub_type: header.sub_type,
        amount: header.amount
    }
      
    var rc = this.journalService.updateJournalDetail(journalDetail);
    // this.journalService.updateJournalHeader(journalHeader);
    
    this.snackBar.open('Journal Entry Updated', 'OK', {
      verticalPosition: 'top',
      horizontalPosition: 'right',
      duration: 2000,
    });


    this.loadContent();

    this.journalDetailForm.reset()
    this.details$ = null;
    this.details$ = this.journalService.getJournalDetail(this.journal_id);

  }

  
  loadContent() {
    this.loading = true;
    var value = 0;
    const numbers = interval(300);
    const take4 = numbers.pipe(take(6))
    const subs$: Subscription = take4.subscribe(res => {
      value = value + 20;
      console.debug('spinner  :',  value );
      if(value === 120) {        
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

    const dialogRef = this.dialog.open(JournalEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      val => {
        console.log("Dialog output:", val)
        this.refresh(this.journal_id, this.description, this.transaction_date);
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
    const formattedWithOptions = e.value.toLocaleString('en-US', options);
    return formattedWithOptions;
  }

}
