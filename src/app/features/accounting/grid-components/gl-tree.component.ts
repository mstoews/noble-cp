import { Component, Input, input, OnInit, output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeGridAllModule, SortService,
         ExcelExportService,  ContextMenuService,
         PageService, ResizeService, FilterService, ToolbarService, EditService, AggregateService, 
         ColumnMenuService,
         ITreeData } from '@syncfusion/ej2-angular-treegrid';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';



const imports = [
    CommonModule,
    TreeGridAllModule
];

const keyExpr = ["account", "child"];

@Component({
    standalone: true,
    selector: 'gl-treegrid',
    imports: [imports],
    template: `
    <ejs-treegrid  class="e-grid mt-3"
                [dataSource]="data" 
                [columns]="columns"
                allowSorting='true'
                showColumnMenu='true' 
                allowEditing='true'                 
                [allowFiltering]='true'                 
                [toolbar]='toolbarOptions'                 
                [filterSettings]='filterSettings'
                [editSettings]='editSettings' 
                [pageSettings]='pageSettings'                 
                [allowResizing]='true' 
                [allowReordering]='true' 
                [childMapping]='mapping'  
                [treeColumnIndex]='1'
                [allowExcelExport]='true' >                                
    </ejs-treegrid>`,
    providers: [ExcelExportService, ContextMenuService, SortService, PageService, ResizeService, FilterService, ToolbarService, EditService, AggregateService, ColumnMenuService],
    styles: [
        `    .e-grid {
             font-family: cursive;
             border: 1px solid #f0f0f0;
        }
        `
    ]
})
export class GLTreeGridComponent implements OnInit {
            
    public selectedItemKeys: any[] = [];
    public bDirty: boolean = false;
    readonly displayModes = [{ text: "Display Mode 'full'", value: 'full' }, { text: "Display Mode 'compact'", value: 'compact' }];
    showPageSizeSelector = true;
    showInfo = true;
    showNavButtons = true;
    mapping = 'account';
    
    @Input() data: Object[];
    @Input() columns: Object[];

    public openTradeId = output<Object>();
    public onFocusChanged = output<Object>();
    public formatoptions: Object;
    public initialSort: Object;
    public pageSettings: Object;
    
    public editSettings: Object;
    public dropDown: DropDownListComponent;
    public submitClicked: boolean = false;
    toolbarOptions: string[];
    searchOptions: { operator: string; ignoreCase: boolean; ignoreAccent: boolean; };
    filterSettings: { type: string; };
    

    openTrade($event) {
        console.log('openTrade : ', $event);
    }

    ngOnInit() {
        this.initialDatagrid();
    
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
        this.editSettings = { allowEditing: true, allowAdding: false, allowDeleting: false };
        this.searchOptions = { operator: 'contains', ignoreCase: true, ignoreAccent: true };
        this.toolbarOptions = ['Search'];
        this.filterSettings = { type: 'Excel' };
    }

    // actionBegin(args: SaveEventArgs): void {
    //     var data = args.rowData;
        
    //     if (args.requestType === 'beginEdit' || args.requestType === 'add') {
    //         args.cancel = true;
    //         this.openTradeId.emit(data);
    //         console.log(JSON.stringify(data));        
    //     }
    //     if (args.requestType === 'save') {
    //         args.cancel = true;
    //         console.log(JSON.stringify(args.data));        
    //     }
    // }

    // actionComplete(args: DialogEditEventArgs): void {
    //     if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
    //         if (args.requestType === 'beginEdit') {
                
    //         } else if (args.requestType === 'add') {
                
    //         }
    //     }
    // }


}
