import { ChangeDetectionStrategy, Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { GLAccountsService } from 'app/services/accounts.service';
import { MatSelectModule } from '@angular/material/select';
import { MaterialModule } from 'app/services/material.module';


const imports = [
    CommonModule,
    MaterialModule,
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
    selector: 'income-statement',
    standalone: true,
    imports: [imports],
    templateUrl: './is.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [GLAccountsService],
})
export class IncomeStatementComponent implements OnInit {
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
    keyField: any;

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



