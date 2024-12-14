import { inject, NgModule, viewChild } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { GridModule, ToolbarService, ExcelExportService, FilterService } from '@syncfusion/ej2-angular-grids'

import { Component, OnInit, ViewChild } from '@angular/core';
import { data } from './datasource'
import { GridComponent, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { TreeGridComponent, PageService, TreeGridModule} from '@syncfusion/ej2-angular-treegrid';
import { JournalStore } from 'app/services/journal.store';
import { TrialBalanceStore } from 'app/services/distribution.ledger.store';

@Component({
    imports: [TreeGridModule],
    providers: [ExcelExportService, ToolbarService, FilterService, PageService, JournalStore, TrialBalanceStore],
    selector: 'download',
    template: 
`
<div id="action-description"></div>
<div class="control-section">
    <ejs-treegrid [dataSource]='store.gl()' allowPaging='false' childMapping='subtasks' height='350' [treeColumnIndex]='1'>
        <e-columns>
            <e-column field='journal_id' headerText='Task ID' width='70' textAlign='Right'></e-column>
            <e-column field='journal_subid' headerText='Task Name' width='200'></e-column>
            <e-column field='startDate' headerText='Start Date' width='90' format="yMd" textAlign='Right'></e-column>
            <e-column field='endDate' headerText='End Date' width='90' format="yMd" textAlign='Right'></e-column>
            <e-column field='duration' headerText='Duration' width='80' textAlign='Right'></e-column>
            <e-column field='progress' headerText='Progress' width='80' textAlign='Right'></e-column>
            <e-column field='priority' headerText='Priority' width='90'></e-column>
        </e-columns>
    </ejs-treegrid>
</div>
 `
})
export class TreeComponent implements OnInit {

    public data?: object[]; 
    public toolbarOptions?: ToolbarItems[];    
    grid = viewChild<GridComponent>('grid');
    store = inject(JournalStore)
    
    ngOnInit(): void {
        this.data = data;
        this.toolbarOptions = ['Search', 'ExcelExport', 'PdfExport', 'CsvExport','Print']
    }

    toolbarClick(args: ClickEventArgs): void {
        if (args.item.id === 'grid_excelexport') {             
            this.grid().excelExport();
        }
        else if (args.item.id === 'grid_csvexport') { 
            this.grid().csvExport();
        }
    }
}

