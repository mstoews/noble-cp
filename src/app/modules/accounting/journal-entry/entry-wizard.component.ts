import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { AUTH } from 'app/app.config';
import { GLAccountsService } from 'app/services/accounts.service';
import { FundsService } from 'app/services/funds.service';
import { IJournalDetail, IJournalHeader, JournalService } from 'app/services/journal.service';
import { MaterialModule } from 'app/services/material.module';
import { SubTypeService } from 'app/services/subtype.service';
import { DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { Observable, Subscription, map } from 'rxjs';
import { JournalUpdateComponent } from './journal-update/journal-update.component';

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
    JournalUpdateComponent
]

@Component({
    selector: 'entry-wizard',
    standalone: true,
    imports: [imports],
    templateUrl: './entry-wizard.component.html',    
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations,
    styles: ``,
    providers: [provideNgxMask()]
})
export class EntryWizardComponent implements OnInit, OnDestroy {

    journalEntryForm: UntypedFormGroup;
    private journalService = inject(JournalService);
    private subtypeService = inject(SubTypeService);
    private fundService = inject(FundsService);
    private accountService = inject(GLAccountsService);
    private snackBar = inject(MatSnackBar);
    private _formBuilder = inject(UntypedFormBuilder);
    private changeDesctionRef = inject(ChangeDetectorRef);
    
    
    public journalHeader: IJournalHeader;
    private auth = inject(AUTH);
    public journal_id = 0;
    public accountList = [];
    public headerAmount = 0;

    public detail$?: Observable<IJournalDetail[]>;
    public journalDetails?: IJournalDetail[];
    public accountsListSubject: Subscription;

    funds$ = this.fundService.read();
    subtype$ = this.subtypeService.read();
    accounts$ = this.accountService.read().pipe(map((child) => child.filter((parent) => parent.parent_account === false)));
    details$ = this.journalService.getJournalDetail(0);


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {

        this.journalService.getJournalDetail(this.journal_id).subscribe(details => {
            this.journalDetails = details;
        });

        this.accountsListSubject = this.accountService.read().subscribe(accounts => {
            this.accountList = accounts;
        });

        this.journalService.getJournalHeader(0).subscribe(header => {
            this.journalHeader = header;            
        })

        // Vertical stepper form
        this.journalEntryForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                description: ['', Validators.required],
                transaction_date: ['', Validators.required],
                amount: ['', Validators.required],
            }),
            step2: this._formBuilder.group({
                child: ['', Validators.required],
                child_credit: ['', Validators.required],
                detail_description: ['', Validators.required],
                reference: ['', Validators.required],
                sub_type: ['', Validators.required],
                fund: ['', Validators.required],
                debit: ['', Validators.required],
                credit: ['', Validators.required],
                
            }),
            step3: this._formBuilder.group({
                
            })
        });

        this.journalService.getLastJournalNo().subscribe(journal_no => {
            this.journal_id = Number(journal_no);
        });

    }

    onUpdateHeader() {
        const dDate = new Date();
        const updateDate = dDate.toISOString().split('T')[0];
        const inputs = { ...this.journalEntryForm.value }        
        const email = this.auth.currentUser?.email;
        var journalHeader: IJournalHeader = {
            journal_id: this.journal_id,
            description: inputs.step1.description,
            booked: false,
            booked_date: updateDate,
            booked_user: email,
            create_date: updateDate,
            create_user: email,
            period: 1,
            period_year: 2024,
            transaction_date: inputs.step1.transaction_date,
            status: 'Open',
            sub_type: '',
            type: '',
            amount: inputs.step1.amount
        }
        
        this.headerAmount = journalHeader.amount;
        this.journalHeader = journalHeader;
        this.changeDesctionRef.markForCheck();
        
    }

    onDelete($event: any) {
        throw new Error('Method not implemented.');
    }


    onUpdate() {
        const dDate = new Date();
        const updateDate = dDate.toISOString().split('T')[0];
        const inputs = { ...this.journalEntryForm.value }    
        const momentDate = new Date(inputs.step1.transaction_date).toISOString().split('T')[0]; // Replace event.value with your date value
        const email = this.auth.currentUser?.email;
    
        var count: number;
        
        if (inputs.step1.amount === 0) {
            this.snackBar.open("Amount must be greater than zero ...");
            return;
        }

        var journalHeader: IJournalHeader = {
            journal_id: this.journal_id,
            description: inputs.step1.description,
            booked: false,
            booked_date: updateDate,
            booked_user: email,
            create_date: updateDate,
            create_user: email,
            period: 1,
            period_year: 2024,
            transaction_date: momentDate,
            status: 'Open',
            type: '',
            sub_type: inputs.step1.sub_type,
            amount: Number(inputs.step1.amount)
        }

        this.journalHeader = journalHeader;

        console.debug(JSON.stringify(journalHeader));
        
        if (this.journalDetails !== undefined ) {
            count = this.journalDetails.length;    
            count = count + 1;
        }

        var acct = this.accountList.find(x => x.child == inputs.step2.child);


        if (Number(inputs.step2.debit) > 0 && Number(inputs.step2.credit) > 0) { 

            const debit = Number(inputs.step2.debit);
            
            
            var journalDetail: IJournalDetail = {
                journal_id: this.journal_id,
                journal_subid: count,
                account: acct.account,
                child: acct.child,
                description: inputs.step2.detail_description,
                create_date: updateDate,
                create_user: email,
                sub_type: inputs.step2.sub_type,
                debit: debit,
                credit: 0.00,
                reference: inputs.step2.reference,
                fund: inputs.step2.fund
            }
            this.journalDetails.push(journalDetail);
        }

        var acct = this.accountList.find(x => x.child == inputs.step2.child_credit);

        if (Number(inputs.step2.debit) > 0 && Number(inputs.step2.credit) > 0)  {
            const credit = Number(inputs.step2.credit);
            var journalDetail: IJournalDetail = {
                journal_id: this.journal_id,
                journal_subid: count,
                account: acct.account,
                child: acct.child,
                description: inputs.step2.detail_description,
                create_date: updateDate,
                create_user: email,
                sub_type: inputs.step2.sub_type,
                debit: 0.00,
                credit: credit,
                reference: inputs.step2.reference,
                fund: inputs.step2.fund
            }
            this.journalDetails.push(journalDetail);
        }
        
    }

    postTransaction() {
        var journalNo: any;
        var details: any;
        
        this.journalService.createJournalHeader(this.journalHeader).subscribe(journal => {
            console.debug(JSON.stringify(journal));            
            this.journalDetails.forEach(journalDetail => {
                journalDetail.journal_id = journal.journal_id    
                this.journalService.createJournalDetail(journalDetail).subscribe(detail => {
                    details = detail;   
                    console.debug(details);
                });
            })
        });

        this.snackBar.open('Transactions have been posted!');
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

    ngOnDestroy(): void {
        if (this.accountsListSubject) {
            this.accountsListSubject.unsubscribe();
        }
    }


}
