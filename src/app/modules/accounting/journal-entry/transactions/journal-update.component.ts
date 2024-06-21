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
} from "@angular/core";
import { DxDataGridModule, DxTemplateModule } from "devextreme-angular";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  IJournalDetailDelete,
  IJournalHeader,
  IJournalHeaderUpdate,
  JournalService,
} from "app/services/journal.service";
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
import { JournalDetailComponent } from "./journal-detail.component";
import { MaterialModule } from "app/services/material.module";
import { SubTypeService } from "app/services/subtype.service";
import { TypeService } from "app/services/type.service";
import { JournalEditComponent } from "../journal-update/journal-edit.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from "ngx-mask";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  ComboBoxModule,
  DropDownListModule,
} from "@syncfusion/ej2-angular-dropdowns";
import { FileManagerComponent } from "app/modules/file-manager/file-manager.component";
import { AUTH } from "app/app.config";
import { MatSelect } from "@angular/material/select";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { IDropDownAccounts } from "app/models";
import {
  DxContextMenuModule,
  DxContextMenuTypes,
} from "devextreme-angular/ui/context-menu";
import { DxDataGridTypes } from "devextreme-angular/ui/data-grid";
import {
  ContextMenuComponent,
  MenuEventArgs,
  MenuItemModel,
  ContextMenuModule,
} from "@syncfusion/ej2-angular-navigations";
import {
  AggregateService,
  EditService,
  EditSettingsModel,
  FilterService,
  FilterSettingsModel,
  GridModule,
  IEditCell,
  PageService,
  SelectionSettingsModel,
  SortService,
  ToolbarService,
} from "@syncfusion/ej2-angular-grids";
import { toSignal } from "@angular/core/rxjs-interop";
import { DataManager, Query } from "@syncfusion/ej2-data";

declare var __moduleName: string;

const imports = [
  CommonModule,
  DxDataGridModule,
  DxTemplateModule,
  ReactiveFormsModule,
  MaterialModule,
  ComboBoxModule,
  FormsModule,
  JournalDetailComponent,
  DndComponent,
  GridMenubarStandaloneComponent,
  JournalEditComponent,
  NgxMaskDirective,
  NgxMaskPipe,
  FileManagerComponent,
  NgxMatSelectSearchModule,
  DxContextMenuModule,
  ContextMenuModule,
  GridModule,
  DropDownListModule,
];

