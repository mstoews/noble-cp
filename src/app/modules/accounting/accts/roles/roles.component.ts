import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { GridMenubarStandaloneComponent } from '../../grid-menubar/grid-menubar.component';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { IRole, RoleService } from 'app/services/roles.service';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { RolesStore } from 'app/services/roles.store';

const imports = [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    GridModule,
    GridMenubarStandaloneComponent
];

@Component({
    selector: 'roles',
    imports: [imports],
    templateUrl: './roles.component.html',
    providers: [RoleService]
})
export class RolesComponent implements OnInit {

    private _fuseConfirmationService = inject(FuseConfirmationService);
    private fb = inject(FormBuilder);

    @ViewChild('drawer') drawer!: MatDrawer;

    public sTitle = 'Roles Administration';    
    public accountsForm!: FormGroup;
    
    store = inject(RolesStore)

    ngOnInit() {        
        this.createEmptyForm();
        this.store.loadRoles();
    }

    onCreate(e: any) {
        this.createEmptyForm();
        this.openDrawer();
    }

    onDelete(e: any) {
        console.debug(`onDelete ${JSON.stringify(e)}`);
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete Role?',
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
            role: [''],
            description: [''],
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
        const account = { ...this.accountsForm.value } as IRole;
        const rawData = {
            role: account.role,
            description: account.description,
            update_date: updateDate,
            update_user: 'admin_update',
        };

        this.closeDrawer();
    }

    onDoubleClicked(e: any) {
        console.debug(e.data);
        this.openDrawer();
    }

    changeRole(e: any) {
        console.debug(e.data);
    }

}
