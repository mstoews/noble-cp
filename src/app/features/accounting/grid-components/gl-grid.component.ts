import { Component, inject, input, OnInit, output, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AggregateService, ColumnMenuService, ContextMenuItem, ContextMenuService, DialogEditEventArgs, EditService, EditSettingsModel, ExcelExportService, FilterService, FilterSettingsModel, GridComponent, GridLine, GridModule, GroupService, PageService, PdfExportService, ReorderService, ResizeService, SaveEventArgs, SearchService, SearchSettingsModel, SelectionSettingsModel, SortService, ToolbarItems, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { AuthService } from 'app/features/auth/auth.service';
import { Observable } from 'rxjs';
import { GridSettingsService, IGridSettingsModel } from 'app/services/grid.settings.service';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { MaterialModule } from 'app/services/material.module';
import { MatDrawer } from '@angular/material/sidenav';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-navigations';
import { ToastrService } from 'ngx-toastr';
import { ContextMenuAllModule } from '@syncfusion/ej2-angular-navigations';

const mods = [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    GridModule,
    ContextMenuAllModule
];

const providers = [
    ReorderService,
    PdfExportService,
    ExcelExportService,
    ContextMenuService,
    SortService,
    PageService,
    ResizeService,
    FilterService,
    ToolbarService,
    EditService,
    AggregateService,
    ColumnMenuService,
    SearchService,
    ContextMenuService
];

const keyExpr = ["account", "child"];

@Component({
    standalone: true,
    selector: 'gl-grid',
    imports: [mods],
    template: `    
    <mat-drawer-container class="flex-col">        
    <ng-container >
        <ejs-grid  #grid_parent id="grid_parent" class="e-grid mt-3 h-[calc(100vh)-100px] border-1 border-gray-200"         
                [rowHeight]='30'               
                [dataSource]="data()" 
                [columns]="columns()"
                [allowSorting]='true'
                [showColumnMenu]='true'                
                [gridLines]="lines"                
                [toolbar]='toolbarOptions'                 
                [filterSettings]='filterOptions'
                [editSettings]='editSettings'
                [allowFiltering]='true'                   
                [enablePersistence]='false'
                [enableStickyHeader]='true'
                [allowGrouping]="false"
                [allowResizing]='true' 
                [allowReordering]='true' 
                [allowExcelExport]='true' 
                [allowPdfExport]='true' 
                [contextMenuItems]="contextMenuItems"
                (actionBegin)='actionBegin($event)' 
                (rowSelected)="rowSelected($event)"              
                (actionComplete)='actionComplete($event)'>
        </ejs-grid>
        </ng-container>        
    </mat-drawer-container>
    `,
    providers: [providers],
    styles: [
        `    .e-grid {
             font-family: cursive;
             border: 1px solid #f0f0f0;
             
        }
        .custom-css {             
             font-style: italic;
             color: #007F00
        }
        `
    ]
})
export class GLGridComponent implements OnInit {
    
    gridForm: any;
    public context: any;

    public selectedItemKeys: any[] = [];
    public bDirty: boolean = false;
    readonly displayModes = [{ text: "Display Mode 'full'", value: 'full' }, { text: "Display Mode 'compact'", value: 'compact' }];
    showPageSizeSelector = true;
    showInfo = true;
    showNavButtons = true;
    public lines: GridLine;
    private authService = inject(AuthService);
    private gridSettingsService = inject(GridSettingsService);
    toast = inject(ToastrService);

    readonly data = input<Object[]>(undefined);
    readonly columns = input<Object[]>(undefined);

    public onUpdateSelection = output<Object>();
    public onFocusChanged = output<Object>();
    public contextMenuItems: ContextMenuItem[];
    public editing: EditSettingsModel;

    public formatoptions: Object;
    public initialSort: Object;
    public editSettings: EditSettingsModel;
    public dropDown: DropDownListComponent;
    public submitClicked: boolean = false;
    public selectionOptions?: SelectionSettingsModel;
    public toolbarOptions?: ToolbarItems[];
    public searchOptions?: SearchSettingsModel;
    public filterSettings: FilterSettingsModel;

    public grid = viewChild<GridComponent>('parent_grid');
    public editDrawer = viewChild<MatDrawer>('drawer');
    private fb = inject(FormBuilder);
    public state?: GridComponent;
    public message?: string;
    public userId: string;
    sTitle: any;


    public animation = {
        effect: 'FadeIn',
        duration: 800
    };

    public filterOptions: Object = { type: 'Excel' };

    openTrade($event) {
        console.log('openTrade : ', $event);
    }

    ngOnInit() {
        this.context = { enableContextMenu: true, contextMenuItems: [], customContextMenuItems: [{ id: 'clear', text: "Clear Selection" }] };
        this.initialDatagrid();
        this.lines = 'Both';
        this.editing = { allowDeleting: true, allowEditing: true, allowEditOnDblClick: false, allowAdding: true };
        this.userId = this.authService.user()?.uid
        this.createEmptyForm();
    }

    onClone(e: any) {
        this.toast.success('Template Clone', 'Clone');
    }

    rowSelected($event: any) {
        this.onFocusChanged.emit($event);
    }

    onEdit(e: any) {
        this.toast.success('Edit Journal', 'Edit');
    }

    onDelete(e: any) {
        this.toast.success('Template');
    }

    onUpdate(e: any) {
        const rawData = {
            settings_name: this.gridForm.value.settings_name,
            grid_name: this.gridForm.value.grid_name,
        };
        this.closeDrawer();
    }

    onCreate($event: any) {
        this.toast.success('onCreate called');
    }



    public readSettings() {
        return this.gridSettingsService.readAll();
    }

    public savePersistData(gridSettings: IGridSettingsModel) {
        var persistData = this.grid().getPersistData(); // Grid persistData
        gridSettings.userId = this.userId;
        gridSettings.settings = persistData;
        this.addFormatSettings(gridSettings); // Grid persistData 
        console.log("Grid state saved.");
    }

    public restorePersistData(settingsName: string) {
        const formats = this.gridSettingsService.readSettingsName(settingsName);
        formats.subscribe(format => {
            var settings = format[0].settings;
            if (settings) {
                this.grid().setProperties(JSON.parse(settings));
            }
        });
    }

    onExportExcel() {
        console.log('Excel');
        const fileName = new Date().toLocaleDateString() + '.xlsx';
        this.grid()!.excelExport({ fileName: fileName });
    }

    onExportCSV() {
        console.log('Refresh');
        this.grid()!.csvExport();
    }

    onExportPDF() {
        console.log('Refresh');
        const fileName = new Date().toLocaleDateString() + '.xlsx';
        this.grid()!.pdfExport({
            pageOrientation: 'Landscape', pageSize: 'A4', fileName: 'TB-31-01-2024.pdf', header: {
                fromTop: 0,
                height: 120,
                contents: [
                    {
                        type: 'Text',
                        position: { x: 10, y: 50 },
                        style: { textBrushColor: '#000000', fontSize: 30 },
                    },
                ]
            }
        });
    }

    public onAdd() {

    }

    public readAllSettings(): Observable<IGridSettingsModel[]> {
        return this.gridSettingsService.readAll();
    }

    private addFormatSettings(settings: IGridSettingsModel) {
        this.gridSettingsService.create(settings);
    }


    private getFormatByName(userId: string) {
        return this.gridSettingsService.readUserId(userId);
    }


    onFocusedRowChanged(e: any) {
        this.onFocusChanged.emit(e);
    }

    initialDatagrid() {
        this.formatoptions = { type: 'dateTime', format: 'M/dd/yyyy' }
        this.selectionOptions = { mode: 'Row' };
        this.editSettings = { allowEditing: true, allowAdding: false, allowDeleting: false };
        this.searchOptions = { operator: 'contains', ignoreCase: true, ignoreAccent: true };
        this.toolbarOptions = ['Search'];
        this.filterSettings = { type: 'Excel' };
    }

    actionBegin(args: SaveEventArgs): void {
        var data = args.rowData;

        if (args.requestType === 'beginEdit' || args.requestType === 'add') {
            args.cancel = true;
            this.onUpdateSelection.emit(data);
        }

        if (args.requestType === 'delete') {
            args.cancel = true;
            this.onUpdateSelection.emit(data);
        }
        if (args.requestType === 'save') {
            args.cancel = true;
        }
    }

    public setRowHeight(height: number): void {
        this.grid().rowHeight = height;
    }

    actionComplete(args: DialogEditEventArgs): void {
        if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
            if (args.requestType === 'beginEdit') {

            } else if (args.requestType === 'add') {

            }
        }
    }

    createEmptyForm() {
        this.gridForm = this.fb.group({
            settings_name: [''],
            grid_name: [''],
        });
    }

    public openEditDrawer() {
        const opened = this.editDrawer().opened;
        if (opened !== true) {
            this.editDrawer().toggle();
        } else {
            return;
        }
    }

    closeDrawer() {
        const opened = this.editDrawer().opened;
        if (opened === true) {
            this.editDrawer().toggle();
        } else {
            return;
        }
    }




}