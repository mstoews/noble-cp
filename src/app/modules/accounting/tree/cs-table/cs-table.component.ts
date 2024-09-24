import { Component, Input, AfterViewInit, ViewChild, OnInit, OnChanges, Output, EventEmitter, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { NgModel } from '@angular/forms';

/**
 * @title Basic CDK data-table
 */
@Component({
  selector: 'cs-table',
  styleUrls: ['./cs-table.component.css'],
  templateUrl: './cs-table.component.html',
})
export class CsTableComponent implements AfterViewInit {

  @Input() columnNames: string[];
  @Input() rowData: object[];
  @Input() enableTableFilter?: boolean;
  @Input() filterPlaceholder?: string;

  @Output() rowClickEvent = new EventEmitter();

  @Output() sqCellClick = new EventEmitter();

  public dataSource: MatTableDataSource<{}>;

  @ViewChild('filter') filter: ElementRef;

  ngAfterViewInit() {
    this.dataSource.data = this.rowData;
    console.log('1');
    console.log(this.dataSource.data);
  }

  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.rowData);
  }
  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.rowData);

    //console.log(`Value ${this.filter.nativeElement.value}`);

    // Observable.fromEvent(this.filter.nativeElement, 'keyup')
    //     .debounceTime(150)
    //     .distinctUntilChanged()
    //     .subscribe(() => {
    //       if (!this.dataSource) { return; }
    //       this.dataSource.filter = this.filter.nativeElement.value;
    //     });
  }

  onFilterSearch(value) {
    console.log(value);
    if (!this.dataSource) {
      console.log(value);
      return;
    }
    this.dataSource.filter = this.filter.nativeElement.value;
  }


  filterByString(dataSource, searchValue) {
    console.log(`searchValue ${searchValue}`);
    if (!this.dataSource) { return; }
    this.dataSource.filter = this.filter.nativeElement.value;
  }

  rowClick($event) {
      this.rowClickEvent.emit($event);
  }
  
  maaz:any;
  onMatCellClick(cellValue) {
    // console.log(cellValue);
    this.maaz = cellValue;
    this.sqCellClick.emit(cellValue);
    // console.log(`${this.maaz} - Maaz`);
  }

}

