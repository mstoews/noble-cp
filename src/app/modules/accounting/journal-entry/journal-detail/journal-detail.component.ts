import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { DxNumberBoxModule, DxTemplateModule } from 'devextreme-angular';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IJournalDetail, JournalService } from 'app/services/journal.service';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';

import { CommonModule } from '@angular/common';
import { DndComponent } from 'app/modules/drag-n-drop/loaddnd/dnd.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from 'app/services/material.module';
import { Observable } from 'rxjs';

const imports = [
    CommonModule,
    DxDataGridModule,
    DxTemplateModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    DxNumberBoxModule,
    DndComponent
];

@Component({
    selector: 'journal-detail',
    standalone: true,
    imports: [imports],
    templateUrl: './journal-detail.component.html',
    styles: `::ng-deep .dx-datagrid .dx-datagrid-rowsview .dx-row-focused.dx-data-row:not(.dx-edit-row) > td:not(.dx-focused) {
    background-color: rgb(195, 199, 199);
    border-color: rgb(195, 199, 199);
    }
    `
})
export class JournalDetailComponent implements OnInit {
    @Input() key: string;
    @Input() journal_id: string;
    @Output() notifyTransactionAdd: EventEmitter<any> = new EventEmitter();
    @Output() notifyTransactionDelete: EventEmitter<any> = new EventEmitter();
    @Output() notifyTransactionEvidence: EventEmitter<any> = new EventEmitter();
    @Output() notifyTransactionEdit: EventEmitter<any> = new EventEmitter();


    isModifiable: boolean = false;
    private fb = inject(FormBuilder);

    public journalService = inject(JournalService);
    matDialog = inject(MatDialog);

    private fuseConfirmationService = inject(FuseConfirmationService);

    selectedItemKeys: any[] = [];
    customizeTooltip = (pointsInfo: { originalValue: string; }) => ({ text: `${parseInt(pointsInfo.originalValue)}%` });
    journalForm!: FormGroup;
    sTitle = 'Journal Entry Modification';

    details$: Observable<IJournalDetail[]>;
    glaccts$ = this.journalService.listAccounts();

    // details$ = this.transactionService.getAllTransactions();
    ngOnInit() {
        console.debug('JournalDetailComponent ngOnInit: ', this.key);
        const journalNo = Number(this.key)
        this.details$ = this.journalService.getJournalDetail(journalNo);
        this.journalForm = this.fb.group({
            journal_id: ['', Validators.required],
            account: ['', Validators.required],
            child: ['', Validators.required],
            description: ['', Validators.required],
            balance: ['', Validators.required],
            sub_type: ['', Validators.required],
            reference: ['', Validators.required],
        });
    }


    getType($event: any) {
        throw new Error('Method not implemented.');
    }

    onDelete($event: any) {
        this.isModifiable = false;
        this.notifyTransactionDelete.emit();
    }

    onUpdate() {
        this.notifyTransactionEdit.emit();

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
                    console.log(result.data);
                    break;
                case 'Cancel':
                    break;
            }
        });
    }

    onAmendJournal() {
        this.isModifiable = true;
        console.log('onAmendJournal');
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
