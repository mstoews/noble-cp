import { ChangeDetectionStrategy, Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { GLAccountsService } from 'app/services/accounts.service';
import { MaterialModule } from 'app/services/material.module';

const imports = [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    MatFormFieldModule
];

@Component({
    selector: 'balance-sheet',
    standalone: true,
    imports: [imports],
    templateUrl: './balance-sheet.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BalanceSheetComponent implements OnInit {
    private fb = inject(FormBuilder);
    private accountApiService = inject(GLAccountsService);

    // local variables
    @ViewChild('drawer') drawer!: MatDrawer;
    collapsed = false;
    sTitle = 'Income Statement';
    selectedItemKeys: any[] = [];
    totalRevenue: any;

    revenue: any[] = [{ account: '', description: 'Total Revenue', balance: 1530, type: '' }];


    customizeTooltip = (pointsInfo: { originalValue: string; }) => ({ text: `${parseInt(pointsInfo.originalValue)}%` });
    accountsForm!: FormGroup;
    //assets$ = this.accountApiService.read().pipe(map((income) => income.filter((inc) => inc.type === 'Assets')));
    //liabilities$ = this.accountApiService.read().pipe(map((income) => income.filter((inc) => inc.type === 'Liability')));
    assets$: any;
    liabilities$: any;

    ngOnInit() {
        this.createEmptyForm();
    }

    add() {
        this.createEmptyForm();

    }


    createEmptyForm() {
        this.accountsForm = this.fb.group({
            account: ['', Validators.required],
            description: ['', Validators.required],
            balance: ['', Validators.required],
            type: ['', Validators.required],
            comments: ['', Validators.required],
            sub_type: ['', Validators.required],
            special_assessment: ['', Validators.required],
            capital_asset_fund: ['', Validators.required],
            reserve_fund: ['', Validators.required],
        });
    }

    selectionChanged(data: any) {
        console.debug(`selectionChanged ${JSON.stringify(data.data)}`);
        this.selectedItemKeys = data.selectedRowKeys;
    }

}
