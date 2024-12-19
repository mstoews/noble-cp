import { Component, inject, Input, input, OnInit, output, viewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AggregateService, ColumnMenuService, ContextMenuItem, ContextMenuService, DialogEditEventArgs, EditService, EditSettingsModel, ExcelExportService, FilterService, FilterSettingsModel, GridComponent, GridLine, GridModule, GroupService, PageService, ReorderService, ResizeService, SaveEventArgs, SearchService, SearchSettingsModel, SelectionSettingsModel, SortService, ToolbarItems, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { FIRESTORE} from 'app/app.config';
import { AuthService } from 'app/modules/auth/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { collection, query, orderBy, limit, addDoc, updateDoc } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { Message } from '@syncfusion/ej2-notifications';
import { retry, filter, map, Observable, Subject, defer } from 'rxjs';


interface Formats {
    id: string;
    name: string;
    grid: string;
    userId: string;
    text: string;
    created: number;
}


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
    <ejs-grid   #grid id="GlGrid"  class="e-grid mt-3 h-[calc(100vh)-100px]"                
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
                [enablePersistence]='false'
                [allowGrouping]="true"
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


    private authService = inject(AuthService);
    private authUser$ = toObservable(this.authService.user);
    private firestore = inject(FIRESTORE);

    
    
    @Input() data: Object[];
    @Input() columns: Object[];

    public openTradeId = output<Object>();
    public onFocusChanged = output<Object>();
    public contextMenuItems: ContextMenuItem[];
    public editing: EditSettingsModel;

    public formatoptions: Object;
    public initialSort: Object;
    public pageSettings: Object;
    public editSettings: Object;
    public dropDown: DropDownListComponent;
    public submitClicked: boolean = false;
    public selectionOptions?: SelectionSettingsModel;
    public toolbarOptions?: ToolbarItems[];
    public searchOptions?: SearchSettingsModel;
    public filterSettings: FilterSettingsModel;

    public grid = viewChild<GridComponent>('grid');
    public state?: GridComponent;
    public message?: string;
    public userId: string;

    messages$ = this.getFormats().pipe(
        // restart stream when user re-authenticates
        retry({
          delay: () => this.authUser$.pipe(filter((user) => !!user)),
        })
    );

    
    
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
        this.userId = this.authService.user()?.uid
    }

    public setPersistData(grid: string ) 
     {
        var persistData = this.getPersistData('DistDB'); // Grid persistData 
        console.log("setting persist data", persistData[0].text);       
        this.addFormat(persistData[0].text);
        this.message = "Grid state saved.";
        return this.message;
    }

    private addFormat(persistData: string) {
        const format = {
          name: 'trial-balance',
          grid: 'DistTB',
          userId: this.userId,
          text: persistData,
          created: Date.now(),
        };
        return addDoc(collection(this.firestore, 'formats'), format);
    }

    public getPersistData(grid: string) {
        console.log("resetting grid");
        this.message = "";
        let value: string = window.localStorage.getItem(grid) as string; 
        const formats = this.getFormats();

        var format: Formats[]

        formats.subscribe(formats => {
            format = formats;
        });
        return format;
    }

    private getFormats() {
        const formatsCollection = query(
          collection(this.firestore, 'formats'),
          orderBy('created', 'desc'),
          limit(50)
        );
  
      return collectionData(formatsCollection, { idField: 'id' }).pipe(
        map((formats) => [...formats].reverse())
      ) as Observable<Formats[]>;
    }


    onAdd() { }

    onFocusedRowChanged(e: any) { 
        this.onFocusChanged.emit(e);
    }

    initialDatagrid() {
        this.formatoptions = { type: 'dateTime', format: 'M/dd/yyyy' }
        this.pageSettings = { pageSizes: true, pageCount: 10 };
        this.selectionOptions = { mode: 'Row' };
        this.editSettings = { allowEditing: true, allowAdding: false, allowDeleting: false };
        this.searchOptions = { operator: 'contains', ignoreCase: true, ignoreAccent: true };
        this.toolbarOptions = ['Search'];
        this.filterSettings = { type: 'Menu' };
    }

    actionBegin(args: SaveEventArgs): void {
        var data = args.rowData;
        
        if (args.requestType === 'beginEdit' || args.requestType === 'add') {
            args.cancel = true;
            this.openTradeId.emit(data);            
        }
        if (args.requestType === 'save') {
            args.cancel = true;            
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
