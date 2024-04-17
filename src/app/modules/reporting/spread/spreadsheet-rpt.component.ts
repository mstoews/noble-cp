import { Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { SpreadsheetComponent, SpreadsheetModule } from '@syncfusion/ej2-angular-spreadsheet';
import { Subject, takeUntil } from 'rxjs';

import { CommonModule } from '@angular/common';
import { DistMenuStandaloneComponent } from '../distributed-ledger/dist-menubar/grid-menubar.component';
import { DistributionLedgerService } from 'app/services/distribution.ledger.service';

@Component({
  selector: 'app-spreadsheet-rpt',
  standalone: true,
  imports: [SpreadsheetModule, CommonModule, DistMenuStandaloneComponent],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './spreadsheet-rpt.component.html',
})

export class SpreadsheetRptComponent implements OnInit, OnDestroy {

  @ViewChild('default')
  public spreadsheetObj: SpreadsheetComponent;
  private distService = inject(DistributionLedgerService)
  public dl$ = this.distService.getDistributionReportByPrdAndYear(1, 2024);


  public openUrl = 'https://services.syncfusion.com/angular/production/api/spreadsheet/open';
  public saveUrl = 'https://services.syncfusion.com/angular/production/api/spreadsheet/save';

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  public currentPeriod = 1;
  public currentYear = 2024;
  public $args: any;

  constructor() { }

  contextMenuBeforeOpen(args: any) {
    if (args.element.id === this.spreadsheetObj!.element.id + '_contextmenu') {
      this.spreadsheetObj!.addContextMenuItems([{ text: 'Custom Item' }], 'Paste Special', false); //To pass the items, Item before / after that the element to be inserted, Set false if the items need to be inserted before the text.
    }
  }

  onYearChanged(e: any) {
    this.currentYear = Number(e);
    this.onRefresh();
  }

  onPeriodChanged(e: any) {
    this.currentPeriod = Number(e);
    this.onRefresh();
  }

  onRefresh() {
  }

  onAdd() { }


  ngOnInit(): void {
    this.updateReport();
  }

  updateReport() {

    var i = 4;
    

    this.dl$.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
      data.forEach(d => {
        
        //this.spreadsheetObj.setValueRowCol(1, d.account, i, 1);
        //this.spreadsheetObj.setValueRowCol(1, d.child, i, 2);
        let account = Number(d.account);
        if (account === 5000 || account === 6000){        
        this.spreadsheetObj.setValueRowCol(1, d.description, i, 3);
        this.spreadsheetObj.setValueRowCol(1, d.opening_balance, i, 4);
        this.spreadsheetObj.setValueRowCol(1, d.debit_balance, i, 5);
        this.spreadsheetObj.setValueRowCol(1, d.credit_balance, i, 6);
        this.spreadsheetObj.setValueRowCol(1, d.closing_balance, i, 7);
        i++;
        }
      })
      i++
      this.spreadsheetObj.setValueRowCol(1, 'Total', i, 3);
      this.spreadsheetObj.setValueRowCol(1, 'Opening', 3, 4);
      this.spreadsheetObj.setValueRowCol(1, 'Debit', 3, 5);
      this.spreadsheetObj.setValueRowCol(1, 'Credit', 3, 6);
      this.spreadsheetObj.setValueRowCol(1, 'Closing', 3, 7);
      this.spreadsheetObj.updateCell({ formula: `=SUM(D4:D${i-1})` }, `D${i}`);
      this.spreadsheetObj.updateCell({ formula:  `=SUM(E4:E${i-1})` }, `E${i}`);
      this.spreadsheetObj.updateCell({ formula:  `=SUM(F4:F${i-1})` }, `F${i}`);
      this.spreadsheetObj.updateCell({ formula:  `=SUM(G4:G${i-1})` }, `G${i}`);
      
  
    });
  }

  

  created() {
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    this.spreadsheetObj.cellFormat({ fontFamily: 'Arial', verticalAlign: 'middle' }, 'A1:G500');
    this.spreadsheetObj.cellFormat({ fontWeight: 'bold', backgroundColor: '#AAA', color: '#EEE', textAlign: 'left', verticalAlign: 'middle', fontSize: '20px' }, 'A1:G1');
    this.spreadsheetObj.setRowHeight(30, 0);
    this.spreadsheetObj.setBorder({ border: '1px solid #A6A6A6' }, 'A1:G300');
    this.spreadsheetObj.setValueRowCol(1, 'Income and Expense Summary', 1, 1);
    this.spreadsheetObj.merge('A1:G1');
    this.spreadsheetObj.merge('A2:G2');
    this.spreadsheetObj.numberFormat('#,##0.00', 'D4:G300');
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
    this.spreadsheetObj.cellFormat({ fontWeight: 'bold', textAlign: 'right', verticalAlign: 'middle', fontSize: '14px' }, 'A53:G53');
    this.spreadsheetObj.cellFormat({ fontWeight: 'bold', textAlign: 'left', verticalAlign: 'middle', fontSize: '14px' }, 'A2');
    this.spreadsheetObj.setValueRowCol(1, updateDate , 2, 1);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
