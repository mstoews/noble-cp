import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { JournalService } from 'app/services/journal.service';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { DndComponent } from 'app/modules/drag-n-drop/loaddnd/dnd.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from 'app/services/material.module';

import { GridModule } from '@syncfusion/ej2-angular-grids';
import { JournalStore } from 'app/services/journal.store';


const imports = [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    DndComponent,
    GridModule
];

@Component({
    selector: 'trn-journal-detail',
    standalone: true,
    imports: [imports],
    templateUrl: './journal-detail.component.html',
})
export class TrnJournalDetailComponent implements OnInit {

    isModifiable: boolean = false;
    private fb = inject(FormBuilder);

    public journalService = inject(JournalService);
    matDialog = inject(MatDialog);
    store = inject(JournalStore);

    private fuseConfirmationService = inject(FuseConfirmationService);
    @Input() key: number;

    selectedItemKeys: any[] = [];
    customizeTooltip = (pointsInfo: { originalValue: string; }) => ({ text: `${parseInt(pointsInfo.originalValue)}%` });
    journalForm!: FormGroup;
    sTitle = 'Journal Entry Modification';
    


    glaccts$ = this.journalService.listAccounts();


    ngOnInit() {
        console.debug('JournalDetailComponent ngOnInit: ', this.key);
        const journalNo = Number(this.key)
        //this.details$ = this.journalService.getJournalDetail(journalNo);
        
        this.store.loadDetails(journalNo);
        this.journalForm = this.fb.group({
            journal_id: ['', Validators.required],
            account: ['', Validators.required],
            child: [''],
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
            message: 'Do you want to post the current journal? ',
            actions: {
                confirm: {
                    label: 'Book',
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


    onCreateTemplate() {
        console.debug('onCreateTemplate');
    }

    onAddEvidence() {

        const dialogRef = this.matDialog.open(DndComponent, {
            width: '600px',
            data: {
                reference_no: this.key,
                description: "description",
            },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (result === undefined) {
                result = { event: 'Cancel' };
            }
            switch (result.event) {
                case 'Create':
                    console.debug(result.data);
                    break;
                case 'Cancel':
                    break;
            }
        });
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
}
