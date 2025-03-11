import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, inject, viewChild, input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, ReplaySubject, Subject, Subscription, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SubTypeService } from "app/services/subtype.service";

import { GridMenubarStandaloneComponent } from '../../accounting/grid-components/grid-menubar.component';
import { MaterialModule } from 'app/services/material.module';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ComboBoxModule } from '@syncfusion/ej2-angular-dropdowns';
import { MatSelect } from '@angular/material/select';
import { IBudget, IDropDownAccounts } from 'app/models';

import { BudgetStore } from 'app/services/budget.store';

import {
  EditService,
  GroupService,
  FilterService,
  GridModule,
  PageService,
  SortService,
  ToolbarService,
  AggregateService,
  FilterSettingsModel,
  ToolbarItems,
  ColumnMenuService,
  ResizeService,
  ExcelExportService,
  SaveEventArgs
} from '@syncfusion/ej2-angular-grids';
import { AccountsService } from 'app/services/accounts.service';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatDrawer } from '@angular/material/sidenav';
import { AUTH } from 'app/app.config';
import { DropDownAccountComponent } from "../../accounting/grid-components/drop-down-account.component";
import { Store } from '@ngrx/store';
import { accountsFeature } from 'app/features/accounting/static/accts/Accts.state';
import { ToastrService } from 'ngx-toastr';
import { accountPageActions } from 'app/features/accounting/static/accts/Accts-page.actions';


const imp = [
  CommonModule,
  ReactiveFormsModule,
  MaterialModule,
  ComboBoxModule,
  FormsModule,
  GridModule,
  NgxMaskDirective,
  NgxMatSelectSearchModule,
  GridMenubarStandaloneComponent,
  DropDownAccountComponent
];

const providers = [
  provideNgxMask(),
  BudgetStore,
  SortService,
  ToolbarService,
  SortService,
  FilterService,
  ToolbarService,
  EditService,
  AggregateService,
  GroupService,
  ExcelExportService,
  PageService,
  ResizeService,
  FilterService,
  ToolbarService,
  EditService,
  AggregateService,
  ColumnMenuService];

