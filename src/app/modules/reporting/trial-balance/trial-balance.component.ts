import { ChangeDetectionStrategy, Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';

import { GLAccountsService } from 'app/services/accounts.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { map } from 'rxjs';

const imports = [
    CommonModule,
    MatSidenavModule,
    MatCardModule,
    ReactiveFormsModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSelectModule
];

@Component({
    selector: 'trial-balance',
    standalone: true,
    imports: [imports],
    styles: [`
    ::ng-deep .dx-datagrid .dx-datagrid-rowsview .dx-row-focused.dx-data-row:not(.dx-edit-row) > td:not(.dx-focused) {
        background-color: rgb(195, 199, 199);
        border-color: rgb(195, 199, 199);
      }
    `],
    templateUrl: './trial-balance.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [GLAccountsService],
})
export class TrialBalanceComponent implements OnInit {
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
    assets$: any;
    //assets$ = this.accountApiService.read().pipe(map((income) => income.filter((inc) => inc.type === 'Assets' || inc.type === 'Liability')));

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

    onCellDoubleClicked(e: any) {
        console.debug(`onCellDoubleClicked ${JSON.stringify(e)}`);
    }

}




/*
id?: string;
account: string;
child_account: string;
type: string;
description: string;
balance: number;
sub_type: boolean;
special_assessment: boolean;
capital_asset_fund: boolean;
reserve_fund: boolean;
comments: string;
createDate: string;
createUsr: string;
updateDate: string;
updateUsr: string;
*/




