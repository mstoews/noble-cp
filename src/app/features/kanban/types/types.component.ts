import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';

import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { GridMenubarStandaloneComponent } from 'app/features/accounting/grid-components/grid-menubar.component';
import { Subject, map, takeUntil } from 'rxjs';
import { KanbanService } from '../kanban.service';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { IType } from 'app/models/types';

const imports = [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    GridModule,
    GridMenubarStandaloneComponent
];

@Component({
    selector: 'kanban-types',
    imports: [imports],
    templateUrl: 'types.component.html',
    providers: []
})
export class KanbanTypesComponent implements OnInit, OnDestroy {

    private _fuseConfirmationService = inject(FuseConfirmationService);
    private fb = inject(FormBuilder);
    private kanbanService = inject(KanbanService)
    @ViewChild('drawer') drawer!: MatDrawer;

    public sTitle = 'Kanban Types';
    public accountsForm!: FormGroup;
    public selectedItemKeys: string[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    typesList = this.kanbanService.readTypes()

    ngOnInit() {
        this.createEmptyForm();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    onCreate(e: any) {
        this.createEmptyForm();
        this.openDrawer();
    }

    deleteRecords() {
        this.selectedItemKeys.forEach((key) => { });
        this.kanbanService.readTypes();
    }

    onDelete(e: any) {
        console.debug(`onDelete ${JSON.stringify(e)}`);
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete Kanban Type?',
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
                // this.kanbanService.delete()

            }
        });
        this.closeDrawer();
    }

    createEmptyForm() {
        this.accountsForm = this.fb.group({
            type: [''],
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
        const types = { ...this.accountsForm.value } as IType;
        const rawData = {
            type: types.type,
            description: types.description,
        };

        this.closeDrawer();
    }

}
