import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  inject,
  viewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { JournalService } from "app/services/journal.service";
import {
  Observable,
  ReplaySubject,
  Subject,
  Subscription,
  interval,
  map,
  startWith,
  take,
  takeUntil,
} from "rxjs";
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
import {
  IDropDownAccounts,
  IDropDownAccountsGridList,
  IFunds,
} from "app/models";

import {
  ContextMenuComponent,
  ContextMenuModule,
} from "@syncfusion/ej2-angular-navigations";
import {
  AggregateService,
  EditService,
  FilterService,
  FilterSettingsModel,
  GridModule,
  PageService,
  RowDDService,
  SaveEventArgs,
  RowDragEventArgs,
  SelectionSettingsModel,
  SortService,
  ToolbarService,
  GridComponent,
  DialogEditEventArgs,
} from "@syncfusion/ej2-angular-grids";

import {
  IJournalDetail,
  IJournalDetailDelete,
  IJournalHeader,
  IJournalHeaderUpdate,
} from "app/models/journals";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { MatDrawer } from "@angular/material/sidenav";
import { JournalStore } from "app/store/journal.store";
import { MatSort, Sort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { LiveAnnouncer } from '@angular/cdk/a11y';


import { SplitterModule } from '@syncfusion/ej2-angular-layouts';

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
  MatTableModule,
  MatSortModule,
  SplitterModule
];

