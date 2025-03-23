import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewChild,
    inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Workbook } from 'exceljs';

import { saveAs } from 'file-saver-es';
import { AggregateService, ColumnMenuService, EditService, FilterService, FilterSettingsModel, GridModule, PageService, ResizeService, SearchSettingsModel, SelectionSettingsModel, SortService, ToolbarItems, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { MaterialModule } from 'app/shared/material.module';

const imports = [
    CommonModule,
    GridModule,
    MaterialModule,
];

@Component({
    selector: 'dist-ledger',
    standalone: true,
    imports: [imports],
    template: `<p>Base report class</p>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [SortService, PageService, ResizeService, FilterService, ToolbarService, EditService, AggregateService, ColumnMenuService],
})
export class ReportTemplateComponent implements OnInit {
    public selectedItemKeys: any[] = [];
    public keyField: any;
    public currentDate: string;
    public currentYear: number;
    public currentPeriod: number;

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
        this.formatoptions = { type: 'dateTime', format: 'MM/dd/yyyy' }
        this.selectionOptions = { mode: 'Cell' };
        this.searchOptions = { fields: ['description'], operator: 'contains', ignoreCase: true, ignoreAccent: true };
        this.toolbarOptions = ['Search'];
        this.currentYear = 2024;
        this.currentPeriod = 1;
    }
    // local variables

    ngOnInit() {

        const dDate = new Date();
        this.currentDate = dDate.toISOString().split('T')[0];
        this.initialDatagrid();

    }

    onYearChanged(e: any) {
        this.currentYear = Number(e);
        this.onRefresh();
    }

    onPeriodChanged(e: any) {
        this.currentPeriod = Number(e);
        this.onRefresh();
    }

    onRefresh() { }

    onAdd() { }

}