@Component({
  selector: 'budget-update',
  imports: [imp],
  template: `
    <mat-drawer class="w-full md:w-[400px]" #drawer [opened]="false" mode="over" [position]="'end'"  [disableClose]="true">

            <mat-card class="">
                <form [formGroup]="detailForm">
                    <div class="flex flex-col w-full filter-article filter-interactive text-gray-700 rounded-lg">
                        <div class="text-3xl gap-2 m-1 text-gray-100 p-2 bg-slate-600 rounded-md" mat-dialog-title>
                            {{ "Budget Update" }}
                        </div>
                    </div>
                    <section class="flex flex-col gap-1">
                     
                      <!-- Drop down accounts list -->
                      @if ((isLoading$ | async) === false) {
                            @if (accounts$ | async; as accounts ) {
                              <account-drop-down [dropdownList]="accounts" controlKey="account" label="Account" #accountDropDown></account-drop-down>
                            }
                      }

                      
                        <mat-form-field class="flex-col ml-2 mr-2 mt-1 grow">
                            <mat-label class="text-md ml-2">Description</mat-label>
                            <input matInput placeholder="Description" formControlName="description"
                                [placeholder]="'Description'" />
                            <mat-icon class="icon-size-5 text-green-700" matPrefix
                                [svgIcon]="'heroicons_solid:calculator'"></mat-icon>
                        </mat-form-field>

                        <!-- Reference  -->
                        
                        <mat-form-field class="flex-col grow mr-2 ml-2 mt-1">
                            <mat-label class="text-md ml-2">Reference</mat-label>
                            <input matInput placeholder="Reference" formControlName="reference"
                                [placeholder]="'Reference'" />
                            <mat-icon class="icon-size-5 text-green-700" matPrefix
                                [svgIcon]="'heroicons_solid:document'"></mat-icon>
                        </mat-form-field>

                        

                        <!-- Budget Amount  -->

                        <mat-form-field class="ml-2 mt-1 grow">
                            <mat-label class="text-md ml-2">Budget Amount</mat-label>
                            <input type="text" mask="separator.2" [leadZero]="true" thousandSeparator=","
                                class="text-right" matInput [placeholder]="'Budger Amount'" formControlName="amount" />
                            <mat-icon class="icon-size-5 text-green-700" matPrefix
                                [svgIcon]="'heroicons_solid:currency-dollar'"></mat-icon>
                        </mat-form-field>

                        

                    </section>
                </form>
                <div mat-dialog-actions class="gap-2 mb-3 mt-5">
                    @if (bDirty === true) {
                    <button mat-icon-button color="warm"
                        class="bg-gray-200 fill-slate-100 text-white hover:bg-slate-400 ml-1" (click)="onBudgetDetail()"
                        matTooltip="Update Transaction" aria-label="hover over">
                        <mat-icon [svgIcon]="'feather:save'"></mat-icon>
                    </button>
                    }

                    <button mat-icon-button color="warm"
                        class="bg-gray-200 fill-slate-100 text-white hover:bg-slate-400 ml-1" (click)="onDeleteDetail()"
                        matTooltip="Delete" aria-label="hover over">
                        <mat-icon [svgIcon]="'feather:trash'"></mat-icon>
                    </button>


                    <button mat-icon-button color="warn"
                        class="bg-gray-200 fill-slate-100 text-white hover:bg-slate-400 ml-1" (click)="closeDrawer()"
                        matTooltip="Cancel" aria-label="hovered over">
                        <mat-icon [svgIcon]="'mat_outline:close'"></mat-icon>
                    </button>

                </div>
            </mat-card>
    </mat-drawer>
    <div class="flex flex-col w-full filter-article filter-interactive text-gray-700">
      <grid-menubar class="pl-1 pr-1 mb-2" [inTitle]="'Budget Details'" 
          (notifyParentRefresh)="onRefresh()"
          (notifyParentAdd)="onAdd()" 
          (notifyParentDelete)="onDeleteSelection()"
          (notifyParentUpdate)="onUpdateSelection()">
      </grid-menubar>

      <mat-drawer-container class=" control-section default-splitter flex flex-col overflow-auto h-[calc(100vh-14rem)]"
          [hasBackdrop]="'false'">

          
          @defer {
          <div class="flex flex-col h-full ml-1 mr-1 text-gray-800 ">

              <ejs-grid #grid id='grid' class="h-[calc(100vh-15rem)]" [dataSource]='store.budgetAmt()' [rowHeight]='30' 
                  showColumnMenu='true' allowEditing='false' (actionBegin)="actionBegin($event)" [gridLines]="'Both'"
                  [allowFiltering]='true' [allowGrouping]='true' [toolbar]='toolbarOptions'
                  [filterSettings]='filterSettings' [editSettings]='editSettings' keyExpr="child"
                  (toolbarClick)='toolbarClick($event)'>
                  <e-columns>
                      <e-column headerText="Period" field="period_year" width="100"></e-column>
                      <e-column headerText="Account" field="child" isPrimaryKey="true" width="130"></e-column>
                      <e-column headerText="Description" field="description" width="250"></e-column>
                      <e-column headerText="Reference" field="reference" width="200"></e-column>
                      <e-column headerText="Amount" field="amount" format='N2' textAlign="Right" width="120"></e-column>
                      <e-column headerText="Update Date" field="update_date" width="120"></e-column>
                      <e-column headerText="Update User" field="update_user" width="120"></e-column>
                  </e-columns>

                  <e-aggregates>
                      <e-aggregate>
                          <e-columns>
                              <e-column type="Sum" field="amount" format="N2">
                                  <ng-template #footerTemplate let-data>{{data.Sum}}</ng-template>
                              </e-column>

                          </e-columns>
                      </e-aggregate>
                  </e-aggregates>
              </ejs-grid>
          </div>
          } @placeholder(minimum 1000ms) {
          <div class="flex justify-center items-center">
              <mat-spinner></mat-spinner>
          </div>
          }
      </mat-drawer-container>
    </div>

  `,
  providers: [providers],
  styles: ``
})
export class BudgetUpdateComponent implements OnInit, OnDestroy, AfterViewInit {
  public bDirty = false;

