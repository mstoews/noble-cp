import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DndComponent } from 'app/modules/drag-n-drop/loaddnd/dnd.component';
import { GridMenubarStandaloneComponent } from '../../accounting/grid-menubar/grid-menubar.component';
import { MaterialModule } from 'app/services/material.module';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ComboBoxModule } from '@syncfusion/ej2-angular-dropdowns';
import { FileManagerComponent } from 'app/modules/file-manager/file-manager.component';

import { MatSelect } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { IDropDownAccounts } from 'app/models';

import { BudgetStore } from 'app/services/budget.store';

import { DialogEditEventArgs, 
  EditService, 
  SelectionSettingsModel, 
  GroupService, 
  FilterService, 
  GridModule, 
  PageService, 
  SaveEventArgs, 
  SortService, 
  ToolbarService, 
  GridComponent, 
  AggregateService, 
  FilterSettingsModel, 
  ToolbarItems, 
  SearchSettingsModel, 
  ColumnMenuService, 
  ResizeService, 
  PdfExportService, 
  ExcelExportService, 
  ReorderService, 
  DetailRowService} from '@syncfusion/ej2-angular-grids';



const imports = [
  CommonModule,
  ReactiveFormsModule,
  MaterialModule,
  ComboBoxModule,
  FormsModule,
  DndComponent,
  GridModule,
  GridMenubarStandaloneComponent,
  NgxMaskDirective,
  NgxMaskPipe,
  FileManagerComponent,
  NgxMatSelectSearchModule
];

@Component({
  selector: 'budget-update',
  standalone: true,
  imports: [imports],
  templateUrl: './budget-update.component.html',
  providers: [
    provideNgxMask(), 
    BudgetStore, 
    SortService, 
    ToolbarService, 
    SortService,
    FilterService,
    ToolbarService,
    EditService,
    AggregateService,
    GroupService, ExcelExportService ,PageService, ResizeService, FilterService, ToolbarService, EditService, AggregateService, ColumnMenuService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: ``,
})
export class BudgetUpdateComponent implements OnInit, OnDestroy, AfterViewInit {
toolbarClick($event: any) {
throw new Error('Method not implemented.');
}

  @Output() notifyDrawerClose: EventEmitter<any> = new EventEmitter();
  @Input() public sTitle: string;
 
  private fb = inject(FormBuilder);
  public budgetForm!: FormGroup;

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
  public filteredAccounts: ReplaySubject<IDropDownAccounts[]> = new ReplaySubject<IDropDownAccounts[]>(1);
  public store = inject(BudgetStore);

  @ViewChild('singleSelect', { static: true })
  singleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();

  ngOnInit(): void {

  }

  
  initialDatagrid() {
    // this.pageSettings = { pageCount: 10 };        
    this.toolbarOptions = ['ExcelExport', 'CsvExport'];
    this.formatoptions = { type: 'dateTime', format: 'M/dd/yyyy' }        
    this.selectionOptions = { mode: 'Cell' };              
    this.editSettings = { allowEditing: true, allowAdding: false, allowDeleting: false };
    this.searchOptions = { operator: 'contains', ignoreCase: true, ignoreAccent:true };
    this.toolbarOptions = ['Search'];   
    this.filterSettings = { type: 'Excel' };    
}


  ngAfterViewInit() {
    this.initialDatagrid();
  }

  onFocusedDetailRowChanged(e: any) {  }

  
  updateForm(row: any) {
    this.budgetForm.reset();

    this.budgetForm = this.fb.group({
      child       : [row.child, Validators.required],
      period_year : [row.period_year, Validators.required],
      sub_type    : [row.sub_type, Validators.required],
      description : [row.description, Validators.required],
      amount      : [row.amount, Validators.required],
      reference   : [row.reference, Validators.required],
      create_date : [row.create_date, Validators.required],
      create_user : [row.create_user, Validators.required],
      update_date : [row.update_date, Validators.required],
      update_user : [row.update_user, Validators.required],
    });

  }

  updateDetailList() { }

  public refresh(journal_id: number, description: string, transaction_date: string, amount: string) { }

  createEmptyForm() { 
    this.budgetForm = this.fb.group({
      child       : ['', Validators.required],
      period_year : ['', Validators.required],
      sub_type    : ['', Validators.required],
      description : ['', Validators.required],
      amount      : ['', Validators.required],
      reference   : ['', Validators.required],
      create_date : ['', Validators.required],
      create_user : ['', Validators.required],
      update_date : ['', Validators.required],
      update_user : ['', Validators.required],
    });
  }

  closeDrawer() { }

  onCreate() {  }

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
