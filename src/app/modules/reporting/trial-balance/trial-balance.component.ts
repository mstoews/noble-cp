import { ChangeDetectionStrategy, Component, OnInit, ViewChild, inject, AfterViewInit, viewChild } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TrialBalanceStore } from 'app/services/distribution.ledger.store';
import { MaterialModule } from 'app/services/material.module';
import {
    AggregateService,
    ColumnMenuService,
    DetailRowService,
    EditService,
    PdfExportService,
    ExcelExportService,
    FilterService,
    FilterSettingsModel,
    GridComponent,
    GridModule,
    GroupService,
    PageService,
    ResizeService,
    RowSelectEventArgs, SearchSettingsModel, SelectionSettingsModel, SortService, ToolbarItems, ToolbarService
} from '@syncfusion/ej2-angular-grids';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { IJournalSummary } from 'app/models';
import { ReportingToolbarComponent } from '../grid-reporting/grid-menubar.component';
import { throwServerError } from '@apollo/client/core';


const imports = [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    GridModule,
    ReportingToolbarComponent
];

const declarations = [
    TrialBalanceStore,
    PdfExportService,
    ExcelExportService,
    GroupService,
    DetailRowService,
    SortService,
    PageService,
    ResizeService,
    FilterService,
    ToolbarService,
    EditService,
    AggregateService,
    ColumnMenuService
];

@Component({
    selector: 'trial-balance',
    standalone: true,
    imports: [imports],
    templateUrl: './trial-balance.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [declarations],
    styles: [` .e-detailcell .e-grid td.e-cellselectionbackground { background-color: #00b7ea; }`]
})
export class TrialBalanceComponent implements OnInit, AfterViewInit {

    store = inject(TrialBalanceStore);
    public grid = viewChild<GridComponent>('grid')

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
    public childData?: IJournalSummary[] | null;

    public childDataGrid: GridModule = {
        dataSource: this.childData,
        queryString: 'child',
        columns: [
            { field: 'journal_id', headerText: 'ID', textAlign: 'left', width: 50 },
            { field: 'child', headerText: 'Child', textAlign: 'left', width: 100 },
            { field: 'description', headerText: 'Description', textAlign: 'left', width: 100 },
            { field: 'fund', headerText: 'Fund', textAlign: 'left', width: 100 },
            { field: 'debit', headerText: 'Debit', textAlign: 'Right', format: 'N2', width: 100 },
            { field: 'credit', headerText: 'Credit', textAlign: 'Right', format: 'N2', width: 100 },
        ],
        aggregates: [
            {
                columns: [
                    {
                        type: 'Sum',
                        field: 'debit',
                        footerTemplate: '${Sum}',
                        format: 'N2'
                    },
                    {
                        type: 'Sum',
                        field: 'credit',
                        footerTemplate: '${Sum}',
                        format: 'N2'
                    },
                ],
            },
        ],

    }

    initialDatagrid() {

        this.formatoptions = { type: 'dateTime', format: 'M/dd/yyyy' }
        this.selectionOptions = { mode: 'Cell' };
        this.editSettings = { allowEditing: false, allowAdding: false, allowDeleting: false };
        this.searchOptions = { fields: ['description'], operator: 'contains', ignoreCase: true, ignoreAccent: true };
        this.toolbarOptions = ['Search'];
        this.filterSettings = { type: 'CheckBox' };
    }

    ngOnInit() {
        this.onRefresh();
    }

    onRefresh() {
        this.initialDatagrid();
        var params = {
            period: 1,
            period_year: 2024
        }
        this.store.loadHeader(params);
        this.store.loadJournals(params);
    }

    onExportExcel() {
        console.log('Excel');
        this.grid()!.excelExport({
            fileName: 'TB-31-01-2024.xlsx', header: {
                headerRows: 7,
                rows: [
                    { cells: [{ colSpan: 4, value: "Company Name", style: { fontColor: '#03396c', fontSize: 20, hAlign: 'Left', bold: true, } }] },
                    { cells: [{ colSpan: 4, value: "Trial Balance", style: { fontColor: '#03396c', fontSize: 20, hAlign: 'Left', bold: true, } }] },
                ]
            },
            footer: {
                footerRows: 4,
                rows: [
                    { cells: [{ colSpan: 4, value: "", style: { hAlign: 'Center', bold: true } }] },
                    { cells: [{ colSpan: 4, value: "", style: { hAlign: 'Center', bold: true } }] }
                ]
            },
        });
    }


    onExportCSV() {
        console.log('Refresh');
        this.grid()!.pdfExport({
            pageOrientation: 'Landscape', pageSize: 'A4', fileName: 'TB-31-01-2024.pdf', header: {
                fromTop: 0,
                height: 120,
                contents: [
                    {
                        type: 'Text',
                        value: `Trial Balance ${this.store.header()[0].period} - ${this.store.header()[0].period_year}`,
                        position: { x: 10, y: 50 },
                        style: { textBrushColor: '#000000', fontSize: 30 },
                    },
                ]
            }
        });

    }

    ngAfterViewInit(): void {
        this.store.loadJournals({
            period: 1,
            period_year: 2024
        });

    }

    // grid.element.addEventListener('click', (e) => { 
    //     let cell = closest(e.target, 'td'); // details cell element 
    //     if (cell.classList.contains('e-detailrowexpand')) { 
    //      const rowIndex = parseInt(cell.parentElement.getAttribute('aria-rowindex'), 10); 
    //      const data = grid.getCurrentViewRecords()[rowIndex]; // get details row data 
    //      alert("Child Grid"); 
    //     } 
    // }); 

    onClickGrid(e: any) {
        this.grid().childGrid.dataSource = this.store.details();
    }

    actionBegin(args: any) {
        console.debug(JSON.stringify(args.requestType));
        console.log('Header Length', this.store.header().length)
        console.debug('Detail Length', this.store.details().length)
    }

    public onRowSelected(args: RowSelectEventArgs): void {
        console.debug('row Selected');
    }

    onLoad(): void {
        this.grid().childGrid.dataSource = this.store.details();

    }
}