  accountDropDown = viewChild<DropDownAccountComponent>("accountDropDown");


  @Output() notifyDrawerClose: EventEmitter<any> = new EventEmitter();
  public readonly sTitle = input<string>(undefined);

  private subtypeService = inject(SubTypeService);
  private fuseConfirmationService = inject(FuseConfirmationService);

  public subtype$ = this.subtypeService.read();
  private auth = inject(AUTH);

  detailForm = new FormGroup({
    description: new FormControl(''),
    reference: new FormControl(''),
    amount: new FormControl(0.0),
    account: new FormGroup({
      dropdown: new FormControl('')
    }),
  });


  public editSettings: Object;
  public editArtifactSettings: Object;
  public filterSettings: Object;
  public toolbar: string[];
  public orderidrules: Object;
  public editparams: Object;
  public formatoptions: Object;
  public selectionOptions: Object;
  public searchOptions: Object;
  public selIndex?: number[] = [];
  public pageSettings: Object;
  public initialSort: Object;
  public filterOptions: FilterSettingsModel;
  public submitClicked: boolean = false;
  public toolbarOptions?: ToolbarItems[];

  public filteredDebitAccounts: ReplaySubject<IDropDownAccounts[]> = new ReplaySubject<IDropDownAccounts[]>(1);


  public value = 0;
  public loading = false;
  public height: string = '250px';

  public accountsListSubject: Subscription;
  public detailsSubject: Subscription;

  store = inject(BudgetStore);

  Store = inject(Store);
  accounts$ = this.Store.select(accountsFeature.selectChildren);
  isLoading$ = this.Store.select(accountsFeature.selectIsLoading);
  toast = inject(ToastrService);



  // drop down searchable list

  public accountCtrl: FormControl<IDropDownAccounts> = new FormControl<IDropDownAccounts>(null);
  public accountFilterCtrl: FormControl<string> = new FormControl<string>('');


  public debitAccounts: IDropDownAccounts[] = [];
  public debitCtrl: FormControl<IDropDownAccounts> = new FormControl<IDropDownAccounts>(null);
  public debitAccountFilterCtrl: FormControl<string> = new FormControl<string>(null);
  public accountService = inject(AccountsService);
  protected _onDestroyDebitAccountFilter = new Subject<void>();


  @ViewChild('singleSelect', { static: true })
  singleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();
  public drawer = viewChild<MatDrawer>("drawer");

  // debitAccounts: IDropDownAccounts[] = [
  //   { account : "1000", child: "5020", description: '5020 - Account 1' },
  //   { account : "1000", child: "5030", description: 'Account 2' },
  //   { account : "1000", child: "5040", description: 'Account 3' },
  //   { account : "1000", child: "4", description: 'Account 4' },
  //   { account : "1000", child: "5", description: 'Account 5' },
  //   { account : "1000", child: "6", description: 'Account 6' },
  //   { account : "1000", child: "7", description: 'Account 7' },
  //   { account : "1000", child: "8", description: 'Account 8' },
  //   { account : "1000", child: "9", description: 'Account 9' },
  //   { account : "1000", child: "10", description: 'Account 10' },
  // ]

  ngOnInit(): void {
    this.Store.dispatch(accountPageActions.children());
  }

  ngAfterViewInit() {
    this.initialDatagrid();

    // const gl$ = this.accounts$.pipe(map( acct => {
    //   const data = acct.map((accts) => ({
    //   account: accts.account.toString(),
    //   child: accts.child.toString(),
    //   description: accts.description
    //  })); 
    //  return data;
    // }));

    //   $.subscribe((data) => {
    //    this.debitAccounts = data
    //    this.filteredDebitAccounts.next(this.debitAccounts.slice());
    //  });


    // this.accountService
    //   .readChildren()
    //   .pipe(takeUntil(this._onDestroy))
    //   .subscribe((accounts) => {
    //     this.debitAccounts = accounts;
    //     this.filteredDebitAccounts.next(this.debitAccounts.slice());
    // });

    //   this.debitAccountFilterCtrl.valueChanges
    //   .pipe(takeUntil(this._onDestroyDebitAccountFilter))
    //   .subscribe(() => {
    //     this.filterDebitAccounts();
    //     this.bDirty = true;
    // });

  }


