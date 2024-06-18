import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { DxBulletModule, DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { IPeriod, PeriodsService } from 'app/services/periods.service';

import { CommonModule } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';

import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { GridMenubarStandaloneComponent } from '../../grid-menubar/grid-menubar.component';

const imports = [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    DxDataGridModule,
    DxBulletModule,
    DxTemplateModule,
    GridMenubarStandaloneComponent
];

@Component({
    selector: 'periods',
    standalone: true,
    imports: [imports],
    templateUrl: './periods.component.html',
    providers: [],
    styles: `::ng-deep .dx-datagrid .dx-datagrid-rowsview .dx-row-focused.dx-data-row:not(.dx-edit-row) > td:not(.dx-focused) {
        background-color: rgb(195, 199, 199);
        border-color: #ada6a7;
        }`,
})
export class PeriodsComponent implements OnInit {
    public data: any;
    private _fuseConfirmationService = inject(FuseConfirmationService);
    private fb = inject(FormBuilder);
    @ViewChild('drawer') drawer!: MatDrawer;
    periodsForm!: FormGroup;

    public sTitle = 'General Ledger Periods';

    private periodsService = inject(PeriodsService)

    data$ = this.periodsService.listPeriods()

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
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete Type?',
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
        this.periodsForm = this.fb.group({
            period_id: [''],
            period_year: [''],
            start_date: [''],
            end_date: [''],
            description: [''],
            create_date: [''],
            create_user: [''],
            update_date: [''],
            update_user: [''],
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
        const periods = { ...this.periodsForm.value } as IPeriod;
        const rawData = {
            period_id: e.data.periods,
            period_year: [''],
            start_date: [''],
            end_date: [''],
            description: [''],
            create_date: [''],
            create_user: [''],
            update_date: [''],
            update_user: [''],
        };

        this.closeDrawer();
    }
}