@Component({
  selector: "gl-journal",
  standalone: true,
  imports: [imports],
  templateUrl: "./journal-update.component.html",
  providers: [
    provideNgxMask(),
    SortService,
    PageService,
    FilterService,
    ToolbarService,
    EditService,
    AggregateService,
    RowDDService,
    JournalStore,
  ],
  styles: [`
   .mat-mdc-row { height: 36px !important; } 
   .mat-mdc-header { height: 36px !important; }
   .mat-mdc-form-field {height: 76px !important;}
   `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalUpdateComponent
  implements OnInit, OnDestroy, AfterViewInit {
  [x: string]: any;

  @Output() notifyDrawerClose: EventEmitter<any> = new EventEmitter();
  private _liveAnnouncer = inject(LiveAnnouncer);

  private _fuseConfirmationService = inject(FuseConfirmationService);

  public detailForm!: FormGroup;
  public journalForm!: FormGroup;

  drawer = viewChild<MatDrawer>("drawer");

  @ViewChild("contextmenu")

  private _location = inject(Location);
  private router = inject(Router);

  public contextmenu: ContextMenuComponent;

  private fb = inject(FormBuilder);
  // private journalService = inject(JournalService);
  private typeService = inject(TypeService);
  private subtypeService = inject(SubTypeService);
  private fundService = inject(FundsService);
  private accountService = inject(GLAccountsService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private auth = inject(AUTH);
  private activatedRoute = inject(ActivatedRoute);
  public store = inject(JournalStore);
  public matDialog = inject(MatDialog);

  public value = 0;
  public loading = false;
  public height: string = "250px";

  public funds$ = this.fundService.read();
  public subtype$ = this.subtypeService.read();
  public types$ = this.typeService.read();

  public dropDownChildren$ = this.accountService.readChildren();
  public fuseConfirmationService = inject(FuseConfirmationService);

  // Internal control variables
  public currentRowData: any;
  public journalHeaderData: any;
  public journal_subid: any;
  public editing = false;
  public myControl = new FormControl("");
  public accountOptions: Observable<string[]>;
  public bDirty = false;
  public bHeaderDirty = false;

  // Datagrid variables
  public accountsListSubject: Subscription;
  public fundListSubject: Subscription;
  public filterOptions?: FilterSettingsModel;
  public editSettings: Object;
  public filterSettings: Object;
  public toolbar: string[];
  public orderidrules: Object;
  public editparams: Object;
  public pageSettings: Object;
  public formatoptions: Object;
  public selectionOptions: Object;
  public selIndex?: number[] = [];

  // Global Journal header
  public description: string;
  public transaction_date: string;
  public amount: number;
  public journalType: string;
  public sTitle = "Transaction Detail Update";
  public journal_id: number;

  // drop down searchable list
  public accountList: IDropDownAccounts[] = [];
  public subtypeList: ISubType[] = [];
  public fundList: IFunds[] = [];

  public selectOptions?: Object;
  public message?: string;

  @ViewChild("grid")
  public grid!: GridComponent;
  public gridControl = viewChild<GridComponent>("grid");
  public selectedItemKeys: any;

  public Accounts: IDropDownAccounts[] = [];
  public accountsGrid: IDropDownAccountsGridList[] = [];
  public dFields = { text: "child", value: "child" };
  public debitAccounts: IDropDownAccounts[] = [];
  public debitCtrl: FormControl<IDropDownAccounts> =
    new FormControl<IDropDownAccounts>(null);
  public debitAccountFilterCtrl: FormControl<string> = new FormControl<string>(
    null
  );
  public filteredDebitAccounts: ReplaySubject<IDropDownAccounts[]> =
    new ReplaySubject<IDropDownAccounts[]>(1);
  public journalData: IJournalHeader;

  protected _onCreditDestroy = new Subject<void>();
  protected _onDebitDestroy = new Subject<void>();
  protected _onDestroyDebitAccountFilter = new Subject<void>();
  protected _onDestroyCreditAccountFilter = new Subject<void>();
  protected _onDestroy = new Subject<void>();

  columnsToDisplay: string[] = ["journal_id", "description"];

  @ViewChild("singleDebitSelect", { static: true })

  singleDebitSelect: MatSelect;

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.createEmptyForm();

    this.activatedRoute.data.subscribe((data) => {
      this.journal_id = data.journal.journal_id;
      this.journalData = {
        journal_id: data.journal.journal_id,
        description: data.journal.description,
        booked: data.journal.booked,
        booked_date: data.journal.booked_date,
        booked_user: data.journal.booked_user,
        create_date: data.journal.create_date,
        create_user: data.journal.create_user,
        period: data.journal.period,
        period_year: data.journal.period_year,
        transaction_date: data.journal.transaction_date,
        status: data.journal.status,
        type: data.journal.type,
        sub_type: data.journal.sub_type,
        amount: data.journal.amount,
        party_id: data.journal.party_id,
      };
      this.createEmptyDetailForm();
      this.onChanges();
    });

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

    this.refresh(
      this.journalData.journal_id,
      this.journalData.description,
      this.journalData.transaction_date,
      this.journalData.amount,
      this.journalData.type
    );

    this.store.loadDetails(this.journal_id);

    this.initialDatagrid();
  }

  ngAfterViewInit() {
    this.setInitialValue();
    this.datastore.sort = this.sort;
  }

  openDrawer() {
    this.bDirty = false;
    this.drawer().open();
  }

  closeDrawer() {
    this.bDirty = false;
    this.drawer().close();
  }

  onRefresh() {
    this.exitWindow();
  }

  rowClick(event: any) {
    console.log('Row clicked ...', event);
  }

  initialDatagrid() {
    // this.pageSettings = { pageCount: 10 };
    this.formatoptions = { type: "dateTime", format: "M/dd/yyyy" };
    this.pageSettings = { pageSizes: true, pageCount: 10 };
    this.selectionOptions = { mode: "Row" };
    this.editSettings = {
      allowEditing: true,
      allowAdding: false,
      allowDeleting: false,
    };
    this.filterSettings = { type: "CheckBox" };
  }

  public announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      console.log('Sort changed ...', sortState.direction);
    } else {
      console.log('Sort changed ...', sortState.active);
    }
  }

  public onEditJournal(id: number) {
    this.journal_id = id;
    this.store.loadDetails(id);
    this.journalData = this.store.gl().find((x) => x.journal_id === id);

    this.refresh(
      this.journalData.journal_id,
      this.journalData.description,
      this.journalData.transaction_date,
      this.journalData.amount,
      this.journalData.type
    );

    this.closeDrawer();
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

  OnCardDoubleClick(data: any): void {
    this.currentRowData = data;
    const email = this.auth.currentUser.email;
    const dDate = new Date();
    var currentDate = dDate.toISOString().split("T")[0];
    data = this.store
      .details()
      .find((x) => x.journal_subid === data.journal_subid);

    const JournalDetail = {
      journal_id: data.journal_id,
      journal_subid: data.journal_subid,
      account: data.account,
      child: data.child,
      child_desc: data.child_desc,
      description: data.description,
      create_date: currentDate,
      create_user: email,
      sub_type: data.sub_type,
      debit: data.debit,
      credit: data.credit,
      reference: data.reference,
      fund: data.fund,
    } as IJournalDetail;

    this.currentRowData = JournalDetail;

    this.createForm(JournalDetail);
    this.onChanges();
  }

  private createForm(journalDetail: IJournalDetail) {
    const accountString = journalDetail.child.toString();
    this.debitCtrl.setValue(
      this.debitAccounts.find((x) => x.child === accountString)
    );

    this.detailForm = this.fb.group({
      debitCtrl: [journalDetail.child.toString(), Validators.required],
      description: [journalDetail.description, Validators.required],
      sub_type: [journalDetail.sub_type, Validators.required],
      debit: [journalDetail.debit, Validators.required],
      credit: [journalDetail.credit, Validators.required],
      reference: [journalDetail.reference, Validators.required],
      fund: [journalDetail.fund, Validators.required],
    });

    this.openDrawer();
  }

  public onChanges(): void {
    this.journalForm.valueChanges.subscribe((dirty) => {
      if (this.journalForm.dirty) {
        this.bHeaderDirty = true;
      }
    });

    this.detailForm.valueChanges.subscribe((dirty) => {
      if (this.detailForm.dirty) {
        this.bDirty = true;
      }
    });
    this.debitCtrl.valueChanges.subscribe((value) => {
      this.bDirty = true;
    });
  }

  public createEmptyDetailForm() {
    this.detailForm = this.fb.group({
      account: ["", Validators.required],
      debitCtrl: ["", Validators.required],
      description: ["", Validators.required],
      sub_type: ["", Validators.required],
      debit: ["", Validators.required],
      credit: ["", Validators.required],
      reference: ["", Validators.required],
      fund: ["", Validators.required],
    });
    this.openDrawer();
  }

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === "beginEdit" || args.requestType === "add") {
      args.cancel = true;
      this.OnCardDoubleClick(args.rowData);
      this.openDrawer();
    }
    if (args.requestType === "save") {
      this.onSaved(args.data);
    }
  }

  actionComplete(args: DialogEditEventArgs): void {
    console.debug("args : ", args.requestType);
    if (args.requestType === "beginEdit" || args.requestType === "add") {
      if (args.requestType === "beginEdit") {
      } else if (args.requestType === "add") {
      }
    }
  }

  rowDrag(args: RowDragEventArgs): void {
    this.message = `rowDrag event triggered ${JSON.stringify(args.data)}`;
    console.debug(this.message);
    (args.rows as Element[]).forEach((row: Element) => {
      row.classList.add("drag-limit");
    });
  }

  rowDrop(args: RowDragEventArgs): void {
    this.message = `Drop  ${args.originalEvent} ${JSON.stringify(args.data)}`;
    console.debug(this.message);
    const value = [];
    for (let r = 0; r < (args.rows as Element[]).length; r++) {
      value.push((args.fromIndex as number) + r);
    }

    this.gridControl().reorderRows(value, args.dropIndex as number);
    this.onSaved(args.data[0]);
  }

  onSaved(e: any) {
    this.bDirty = true;
    const updateDate = new Date().toISOString().split("T")[0];
    const email = this.auth.currentUser?.email;
    const debitAccount = this.debitCtrl.getRawValue();
    const journalDetail = {
      journal_id: e.journal_id,
      journal_subid: e.journal_subid,
      account: Number(e.account),
      child: Number(e.child),
      child_desc: debitAccount.description,
      description: e.description,
      create_date: updateDate,
      create_user: email,
      sub_type: e.sub_type,
      debit: e.debit,
      credit: e.credit,
      reference: e.reference,
      fund: e.fund,
    };
    this.store.updateJournalDetail(journalDetail);

  }

  protected setInitialValue() {
    if (this.filteredDebitAccounts)
      this.filteredDebitAccounts
        .pipe(take(1), takeUntil(this._onDebitDestroy))
        .subscribe(() => {
          if (
            this.singleDebitSelect != null ||
            this.singleDebitSelect != undefined
          )
            this.singleDebitSelect.compareWith = (
              a: IDropDownAccounts,
              b: IDropDownAccounts
            ) => a && b && a.child === b.child;
        });
  }


  onFocusedDetailRowChanged(e: any) {

    this.journalData = e.row.data;
    this.currentRowData = e.row.data;
    this.journal_subid = e.row.data.journal_subid;
    this.journal_id = e.row.data.journal;
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
    this.journalType = journalType;

    this.journalForm = this.fb.group({
      description: [this.description, Validators.required],
      amount: [this.amount, Validators.required],
      transaction_date: [this.transaction_date, Validators.required],
    });

    this.onChanges()

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
      amount: ["", Validators.required],
      transaction_date: ["", Validators.required],
    });

    this.detailForm = this.fb.group({
      debitCtrl: ["", Validators.required],
      description: ["", Validators.required],
      child: ["", Validators.required],
      fund: ["", Validators.required],
      sub_type: ["", Validators.required],
      reference: [""],
      amount: ["", Validators.required],
    });
    this.onChanges()
  }

  exitWindow() {
    if (this.bDirty === false) {
      this.journalForm.reset();
      this.router.navigate(["journals"]);

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
      this.onChanges()
    }
  }

  onDeleteDetail() {

    var journalDetail = {
      journal_id: this.journal_id,
      journal_subid: this.currentRowData.journal_subid,
    };

    const confirmation = this._fuseConfirmationService.open({
      title: `Delete  transaction number : ${journalDetail.journal_id}-${journalDetail.journal_subid} `,
      message: "Are you sure you want to delete this line entry? ",
      actions: {
        confirm: {
          label: "Delete",
        },
      },
    });

    // Subscribe to the confirmation dialog closed action
    var sub = confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === "confirmed") {
        // Delete the list
        // this.delete(journalDetail);
        this.store.deleteJournalDetail(journalDetail);
        this.bDirty = false;
        this.closeDrawer();
      }
    });

    sub.unsubscribe();

  }


  onDelete(args: any) {
    const index = (this.grid as GridComponent).getSelectedRowIndexes();
    const rowData = this.grid.getCurrentViewRecords().at(index[0]) as any;
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
        this.store.deleteJournalDetail(journalDetail);
        this.bDirty = false;
      }
    });
  }

  onAddLineJournalDetail() {
    const updateDate = new Date().toISOString().split("T")[0];
    const email = this.auth.currentUser?.email;
    var max = 0;

    this.store.details().forEach((details) => {
      if (details.journal_subid > max) {
        max = details.journal_subid;
      }
    });

    if (this.journal_id === 0) {
      return;
    }

    if (this.store.details().length > 0) {
      const journalCopy = this.store.details().slice();
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
      }
      this.store.createJournalDetail(journalDetail);
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
      this.store.createJournalDetail(journalDetail);

    }
    this.bDirty = true;
  }

  journalEntryCleanUp() {
    this.detailForm.reset();
    this.debitCtrl.reset();
    this.store.renumberJournalDetail(this.journal_id);
  }

  onUpdateJournalEntry() {

    if (this.bHeaderDirty === false) {
      this.snackBar.open("Journal details have nothing to update ... ", "OK", {
        verticalPosition: "top",
        horizontalPosition: "right",
        duration: 2000,
      });
      return;
    }

    const dDate = new Date();
    const updateDate = dDate.toISOString().split("T")[0];

    var header = this.journalForm.getRawValue();

    const journalHeaderUpdate: IJournalHeader = {
      journal_id: this.journal_id,
      booked_date: updateDate,
      booked_user: this.auth.currentUser.email,
      create_date: updateDate,
      create_user: this.auth.currentUser.email,
      period: this.journalData.period,
      period_year: this.journalData.period_year,
      status: "Open",
      booked: false,
      type: this.journalData.type,
      sub_type: this.journalData.sub_type,
      description: header.description,
      transaction_date: header.transaction_date,
      amount: Number(header.amount),
    };

    this.store.updateJournalHeader(journalHeaderUpdate);

    this.snackBar.open("Journal description updated", "", {
      verticalPosition: "top",
      horizontalPosition: "right",
      duration: 2000,
    });

    this.bHeaderDirty = false;

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
      description: detail.description,
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

    this.store.updateJournalDetail(journalDetail);

    this.snackBar.open(
      "Journal details updated",
      "",
      {
        verticalPosition: "top",
        horizontalPosition: "right",
        duration: 2000,
      }
    );

    this.debitCtrl.reset();
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

  onUpdateJournalDetail() {
    var header = this.journalForm.getRawValue();
    var detail = this.detailForm.getRawValue();
    const dDate = new Date();
    const updateDate = dDate.toISOString().split("T")[0];
    const email = this.auth.currentUser?.email;

    var debit = Number(detail.debit);

    var credit = Number(detail.credit);

    var childAccount = this.debitCtrl.getRawValue();

    var child_desc = this.store.accounts().find((x) => x.child === Number(childAccount.child)).description;


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
      child: Number(childAccount.child),
      child_desc: child_desc,
      description: detail.description,
      create_date: updateDate,
      create_user: email,
      sub_type: detail.sub_type,
      debit: debit,
      credit: credit,
      reference: detail.reference,
      fund: detail.fund,
    };

    this.store.updateJournalDetail(journalDetail);

    this.snackBar.open("Journal Entry Updated", "OK", {
      verticalPosition: "top",
      horizontalPosition: "right",
      duration: 2000,
    });

    this.bDirty = false;
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
