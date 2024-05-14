import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GLAccountsService } from 'app/services/accounts.service';
import { FundsService } from 'app/services/funds.service';
import { IJournalDetail, JournalService } from 'app/services/journal.service';
import { MaterialModule } from 'app/services/material.module';
import { SubTypeService } from 'app/services/subtype.service';
import { TypeService } from 'app/services/type.service';
import { DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { Observable, map } from 'rxjs';

const imports = [
  CommonModule,
  MatIconModule, 
  FormsModule, 
  ReactiveFormsModule, 
  MaterialModule,
  NgxMaskDirective, 
  NgxMaskPipe,
  DxDataGridModule,
  DxTemplateModule,

]

@Component({
  selector: 'entry-wizard',
  standalone: true,
  imports: [imports],
  templateUrl: './entry-wizard.component.html',
  styles: ``,
  providers: [provideNgxMask()]
})
export class EntryWizardComponent implements OnInit
{
onDelete($event: any) {
throw new Error('Method not implemented.');
}
onUpdate() {
throw new Error('Method not implemented.');
}
    horizontalStepperForm: UntypedFormGroup;
    verticalStepperForm: UntypedFormGroup;
    private journalService = inject(JournalService);
    private typeService = inject(TypeService);
    private subtypeService = inject(SubTypeService);
    private fundService = inject(FundsService);
    private accountService = inject(GLAccountsService);
    private snackBar = inject(MatSnackBar);
  
   journal_id = 0;

   detail$?: Observable<IJournalDetail[]>
   funds$ = this.fundService.read();
   subtype$ = this.subtypeService.read();
   accounts$ = this.accountService.read().pipe(map((child) => child.filter((parent) => parent.parent_account === false)));
   details$ = this.journalService.getJournalDetail(0);

    /**
     * Constructor
     */
    constructor(private _formBuilder: UntypedFormBuilder)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.details$ = this.journalService.getJournalDetail(this.journal_id);
        // Vertical stepper form
        this.verticalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                description : ['test',Validators.required ],
                transaction_date : ['05/01/2024', Validators.required],
                amount: ['1500', Validators.required],
            }),
            step2: this._formBuilder.group({
                account: ['1001', Validators.required],
                detail_description : ['Some Description', Validators.required],
                reference : ['#Reference', Validators.required],
                sub_type : ['Operating', Validators.required],
                fund : ['Reserve', Validators.required],
                debit : ['1000', Validators.required],
                credit : ['0', Validators.required],                
            }),
            step3: this._formBuilder.group({
                byEmail          : this._formBuilder.group({
                    companyNews     : [true],
                    featuredProducts: [false],
                    messages        : [true],
                }),
                pushNotifications: ['everything', Validators.required],
            }),
        });
    }

    changeFund(e: any) {
        console.log('Fund: ', e.value);
      }
    
    changeSubtype(e: any) {
        console.log('Subytype :', e.value);
      }

    changeChildAccount($event: any) {

    }

    formatNumber(e) {
        const options = {
            style: 'decimal',  // Other options: 'currency', 'percent', etc.
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        };
        const formattedWithOptions = e.value.toLocaleString('en-US', options);
        console.log(formattedWithOptions);
        return formattedWithOptions;
    }

      
    
}
