import { Component, Input, input, OnInit, output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AggregateService, ColumnMenuService, ContextMenuItem, ContextMenuService, DialogEditEventArgs, EditService, EditSettingsModel, ExcelExportService, FilterService, FilterSettingsModel, GridLine, GridModule, GroupService, PageService, ReorderService, ResizeService, SaveEventArgs, SearchService, SearchSettingsModel, SelectionSettingsModel, SortService, ToolbarItems, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';



const imports = [
    CommonModule,
    GridModule
];

const keyExpr = ["account", "child"];

@Component({
    standalone: true,
    selector: 'gl-grid',
    imports: [imports],
    template: `
    <ejs-grid  class="e-grid mt-3"
                [dataSource]="data" 
                [columns]="columns"
                allowSorting='true'
                showColumnMenu='true' 
                allowEditing='true' 
                [gridLines]="lines"
                [allowFiltering]='true'                 
                [toolbar]='toolbarOptions'                 
                [filterSettings]='filterSettings'
                [editSettings]='editSettings' 
                [pageSettings]='pageSettings'                 
                [enableStickyHeader]='true' 
                [allowGrouping]="false"
                [allowResizing]='true' 
                [allowReordering]='true' 
                [allowExcelExport]='true' 
                [contextMenuItems]="contextMenuItems" 
                (actionBegin)='actionBegin($event)' 
                (actionComplete)='actionComplete($event)'>
    </ejs-grid>`,
    providers: [ExcelExportService, GroupService, SearchService, ContextMenuService, ReorderService, SortService, GroupService, PageService, ResizeService, FilterService, ToolbarService, EditService, AggregateService, ColumnMenuService],
    styles: [
        `    .e-grid {
             font-family: cursive;
             border: 1px solid #f0f0f0;
        }
        `
    ]
})
export class GLGridComponent implements OnInit {
            
    public selectedItemKeys: any[] = [];
    public bDirty: boolean = false;
    readonly displayModes = [{ text: "Display Mode 'full'", value: 'full' }, { text: "Display Mode 'compact'", value: 'compact' }];
    showPageSizeSelector = true;
    showInfo = true;
    showNavButtons = true;
    public lines: GridLine;
    
    @Input() data: Object[];
    @Input() columns: Object[];

    public openTradeId = output<Object>();
    public onFocusChanged = output<Object>();
    public contextMenuItems: ContextMenuItem[];
    public editing: EditSettingsModel;

    public formatoptions: Object;
    public initialSort: Object;
    public pageSettings: Object;
    public filterOptions: FilterSettingsModel;
    public editSettings: Object;
    public dropDown: DropDownListComponent;
    public submitClicked: boolean = false;
    public selectionOptions?: SelectionSettingsModel;
    public toolbarOptions?: ToolbarItems[];
    public searchOptions?: SearchSettingsModel;
    public filterSettings: FilterSettingsModel;
    

    openTrade($event) {
        console.log('openTrade : ', $event);
    }

    ngOnInit() {
        this.initialDatagrid();
        this.lines = 'Both';
        this.contextMenuItems = ['AutoFit', 'AutoFitAll', 'SortAscending', 'SortDescending',
            'Copy', 'Edit', 'Delete', 'Save', 'Cancel',
            'PdfExport', 'ExcelExport', 'CsvExport', 'FirstPage', 'PrevPage',
            'LastPage', 'NextPage'];
        this.editing = { allowDeleting: true, allowEditing: true };
    }

    onUpdateSelection() { }

    onUpdate(e: any) { }

    changeType(e) {  console.debug('changeType ', JSON.stringify(e));  }

    onDeleteSelection() {}

    onDelete(e: any) { }

    onRefresh() {}

    onAdd() { }

    onDoubleClicked(args: any) { }

    onFocusedRowChanged(e: any) { 
        this.onFocusChanged.emit(e);
    }


    


    initialDatagrid() {
        this.formatoptions = { type: 'dateTime', format: 'M/dd/yyyy' }
        this.pageSettings = { pageSizes: true, pageCount: 10 };
        this.selectionOptions = { mode: 'Cell' };
        this.editSettings = { allowEditing: true, allowAdding: false, allowDeleting: false };
        this.searchOptions = { operator: 'contains', ignoreCase: true, ignoreAccent: true };
        this.toolbarOptions = ['Search'];
        this.filterSettings = { type: 'Excel' };
    }

    actionBegin(args: SaveEventArgs): void {
        var data = args.rowData;
        
        if (args.requestType === 'beginEdit' || args.requestType === 'add') {
            args.cancel = true;
            this.openTradeId.emit(data);
            console.log(JSON.stringify(data));        
        }
        if (args.requestType === 'save') {
            args.cancel = true;
            console.log(JSON.stringify(args.data));        
        }
    }

    actionComplete(args: DialogEditEventArgs): void {
        if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
            if (args.requestType === 'beginEdit') {
                
            } else if (args.requestType === 'add') {
                
            }
        }
    }


}
