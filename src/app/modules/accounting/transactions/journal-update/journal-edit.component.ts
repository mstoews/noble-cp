import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Inject, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GLAccountsService } from 'app/services/accounts.service';
import { FundsService } from 'app/services/funds.service';
import { JournalService } from 'app/services/journal.service';
import { MaterialModule } from 'app/services/material.module';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SubTypeService } from 'app/services/subtype.service';

import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { IJournalDetail } from 'app/models/journals';
import { AuthService } from 'app/modules/auth/auth.service';
import { JournalStore } from 'app/store/journal.store';


const imports = [
  CommonModule,
  ReactiveFormsModule,
  MaterialModule,
  FormsModule,
  NgxMaskDirective,
  NgxMaskPipe
];

@Component({
  selector: 'journal-edit',
  standalone: true,
  imports: [imports],
  templateUrl: './journal-edit.component.html',
  providers: [provideNgxMask()]
})
export class JournalEditComponent {
  public journal_id: number;
  public journal_subid: number;

  public journalService = inject(JournalService);
  private fundService = inject(FundsService);
  private subtypeService = inject(SubTypeService);
  private accountService = inject(GLAccountsService);
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef)

  journalDetailEditForm?: FormGroup;
  journalDetail$?: Observable<IJournalDetail[]>
  funds$ = this.fundService.read();
  subtype$ = this.subtypeService.read();
  accounts$ = this.accountService.readChildren();
  childAccount: 'account';
  account: number;
  store = inject(JournalStore);

  constructor(

    private dialogRef: MatDialogRef<JournalEditComponent>,
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
    console.debug('Sub type :', e.value);
  }

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  onUpdate() {
    const dDate = new Date();
    const email = this.auth.user().email;
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
      create_user: email,
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
    const User = this.auth.user();
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
      create_user: User.email.split('T')[0],
      sub_type: journal_details.sub_type,
      debit: journal_details.debit,
      credit: journal_details.credit,
      reference: journal_details.reference,
      fund: journal_details.fund
    }

    this.store.createJournalDetail(rawData);
    
    
    this.dialogRef.close('Update');
    this.dialogRef.close('Create');

  }

  onDelete(e: any) {
    this.dialogRef.close('Delete')
  }


}
