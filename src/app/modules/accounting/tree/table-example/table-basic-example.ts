import { Component,ElementRef, ViewChild } from '@angular/core';
import { Sort } from '@angular/material';
import {Observable} from 'rxjs';

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'table-basic-example',
  styleUrls: ['table-basic-example.css'],
  templateUrl: 'table-basic-example.html',
  standalone: true,
  imports: []
})
export class TableBasicExample {
  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  @ViewChild('filter') filter: ElementRef;


  ngOnInit() {
    // Observable for the filter
    //console.log(`Value ${this.filter.nativeElement.value}`);
    // Observable.fromEvent(this.filter.nativeElement, 'keyup')
    //     .debounceTime(150)
    //     .distinctUntilChanged()
    //     .subscribe(() => {
    //       if (!this.dataSource) { return; }
    //       this.dataSource.filter = this.filter.nativeElement.value;
    //     });

  
  }

  onRowClick($event) {
    console.log(`${JSON.stringify($event)} - Row Click Event from Demo`);
  }

  onCellClick($event) {
    console.log(`${$event} - Cell Click Event from Demo`);
    if($event === 'Hydrogen')
    {
      alert('Maaz');
    }
  }

  // sortedData;

  // constructor() {
  //   this.sortedData = this.dataSource.slice();
  // }

  // sortData(sort: Sort) {
  //   const data = this.dataSource.slice();
  //   if (!sort.active || sort.direction == '') {
  //     this.sortedData = data;
  //     return;
  //   }

  //   this.sortedData = data.sort((a, b) => {
  //     let isAsc = sort.direction == 'asc';
  //     switch (sort.active) {
  //       case 'position': return compare(a.position, b.position, isAsc);
  //       case 'name': return compare(+a.name, +b.name, isAsc);
  //       case 'weight': return compare(+a.weight, +b.weight, isAsc);
  //       case 'symbol': return compare(+a.symbol, +b.symbol, isAsc);
  //       default: return 0;
  //     }
  //   });
  // }

}
// function compare(a, b, isAsc) {
//   return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
// }


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];


/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */