import { AfterViewInit, Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { DxBulletModule, DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IJournalDetail, JournalService } from 'app/services/journal.service';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';

import { CommonModule } from '@angular/common';
import { DndComponent } from 'app/modules/drag-n-drop/loaddnd/dnd.component';
import { DxNumberBoxModule } from 'devextreme-angular';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { GLAccountsService } from 'app/services/accounts.service';
import { GlTransactionsService } from 'app/services/gltransaction.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const imports = [
    CommonModule,
    DxDataGridModule,
    DxTemplateModule,
    MatSidenavModule,
    MatCardModule,
    ReactiveFormsModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSelectModule,
    DxNumberBoxModule,
    DndComponent
];

@Component({
    selector: 'journal-details',
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

    isModifiable: boolean = false;
    private fb = inject(FormBuilder);

    public journalService = inject(JournalService);
    matDialog = inject(MatDialog);

    private fuseConfirmationService = inject(FuseConfirmationService);
    @Input() child_account: string;
    @Input() key: string;

    selectedItemKeys: any[] = [];
    customizeTooltip = (pointsInfo: { originalValue: string; }) => ({ text: `${parseInt(pointsInfo.originalValue)}%` });
    journalForm!: FormGroup;
    sTitle = 'Journal Entry Modification';


    details$: Observable<IJournalDetail[]>;
    glaccts$ = this.journalService.listAccounts();

    // details$ = this.transactionService.getAllTransactions();
    ngOnInit() {
        console.debug('JournalDetailComponent ngOnInit: ', this.child_account);

        this.details$ = this.journalService.getJournalDetailByChildAccount(this.child_account);
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
        console.log('onCreateTemplate');
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
