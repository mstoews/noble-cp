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
import {JournalStore} from "../../../services/journal.store";
import {registerAllModules} from "handsontable/registry";
import { ContextMenu } from 'handsontable/plugins/contextMenu';
import {GridMenubarStandaloneComponent} from "../../accounting/grid-menubar/grid-menubar.component";

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
  selector: 'handson-table',
  providers: [JournalStore],
  imports: [imports, GridMenubarStandaloneComponent],
  template: `
    <grid-menubar [inTitle]="'Transaction Listing'"></grid-menubar>
    <mat-card class="w-[100%] mt-2">
      <hot-table 
        class="m-1"
        [data]="store.gl()"
        [settings]="hotSettings">
      </hot-table>
    </mat-card>
  `,
})

export class HandsonComponent  implements OnInit {
   store = inject(JournalStore);
   ngOnInit() {}

  selectedRows: any[] = [];

columnData =  [
{ title: 'Journal ID', data: 'journal_id', className: 'htMiddle' ,  type: 'numeric',   numericFormat: { pattern: '0,0',  culture: 'en-US' }, },
{ title: 'Description', data: 'description', type: 'text' },
{ title: 'Booked', data: 'booked', type: 'checkbox' },
{ title: 'Create Date', data: 'create_date', type: 'date' },
{ title: 'User', data: 'create_user', type: 'text' },
{ title: 'Year', data: 'period_year', type: 'text' },
{ title: 'Period', data: 'period', type: 'text' },
{ title: 'Transaction Date', data: 'transaction_date', type: 'text' },
{ title: 'Amount', data: 'amount', type: 'numeric',  numericFormat: { pattern: '0,0',  culture: 'en-US' }, },
{ title: 'Type', data: 'type', type: 'text' },
{ title: 'Party', data: 'party_id', type: 'text' },
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


