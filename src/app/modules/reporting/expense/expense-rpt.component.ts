import { Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation, inject, AfterViewInit, signal } from '@angular/core';
import { SpreadsheetComponent, SpreadsheetModule } from '@syncfusion/ej2-angular-spreadsheet';
import { CommonModule } from '@angular/common';
import { DistMenuStandaloneComponent } from '../distributed-ledger/dist-menubar/grid-menubar.component';
import { TrialBalanceStore } from 'app/services/distribution.ledger.store';


@Component({
  selector: 'expense-rpt',
  standalone: true,
  imports: [SpreadsheetModule, CommonModule, DistMenuStandaloneComponent],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './expense-rpt.component.html',
  providers: [TrialBalanceStore]
})

export class ExpenseRptComponent implements OnInit, OnDestroy {

  @ViewChild('default')
  public spreadsheetObj: SpreadsheetComponent;
  store = inject(TrialBalanceStore);
  START_DETAIL = 5;

  currentPeriod = signal(1);
  currentYear = signal(2024);
  args$ : any;

  ngOnDestroy(): void {
    
  }

  contextMenuBeforeOpen(args: any) {
    if (args.element.id === this.spreadsheetObj!.element.id + '_contextmenu') {
      this.spreadsheetObj!.addContextMenuItems([{ text: 'Custom Item' }], 'Paste Special', false); 
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

  public scrollSettings: { 
    isFinite: true, 
    enableVirtualization: false, 
  } 

  onRefresh() {
    this.updateReport();
  }

  ngOnInit(): void {
    var params = {
      period: this.currentPeriod(),
      period_year: this.currentYear()
  }
   this.store.loadHeader(params);
   
  }

  updateReport() {
    var i = this.START_DETAIL;
    var row = 0;
    this.store.header().forEach(data => {  
          if (Number(data.child) >= 6000)
          {
            this.spreadsheetObj.setValueRowCol(1, data.description, i,     3);
            this.spreadsheetObj.setValueRowCol(1, data.opening_balance, i, 4);
            this.spreadsheetObj.setValueRowCol(1, data.closing_balance, i, 5);
            this.spreadsheetObj.setValueRowCol(1, data.opening_balance + data.closing_balance, i, 6);
            i++;
          }      
    });

    this.spreadsheetObj.setValueRowCol(1, 'Total', i, 3);
    this.spreadsheetObj.setValueRowCol(1, 'Opening', 4, 4);      
    this.spreadsheetObj.setValueRowCol(1, 'Current', 4, 5);
    this.spreadsheetObj.setValueRowCol(1, 'Change', 4, 6);

    row = i - 1  
    this.spreadsheetObj.updateCell({ formula: `=SUM(D4:D$${row})` }, `D${i}`);
    this.spreadsheetObj.updateCell({ formula: `=SUM(E4:E$${row})` }, `E${i}`);
    this.spreadsheetObj.updateCell({ formula: `=SUM(F4:F$${row})` }, `F${i}`);            
    this.spreadsheetObj.cellFormat({ fontWeight: 'bold', textAlign: 'right', verticalAlign: 'middle', fontSize: '12px' }, `A${i}:G${i}`);      
  }

  created() {
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    this.spreadsheetObj.cellFormat({ fontFamily: 'Arial', verticalAlign: 'middle' }, 'A1:h500');
    this.spreadsheetObj.cellFormat({ fontWeight: 'bold', backgroundColor: '#AAA', color: '#EEE', textAlign: 'left', verticalAlign: 'middle', fontSize: '20px' }, 'A1:G3');
    this.spreadsheetObj.setRowHeight(30, 0);
    this.spreadsheetObj.setValueRowCol(1, 'Noble Ledgers', 1, 1);
    this.spreadsheetObj.setValueRowCol(1, 'Expense Summary By Period', 2, 1);
    this.spreadsheetObj.merge('A1:h1');
    this.spreadsheetObj.merge('A2:h2');
    this.spreadsheetObj.merge('A3:h3');
    this.spreadsheetObj.numberFormat('#,##0.00', 'D5:G300');
    this.spreadsheetObj.cellFormat({ textAlign: 'right', verticalAlign: 'middle', fontSize: '12px' }, 'D5:G100');
    this.spreadsheetObj.setColWidth(15, 0, 0);
    this.spreadsheetObj.setColWidth(15, 1, 0);
    this.spreadsheetObj.setColWidth(140, 1, 1);
    this.spreadsheetObj.setColWidth(300, 2);
    this.spreadsheetObj.setColWidth(140, 3);
    this.spreadsheetObj.setColWidth(140, 4);
    this.spreadsheetObj.setColWidth(140, 5);
    this.spreadsheetObj.setColWidth(140, 6);
    this.spreadsheetObj.setColWidth(140, 7);
    this.spreadsheetObj.cellFormat({ textAlign: 'right' }, 'D4:G300');
    this.spreadsheetObj.cellFormat({ fontWeight: 'bold', textAlign: 'right', verticalAlign: 'middle', fontSize: '12px' }, 'A53:G53');
    this.spreadsheetObj.setValueRowCol(1, updateDate, 3, 1);
  }
}
