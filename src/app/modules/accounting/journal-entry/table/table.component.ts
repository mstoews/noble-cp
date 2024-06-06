import {AfterContentInit, AfterViewInit, Component, OnDestroy, ViewChild, inject} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MaterialModule } from 'app/services/material.module';
import { MatPaginator } from '@angular/material/paginator';
import { SubTypeService } from 'app/services/subtype.service';
import { CommonModule } from '@angular/common';
import { GLAccountsService } from 'app/services/accounts.service';
import { FormControl } from '@angular/forms';
import { IDropDownAccounts } from 'app/models';
import { ReplaySubject, Subject, Subscription, takeUntil } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'noble-table',
  standalone: true,
  imports: [MaterialModule, CommonModule, NgxMatSelectSearchModule],
  templateUrl: './table.component.html',
  styles: `.example-container {
    position: relative;
  }  
  .example-table-container {
    position: relative;
    min-height: 200px;
    max-height: 400px;
    overflow: auto;
  }
  
  table {
    width: 100%;
  }
  
  .example-loading-shade {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 56px;
    right: 0;
    background: rgba(0, 0, 0, 0.15);
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .example-rate-limit-reached {
    max-width: 360px;
    text-align: center;
  }
  
  /* Column Widths */
  .mat-column-number,
  .mat-column-state {
    max-width: 64px;
  }
  
  .mat-column-created {
    max-width: 124px;
  }`
})
export class TableGridComponent implements AfterViewInit, OnDestroy{

  private subtypeService = inject(SubTypeService);
  private accountService = inject(GLAccountsService);
  public accountList: IDropDownAccounts[] = [];
  public accountCtrl: FormControl<IDropDownAccounts> = new FormControl<IDropDownAccounts>(null);
  public accountFilterCtrl: FormControl<string> = new FormControl<string>('');
  public filteredAccounts: ReplaySubject<IDropDownAccounts[]> = new ReplaySubject<IDropDownAccounts[]>(1);

  @ViewChild('singleSelect', { static: true }) 
  singleSelect: MatSelect;

  
  displayedColumns: string[] = [
    "position",
    "name",
    "weight",
    "symbol",
    "sub_type",
    "account"
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  public accountsListSubject: Subscription;
  protected _onDestroy = new Subject<void>();
  
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  subtype$ = this.subtypeService.read();
  dropDownChildren$ = this.accountService.readChildren()
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.accountsListSubject = this.dropDownChildren$.subscribe(accounts => {
      accounts.forEach(acct =>{          
        var list = {            
          account: acct.account,
          child: acct.child,
          description: acct.description
        }
        this.accountList.push(list)
      })        
      this.filteredAccounts.next(this.accountList.slice());
      console.debug('Length of array: ',this.accountList.length)
   });
   this.accountFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterAccounts();
    });
  }

  protected filterAccounts() {
    if (!this.accountList) {
      return;
    }
    // get the search keyword
    let search = this.accountFilterCtrl.value;
    if (!search) {
      this.filteredAccounts.next(this.accountList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredAccounts.next(
      this.accountList.filter(account => account.description.toLowerCase().indexOf(search) > -1)      
    );
  }
  
  changeSubtype(e: any) {
    console.log(e);

  }

  toppingList: string[] = [
    "Extra cheese",
    "Mushroom",
    "Onion",
    "Pepperoni",
    "Sausage",
    "Tomato"
  ];

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  someMethod(value: any, element: any) {
    console.log("selected value", value);
    console.log("selected element", element);
    element.symbol = value;
  }

  ngOnDestroy() {
    if (this.accountsListSubject) {
      this.accountsListSubject.unsubscribe();
    }  
  }
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

