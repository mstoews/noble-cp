import { Component, OnInit, ViewChild, inject } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';

import { MatDrawer } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { FundsService } from 'app/services/funds.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { GridMenubarStandaloneComponent } from '../../grid-menubar/grid-menubar.component';
import { MaterialModule } from 'app/services/material.module';
import { IFund } from 'app/modules/kanban/kanban.service';
import { GridModule } from '@syncfusion/ej2-angular-grids';


const imports = [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    GridModule,
    GridMenubarStandaloneComponent
];

@Component({
    selector: 'funds',
    standalone: true,
    imports: [imports],
    templateUrl: './funds.component.html',
})
export class FundsComponent implements OnInit {
    public data: any;
    private fuseConfirmationService = inject(FuseConfirmationService);
    private fundService = inject(FundsService)
    private fb = inject(FormBuilder);
    @ViewChild('drawer') drawer!: MatDrawer;

    public sTitle = 'General Ledger Funds';
    public accountsForm!: FormGroup;

    funds = this.fundService.read();

    ngOnInit() {
        this.createEmptyForm();
    }

    onCreate(e: any) {
        this.createEmptyForm();
        this.openDrawer();
    }

    public selectingEvent(e: any): void {
        console.debug('the row was selected ... ', e);
    }

    onDelete(e: any) {
        console.debug(`onDelete ${JSON.stringify(e)}`);
        const confirmation = this.fuseConfirmationService.open({
            title: 'Delete Fund?',
            message: 'Are you sure you want to delete this type? ',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                // Delete the list
                // this.typeApiService.delete(this.typeId);
            }
        });
        this.closeDrawer();
    }

    createEmptyForm() {
        this.accountsForm = this.fb.group({
            fund: [''],
            description: ['']
        });
    }


    openDrawer() {
        const opened = this.drawer.opened;
        if (opened !== true) {
            this.drawer.toggle();
        } else {
            return;
        }
    }

    closeDrawer() {
        const opened = this.drawer.opened;
        if (opened === true) {
            this.drawer.toggle();
        } else {
            return;
        }
    }

    onUpdate(e: any) {
        const dDate = new Date();
        const updateDate = dDate.toISOString().split('T')[0];
        const fund = { ...this.accountsForm.value } as IFund;
        const rawData = {
            fund: fund.fund,
            description: fund.description,
            update_date: updateDate,
            update_user: 'admin_update',
        };
        this.closeDrawer();
    }
}