  toolbarClick($event: any) {
    throw new Error('Method not implemented.');
  }

  changeSubtype(e: any) {
    console.debug("Subtype :", e.value);
  }

  protected filterDebitAccounts() {
    if (!this.debitAccounts) {
      return;
    }

    let search = this.debitAccountFilterCtrl.value;
    if (!search) {
      this.filteredDebitAccounts.next(this.debitAccounts.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredDebitAccounts.next(
      this.debitAccounts.filter(
        (account) => account.description.toLowerCase().indexOf(search) > -1
      )
    );
  }

  initialDatagrid() {
    // this.pageSettings = { pageCount: 10 };        
    this.toolbarOptions = ['ExcelExport', 'CsvExport'];
    this.formatoptions = { type: 'dateTime', format: 'M/dd/yyyy' }
    this.selectionOptions = { mode: 'Cell' };
    this.editSettings = { allowEditing: true, allowAdding: false, allowDeleting: false };
    this.searchOptions = { operator: 'contains', ignoreCase: true, ignoreAccent: true };
    this.toolbarOptions = ['Search'];
    this.filterSettings = { type: 'Excel' };
  }



  onFocusedDetailRowChanged(e: any) { }

  onDeleteDetail() {
    throw new Error('Method not implemented.');
  }

  onRefresh() {
    throw new Error('Method not implemented.');
  }

  onAdd() {
    throw new Error('Method not implemented.');
  }

  onDeleteSelection() {
    throw new Error('Method not implemented.');
  }

  onUpdateSelection() {
    throw new Error('Method not implemented.');
  }

  openDrawer() {
    this.bDirty = false;
    this.drawer().open();
  }


  public actionBegin(args: SaveEventArgs): void {
    if (args.requestType === "beginEdit" || args.requestType === "add") {
      args.cancel = true;
      this.OnCardDoubleClick(args.rowData);
      this.openDrawer();
    }
    if (args.requestType === "save") {
      //this.onSaved(args.data);
    }
  }

  public OnCardDoubleClick(data: any): void {

    const email = this.auth.currentUser.email;
    const dDate = new Date();
    var currentDate = dDate.toISOString().split("T")[0];
    data = this.store.budgetAmt().find((x) => x.child === data.child);

    const BudgetDetail = {
      child: data.child,
      period_year: data.period_year,
      sub_type: data.sub_type,
      description: data.description,
      amount: data.amount,
      reference: data.reference,
      create_date: data.create_date,
      create_user: data.create_user,
      update_date: currentDate,
      update_user: email,
    } as IBudget;

    const accountString = data.child.toString();

    this.accountDropDown().setDropdownValue(accountString);

    this.debitCtrl.setValue(accountString);

    this.detailForm.patchValue({
      reference: BudgetDetail.reference,
      description: BudgetDetail.description,
      amount: BudgetDetail.amount,

    });

    this.openDrawer();

  }

  public onChanges(): void {
    this.detailForm.valueChanges.subscribe((dirty) => {
      if (this.detailForm.dirty) {
        this.bDirty = true;
      }
    });
    this.debitCtrl.valueChanges.subscribe((value) => {
      this.bDirty = true;
    });
  }

  closeDrawer() {
    this.drawer().close();
  }

  formatNumber(e: any) {
    const options = {
      style: 'decimal',  // Other options: 'currency', 'percent', etc.
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };
    if (e.value === null)
      e.value = 0.0;
    const formattedWithOptions = e.value.toLocaleString('en-US', options);
    return formattedWithOptions;
  }

  ngOnDestroy(): void { }
}
