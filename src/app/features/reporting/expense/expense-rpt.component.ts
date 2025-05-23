import { Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation, inject, AfterViewInit, signal, HostListener, viewChild } from '@angular/core';
import { SpreadsheetComponent, SpreadsheetAllModule } from '@syncfusion/ej2-angular-spreadsheet';
import { CommonModule } from '@angular/common';
import { TrialBalanceStore } from 'app/store/distribution.ledger.store';
import { UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { IDistributionLedger } from 'app/models';
import { DistributionLedgerService } from 'app/services/distribution.ledger.service';
import { GridMenubarStandaloneComponent } from "../../accounting/grid-components/grid-menubar.component";
import { Observable, of } from 'rxjs';
import { data } from './data';

@Component({
  selector: 'expense-rpt',
  imports: [SpreadsheetAllModule, UploaderModule, CommonModule, GridMenubarStandaloneComponent],
  encapsulation: ViewEncapsulation.None,
  template: `
  <div class="absolute inset-0 flex flex-col min-w-0 overflow-y-auto -px-20" cdkScrollable>
  <!-- Main -->
  <div class="flex-auto p-6 sm:p-10">
        <div class="h-full border-gray-300 rounded-2xl">
            <grid-menubar
            [inTitle]="'Income Expense Report by Period'"       
            (period)=onPeriod($event) 
            (onPrint)="onPrint()"                          
            (exportXL)="exportXL()"
            (exportPRD)="exportPDF()"
            (exportCSV)="exportCSV()"
            [showCalendar]=true
            [showCalendarButton]=true
            [showPrint]=false
            [showExportXL]=true
            [showExportPDF]=false
            [showExportCSV]=false
            [showSettings]=false
            [showBack]=true>
        </grid-menubar>  
      
    <div class="flex flex-col h-full mt-10">
      
        <ejs-spreadsheet  class="w-[calc(100%)] h-[calc(85%)]"  #spreadsheet 
              saveUrl='http://localhost:6002/api/spreadsheet/save'  
              openUrl='http://localhost:6002/api/spreadsheet/open'  
              (created)="created()"              
              [allowResizing]="true"
              allowOpen='true' 
              allowSave='true'                      
              [showRibbon]="true" 
              [showFormulaBar]="true"                           
              [showSheetTabs]="true">                            
        </ejs-spreadsheet>
      </div>
    </div>
  </div>
</div>
  `,
  providers: [TrialBalanceStore]
})

export class ExpenseRptComponent implements OnInit, AfterViewInit, OnDestroy {

  spreadSheetView = viewChild<SpreadsheetComponent>('spreadsheet');

  distributionLedgerService = inject(DistributionLedgerService)
  START_DETAIL = 5;
  GRID_HEIGHT_ADJ = 450;
  gridHeight = 500;

  currentPeriod = signal(1);
  currentYear = signal(2025);
  
  data$ = of(data)
  
  distLedger$: Observable<IDistributionLedger[]>;  
  accountHash = new Map<string, IDistributionLedger>();
  tb: IDistributionLedger[] = [];

  public scrollSettings: {
    isFinite: true,
    enableVirtualization: false,
  }

  ngOnDestroy(): void {

  }
  currentBalance(account: string): number {    
    const data = this.accountHash.get(account);      
    return data?.closing_balance ?? 0; 
  }
  
  
  onPrint() {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
    this.distLedger$ = this.distributionLedgerService.getDistributionReportByPrdAndYear({ period: this.currentPeriod(), period_year: this.currentYear() })
    this.distLedger$.subscribe(data => {
      data.forEach((item: IDistributionLedger) => {
        this.accountHash.set(item.child.toString(), item);
      });           
    });
  }


  ngAfterViewInit(): void {

    // if (this.spreadSheetView() !== undefined) {
    //   this.updateReportFromJSON(this.data);    
    // }  

  
  }
    

  contextMenuBeforeOpen(args: any) {
    if (args.element.id === this.spreadSheetView()!.element.id + '_contextmenu') {
      this.spreadSheetView()!.addContextMenuItems([{ text: 'Custom Item' }], 'Paste Special', false);
    }
  }

  onYearChanged(e: any) {
    this.currentYear.set(Number(e));
    this.onRefresh();
  }

  onPeriodChanged(e: any) {
    this.currentPeriod.set(Number(e));
    this.onRefresh();
  }

  onRefresh() {
    // this.updateReport(this.store.header());

    // var param = {
    //   period: this.currentPeriod(),
    //   period_year: this.currentYear()
    // }
    // this.distLedger$ = this.distributionLedgerService.getDistributionReportByPrdAndYear({ period: this.currentPeriod(), period_year: this.currentYear() })
   //this.updateReportFromJSON(this.data);
  }

  updatedReport(tb: IDistributionLedger[]) {
    if (this.spreadSheetView()) {
      var i = this.START_DETAIL;
      var row = 0;
      tb.forEach(data => {
        if (Number(data.child) >= 6000) {
          this.spreadSheetView().setValueRowCol(1, data.description, i, 3);
          this.spreadSheetView().setValueRowCol(1, data.opening_balance, i, 4);
          this.spreadSheetView().setValueRowCol(1, data.closing_balance, i, 5);
          this.spreadSheetView().setValueRowCol(1, data.opening_balance + data.closing_balance, i, 6);
          i++;
        }
      });

      this.spreadSheetView().setValueRowCol(1, 'Total', i, 3);
      this.spreadSheetView().setValueRowCol(1, 'Opening', 4, 4);
      this.spreadSheetView().setValueRowCol(1, 'Current', 4, 5);
      this.spreadSheetView().setValueRowCol(1, 'Change', 4, 6);

      row = i - 1
      this.spreadSheetView().updateCell({ formula: `=SUM(D4:D$${row})` }, `D${i}`);
      this.spreadSheetView().updateCell({ formula: `=SUM(E4:E$${row})` }, `E${i}`);
      this.spreadSheetView().updateCell({ formula: `=SUM(F4:F$${row})` }, `F${i}`);
      this.spreadSheetView().cellFormat({ fontWeight: 'bold', textAlign: 'right', verticalAlign: 'middle', fontSize: '12px' }, `A${i}:G${i}`);
    }
  }

  
  exportCSV() {
    throw new Error('Method not implemented.');
  }
  
  exportPDF() {
    throw new Error('Method not implemented.');
  }
  
  exportXL() {
    throw new Error('Method not implemented.');
  }
  
  onPeriod($event: any) {
    throw new Error('Method not implemented.');
  }

  
  created() {
    // Applies style formatting to the active sheet before inserting a new sheet
    this.spreadSheetView()!.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
    this.spreadSheetView()!.cellFormat({ textAlign: 'right' }, 'D2:H200');
    
    // inserting a new sheet with data at 1st index
    // You can also insert empty sheets by specifying the start and end sheet index instead of sheet model
    this.spreadSheetView()!.insertSheet([{
        index: 1,
        name: 'Inserted Sheet',
        ranges: [{ dataSource: data }],
        columns: [{ width: 150 }, { width: 200 }, { width: 110 }, { width: 85 }, { width: 85 }, { width: 85 }, { width: 85 },
            { width: 85 }]
    }]);
    // Applies style formatting for the inserted sheet
    this.spreadSheetView()!.cellFormat({ fontWeight: 'bold', textAlign: 'right' }, 'Inserted Sheet!A1:H1');
    this.spreadSheetView()!.cellFormat({ textAlign: 'center' }, 'Inserted Sheet!D2:H11');
    this.spreadSheetView().addCustomFunction(this.currentBalance , 'BALANCE');
  }

  
  create() {
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    
    this.spreadSheetView().cellFormat({ fontFamily: 'Arial', verticalAlign: 'middle' }, 'A1:h500');
    this.spreadSheetView().cellFormat({ fontWeight: 'bold', textAlign: 'left', verticalAlign: 'middle', fontSize: '20px' }, 'A1:G3');
    
    // this.spreadSheetView().setRowHeight(40, 0);
    // this.spreadSheetView().setValueRowCol(1, 'Noble Ledger Ltd.', 1, 1);
    // this.spreadSheetView().setValueRowCol(1, 'Expense Summary By Period', 2, 1);
    // this.spreadSheetView().merge('A1:h1');
    // this.spreadSheetView().merge('A2:h2');
    // this.spreadSheetView().merge('A3:h3');
    // this.spreadSheetView().setRowHeight(40, 1);
    // this.spreadSheetView().numberFormat('#,##0.00', 'D5:G300');
    // this.spreadSheetView().cellFormat({ textAlign: 'right', verticalAlign: 'middle', fontSize: '12px' }, 'D5:G100');
    // this.spreadSheetView().setColWidth(15, 0, 0);
    // this.spreadSheetView().setColWidth(15, 1, 0);
    // this.spreadSheetView().setColWidth(140, 1, 1);
    // this.spreadSheetView().setColWidth(300, 2);
    // this.spreadSheetView().setColWidth(140, 3);
    // this.spreadSheetView().setColWidth(140, 4);
    // this.spreadSheetView().setColWidth(140, 5);
    // this.spreadSheetView().setColWidth(140, 6);
    // this.spreadSheetView().setColWidth(140, 7);
    // this.spreadSheetView().cellFormat({ textAlign: 'right' }, 'D4:G300');
    // this.spreadSheetView().cellFormat({ borderBottom: 'black', fontWeight: 'bold', textAlign: 'right', verticalAlign: 'middle', fontSize: '12px' }, 'A53:G53');
    // this.spreadSheetView().setValueRowCol(1, updateDate, 3, 1);
    // this.spreadSheetView().setRowHeight(30, 4);

    // this.spreadSheetView().cellFormat(
    //   { fontWeight: 'bold', textAlign: 'left' },
    //   'A2:F2'
    // );
    // // this.spreadSheetView().numberFormat('$#,##0', 'B3:D12');
    // this.spreadSheetView().numberFormat('0%', 'E50:E60');

    //this.updateReportFromJSON (this.data);
      
  }

  updateReportFromJSON(tb: any[]) {
    var i = this.START_DETAIL;
    if (this.spreadSheetView()) {    
      
      this.spreadSheetView().setValueRowCol(1, 'Description', 1, 10);
      
      var row = 0;
      tb.forEach(data => {
        if (data.acct_type === 'Revenue') {
          this.spreadSheetView().setValueRowCol(1, data.description, i, 3);
          this.spreadSheetView().setValueRowCol(1, data.previous, i, 4);
          this.spreadSheetView().setValueRowCol(1, data.current, i, 5);
          this.spreadSheetView().setValueRowCol(1, data.difference, i, 6);
          i++;
        }
      });

      this.spreadSheetView().setValueRowCol(1, 'Total', i, 3);
      this.spreadSheetView().setValueRowCol(1, 'Opening', 4, 4);
      this.spreadSheetView().setValueRowCol(1, 'Current', 4, 5);
      this.spreadSheetView().setValueRowCol(1, 'Change', 4, 6);

      row = i - 1
      this.spreadSheetView().updateCell({ formula: `=SUM(D4:D$${row})` }, `D${i}`);
      this.spreadSheetView().updateCell({ formula: `=SUM(E4:E$${row})` }, `E${i}`);
      this.spreadSheetView().updateCell({ formula: `=SUM(F4:F$${row})` }, `F${i}`);
      this.spreadSheetView().cellFormat({ fontWeight: 'bold', textAlign: 'right', verticalAlign: 'middle', fontSize: '12px' }, `A${i}:G${i}`);
    

      row = i + 2;

      tb.forEach(data => {
        if (data.acct_type === 'Expense') {
          this.spreadSheetView().setValueRowCol(1, data.description, i, 3);
          this.spreadSheetView().setValueRowCol(1, data.previous, i, 4);
          this.spreadSheetView().setValueRowCol(1, data.current, i, 5);
          this.spreadSheetView().setValueRowCol(1, data.difference, i, 6);
          i++;
        }
      });

      this.spreadSheetView().setValueRowCol(1, 'Total', i, 3);
      this.spreadSheetView().setValueRowCol(1, 'Opening', 4, 4);
      this.spreadSheetView().setValueRowCol(1, 'Current', 4, 5);
      this.spreadSheetView().setValueRowCol(1, 'Change', 4, 6);

      row = i - 1
      this.spreadSheetView().updateCell({ formula: `=SUM(D4:D$${row})` }, `D${i}`);
      this.spreadSheetView().updateCell({ formula: `=SUM(E4:E$${row})` }, `E${i}`);
      this.spreadSheetView().updateCell({ formula: `=SUM(F4:F$${row})` }, `F${i}`);
      this.spreadSheetView().cellFormat({ fontWeight: 'bold', textAlign: 'right', verticalAlign: 'middle', fontSize: '12px' }, `A${i}:G${i}`);
    }
  }

  @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        const width = window.innerWidth;        
        this.adjustHeight();
    }

    adjustHeight() {
        this.gridHeight = (window.innerHeight - this.GRID_HEIGHT_ADJ)
            //this.grid().height = (window.innerHeight - this.GRID_HEIGHT_ADJ) + 'px'; // Adjust as needed
    }




  
}
