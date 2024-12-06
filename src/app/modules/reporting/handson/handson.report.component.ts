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
    selector: 'handson-fs-report',
    providers: [JournalStore],
    imports: [imports, GridMenubarStandaloneComponent],
    template: `
    <grid-menubar [inTitle]="'Transaction Listing'"></grid-menubar>
    <mat-card class="w-[100%] mt-2">
      <hot-table 
        class="m-1"
        [data]="dataset"
        [settings]="hotSettings">
      </hot-table>
    </mat-card>
  `,
    styleUrls: ['./data.scss']
})

export class HandsonFSReportComponent  implements OnInit {
   store = inject(JournalStore);
   ngOnInit() {}

  selectedRows: any[] = [];

  dataset: any[] = [
    {id: 0, name: 'Financial Statement', address: '', amount: '', debit: ''},
    {id: 0, name: 'Income Statement', address: '', amount: '', debit: ''},
    {id: 0, name: '', address: '', amount: 'Amount', debit: 'debit', credit: 'Credit'},
    {id: 1, name: '', description: 'Interest', amount: 1000, debit: 2000.25, credit: 0},
    {id: 1, name: '', description: 'Water', amount: 2000, debit: 2000.45, credit: 0},
    {id: 1, name: '', description: 'Electricity', amount: 4000, debit: 2000},
    {id: 1, name: '', description: 'Maintenance', amount: 5000, debit: 2000},
    {id: 1, name: '', description: 'Cleaning', amount: 600, debit: 2000},
    {id: 1, name: '', description: 'Heating', amount: 10.15, debit: 2000},
    {id: 1, name: '', description: 'Subtotal', amount: '=sum(C3:C8)', debit:'=sum(D3:D8)'}
  ];

columnData =  [
{  data: 'name', className: 'htMiddle' ,  type: 'numeric',   numericFormat: { pattern: '0,0.00',  culture: 'en-US' }, },
{  data: 'description', className: 'htMiddle' ,  type: 'numeric',   numericFormat: { pattern: '0,0.00',  culture: 'en-US' }, },
{  data: 'amount', className: 'htMiddle' ,  type: 'numeric',   numericFormat: { pattern: '0,0.00',  culture: 'en-US' }, },
{  data: 'debit', className: 'htMiddle' ,  type: 'numeric',   numericFormat: { pattern: '0,0.00',  culture: 'en-US' }, },
{  data: 'difference', className: 'htMiddle' ,  type: 'numeric',   numericFormat: { pattern: '0,0.00',  culture: 'en-US' }, },
];

  hotSettings: Handsontable.GridSettings = {
    colHeaders: false,
    rowHeaders: false,
    columnSorting: false,
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
    colWidths: [100, 80, 80, 80, 80],
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


