import {ChangeDetectionStrategy, Component, OnInit, ViewChild, inject} from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { DistMenuStandaloneComponent } from './dist-menubar/grid-menubar.component';
import { DistributionLedgerService } from 'app/services/distribution.ledger.service';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { AggregateService, ColumnMenuService, EditService, FilterService, FilterSettingsModel, GridComponent, GridModule, PageService, ResizeService, SearchSettingsModel, SelectionSettingsModel, SortService, ToolbarItems, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { ReportTemplateComponent } from './report-template-component';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';


const imports = [
    CommonModule,
    GridModule,
    MaterialModule,
    DistMenuStandaloneComponent,
];

@Component({
    selector: 'dist-ledger',
    standalone: true,
    imports: [imports],    
    templateUrl: './distributed-ledger.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [SortService, PageService, ResizeService, FilterService, ToolbarService, EditService, AggregateService, ColumnMenuService],
})
export class DistributedLedgerComponent extends ReportTemplateComponent implements OnInit {
    private dlService = inject(DistributionLedgerService);
    public selectedItemKeys: any[] = [];
    public keyField: any;
    public currentDate: string;
    
    dl$: any;
    
    // local variables
    @ViewChild('drawer') drawer!: MatDrawer;
    public initialPage: Object;
    
    @ViewChild('grid')
    public grid?: GridComponent;

    ngOnInit() {
        super.ngOnInit();
        this.initialPage = { pageSizes:true, pageCount:10 };        
        this.currentPeriod = 1;
        this.currentYear = 2024;        
        this.dl$ = this.dlService.getDistributionByPrdAndYear(
            this.currentPeriod,
            this.currentYear
        );
        (this.grid as GridComponent).pageSettings.pageSize = 10;
    }
    

    onYearChanged(e: any) {
        this.currentYear = Number(e);
        this.onRefresh();
    }

    onPeriodChanged(e: any) {
        this.currentPeriod = Number(e);
        this.onRefresh();
    }

    onRefresh() {
        this.dl$ = this.dlService.getDistributionByPrdAndYear(
            this.currentPeriod,
            this.currentYear
        );
    }

    onAdd() { }

    onCellDoubleClicked(e) { }

    selectionChanged(data: any) {
        
        this.selectedItemKeys = data.selectedRowKeys;
    }

    onFocusedRowChanged(e: any) {
        
    }
}
