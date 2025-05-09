import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CurrencyPipe, NgClass, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { FuseAlertComponent } from '@fuse/components/alert';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'settings-plan-billing',
    templateUrl: './plan-billing.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, ReactiveFormsModule, FuseAlertComponent, MatRadioModule, NgClass, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule, CurrencyPipe]
})
export class SettingsPlanBillingComponent implements OnInit {
    planBillingForm: UntypedFormGroup;
    plans: any[];

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.planBillingForm = this._formBuilder.group({
            plan: ['team'],
            cardHolder: ['Noble Ledger Team'],
            cardNumber: [''],
            cardExpiration: [''],
            cardCVC: [''],
            country: ['usa'],
            zip: [''],
        });

        // Setup the plans
        this.plans = [
            {
                value: 'basic',
                label: 'BASIC',
                details: 'Starter plan for individuals.',
                price: '10',
            },
            {
                value: 'team',
                label: 'TEAM',
                details: 'Collaborate up to 10 people.',
                price: '20',
            },
            {
                value: 'enterprise',
                label: 'ENTERPRISE',
                details: 'For bigger businesses.',
                price: '40',
            },
        ];
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
