import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GLAccountsService } from 'app/services/accounts.service';
import { FundsService } from 'app/services/funds.service';
import { IJournalDetail ,JournalService } from 'app/services/journal.service';
import { MaterialModule } from 'app/services/material.module';
import { map, Observable } from 'rxjs';
import { JournalTableComponent } from '../journal-table/journal-table.component';


const imports = [
  CommonModule,
  ReactiveFormsModule,
  MaterialModule,
  FormsModule,
  JournalTableComponent
];

@Component({
  selector: 'journal-edit',
  standalone: true,
  imports: [imports],
  templateUrl: './journal-edit.component.html',
  styles: ``
})
export class JournalEditComponent implements OnInit {

  @Input() public journal_id: number;
  @Input() public journal_subid: number;
  @Input() public child: string;
  @Input() public fund: string;
  @Input() public child_description: string;
  @Input() public debit: number;
  @Input() public credit: number;
  

  public journalService = inject(JournalService);
  private fundService = inject(FundsService);
  private accountService = inject(GLAccountsService);
  private fb = inject(FormBuilder);

  journalDetailEditForm?: FormGroup;
  journalDetail$? : Observable<IJournalDetail[]>
  
  funds$ = this.fundService.read();
  accounts$ = this.accountService.read().pipe(map((child) => child.filter((parent) => parent.parent_account === false)));
  childAccount: 'account';

  ngOnInit(): void {
    console.log(`Child account :',  ${this.child} no: ${this.journal_id}`);
    this.createEmptyForm();    
  }

  createEmptyForm  () {
    this.journalDetailEditForm = this.fb.group({           
      child: [this.child, Validators.required] ,
      fund:  [this.fund, Validators.required] ,
      child_description: [this.child_description, Validators.required] ,
      debit: ['', Validators.required] ,
      credit:['', Validators.required],                       
    });
  }
  
  updateForm() {
    this.journalDetailEditForm = this.fb.group({           
      child: [this.child, Validators.required] ,
      fund:  [this.fund, Validators.required] ,
      child_description: [this.child_description, Validators.required] ,
      debit: [this.debit, Validators.required] ,
      credit:[this.credit, Validators.required],                       
    });
  }
  

  changeChildAccount(e: any) {
    console.log(e.value);
    this.childAccount = e;
  }

  changeFund(e: any){

  }

  onDelete(e: any) {

  }

  onUpdate(e: any) {

  }

}
