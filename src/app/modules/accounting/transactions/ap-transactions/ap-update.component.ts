import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, inject, viewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { JournalService } from "app/services/journal.service";
import { Observable, ReplaySubject, Subject, Subscription, interval, map, startWith, take, takeUntil } from "rxjs";
import { CommonModule } from "@angular/common";
import { DndComponent } from "app/modules/drag-n-drop/loaddnd/dnd.component";
import { FundsService } from "app/services/funds.service";
import { GLAccountsService } from "app/services/accounts.service";
import { GridMenubarStandaloneComponent } from "../../grid-menubar/grid-menubar.component";
import { MaterialModule } from "app/services/material.module";
import { ISubType, SubTypeService } from "app/services/subtype.service";
import { TypeService } from "app/services/type.service";
import { JournalEditComponent } from "../journal-update/journal-edit.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from "ngx-mask";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DropDownListAllModule } from "@syncfusion/ej2-angular-dropdowns";
import { FileManagerComponent } from "app/modules/file-manager/file-manager.component";
import { AUTH } from "app/app.config";
import { MatSelect } from "@angular/material/select";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { IDropDownAccounts, IDropDownAccountsGridList, IFunds } from "app/models";

import { ContextMenuComponent, MenuEventArgs, MenuItemModel, ContextMenuModule } from "@syncfusion/ej2-angular-navigations";
import {
  AggregateService, EditService, EditSettingsModel, FilterService, FilterSettingsModel, GridModule, IEditCell, PageService,
  RowDDService,
  SaveEventArgs,
  RowDragEventArgs,
  SelectionSettingsModel, SortService, ToolbarService,
  GridComponent,
  DialogEditEventArgs,
} from "@syncfusion/ej2-angular-grids";

