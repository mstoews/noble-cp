import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, inject, viewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReplaySubject, Subject, Subscription, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ISubType, SubTypeService } from "app/services/subtype.service";

import { GridMenubarStandaloneComponent } from '../../accounting/grid-menubar/grid-menubar.component';
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
import { GLAccountsService } from 'app/services/accounts.service';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatDrawer } from '@angular/material/sidenav';
import { AUTH } from 'app/app.config';


const imp = [
  CommonModule,
  ReactiveFormsModule,
  MaterialModule,
  ComboBoxModule,
  FormsModule,
  GridModule,
  NgxMaskDirective,
  NgxMatSelectSearchModule,
  GridMenubarStandaloneComponent
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
    templateUrl: './budget-update.component.html',
    providers: [providers],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: ``
})
export class BudgetUpdateComponent implements OnInit, OnDestroy, AfterViewInit {
  public bDirty = false;


  @Output() notifyDrawerClose: EventEmitter<any> = new EventEmitter();
  @Input() public sTitle: string;



  private subtypeService = inject(SubTypeService);
  public subtype$ = this.subtypeService.read();

  private auth = inject(AUTH);

  private fb = inject(FormBuilder);
  
  // Data grid settings

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
  public detailForm!: FormGroup;
  public filteredDebitAccounts: ReplaySubject<IDropDownAccounts[]> = new ReplaySubject<IDropDownAccounts[]>(1);


  public value = 0;
  public loading = false;
  public height: string = '250px';
  private fuseConfirmationService = inject(FuseConfirmationService);
  public accountsListSubject: Subscription;
  public detailsSubject: Subscription;


  // drop down searchable list
  public accountList: IDropDownAccounts[] = [];
  public accountCtrl: FormControl<IDropDownAccounts> = new FormControl<IDropDownAccounts>(null);
  public accountFilterCtrl: FormControl<string> = new FormControl<string>('');

  public store = inject(BudgetStore);

  public debitAccounts: IDropDownAccounts[] = [];
  public debitCtrl: FormControl<IDropDownAccounts> = new FormControl<IDropDownAccounts>(null);
  public debitAccountFilterCtrl: FormControl<string> = new FormControl<string>(null);
  public accountService = inject(GLAccountsService);
  protected _onDestroyDebitAccountFilter = new Subject<void>();


  @ViewChild('singleSelect', { static: true })
  singleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();
  public drawer = viewChild<MatDrawer>("drawer");

  ngOnInit(): void {

    this.createEmptyForm();

    this.accountService
      .readChildren()
      .pipe(takeUntil(this._onDestroy))
      .subscribe((accounts) => {
        this.debitAccounts = accounts;
        this.filteredDebitAccounts.next(this.debitAccounts.slice());
      });

    this.debitAccountFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroyDebitAccountFilter))
      .subscribe(() => {
        this.filterDebitAccounts();
      });


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


  ngAfterViewInit() {
    this.initialDatagrid();
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
    this.debitCtrl.setValue(
      this.debitAccounts.find((x) => x.child === accountString)
    );

    this.detailForm = this.fb.group({
      debitAccountFilterCtrl: [data.child.toString(), Validators.required],
      description: [data.description, Validators.required],
      reference: [data.reference, Validators.required],
      amount: [data.amount, Validators.required],
    });

    this.openDrawer();

    // this.createForm(BudgetDetail);
    // this.onChanges();
  }

  private createForm(budget: IBudget) {
    const accountString = budget.child.toString();
    this.debitCtrl.setValue(
      this.debitAccounts.find((x) => x.child === accountString)
    );

    this.detailForm = this.fb.group({
      debitAccountFilterCtrl: [budget.child.toString(), Validators.required],
      description: [budget.description, Validators.required],
      reference: [budget.reference, Validators.required],
      amount: [budget.amount, Validators.required],
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

  updateForm(row: any) {
    this.detailForm.reset();
    this.detailForm = this.fb.group({
      debitAccountFilterCtrl: [''],
      description: [''],
      reference: [''],
      amount: [''],
    });
  }

  createEmptyForm() {
    this.detailForm = this.fb.group({
      debitAccountFilterCtrl: [''],
      description: [''],
      reference: [''],
      amount: [''],
    });
  }

  closeDrawer() {
    this.drawer().close();
  }


  onCreate() { }

  loadContent() {
    this.loading = true;
  }

  changeFund($event: any) { }

  changeChildAccount($event: any) { }

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
