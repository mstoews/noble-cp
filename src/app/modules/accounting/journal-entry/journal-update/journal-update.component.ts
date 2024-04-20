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
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { JournalEditComponent } from './journal-edit.component';
import { JournalTableComponent } from '../journal-table/journal-table.component';

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
  JournalTableComponent
];


@Component({
  selector: 'journal-update',
  standalone: true,
  imports: [imports],
  templateUrl: './journal-update.component.html',
  styles: ``,
})
export class JournalUpdateComponent implements OnInit{
  
  onDetailRowSelected(e: any) {
    console.log('onFocusRowChanged :', JSON.stringify(e.row.data)) 
    this.child_desciption = e.row.data.description;
    this.child = e.row.data.child;
    this.debit = e.row.data.debit;
    this.credit = e.row.data.credit;
    this.fund = e.row.sub_type;
  }

  child_desciption = ''
  child = '';
  debit = 0;
  credit = 0;
  fund = '';
  
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
  public currentDate: string;
  public journal_details: any[];
  public journalForm!: FormGroup;

  journalHeader$ = this.journalService.listJournalHeader();
  types$ = this.typeService.read();
  funds$ = this.fundService.read();
  subtypes$ = this.subtypeService.read();
  accounts$ = this.accountService.read().pipe(map((child) => child.filter((parent) => parent.parent_account === false)));
  details$: Observable<IJournalDetail[]>;
    
  ngOnInit(): void {
    if (this.journal_id !== null || this.journal_id  !== undefined) {
       this.details$ = this.journalService.getJournalDetail(this.journal_id);
    }
    this.createEmptyForm();
    
  }

  createEmptyForm  () {
    this.journalForm = this.fb.group({                 
      description: [this.description, Validators.required] ,
      transaction_date: [this.transaction_date, Validators.required] ,      
    });
  }
  
  closeDrawer() {
    this.notifyDrawerClose.emit();
  }

  onDelete($event: any) {
    
  }

  onCreate() {
    
  }

  onUpdate(e: IJournalDetail) {
    const detail  = {
      journal_id    : e.journal_id,
      journal_subid : e.journal_subid,
      account       : e.account,
      child         : e.child,
      fund          : e.fund,
      sub_type      : e.sub_type,
      description   : e.description,
      debit         : e.debit,
      credit        : e.credit,
      create_date   : e.create_date,
      create_user   : e.create_user
    }
    this.journalService.updateJournalDetail(detail)
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
