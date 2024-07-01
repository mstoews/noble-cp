import { AfterViewInit, Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { GlTransactionsService } from 'app/services/gltransaction.service';
import { GLAccountsService } from 'app/services/accounts.service';

import { FuseConfirmationService } from '@fuse/services/confirmation';
import { IAccounts } from 'app/services/journal.service';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { MaterialModule } from 'app/services/material.module';


const imports = [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,    
    FormsModule,
    GridModule
];

@Component({
    selector: 'gl-detail',
    standalone: true,
    imports: [imports],
    templateUrl: './gl-accts-detail.component.html',
})
export class GLAcctDetailComponent implements OnInit {

    isModifiable: boolean = false;
    private fb = inject(FormBuilder);
    private transactionService = inject(GlTransactionsService);
    private glAccountsService = inject(GLAccountsService);
    private fuseConfirmationService = inject(FuseConfirmationService);
    @Input() account!: string;

    selectedItemKeys: any[] = [];
    customizeTooltip = (pointsInfo: { originalValue: string; }) => ({ text: `${parseInt(pointsInfo.originalValue)}%` });
    journalForm!: FormGroup;
    sTitle = 'General Ledger Accounts';
    accounts$ = this.glAccountsService.getChild(this.account);

    ngOnInit() {

        this.journalForm = this.fb.group({
            account: ['', Validators.required],
            parent_account: ['', Validators.required],
            child_account: [''],
            description: ['', Validators.required],
            balance: ['', Validators.required],
            type: ['', Validators.required],
            comments: ['', Validators.required],
        });
    }


    getType($event: any) {
        throw new Error('Method not implemented.');
    }

    onDelete($event: any) {
        this.isModifiable = false;
    }

    onUpdate($event: any) {
        throw new Error('Method not implemented.');
    }

    formatNumber(e) {
        const options = {
            style: 'decimal',  // Other options: 'currency', 'percent', etc.
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        };
        const formattedWithOptions = e.value.toLocaleString('en-US', options);
        console.debug(formattedWithOptions);
        return formattedWithOptions;
    }

    onBook() {
        const confirmation = this.fuseConfirmationService.open({
            title: 'Book Journal Entry',
            message: 'Do you want to post the current entry? ',
            actions: {
                confirm: {
                    label: 'Post',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                // Delete the list
                this.transactionService.bookJournal(this.account);
            }
        });

    }

    onCreateTemplate() {
        console.debug('onCreateTemplate');
    }

    onAddEvidence() {
        console.debug('onAddEvidence');
    }

    onAmendJournal() {
        this.isModifiable = true;
        console.debug('onAmendJournal');
    }

    calculateDebitValue(data) {
        var debit = data.debit.toFixed(2);
        if (data.debit !== undefined || data.debit !== 0.00) {
            debit = data.debit.toFixed(2);
        }
        return debit.toString();
    }

    createEmptyForm() {
        this.journalForm = this.fb.group({
            journal_id: [''],
            journal_child_id: [''],
            account: [''],
            create_date: [''],
            create_user: [''],
            description: [''],
            fund: [''],
            debit: [''],
            credit: [''],
            update_date: [''],
            update_user: [''],

        });
    }


    closeDialog() {
        throw new Error('Method not implemented.');
    }
    onImages() {
        throw new Error('Method not implemented.');
    }
    onCreate() {
        this.createEmptyForm();
    }

    selectionChanged(e: any) {
        if (e.data.booked === undefined || e.data.booked === '') {
            e.data.booked = false;
            e.data.booked_date = '';
        }

        this.journalForm = this.fb.group({
            journal_id: [e.data.journal_id],
            description: [e.data.description],
            parent_account: [e.data.parent_account],
            booked: [e.data.booked],
            create_date: [e.data.create_date],
            create_user: [e.data.create_user],
            booked_user: [e.data.booked_user],
            booked_date: [e.data.booked_date]
        });
    }

    onCellDoubleClicked(e: any) {
        if (e.data.booked === undefined || e.data.booked === '') {
            e.data.booked = false;
            e.data.booked_date = '';
        }

        this.journalForm = this.fb.group({
            journal_id: [e.data.journal_id],
            description: [e.data.description],
            parent_account: [e.data.parent_account],
            booked: [e.data.booked],
            create_date: [e.data.create_date],
            create_user: [e.data.create_user],
            booked_user: [e.data.booked_user],
            booked_date: [e.data.booked_date]
        });
    }

    onFocusedRowChanged(e: any) {
        if (e.data.booked === undefined || e.data.booked === '') {
            e.data.booked = false;
            e.data.booked_date = '';
        }

        this.journalForm = this.fb.group({
            journal_id: [e.data.journal_id],
            description: [e.data.description],
            parent_account: [e.data.parent_account],
            booked: [e.data.booked],
            create_date: [e.data.create_date],
            create_user: [e.data.create_user],
            booked_user: [e.data.booked_user],
            booked_date: [e.data.booked_date]
        });
    }


}
