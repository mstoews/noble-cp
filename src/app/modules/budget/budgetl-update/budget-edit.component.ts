import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Inject, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GLAccountsService } from 'app/services/accounts.service';
import { FundsService } from 'app/services/funds.service';
import { JournalService } from 'app/services/journal.service';
import { MaterialModule } from 'app/services/material.module';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SubTypeService } from 'app/services/subtype.service';
import { AUTH } from 'app/app.config';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { IJournalDetail } from 'app/models/journals';


const imports = [
  CommonModule,
  ReactiveFormsModule,
  MaterialModule,
  FormsModule,
  NgxMaskDirective,
  NgxMaskPipe
];

@Component({
  selector: 'budget-edit',
  standalone: true,
  imports: [imports],
  templateUrl: './budget-edit.component.html',
  styles: ``,
  providers: [provideNgxMask()]
})
export class BudgetEditComponent {
  public journal_id: number;
  public journal_subid: number;

  public journalService = inject(JournalService);
  private fundService = inject(FundsService);
  private subtypeService = inject(SubTypeService);
  private accountService = inject(GLAccountsService);
  private auth = inject(AUTH);
  private fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef)

  journalDetailEditForm?: FormGroup;
  journalDetail$?: Observable<IJournalDetail[]>
  funds$ = this.fundService.read();
  subtype$ = this.subtypeService.read();
  accounts$ = this.accountService.readChildren();
  childAccount: 'account';
  account: number;

  constructor(

    private dialogRef: MatDialogRef<BudgetEditComponent>,
    @Inject(MAT_DIALOG_DATA) {
      journal_id,
      journal_subid,
      description,
      sub_type,
      reference,
      debit,
      credit,
      account,
      child,
      fund
    }) {

    this.journal_id = journal_id;
    this.journal_subid = journal_subid;
    this.account = account;

    this.journalDetailEditForm = this.fb.group({
      child: [child, Validators.required],
      fund: [fund, Validators.required],
      sub_type: [sub_type, Validators.required],
      description: [description, Validators.required],
      debit: [debit, Validators.required],
      credit: [credit, Validators.required],
      reference: [reference, Validators.required],
    });
  }


  changeChildAccount(e: any) {
    console.debug(e.value);
    this.childAccount = e;
  }

  changeFund(e: any) {
    console.debug('Fund: ', e.value);
  }

  changeSubtype(e: any) {
    console.debug('Subytype :', e.value);
  }

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  onUpdate() {
    const dDate = new Date();
    const User = this.auth.currentUser;
    const createDate = dDate.toISOString().split('T')[0];
    const journal_details = { ...this.journalDetailEditForm.value } as IJournalDetail;
    const rawData = {
      journal_id: this.journal_id,
      journal_subid: this.journal_subid,
      account: this.account,
      child: journal_details.child,
      child_desc: journal_details.child_desc,
      description: journal_details.description,
      create_date: createDate,
      create_user: User.email,
      sub_type: journal_details.sub_type,
      debit: journal_details.debit,
      credit: journal_details.credit,
      reference: journal_details.reference,
      fund: journal_details.fund
    }
    this.journalService.updateJournalDetail(rawData);

    this.dialogRef.close('Update');
  }

  onClose() {
    this.dialogRef.close('Close');
  }

  onCreate() {
    const dDate = new Date();
    const User = this.auth.currentUser;
    const createDate = dDate.toISOString().split('T')[0];
    const journal_details = { ...this.journalDetailEditForm.value } as IJournalDetail;
    const rawData = {
      journal_id: this.journal_id,
      journal_subid: this.journal_subid,
      account: this.account,
      child: journal_details.child,
      child_desc: journal_details.child_desc,
      description: journal_details.description,
      create_date: createDate,
      create_user: User.email,
      sub_type: journal_details.sub_type,
      debit: journal_details.debit,
      credit: journal_details.credit,
      reference: journal_details.reference,
      fund: journal_details.fund
    }
    this.journalService.createHttpJournalDetail(rawData);
    this.dialogRef.close('Update');
    this.dialogRef.close('Create');

  }

  onDelete(e: any) {
    this.dialogRef.close('Delete')
  }


}
