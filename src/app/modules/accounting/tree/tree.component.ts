import { NgModule, viewChild } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { GridModule, ToolbarService, ExcelExportService, FilterService } from '@syncfusion/ej2-angular-grids'

import { Component, OnInit, ViewChild } from '@angular/core';
import { data } from './datasource'
import { GridComponent, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';

@Component({
imports: [GridModule ],
providers: [ExcelExportService, ToolbarService, FilterService],
standalone: true,
    selector: 'download',
    template: 
    `
        <ejs-grid #grid id='grid' class="h-[calc(100vh-15rem)]" 
               [dataSource]='data' 
               [toolbar]='toolbarOptions'                 
               [allowExcelExport]='true' 
               (toolbarClick)='toolbarClick($event)'>
                <e-columns>
                    <e-column field='OrderID' headerText='Order ID' textAlign='Right' width=120></e-column>
                    <e-column field='CustomerID' headerText='Customer ID' width=150> </e-column>
                    <e-column field='ShipCity' headerText='Ship City' width=150></e-column>
                    <e-column field='ShipName' headerText='Ship Name' width=150></e-column>
                </e-columns>
        </ejs-grid>
    `
})
export class TreeComponent implements OnInit {

    public data?: object[]; 
    public toolbarOptions?: ToolbarItems[];    
    grid = viewChild<GridComponent>('grid');
    
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

