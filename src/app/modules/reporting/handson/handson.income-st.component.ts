import {Component, inject, OnInit} from '@angular/core';
import { HotTableModule } from '@handsontable/angular';
import Handsontable from 'handsontable/base';
import { HyperFormula } from 'hyperformula';

import {registerCellType, NumericCellType, registerAllCellTypes} from 'handsontable/cellTypes';

import {
  registerPlugin,
  UndoRedo,
} from 'handsontable/plugins';

import {MatCardModule} from "@angular/material/card";


import {registerAllModules} from "handsontable/registry";
import { ContextMenu } from 'handsontable/plugins/contextMenu';
import {GridMenubarStandaloneComponent} from "../../accounting/grid-menubar/grid-menubar.component";
import {TrialBalanceStore} from "../../../services/distribution.ledger.store";

registerAllCellTypes();
registerAllModules()
registerPlugin(UndoRedo);

const imports = [
  HotTableModule,
  MatCardModule,
  GridMenubarStandaloneComponent
]

@Component({
  standalone: true,
  selector: 'handson-income-st',
  providers: [TrialBalanceStore],
  imports: [imports],
  template: `
    <grid-menubar [inTitle]="'Transaction Listing'"></grid-menubar>
    <mat-card class="w-[100%] mt-2">
      <hot-table 
        class="m-1"
        [data]="store.header()"
        [settings]="hotSettings">
      </hot-table>
    </mat-card>
  `,
})

export class HandsonIncomeStComponent  implements OnInit {
   store = inject(TrialBalanceStore);
   ngOnInit() {

   }

selectedRows: any[] = [];

 // columns: this.columnData,

  columnData =  [
    { title: 'Account', data: 'child', className: 'htMiddle' ,  type: 'text'},
    { title: 'Period', data: 'period', type: 'text' },
    { title: 'Description', data: 'description', type: 'numeric', numericFormat: { pattern: '0,0.00',  culture: 'en-US' }, },
    { title: 'Opening Balance', data: 'opening_balance', type: 'numeric',numericFormat: { pattern: '0,0.00',  culture: 'en-US' }, },
    { title: 'Debit', data: 'debit_balance',  type:  'numeric',  numericFormat: { pattern: '0,0.00',  culture: 'en-US' }, },
    { title: 'Credit', data: 'credit_balance',  type: 'numeric', numericFormat: { pattern: '0,0.00',  culture: 'en-US' }, },
    { title: 'Closing Balance', data: 'closing_balance',  type: 'numeric', numericFormat: { pattern: '0,0.00',  culture: 'en-US' }, },
  ];

  hotSettings: Handsontable.GridSettings = {
    colHeaders: true,
    columnSorting: true,
    manualRowMove: true,
    autoColumnSize: true,
    dropdownMenu: true,
    stretchH: "all",
    type: 'numeric',
    formulas: {
      engine: HyperFormula,
      sheetName: 'Sheet1',
    },

    columns: this.columnData,
    colWidths: [40, 40, 150, 100,100,100, 100],

    contextMenu: {
      items: {
        'row_above': {
          name: 'Insert row above this one (custom name)'
        },
        'row_below': {},
        'separator': ContextMenu.SEPARATOR,
        'clear_custom': {
          name: 'Clear all cells (custom)',
          callback: function() {
            this.clear();
          }
        }
      }
    },
    columnSummary: [
      {
        type: 'sum',
        destinationRow: -1,
        destinationColumn: 0,
      }
    ],
    height: 'auto',
    autoWrapRow: true,
    autoWrapCol: true,
    licenseKey: 'non-commercial-and-evaluation'
  };

  // afterSelection(changes: any, source: any) {
  //   if (source !== 'loadData') {
  //     this.selectedRows = this.store.gl().filter((row, index) => {
  //       return changes.some((change: any) => {
  //         return change[0] === index;
  //       });
  //     });
  //     console.log('Selected rows:', this.selectedRows);
  //   }
  // }

}


