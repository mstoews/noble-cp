import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit, ViewChild, inject, Signal } from '@angular/core';

import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { GridMenubarStandaloneComponent } from 'app/modules/accounting/grid-menubar/grid-menubar.component';
import { CommonModule } from '@angular/common';
import { KanbanService, IStatus, IPriority } from '../kanban.service';
import { Browser } from '@syncfusion/ej2-base';
import { SaveEventArgs, DialogEditEventArgs } from '@syncfusion/ej2-grids';
import { Dialog } from '@syncfusion/ej2-popups';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { EditService, ToolbarService, PageService, SortService, FilterService, GridModule } from '@syncfusion/ej2-angular-grids';

const imports = [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    GridModule,
    GridMenubarStandaloneComponent
];

@Component({
    selector: 'kanban-status',
    standalone: true,
    imports: [imports],
    templateUrl: 'status.component.html',
    providers: [SortService, PageService, FilterService, ToolbarService, EditService],
    styles: `
        .e-grid .e-headercell {
        background-color: #333232; 
        color: #fff; }
    `
})
export class StatusComponent implements OnInit {

    private fuseConfirmationService = inject(FuseConfirmationService);
    private fb = inject(FormBuilder);
    public kanbanService = inject(KanbanService)
    public sTitle = 'Kanban Status Types';
    public accountsForm!: FormGroup;
    public selectedItemKeys: string[] = [];
    public orderidrules: Object;
    public dropDown: DropDownListComponent;
    public initialSort: Object;
    public pageSettings: Object;
    public filterSettings: Object;
    public toolbar: string[];
    public editSettings: Object;
    public customeridrules: Object;
    public freightrules: Object;
    public editparams: Object;
    public submitClicked: boolean = false;

    @ViewChild('drawer') drawer!: MatDrawer;

    onCellDblClick(e: any) {
        this.accountsForm = this.fb.group({
            status: [e.data.status],
            description: [e.data.description],
        });
        this.openDrawer();
    }

    ngOnInit() {
        this.kanbanService.readStatus();
        this.createEmptyForm();
        this.kanbanService.readPriority();
        this.orderidrules = { required: true, number: true };
        this.pageSettings = { pageCount: 5 };                
        this.filterSettings = { type: 'Excel' };
        // this.toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];
        this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true };
    }

    actionBegin(args: SaveEventArgs): void {
        if (args.requestType === 'beginEdit' || args.requestType === 'add') {
            this.submitClicked = false;
            this.accountsForm = this.createEmptyForm();
        }
        if (args.requestType === 'save') {
            console.log(JSON.stringify(args.data));
            var data = args.data as IStatus;
            //this.kanbanService.updateTaskStatus(data)
            this.submitClicked = true;
            if (this.accountsForm.valid) {
                args.data = this.accountsForm.value;
            } else {
                args.cancel = true;
            }
        }
    }

    actionComplete(args: DialogEditEventArgs): void {
        if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
            if (Browser.isDevice) {
                args.dialog.height = window.innerHeight - 90 + 'px';
                (<Dialog>args.dialog).dataBind();
            }
            // Set initail Focus
            if (args.requestType === 'beginEdit') {
                // (args.form.elements.namedItem('CustomerName') as HTMLInputElement).focus();
            } else if (args.requestType === 'add') {
                // (args.form.elements.namedItem('OrderID') as HTMLInputElement).focus();
            }
        }
    }

    onCreate(e: any) {
        this.createEmptyForm();
        this.openDrawer();
    }
    
    onSelectionChanged({ selectedRowKeys }: DxDataGridTypes.SelectionChangedEvent) {
        this.selectedItemKeys = selectedRowKeys;
    }

    deleteRecords() {
        this.selectedItemKeys.forEach((key) => {

        });
    }

    onDelete(e: any) {
        console.debug(`onDelete ${JSON.stringify(e)}`);
        const confirmation = this.fuseConfirmationService.open({
            title: 'Delete status?',
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
        return this.accountsForm = this.fb.group({
            status: [''],
            description: [''],
            updateusr: [''],
            updatedte: ['']
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
        const status = { ...this.accountsForm.value } as IStatus;
        const rawData = {
            status: status.status,
            description: status.description,
        };
        this.kanbanService.updateStatus(rawData)
        this.closeDrawer();
    }

}
