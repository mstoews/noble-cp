import { Component, Input, OnInit,  inject } from '@angular/core';

import { JournalService } from 'app/services/journal.service';
import { Observable, map } from 'rxjs';

import { CommonModule } from '@angular/common';
import { DndComponent } from 'app/modules/drag-n-drop/loaddnd/dnd.component';

import { MaterialModule } from 'app/services/material.module';
import { TrnJournalDetailComponent } from '../journal-detail/journal-detail.component';
import { GridModule } from '@syncfusion/ej2-angular-grids';

const imports = [
    CommonModule,
    MaterialModule,
    DndComponent,
    TrnJournalDetailComponent,
    GridModule
];

@Component({
    selector: 'transaction-detail',
    standalone: true,
    imports: [imports],
    templateUrl: './transaction-detail.component.html',    
})
export class TransactionDetailComponent implements OnInit {

    public journalService = inject(JournalService);
    @Input() period: number;
    @Input() year: number;
    @Input() account: number;

    selectedItemKeys: any[] = [];

    details$ : Observable<Object>;

    ngOnInit() {        
        this.details$ = this.journalService.readJournalDetails(this.period, this.year, this.account);
    }

    formatNumber(e) {
        const options = {
            style: 'decimal',  // Other options: 'currency', 'percent', etc.
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        };
        if (e.value === null || e.value === undefined)
            e.value = 0;
        
        const formattedWithOptions = e.value.toLocaleString('en-US', options);
        console.debug(formattedWithOptions);
        return formattedWithOptions;
    }

    calculateDebitValue(data) {
        var debit = data.debit.toFixed(2);
        if (data.debit !== undefined || data.debit !== 0.00) {
            debit = data.debit.toFixed(2);
        }
        return debit.toString();
    }
}
