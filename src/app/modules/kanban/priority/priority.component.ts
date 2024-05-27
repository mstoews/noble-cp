import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { DxBulletModule, DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';

import { IPriority, KanbanService } from 'app/services/kanban.service';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { GridMenubarStandaloneComponent } from 'app/modules/accounting/grid-menubar/grid-menubar.component';
import { Subject, map, takeUntil } from 'rxjs';
import { DxButtonModule } from 'devextreme-angular';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';

const imports = [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    DxDataGridModule,
    DxBulletModule,
    DxTemplateModule,
    DxButtonModule,
    GridMenubarStandaloneComponent
];

@Component({
    selector: 'kanban-priority',
    standalone: true,
    imports: [imports],
    templateUrl: 'priority.component.html',
    styles: `::ng-deep .dx-datagrid .dx-datagrid-rowsview .dx-row-focused.dx-data-row:not(.dx-edit-row) > td:not(.dx-focused) {
        background-color: rgb(195, 199, 199);
        border-color: #ada6a7;
        }`,
    providers: []
})
export class KanbanPriorityComponent implements OnInit, OnDestroy {
    
    public data: any;
    private _fuseConfirmationService = inject(FuseConfirmationService);
    private fb = inject(FormBuilder);
    private kanbanService = inject(KanbanService)
    @ViewChild('drawer') drawer!: MatDrawer;

    public sTitle = 'Kanban Types';
    public priorityForm!: FormGroup;
    public data$: any
    public selectedItemKeys: string[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    
    
    async ngOnInit() {        
        this.createEmptyForm()
        this.data$ = await this.kanbanService.getPriorityList();                    
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
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
        this.kanbanService.readTypes();
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
            Priority: priority.Priority,
            Description: priority.Description
        };

        // this.kanbanService.updatePriority(rawData)

        this.closeDrawer();
    }


}
