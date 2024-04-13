import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { DxBulletModule, DxDataGridModule, DxTemplateModule } from 'devextreme-angular';

import { CommonModule } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { GridMenubarStandaloneComponent } from '../grid-menubar/grid-menubar.component';
import { HttpClient } from '@angular/common/http';
import { IType } from 'app/models';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { TypeService } from 'app/services/type.service';
import { environment } from 'environments/environment.prod';

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
    selector: 'gl-types',
    standalone: true,
    imports: [imports],
    templateUrl: './gl-types.component.html',
    styles: `::ng-deep .dx-datagrid .dx-datagrid-rowsview .dx-row-focused.dx-data-row:not(.dx-edit-row) > td:not(.dx-focused) {
        background-color: rgb(195, 199, 199);
        border-color: #ada6a7;
        }`,
    providers: []
})
export class GlTypesComponent implements OnInit {
    public data: any;
    private url = environment.baseUrl + '/v1/type_list'

    private client = inject(HttpClient);
    private _fuseConfirmationService = inject(FuseConfirmationService);
    private fb = inject(FormBuilder);
    private typeService = inject(TypeService)
    @ViewChild('drawer') drawer!: MatDrawer;

    public sTitle = 'General Ledger Types';
    public accountsForm!: FormGroup;
    public data$: any
    public typeForm?: FormGroup | any;

    ngOnInit() {
        this.createEmptyForm();
        this.data$ = this.typeService.read();
        this.createEmptyForm()
    }

    onCreate(e: any) {
        this.createEmptyForm();
        this.openDrawer();
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
        this.accountsForm = this.fb.group({
            type: [''],
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
        const account = { ...this.accountsForm.value } as IType;
        const rawData = {
            type: account.type,
            description: account.description,
            update_date: updateDate,
            update_user: 'admin_update',
        };

        this.closeDrawer();
    }

    public focusIn(target: HTMLElement | any): void {
        (target as any).parentElement.classList.add('e-input-focus');
    }

    public focusOut(target: HTMLElement | any): void {
        (target as any).parentElement.classList.remove('e-input-focus');
    }

    get OrderID(): AbstractControl { return (this as any).orderForm.get('OrderID'); }

    get CustomerID(): AbstractControl { return (this as any).orderForm.get('CustomerID'); }

}
