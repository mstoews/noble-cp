import { ChangeDetectionStrategy, Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TrialBalanceStore } from 'app/services/distribution.ledger.store';
import { MaterialModule } from 'app/services/material.module';
import { AggregateService, ColumnMenuService, DetailRowService, EditService, FilterService, FilterSettingsModel, GridComponent, GridModule, GroupService, PageService, ResizeService, RowSelectEventArgs, SearchSettingsModel, SelectionSettingsModel, SortService, ToolbarItems, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';


const imports = [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    GridModule,
];

@Component({
    selector: 'trial-balance',
    standalone: true,
    imports: [imports],
    templateUrl: './trial-balance.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TrialBalanceStore, GroupService, DetailRowService, SortService, PageService, ResizeService, FilterService, ToolbarService, EditService, AggregateService, ColumnMenuService],
    styles: [`
               .e-detailcell .e-grid td.e-cellselectionbackground { background-color: #00b7ea; }
            `]
})
export class TrialBalanceComponent implements OnInit {

    store = inject(TrialBalanceStore);
    @ViewChild('grid')
    public grid?: GridComponent;

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

    public childGrid: GridModule = {
        dataSource: this.store.details(),        
        queryString: 'child',        
        columns: [
            { field: 'account', headerText: 'Account', textAlign: 'Right', width: 140 },
            { field: 'child', headerText: 'Child', textAlign: 'Right', width: 140 },
            { field: 'fund', headerText: 'Fund', textAlign: 'Right', width: 140 },
            { field: 'sub_type', headerText: 'Sub Type', textAlign: 'Right', width: 140 },
            { field: 'description', headerText: 'Description', textAlign: 'Right', width: 240 },
            { field: 'debit', headerText: 'Debit', textAlign: 'Right', format: 'N2', width: 140 },
            { field: 'credit', headerText: 'Credit', textAlign: 'Right', format: 'N2', width: 140 },
        ],
    }

    initialDatagrid() {
        // this.pageSettings = { pageCount: 10 };        
        this.formatoptions = { type: 'dateTime', format: 'M/dd/yyyy' }
        this.pageSettings = { pageSizes: true, pageCount: 10 };
        this.selectionOptions = { mode: 'Cell' };
        this.editSettings = { allowEditing: false, allowAdding: false, allowDeleting: false };
        this.searchOptions = { fields: ['description'], operator: 'contains', ignoreCase: true, ignoreAccent: true };
        this.toolbarOptions = ['Search'];
        this.filterSettings = { type: 'CheckBox' };
    }

    ngOnInit() {
        this.initialDatagrid();
        var params = {
            period: 1,
            period_year: 2024
        }
        var paramsDetail = {
            child: 1002,
            period: 1,
            period_year: 2024
        }
        this.store.loadHeader(params)

        

        this.store.loadDetail(paramsDetail);

        
        console.log('Initial Trial Balance completed');
        
        console.log('Header Length', this.store.header().length)

    }

    actionBegin(args: any) {
        console.debug(JSON.stringify(args.requestType));
        console.log('Header Length from refresh', this.store.header().length)

        
        // if (args.requestType === 'beginEdit' || args.requestType === 'add') {

        //     var detailParams = {
        //         period: 1,
        //         period_year: 2024,
        //         child: 1001
        //     }

        //     this.store.loadDetail(detailParams)
        //     this.store.details().forEach(data => {
        //         console.log(JSON.stringify(data));
        //     })
        //     var data =args.rowData as IDistributionLedger;
            
        // }
    }

    public onRowSelected(args: RowSelectEventArgs): void {
        const queryData: any = args.data;      
        
        var params = {
            period: queryData.period,
            period_year: queryData.period_year,
            child: queryData.child
        }

        this.store.loadDetail(params);
        
        console.debug('Number of entries', JSON.stringify(this.store.details().length));        
        
    }


    onLoad(): void {
        // (this.grid as GridComponent).childGrid.dataSource = this.store.details();
        // (this.grid as GridComponent).detailRowModule.expand(1);
    }
    
    
}