import { DataManager, Query } from "@syncfusion/ej2-data";
import { IJournalDetail, IJournalDetailDelete, IJournalHeader, IJournalHeaderUpdate } from "app/models/journals";
import { ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { MatDrawer } from "@angular/material/sidenav";

const imports = [
  CommonModule,
  ReactiveFormsModule,
  MaterialModule,
  FormsModule,
  DndComponent,
  GridMenubarStandaloneComponent,
  JournalEditComponent,
  NgxMaskDirective,
  NgxMaskPipe,
  FileManagerComponent,
  NgxMatSelectSearchModule,
  ContextMenuModule,
  GridModule,
  DropDownListAllModule,
];

@Component({
  selector: "ap-journal",
  standalone: true,
  imports: [imports],
  templateUrl: "./ap-update.component.html",
  providers: [
    provideNgxMask(),
    SortService,
    PageService,
    FilterService,
    ToolbarService,
    EditService,
    AggregateService,
    RowDDService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class APUpdateComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Output() notifyDrawerClose: EventEmitter<any> = new EventEmitter();

  public accountParams?: IEditCell;
  public subtypeParams?: IEditCell;
  public fundsParams?: IEditCell;

  public fields: Object = { text: "description", value: "child" };

  @ViewChild("contextmenu")
  private _change = inject(ChangeDetectorRef);
  private _fuseConfirmationService = inject(FuseConfirmationService);
  private _location = inject(Location);

  public contextmenu: ContextMenuComponent;

  private fb = inject(FormBuilder);
  private journalService = inject(JournalService);
  private typeService = inject(TypeService);
  private subtypeService = inject(SubTypeService);
  private fundService = inject(FundsService);
  private accountService = inject(GLAccountsService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private auth = inject(AUTH);
  private activatedRoute = inject(ActivatedRoute)

  
  public journalForm!: FormGroup;
  public detailForm!: FormGroup;
  public matDialog = inject(MatDialog);

  public value = 0;
  public loading = false;
  public height: string = "250px";

  public funds$ = this.fundService.read();
  public subtype$ = this.subtypeService.read();
  public accounts$ = this.accountService.readChildren();
  public dropDownChildren$ = this.accountService.readChildren();

  private fuseConfirmationService = inject(FuseConfirmationService);

  public types$ = this.typeService.read();
  public subtypes$ = this.subtypeService.read();
  public currentRowData: any;
  public journalHeaderData: any;
  public journal_subid: any;
  public editing = false;
  public child = new FormControl("");
  public myControl = new FormControl("");
  public accountOptions: Observable<string[]>;
  public bDirty = false;
  
  public accountsListSubject: Subscription;
  public fundListSubject: Subscription;
  public selectionOptions?: SelectionSettingsModel;
  public filterOptions?: FilterSettingsModel;
  public editSettings: Object;
  public filterSettings: Object;
  public toolbar: string[];
  public orderidrules: Object;
  public editparams: Object;
  public pageSettings: Object;
  public formatoptions: Object;
  journal_id: number;
  
  description: string;
  transaction_date: string;
  amount: number;
  journalType: string;

  // drop down searchable list
  public accountList: IDropDownAccounts[] = [];
  public subtypeList: ISubType[] = [];
  public fundList: IFunds[] = [];

  public accountCtrl: FormControl<IDropDownAccounts> = new FormControl<IDropDownAccounts>(null);
  public accountFilterCtrl: FormControl<string> = new FormControl<string>("");
  public filteredAccounts: ReplaySubject<IDropDownAccounts[]> = new ReplaySubject<IDropDownAccounts[]>(1);

  public data: Object[] = [];
  public selectOptions?: Object;
  public message?: string;

  @ViewChild('grid')
  public grid!: GridComponent;
  public gridControl = viewChild<GridComponent>('grid');
  public selectedItemKeys: any;

  @ViewChild("singleSelect", { static: true })
  singleSelect: MatSelect;

  
  public Accounts: IDropDownAccounts[] = [];

  public accountsGrid: IDropDownAccountsGridList[] = [];
  public dataAccountList = new DataManager(this.accountsGrid);
  public dFields = { text: "child", value: "child" };


  public debitAccounts: IDropDownAccounts[] = [];
  public debitCtrl: FormControl<IDropDownAccounts> = new FormControl<IDropDownAccounts>(null);
  public debitAccountFilterCtrl: FormControl<string> = new FormControl<string>(null);
  public filteredDebitAccounts: ReplaySubject<IDropDownAccounts[]> = new ReplaySubject<IDropDownAccounts[]>(1);

  public creditAccounts: IDropDownAccounts[] = [];
  public creditCtrl: FormControl<IDropDownAccounts> = new FormControl<IDropDownAccounts>(null);
  public creditAccountFilterCtrl: FormControl<string> = new FormControl<string>('');
  public filteredCreditAccounts: ReplaySubject<IDropDownAccounts[]> = new ReplaySubject<IDropDownAccounts[]>(1);


  protected _onCreditDestroy = new Subject<void>();
  protected _onDebitDestroy = new Subject<void>();
  protected _onDestroyDebitAccountFilter = new Subject<void>();
  protected _onDestroyCreditAccountFilter = new Subject<void>();
  protected _onDestroy = new Subject<void>();

  @ViewChild('singleDebitSelect', { static: true }) singleDebitSelect: MatSelect;
  @ViewChild('singleCreditSelect', { static: true }) singleCreditSelect: MatSelect;

  updateForm(row: IJournalHeader) {    
    this.journalForm = this.fb.group({
      description: [row.description, Validators.required],
      amount: [row.amount, Validators.required],
      party: ['Vendor', Validators.required],
      invoice_no: ['123456', Validators.required],
      due_date: ['2024-06-12', Validators.required],
      transaction_date: [row.transaction_date, Validators.required],
    });
  }

  public journalData: IJournalHeader;

  ngOnInit(): void {
    this.createEmptyForm();

    this.activatedRoute.data.subscribe(( data ) => {        
        console.log(data.journal.journal_id);
        this.journalData = {
          journal_id: data.journal.journal_id,         
          description:      data.journal.description,
          booked:           data.journal.booked,
          booked_date:      data.journal.booked_date,
          booked_user:      data.journal.booked_user,
          create_date:      data.journal.create_date,
          create_user:      data.journal.create_user,
          period:           data.journal.period,
          period_year:      data.journal.period_year,
          transaction_date: data.journal.transaction_date,
          status:           data.journal.status,
          type:             data.journal.type,
          sub_type:         data.journal.sub_type,
          amount:           data.journal.amount,
          party_id:        data.journal.party_id 
        }
        // this.updateForm(this.journalData)
    });

    this.refresh(this.journalData.journal_id, this.journalData.description, this.journalData.transaction_date, this.journalData.amount, this.journalData.type);

    this.editSettings = {
      allowEditing: true,
    };

    this.editparams = { params: { popupHeight: "300px" } };
    this.pageSettings = { pageCount: 5 };
    this.filterSettings = { type: "Excel" };
    this.formatoptions = { type: "dateTime", format: "M/d/y hh:mm a" };
    this.selectionOptions = { mode: 'Row', type: 'Single' };

    this.accountsListSubject = this.dropDownChildren$.subscribe((accounts) => {
      accounts.forEach((acct) => {
        var list = {
          childName: Number(acct.child),
          descriptionName: acct.description,
        };
        this.accountsGrid.push(list);
      }); 
    
    this.fundListSubject = this.funds$.subscribe((funds) => {
        funds.forEach((fund) => {
          var list = {
            fund: fund.fund,
            description: fund.description,
          };
          this.fundList.push(list);
        });
      });
    });
    
    this.accountFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAccounts();
      });


      this.accountService.readChildren().pipe(takeUntil(this._onDestroy)).subscribe((accounts) => {
        this.debitAccounts = accounts;
        this.creditAccounts = accounts;
        this.filteredDebitAccounts.next(this.debitAccounts.slice());
        this.filteredCreditAccounts.next(this.creditAccounts.slice());
  
      });
  
      // Vertical stepper form
  
      this.journalService.getLastJournalNo().subscribe(journal_no => {
        this.journal_id = Number(journal_no);
      });
  
      this.debitAccountFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroyDebitAccountFilter))
        .subscribe(() => { this.filterDebitAccounts(); })
  
      this.creditAccountFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroyCreditAccountFilter))
        .subscribe(() => { this.filterCreditAccounts(); });
  
              

  }


  protected filterCreditAccounts() {
    if (!this.creditAccounts) {
      return;
    }
    // get the search keyword
    let search = this.creditAccountFilterCtrl.value;
    if (!search) {
      this.filteredCreditAccounts.next(this.creditAccounts.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredCreditAccounts.next(
      this.creditAccounts.filter(account => account.description.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterDebitAccounts() {
    if (!this.debitAccounts) {
      return;
    }
    // get the search keyword
    let search = this.debitAccountFilterCtrl.value;
    if (!search) {
      this.filteredDebitAccounts.next(this.debitAccounts.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredDebitAccounts.next(
      this.debitAccounts.filter(account => account.description.toLowerCase().indexOf(search) > -1)
    );
  }


  
  public addDisabled(e: any) {

  }
  
  public selIndex?: number[] = [];

  drawer = viewChild<MatDrawer>('drawer')

  openDrawer() {
    if (this.drawer().opened !== true)
        this.drawer().toggle();
  }


  actionBegin(args: SaveEventArgs): void {
    console.debug('args : ', args.requestType);
    var data = args.rowData as IJournalDetail;
    args.cancel = true
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {

      this.detailForm = this.fb.group({        
        child: [data.child, Validators.required],
        description: [data.description, Validators.required],
        fund: [data.fund, Validators.required],
        sub_type: [data.sub_type, Validators.required],
        reference: [data.reference, Validators.required],
        debit: [data.debit, Validators.required],      
        credit: [data.credit, Validators.required],      
      });

      this.openDrawer();

    }
    if (args.requestType === 'save') {

      console.log(`Row to be saved : ${JSON.stringify(args.data)}`);
      this.onSaved(args.data)

    }
  }

  actionComplete(args: DialogEditEventArgs): void {
    console.debug('args : ', args.requestType);
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {

      // Set initail Focus
      if (args.requestType === 'beginEdit') {
        // (args.form.elements.namedItem('CustomerName') as HTMLInputElement).focus();
      } else if (args.requestType === 'add') {
        // (args.form.elements.namedItem('OrderID') as HTMLInputElement).focus();
      }
    }
  }

  rowDragStartHelper(args: RowDragEventArgs): void {
    this.message = `rowDragStartHelper event triggered`;
    //args.cancel = true;
    console.debug(this.message);

  }

  rowDragStart(args: RowDragEventArgs) {
    this.message = `rowDragStart event triggered`;
    console.debug(this.message);
    //args.cancel = true;
  }

  rowDrag(args: RowDragEventArgs): void {
    this.message = `rowDrag event triggered ${JSON.stringify(args.data)}`;
    console.debug(this.message);
    (args.rows as Element[]).forEach((row: Element) => {
      row.classList.add('drag-limit');
    });
  }

  rowDrop(args: RowDragEventArgs): void {
    this.message = `Drop  ${args.originalEvent} ${JSON.stringify(args.data)}`;
    console.debug(this.message);
    const value = [];
    for (let r = 0; r < (args.rows as Element[]).length; r++) {
      value.push((args.fromIndex as number) + r);
    }
    // this.grid.reorderRows(value, (args.dropIndex as number));

    this.gridControl().reorderRows(value, (args.dropIndex as number));
    this.onSaved(args.data[0]);
  }


  // Update only the signal and mark as dirty. When completed update the whole signal.
  onSaved(e: any) {
    this.bDirty = true;
    const updateDate = new Date().toISOString().split("T")[0];
    const email = this.auth.currentUser?.email;


    const journalDetail = {
      journal_id: e.journal_id,
      journal_subid: e.journal_subid,
      account: Number(e.account),
      child: Number(e.child),
      description: e.description,
      create_date: updateDate,
      create_user: email,
      sub_type: e.sub_type,
      debit: e.debit,
      credit: e.credit,
      reference: e.reference,
      fund: e.fund,
    };
    this.journalService.updateJournalDetailSignal(journalDetail);
    if (this.journalService.journalDetailList().length > 0) {
       this.journalService.journalDetailList().forEach((data) => {
        console.log(data);
      });
    }
    console.log("onSaved ", e);
  }


  protected setInitialValue() {
    // this.journalService.getJournalDetail(this.journal_id);
    this.accountParams = {
      params: {
        filterType: "Contains",
        ignoreCase: true,
        allowFiltering: true,
        dataSource: new DataManager(this.accountsGrid),
        fields: { text: "descriptionName", value: "childName" },
        query: new Query(),
        actionComplete: () => false,
      },
    };
  }

  ngAfterViewInit() {
    this.setInitialValue();
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
      this.accountList.filter(
        (account) => account.description.toLowerCase().indexOf(search) > -1
      )
    );
  }

  onFocusedDetailRowChanged(e: any) {
    this.currentRowData = e.row.data;
    this.journal_subid = e.row.data.journal_subid;
    this.journal_id = e.row.data.journal;
    this.editing = true;
  }



  public refresh(
    journal_id: number,
    description: string,
    transaction_date: string,
    amount: number,
    journalType: string
  ) {
    this.description = description;
    this.transaction_date = transaction_date;
    this.amount = amount;
    this.journalService.getJournalDetail(journal_id);
    this.journalType = journalType

    this.journalForm = this.fb.group({
      description: [this.description, Validators.required],
      amount: [this.amount, Validators.required],
      transaction_date: [this.transaction_date, Validators.required],
    });

    if (journal_id === undefined) {
      this.description = "";
      this.transaction_date = "";      
      return;
    } 
  }

  changeSubtype(e: any) {
    console.debug("Subtype :", e.value);
  }

  onCreateTemplate() {
    const confirmation = this.fuseConfirmationService.open({
      title: "Create Template",
      message:
        "Would you like to create a template based upon the current transaction? ",
      actions: {
        confirm: {
          label: "Journal Template",
        },
      },
    });

    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      if (result === "confirmed") {
        // Delete the list
        // this.journalService.cre
      }
    });
  }

  onAddEvidence() {
    const dialogRef = this.matDialog.open(DndComponent, {
      width: "600px",
      data: {
        journal_id: this.journal_id,
        reference_no: this.journal_id,
        description: this.description,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === undefined) {
        result = { event: "Cancel" };
      }
      switch (result.event) {
        case "Create":
          console.debug(result.data);
          break;
        case "Cancel":
          break;
      }
    });
  }

  
  createEmptyForm() {
    this.journalForm = this.fb.group({
      description: ["", Validators.required],
      amount:      ["", Validators.required],
      transaction_date: ["", Validators.required],
    });
    
    this.detailForm = this.fb.group({
      detail_description: ["", Validators.required],
      child: ["", Validators.required],
      fund: ["", Validators.required],
      sub_type: ["", Validators.required],
      reference: [""],
      amount: ["", Validators.required],      
    });
    this._change.markForCheck();
  }


  back() {
    if (this.bDirty === false) {
      this.journalForm.reset();
      this._location.back();
    } else {
      const confirmation = this.fuseConfirmationService.open({
        title: "Unsaved Changes",
        message:
          "Would you like to save the changes before the edit window is closed and the changes lost?  ",
        actions: {
          confirm: {
            label: "Close Without Saving",
          },
        },
      });
      // Subscribe to the confirmation dialog closed action
      confirmation.afterClosed().subscribe((result) => {
        if (result === "confirmed") {
          this.detailForm.reset();
          this.journalForm.reset();
          this._location.back();
        }
      });
    }
  }



  closeDrawer() {

    this.drawer().close();

  
  }

  onDelete(args: any) {
    
    const index  = (this.grid as GridComponent).getSelectedRowIndexes()
    console.debug(`select index `, index[0])
    
    const rowData = this.grid.getCurrentViewRecords().at(index[0]) as any;
    
    // const rowData = 
    
    var journalDetail = {
      journal_id: this.journal_id,
      journal_subid: rowData.journal_subid,
    };
    const confirmation = this._fuseConfirmationService.open({
      title: `Delete  transaction number : ${this.journal_id}-${rowData.journal_subid} `,
      message: "Are you sure you want to delete this line entry? ",
      actions: {
        confirm: {
          label: "Delete",
        },
      },
    });

    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === "confirmed") {
        // Delete the list
        this.delete(journalDetail);
        this.bDirty = false;
      }
    });
  }

  delete(journal: IJournalDetailDelete) {
    this.journalService.deleteJournalDetail(journal);
    this.bDirty = true;
    this.journalService.reNumberJournalDetail(this.journal_id);
  }

  onAddLineJournalDetail() {
    const updateDate = new Date().toISOString().split("T")[0];
    const email = this.auth.currentUser?.email;
    var max = 0;

    for (let i = 0; i < this.journalService.journalDetailList().length; i++) {
      if (this.journalService.journalDetailList()[i].journal_subid > max)
        max = this.journalService.journalDetailList()[i].journal_subid;
    }

    if (this.journal_id === 0) {
      return;
    }

    if (this.journalService.journalDetailList().length > 0) {
      const journalCopy = this.journalService.journalDetailList();
      const journalDetail = {
        journal_id: this.journal_id,
        journal_subid: max + 1,
        account: journalCopy[0].account,
        child: journalCopy[0].child,
        description: journalCopy[0].description,
        create_date: updateDate,
        create_user: email,
        sub_type: journalCopy[0].sub_type,
        debit: 0,
        credit: 0,
        reference: journalCopy[0].reference,
        fund: journalCopy[0].fund,
      };
      this.journalService.createJournalDetail(journalDetail);
    } else {
      const journalDetail = {
        journal_id: this.journal_id,
        journal_subid: 1,
        account: 0,
        child: 0,
        description: "",
        create_date: updateDate,
        create_user: email,
        sub_type: "",
        debit: 0,
        credit: 0,
        reference: "",
        fund: "",
      };
      this.journalService.createJournalDetail(journalDetail);
    }
    this.bDirty = true;
  }

  journalEntryCleanUp() {
    this.detailForm.reset();
    this.accountCtrl.reset();
    this.journalService.reNumberJournalDetail(this.journal_id);
  }

  
  onUpdateJournalEntry() {
    const dDate = new Date();
    const updateDate = dDate.toISOString().split("T")[0];
    const email = this.auth.currentUser?.email;
    var debit: number;
    var credit: number;

    if (this.bDirty === false) {
      this.snackBar.open("Journal details have nothing to update ... ", "OK", {
        verticalPosition: "top",
        horizontalPosition: "right",
        duration: 2000,
      });
      return;
    }

    this.editing = false;
    var header = this.journalForm.getRawValue();

    header.header_amount = 0.0;
    var journal_subid = 1;

    console.log("Detail list length", this.journalService.journalDetailList().length);
    
    this.journalService.journalDetailList().forEach((details) => {
      header.header_amount = Number(details.debit) + header.header_amount;
      this.journal_id = details.journal_id;
      debit = Number(details.debit);
      credit = Number(details.credit);

      if (debit > 0 && credit > 0) {
        this.snackBar.open(
          "Only one of debit and credit fields updated",
          "OK",
          {
            verticalPosition: "top",
            horizontalPosition: "right",
            duration: 2000,
          }
        );
        return;
      }
      details.journal_subid = journal_subid;
      details.create_date = updateDate;
      this.journalService.updateJournalDetail(details);
      journal_subid++;
    });

    const journalHeaderUpdate: IJournalHeaderUpdate = {
      journal_id: this.journal_id,
      description: header.description,
      transaction_date: header.transaction_date,
      amount: Number(header.header_amount),
    };

    this.journalForm = this.fb.group({
      description: [this.description, Validators.required],
      amount: [Number(header.header_amount), Validators.required],
      transaction_date: [this.transaction_date, Validators.required],
    });

    this.journalService.updateJournalHeader(journalHeaderUpdate);

    this.bDirty = false;
  }

  onCreate() {
    var header = this.journalForm.getRawValue();
    var detail = this.detailForm.getRawValue();
    const dDate = new Date();
    const updateDate = dDate.toISOString().split("T")[0];
    const email = this.auth.currentUser?.email;

    if (
      detail.detail_description === "" ||
      detail.detail_description === undefined ||
      detail.detail_description === null
    ) {
      this.snackBar.open("Please select a row to edit", "OK", {
        verticalPosition: "top",
        horizontalPosition: "right",
        duration: 2000,
      });
      return;
    }

    var debit: number;
    var credit: number;

    debit = Number(detail.debit);
    credit = Number(detail.credit);

    if (debit > 0 && credit > 0) {
      this.snackBar.open(
        "Only one of the debit field and credit field may be greater than zero!",
        "OK",
        {
          verticalPosition: "top",
          horizontalPosition: "right",
          duration: 2000,
        }
      );
      return;
    }

    const journalDetail = {
      journal_id: this.currentRowData.journal_id,
      journal_subid: this.currentRowData.journal_subid,
      account: this.currentRowData.account,
      child: detail.child,
      description: detail.detail_description,
      create_date: updateDate,
      create_user: email,
      sub_type: detail.sub_type,
      debit: debit,
      credit: credit,
      reference: detail.reference,
      fund: detail.fund,
    };

    const journalHeader: any = {
      description: header.description,
      transaction_date: header.transaction_date,
      amount: header.amount,
    };

    var rc = this.journalService.updateJournalDetail(journalDetail);

    this.snackBar.open("Journal Entry Updated", "OK", {
      verticalPosition: "top",
      horizontalPosition: "right",
      duration: 2000,
    });

    this.journalService.getJournalDetail(this.journal_id);
  
    this.accountCtrl.reset();
  }

  onUpdate(e: any) {
    if (e.data === undefined) {
      return;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = e.data;
    dialogConfig.width = "450px";

    const dialogRef = this.dialog.open(JournalEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((val) => {
      this.refresh(
        this.journal_id,
        this.description,
        this.transaction_date,
        this.amount,
        this.journalType
      );
    });
  }

  ngOnDestroy(): void {
    if (this.accountsListSubject) {
      this.accountsListSubject.unsubscribe();
    }
    if (this.fundListSubject) {
      this.fundListSubject.unsubscribe();
    }

    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
