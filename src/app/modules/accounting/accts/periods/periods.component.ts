import { Component, OnInit, ViewChild, inject } from '@angular/core';
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
import { AggregateService, ColumnMenuService, EditService, FilterService, FilterSettingsModel, GridModule, GroupService, PageService, ResizeService, SearchSettingsModel, SelectionSettingsModel, SortService, ToolbarItems, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { PeriodStore } from 'app/services/periods.store';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';

const imports = [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    GridMenubarStandaloneComponent,
    GridModule
];

@Component({
    selector: 'periods',
    standalone: true,
    imports: [imports],
    templateUrl: './periods.component.html',
    providers: [PeriodStore, SortService, GroupService ,PageService, ResizeService, FilterService, ToolbarService, EditService, AggregateService, ColumnMenuService,],
})
export class PeriodsComponent implements OnInit {
onRefresh() {
throw new Error('Method not implemented.');
}
onAdd() {
throw new Error('Method not implemented.');
}
onDeleteSelection() {
throw new Error('Method not implemented.');
}
onUpdateSelection() {
throw new Error('Method not implemented.');
}
    public data: any;
    private _fuseConfirmationService = inject(FuseConfirmationService);
    private fb = inject(FormBuilder);
    @ViewChild('drawer') drawer!: MatDrawer;
    periodsForm!: FormGroup;

    public sTitle = 'General Ledger Periods';

    store = inject(PeriodStore);

    // datagrid settings start
    public pageSettings: Object;
    public formatoptions: Object;
    public initialSort: Object;
    public filterOptions: FilterSettingsModel;
    public editSettings: Object;
    public dropDown: DropDownListComponent;
    public submitClicked: boolean = false;
    public selectionOptions?: SelectionSettingsModel;
    public toolbarOptions?: ToolbarItems[];
    public searchOptions?: SearchSettingsModel;
    public filterSettings: FilterSettingsModel;
    
    initialDatagrid() {
        // this.pageSettings = { pageCount: 10 };        
        this.formatoptions = { type: 'dateTime', format: 'M/dd/yyyy' }        
        this.pageSettings =  { pageSizes: true, pageCount: 10 };
        this.selectionOptions = { mode: 'Cell' };              
        this.editSettings = { allowEditing: true, allowAdding: false, allowDeleting: false };
        this.searchOptions = { operator: 'contains', ignoreCase: true, ignoreAccent:true };
        this.toolbarOptions = ['Search'];   
        this.filterSettings = { type: 'Excel' };    
    }

    ngOnInit() {
        this.createEmptyForm();
        this.initialDatagrid()
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
            title: 'Delete period?',
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
