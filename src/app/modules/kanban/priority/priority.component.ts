import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';

import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { GridMenubarStandaloneComponent } from 'app/modules/accounting/grid-menubar/grid-menubar.component';
import { Subject } from 'rxjs';

import { KanbanService, IPriority } from '../kanban.service';
import { EditService, ToolbarService, PageService, SortService, FilterService, NewRowPosition, GridModule, DialogEditEventArgs, SaveEventArgs } from '@syncfusion/ej2-angular-grids';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { Browser } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';

const imports = [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,    
    GridModule,
    GridMenubarStandaloneComponent
];

@Component({
    selector: 'kanban-priority',
    standalone: true,
    imports: [imports],
    templateUrl: 'priority.component.html',    
    providers: [SortService, PageService, FilterService, ToolbarService, EditService],
    styles: `
        .e-grid .e-headercell {
        background-color: #333232; 
        color: #fff;
        }
    `
})
export class KanbanPriorityComponent implements OnInit {

    fuseConfirmationService = inject(FuseConfirmationService);
    fb = inject(FormBuilder);
    kanbanService = inject(KanbanService)

    @ViewChild('drawer') drawer!: MatDrawer;

    public sTitle = 'Priority';
    public priorityForm!: FormGroup;

    public selectedItemKeys: string[] = [];
    public dropDown: DropDownListComponent;
    public submitClicked: boolean = false;
    public PriorityForm: FormGroup;
    

    // datagrid settings start
    public pageSettings: Object;
    public formatoptions: Object;
    public initialSort: Object;
    public filterSettings: Object;
    public editSettings: Object;

    initialDatagrid() {
        this.pageSettings = { pageCount: 10 };        
        this.formatoptions = { type: 'dateTime', format: 'M/d/y hh:mm a' }
        this.filterSettings = { type: 'Excel' };        
        this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true };   
    }


    actionBegin(args: SaveEventArgs): void {
        if (args.requestType === 'beginEdit' || args.requestType === 'add') {
            this.submitClicked = false;
            var priority: IPriority = {
                priority: '',
                description: '',
                updatedte: '',
                updateusr: ''
            }
            this.PriorityForm = this.createFormGroup(priority);
        }
        if (args.requestType === 'save') {
            console.log(JSON.stringify(args.data));
            var data = args.data as IPriority;
            this.kanbanService.updateTaskPriority(data)
            this.submitClicked = true;
            if (this.PriorityForm.valid) {
                args.data = this.PriorityForm.value;
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

    dateValidator() {
        return (control: FormControl): null | Object  => {
            return control.value && control.value.getFullYear &&
            (1900 <= control.value.getFullYear() && control.value.getFullYear() <=  2099) ? null : { OrderDate: { value : control.value}};
        }
    }

    // datagrid settings end 
    
    ngOnInit() {
        var priority: IPriority = {
            priority: '',
            description: '',
            updatedte: '',
            updateusr: ''
        }
        this.createEmptyForm(priority);
        this.kanbanService.readPriority(); 
        this.initialDatagrid();       
    }


    createFormGroup(data: IPriority): FormGroup {
        return new FormGroup({
            Priority: new FormControl(data.priority, Validators.required),
            Description: new FormControl(data.description, this.dateValidator()),            
        });
    }

    onCreate(e: any) {
        var priority: IPriority = {
            priority: '',
            description: '',
            updatedte: '',
            updateusr: ''
        }
        this.createEmptyForm(priority);
        this.openDrawer();
    }

    deleteRecords() {
        this.selectedItemKeys.forEach((key) => {

        });
        this.kanbanService.readTypes();
    }

    onDelete(e: any) {
        console.debug(`onDelete ${JSON.stringify(e)}`);
        const confirmation = this.fuseConfirmationService.open({
            title: 'Delete Period?',
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

    createEmptyForm(priority: IPriority) {
        this.priorityForm = this.fb.group({
            priority: [''],
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
        const priority = { ...this.priorityForm.value } as IPriority;
        const rawData = {
            Priority: priority.priority,
            Description: priority.description
        };

        // this.kanbanService.updatePriority(rawData)

        this.closeDrawer();
    }

}
