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
  private dialog = inject(MatDialog);
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
    this.refresh(this.journal_id);    
    this.openForm();

  }

  public refresh(journal_id: number)  {
    if (journal_id > 0) {
      this.details$ = this.journalService.getJournalDetail(this.journal_id);
      this.journalHeader$.pipe(map((child) => child.filter((parent) => parent.journal_id === this.journal_id))).subscribe(header => {        
         this.description = header[0].description;
         this.transaction_date = header[0].transaction_date;
         this.journalForm = this.fb.group({                       
           description: [ this.description , Validators.required] ,
           transaction_date: [this.transaction_date, Validators.required] ,      
         });
     } )    
   }
   else {
      this.description = '';
      this.transaction_date = '';
      this.details$ = this.journalService.getJournalDetail(0);
      this.journalForm = this.fb.group({                       
        description: [ this.description , Validators.required] ,
        transaction_date: [this.transaction_date, Validators.required] ,      
      });
   }

  }


  onCellDoubleClicked(e: any){

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = e.data;
      dialogConfig.width = "450px";

      const dialogRef = this.dialog.open( JournalEditComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(
          val => {
            console.log("Dialog output:", val)         
            this.refresh(this.journal_id);         
          }  
      );     
  }

  openForm  () {
    console.log('Open Form ...');
    
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

  onUpdate(e: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = e.data;
    dialogConfig.width = "450px";

    const dialogRef = this.dialog.open( JournalEditComponent, dialogConfig);

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