@Component({
  selector: "journal-update",
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["./context.scss"],
})
export class JournalUpdateComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Output() notifyDrawerClose: EventEmitter<any> = new EventEmitter();
  @Input() public sTitle: string;
  @Input() public journal_id: number;
  @Input() public description: string;
  @Input() public transaction_date: string;
  @Input() public amount: string;
  @Input() public bNewTransaction = true;

  public accountParams?: IEditCell;

  @ViewChild("contextmenu")
  private _change = inject(ChangeDetectorRef);
  private _fuseConfirmationService = inject(FuseConfirmationService);

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

  public journalForm!: FormGroup;
  public journalDetailForm!: FormGroup;
  public matDialog = inject(MatDialog);

  public value = 0;
  public loading = false;
  public height: string = "250px";

  funds$ = this.fundService.read();
  subtype$ = this.subtypeService.read();
  accounts$ = this.accountService.readChildren();
  dropDownChildren$ = this.accountService.readChildren();
  detailsListSignal = this.journalService.getJournalDetail(0);

  private fuseConfirmationService = inject(FuseConfirmationService);

  // header$ = this.journalService.readJournalHeader();
  types$ = this.typeService.read();
  subtypes$ = this.subtypeService.read();
  currentRowData: any;
  journalHeaderData: any;
  journal_subid: any;
  editing = false;
  child = new FormControl("");
  myControl = new FormControl("");
  accountOptions: Observable<string[]>;
  bDirty = false;

  public accountsListSubject: Subscription;
  public selectionOptions?: SelectionSettingsModel;
  public filterOptions?: FilterSettingsModel;
  public editSettings: Object;
  public filterSettings: Object;
  public toolbar: string[];
  public orderidrules: Object;
  public customeridrules: Object;
  public freightrules: Object;
  public editparams: Object;
  public pageSettings: Object;
  public formatoptions: Object;
  public fields: Object = { text: "description", value: "child" };

  // drop down searchable list
  public accountList: IDropDownAccounts[] = [];
  public accountCtrl: FormControl<IDropDownAccounts> =  new FormControl<IDropDownAccounts>(null);
  public accountFilterCtrl: FormControl<string> = new FormControl<string>("");
  public filteredAccounts: ReplaySubject<IDropDownAccounts[]> = new ReplaySubject<IDropDownAccounts[]>(1);

  selectedItemKeys: any;

  @ViewChild("singleSelect", { static: true })
  singleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();
  public Accounts: IDropDownAccounts[] = [];

  ngOnInit(): void {
    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      newRowPosition: "Top",
      showAddNewRow: false,
    };
    this.toolbar = ["Add", "Edit", "Delete", "Update", "Cancel"];
    this.orderidrules = { required: true, number: true };
    this.customeridrules = { required: true, minLength: 5 };
    this.freightrules = { required: true, min: 0 };
    this.editparams = { params: { popupHeight: "300px" } };
    this.pageSettings = { pageCount: 5 };
    this.filterSettings = { type: "Excel" };
    this.formatoptions = { type: "dateTime", format: "M/d/y hh:mm a" };

    this.accountsListSubject = this.dropDownChildren$.subscribe((accounts) => {
      accounts.forEach((acct) => {
        var list = {
          account: acct.account,
          child: acct.child,
          description: acct.description,
        };
        this.accountList.push(list);
      });
      this.filteredAccounts.next(this.accountList.slice());
      console.debug("Length of array: ", this.accountList.length);
    });

    this.updateDetailList();
    this.createEmptyForm();
    this.refresh(
      this.journal_id,
      this.description,
      this.transaction_date,
      this.amount
    );

    this.accountFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAccounts();
      });
  }

  addDisabled($event: any) {}

  onSelectionChanged(data: any) {
    console.log(JSON.stringify(data));
    this.selectedItemKeys = data.selectedRowKeys;
  }

  onEditingStart(e: any) {
    console.log(e);
  }

  onEditingEnd(e: any) {
    console.log(e);
  }

  // Update only the signal and mark as dirty. When completed update the whole signal.
  onSaved(e: any) {
    this.bDirty = true;
    const updateDate = new Date().toISOString().split("T")[0];
    const email = this.auth.currentUser?.email;
    const changes = e.changes[0].data;
    console.log("onSaved ", changes);
    const journalDetail = {
      journal_id: changes.journal_id,
      journal_subid: changes.journal_subid,
      account: Number(changes.account),
      child: Number(changes.child),
      description: changes.description,
      create_date: updateDate,
      create_user: email,
      sub_type: changes.sub_type,
      debit: changes.debit,
      credit: changes.credit,
      reference: changes.reference,
      fund: changes.fund,
    };
    this.journalService.updateJournalDetailSignal(journalDetail);
    if (this.detailsListSignal.length > 0) {
      this.detailsListSignal().forEach((data) => {
        console.log(data);
      });
    }
  }

  protected setInitialValue() {
    this.detailsListSignal = this.journalService.getJournalDetail(
      this.journal_id
    );
    this.accountParams = {
      params: {
        filterType: "Contains",
        ignoreCase: true,
        allowFiltering: true,
        dataSource: new DataManager(this.accountList),
        fields: { text: "description", value: "child" },
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

  updateForm(row: any) {
    this.journalForm.reset();
    this.journalForm = this.fb.group({
      description: [this.description, Validators.required],
      amount: [this.amount, Validators.required],
      transaction_date: [this.transaction_date, Validators.required],
    });
  }

  updateDetailList() {
    // this.detailsSubject = this.detailsListSignal.subscribe(details => {
    //   this.journalDetailList = details;
    // })
  }

  public refresh(
    journal_id: number,
    description: string,
    transaction_date: string,
    amount: string
  ) {
    this.description = description;
    this.transaction_date = transaction_date;
    this.amount = amount;

    this.journalForm = this.fb.group({
      description: [this.description, Validators.required],
      amount: [this.amount, Validators.required],
      transaction_date: [this.transaction_date, Validators.required],
    });

    if (journal_id === undefined) {
      this.description = "";
      this.transaction_date = "";
      this.detailsListSignal = this.journalService.getJournalDetail(0);
      return;
    } else if (journal_id > 0) {
      //this.detailsListSignal = this.journalService.getJournalDetail(this.journal_id);
    } else {
      this.description = "";
      this.transaction_date = "";
      this.detailsListSignal = this.journalService.getJournalDetail(0);
      this.journalForm = this.fb.group({
        description: [this.description, Validators.required],
        amount: [this.amount, Validators.required],
        transaction_date: [this.transaction_date, Validators.required],
      });
    }
  }

  changeSubtype(e: any) {
    console.debug("Subytype :", e.value);
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
      description: [this.description, Validators.required],
      amount: [this.amount, Validators.required],
      transaction_date: [this.transaction_date, Validators.required],
    });
    this.journalDetailForm = this.fb.group({
      detail_description: ["", Validators.required],
      child: ["", Validators.required],
      fund: ["", Validators.required],
      sub_type: ["", Validators.required],
      reference: [""],
      debit: ["", Validators.required],
      credit: ["", Validators.required],
    });
    this._change.markForCheck();
  }

  closeDrawer() {
    if (this.bDirty === false) {
      this.journalForm.reset();
      this.notifyDrawerClose.emit();
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
          this.journalDetailForm.reset();
          this.journalForm.reset();
          this.notifyDrawerClose.emit();
        }
      });
    }
  }

  onDelete() {
    var journalDetail = {
      journal_id: this.currentRowData.journal_id,
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
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === "confirmed") {
        // Delete the list
        this.delete(journalDetail);
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

    for (let i = 0; i < this.detailsListSignal().length; i++) {
      if (this.detailsListSignal()[i].journal_subid > max)
        max = this.detailsListSignal()[i].journal_subid;
    }

    if (this.journal_id === 0) {
      return;
    }

    if (this.detailsListSignal().length > 0) {
      const journalCopy = this.detailsListSignal();
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
    this.journalDetailForm.reset();
    this.accountCtrl.reset();
    this.journalService.reNumberJournalDetail(this.journal_id);
  }

  onReorder = (e: Parameters<DxDataGridTypes.RowDragging["onReorder"]>[0]) => {
    e.promise = this.processReorder(e);
  };

  async processReorder(
    e: Parameters<DxDataGridTypes.RowDragging["onReorder"]>[0]
  ) {
    const visibleRows = e.component.getVisibleRows();
    const toIndex = this.detailsListSignal().findIndex(
      (item) => item.journal_subid === visibleRows[e.toIndex].data.journal_subid
    );
    const fromIndex = this.detailsListSignal().findIndex(
      (item) => item.journal_subid === e.itemData.journal_subid
    );
    const details = this.detailsListSignal();
    // details.forEach(journals => console.debug('Start List', journals.child + ' : ' + journals.journal_subid ))
    details.splice(fromIndex, 1);
    details.splice(toIndex, 0, e.itemData);
    var n = 1;
    details.forEach((journal) => {
      journal.journal_subid = n;
      n++;
    });
    // details.forEach(journals => console.debug('Ending List', journals.child+ ' : ' + journals.journal_subid ))
    this.detailsListSignal.set(null);
    this.detailsListSignal.set(details);
    this.bDirty = true;
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

    console.log("Detail list length", this.detailsListSignal().length);
    const details = this.detailsListSignal();
    details.forEach((details) => {
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
    this._change.markForCheck();
  }

  onCreate() {
    var header = this.journalForm.getRawValue();
    var detail = this.journalDetailForm.getRawValue();
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

    this.detailsListSignal = null;
    this.detailsListSignal = this.journalService.getJournalDetail(
      this.journal_id
    );
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
        this.amount
      );
    });
  }

  changeFund($event: any) {}

  changeChildAccount($event: any) {}

  formatNumber(e: any) {
    const options = {
      style: "decimal", // Other options: 'currency', 'percent', etc.
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };
    if (e.value === null || e.value === undefined) e.value = 0.0;
    const formattedWithOptions = e.value.toLocaleString("en-US", options);
    return formattedWithOptions;
  }

  ngOnDestroy(): void {
    if (this.accountsListSubject) {
      this.accountsListSubject.unsubscribe();
    }
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  public menuItems: MenuItemModel[] = [
    {
      text: "Delete Line",
      iconCss: "e-cm-icons e-cut",
    },
    {
      text: "Copy Line",
      iconCss: "e-cm-icons e-copy",
    },
    {
      text: "Paste",
      iconCss: "e-cm-icons e-paste",
      items: [
        {
          text: "Paste Text",
          iconCss: "e-cm-icons e-pastetext",
        },
        {
          text: "Paste Special",
          iconCss: "e-cm-icons e-pastespecial",
        },
      ],
    },
    {
      separator: true,
    },
    {
      text: "Link",
      iconCss: "e-cm-icons e-link",
    },
    {
      text: "New Comment",
      iconCss: "e-cm-icons e-comment",
    },
  ];
}
