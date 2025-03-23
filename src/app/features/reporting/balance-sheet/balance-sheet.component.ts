import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MaterialModule } from 'app/shared/material.module';
import { TrialBalanceStore } from 'app/store/distribution.ledger.store';
import { ReportingToolbarComponent } from '../grid-reporting/grid-menubar.component';
import { CdkTableModule } from '@angular/cdk/table';

const imports = [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    MatFormFieldModule,
    ReportingToolbarComponent,
    CdkTableModule
];

@Component({
    selector: 'bs',
    imports: [imports],
    templateUrl: './balance-sheet.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BalanceSheetComponent {
    private fb = inject(FormBuilder);
    store = inject(TrialBalanceStore);
    assets: any[]
    // local variables
    refresh() {
        var params = {
            period: 1,
            period_year: 2024
        }
        this.store.loadHeader(params);
        this.assets = this.store.header();
    }

    add() { }

}

/*
  child: string;
  period: string;
  period_year: string;
  description: string;
  opening_balance: number;
  debit_balance: number;
  credit_balance: number;
*/
