import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IJournalDetail, JournalService } from 'app/services/journal.service';
import { Observable, map } from 'rxjs';

import { CommonModule } from '@angular/common';
import { DndComponent } from 'app/modules/drag-n-drop/loaddnd/dnd.component';
import { FundsService } from 'app/services/funds.service';
import { GLAccountsService } from 'app/services/accounts.service';
import { GridMenubarStandaloneComponent } from '../../grid-menubar/grid-menubar.component';
import { JournalDetailComponent } from '../journal-detail/journal-detail.component';
import { MaterialModule } from 'app/services/material.module';
import { SubTypeService } from 'app/services/subtype.service';
import { TypeService } from 'app/services/type.service';
// import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { JournalEditComponent } from './journal-edit.component';
import { JournalTableComponent } from '../journal-table/journal-table.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { FuseConfirmationService } from '@fuse/services/confirmation';


const imports = [
  CommonModule,
  DxDataGridModule,
  DxTemplateModule,
  ReactiveFormsModule,
  MaterialModule,
  FormsModule,
  JournalDetailComponent,
  DndComponent,
  GridMenubarStandaloneComponent,
  JournalEditComponent,
  JournalTableComponent,
  NgxMaskDirective,
  NgxMaskPipe
];


@Component({
  selector: 'journal-update',
  standalone: true,
  imports: [imports],
  templateUrl: './journal-update.component.html',
  providers: [provideNgxMask()],
  styles: ``,
})
export class JournalUpdateComponent implements OnInit {

  onDetailRowSelected(e: any) {
    console.log('onFocusRowChanged :', JSON.stringify(e.row.data))
    this.child_desciption = e.row.data.description;
    this.child = e.row.data.child;
    this.debit = e.row.data.debit;
    this.credit = e.row.data.credit;
    this.fund = e.row.sub_type;
  }

  child_desciption = ''
  reference = '';
  child = '';
  debit = 0.0;
  credit = 0.0;
  fund = '';
  sub_type = '';

  @Output() notifyDrawerClose: EventEmitter<any> = new EventEmitter();
  @Input() public sTitle: string;
  @Input() public journal_id: number;
  @Input() public description: string;
  @Input() public transaction_date: string;

  private fb = inject(FormBuilder);
  private journalService = inject(JournalService);
  private typeService = inject(TypeService);
  private subtypeService = inject(SubTypeService);
  private fundService = inject(FundsService);
  private accountService = inject(GLAccountsService);
  private dialog = inject(MatDialog);
  public currentDate: string;
  public journal_details: any[];
  public journalForm!: FormGroup;
  public matDialog = inject(MatDialog);

  funds$ = this.fundService.read();
  subtype$ = this.subtypeService.read();
  accounts$ = this.accountService.read().pipe(map((child) => child.filter((parent) => parent.parent_account === false)));
  private fuseConfirmationService = inject(FuseConfirmationService);


  journalHeader$ = this.journalService.listJournalHeader();
  types$ = this.typeService.read();
  subtypes$ = this.subtypeService.read();
  details$: Observable<IJournalDetail[]>;

  ngOnInit(): void {
    this.refresh(this.journal_id);
    this.openForm();

  }

  onFocusedDetailRowChanged(e: any) {
    this.updateForm(e.row.data)
  }
  public refresh(journal_id: number) {
    if (journal_id > 0) {
      this.details$ = this.journalService.getJournalDetail(this.journal_id);
      this.journalHeader$.pipe(map((child) => child.filter((parent) => parent.journal_id === this.journal_id))).subscribe(header => {
        this.description = header[0].description;
        this.transaction_date = header[0].transaction_date;
        this.journalForm = this.fb.group({
          description: [this.description, Validators.required],
          transaction_date: [this.transaction_date, Validators.required],
        });
      })
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

  onCellDoubleClicked(e: any) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = e.data;
    dialogConfig.width = "450px";

    const dialogRef = this.dialog.open(JournalEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      val => {
        switch (val) {
          case 'Close':
            break;
          case 'Update':
            this.refresh(this.journal_id);
            break;
          case 'Create':
            this.refresh(this.journal_id);
            break;
          case 'Delete':
            this.refresh(this.journal_id);
            break;
          default:
            break;
        }
      }
    );
  }

  updateForm(row: any) {

    this.journalForm = this.fb.group({
      description: [row.description, Validators.required],
      transaction_date: [row.transaction_date, Validators.required],
      child: [row.child],
      fund: [row.fund],
      sub_type: [row.sub_type],
      reference: [row.reference],
      debit: [row.debit],
      credit: [row.credit]
    });
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
        reference_no: this.journal_id,
        description: "description",
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


  openForm() {
    console.log('Open Form ...');

    this.journalForm = this.fb.group({
      description: [this.description, Validators.required],
      transaction_date: [this.transaction_date, Validators.required],
      account: [this.child],
      fund: [this.fund],
      sub_type: [this.sub_type],
      reference: [this.reference],
      debit: [this.debit],
      credit: [this.credit]
    });

  }

  closeDrawer() {
    this.notifyDrawerClose.emit();
  }

  onDelete($event: any) {

  }

  onCreate() {

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
        this.refresh(0);
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
