import { Component, OnInit, ViewChild, inject, viewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { SubTypeService } from "app/services/subtype.service";
import { TypeStore } from "app/services/type.service";
import { CommonModule, JsonPipe } from "@angular/common";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { AccountsService } from "app/services/accounts.service";
import { GridMenubarStandaloneComponent } from "../../grid-components/grid-menubar.component";

import { IValue } from "app/features/kanban/kanban/kanban.component";
import { MatDrawer } from "@angular/material/sidenav";
import { MaterialModule } from "app/services/material.module";
import {
  AggregateService,
  ColumnMenuService,
  ContextMenuItem,
  ContextMenuService,
  DialogEditEventArgs,
  EditService,
  EditSettingsModel,
  ExcelExportService,
  FilterService,
  FilterSettingsModel,
  GridComponent,
  GridModule,
  GroupService,
  PageService,
  ReorderService,
  ResizeService,
  SaveEventArgs,
  SearchSettingsModel,
  SelectionSettingsModel,
  SortService,
  ToolbarItems,
  ToolbarService,
} from "@syncfusion/ej2-angular-grids";
import { DropDownListComponent } from "@syncfusion/ej2-angular-dropdowns";
import { IAccounts } from "app/models/journals";
import { AuthService } from "app/features/auth/auth.service";
import { GLGridComponent } from "../../grid-components/gl-grid.component";

const imports = [
  CommonModule,
  MaterialModule,
  ReactiveFormsModule,
  FormsModule,
  GridMenubarStandaloneComponent,
  GLGridComponent,
];

const keyExpr = ["account", "child"];

@Component({
  selector: "glaccounts",
  imports: [imports],
  template: `
    <div class="h-[calc(100vh)-100px] ">
      <mat-drawer
        class="w-[450px]"
        #drawer
        [opened]="false"
        mode="over"
        [position]="'end'"
        [disableClose]="false"
      >
        <mat-card class="m-2">
          <div
            class="flex flex-col w-full filter-article filter-interactive text-gray-700"
          >
            <div
              class="bg-slate-600 text-justify m-2 p-2 text-white h-10 text-2xl border-l-4 border-gray-400"
              mat-dialog-title
            >
              {{ sTitle }}
            </div>
          </div>

          <form [formGroup]="accountsForm" class="form">
            <div class="div flex flex-col grow">
              <section class="flex flex-col md:flex-row m-1">
                <div class="flex flex-col grow">
                  <mat-form-field class="m-1 flex-start">
                    <mat-label class="text-md ml-2">Group</mat-label>
                    <input
                      #myInput
                      matInput
                      placeholder="Account"
                      formControlName="account"
                    />
                    <mat-icon
                      class="icon-size-5 text-lime-700"
                      matPrefix
                      [svgIcon]="'heroicons_outline:document'"
                    ></mat-icon>
                  </mat-form-field>
                </div>

                <div class="flex flex-col grow">
                  <mat-form-field class="m-1 flex-start">
                    <mat-label class="text-md ml-2">Account</mat-label>
                    <input
                      #myInput
                      matInput
                      placeholder="Child Account"
                      formControlName="child"
                    />
                    <mat-icon
                      class="icon-size-5 text-lime-700"
                      matPrefix
                      [svgIcon]="'heroicons_outline:clipboard-document'"
                    ></mat-icon>
                  </mat-form-field>
                </div>

                <div class="flex flex-col grow">
                  <mat-checkbox
                    color="primary"
                    class="mt-5"
                    formControlName="parent_account"
                  >
                    Parent
                  </mat-checkbox>
                </div>
              </section>

              <div class="flex flex-col grow">
                <mat-form-field class="m-1 flex-start">
                  <mat-label class="text-md ml-2">Description</mat-label>
                  <input #myInput matInput placeholder="Description" formControlName="description" />
                  <mat-icon class="icon-size-5 text-lime-700" matPrefix [svgIcon]="'heroicons_outline:document-text'"></mat-icon>
                </mat-form-field>
              </div>

              <section class="flex flex-col md:flex-row">
                <mat-form-field class="m-1 grow">
                  <mat-label class="text-md ml-2">Type</mat-label>
                  <mat-select placeholder="Type" formControlName="type"  (selectionChange)="changeType($event)">
                    @for (item of typeStore.type(); track item) {
                      <mat-option [value]="item.type"> {{ item.type }}  </mat-option>
                    }
                  </mat-select>
                  <span class="e-icons e-notes text-lime-700 m-2 " matPrefix></span>
                </mat-form-field>
              </section>

              <div class="flex flex-col grow">
                <mat-form-field class="m-1 flex-start">
                  <mat-label class="text-md ml-2">Comments</mat-label>
                  <input #myInput matInput placeholder="Comments" formControlName="comments" />
                  <span class="e-icons e-comment-show text-lime-700 m-2" matPrefix></span>
                </mat-form-field>
              </div>
            </div>
          </form>

          <div mat-dialog-actions class="gap-2 mb-3">
                  @if (bHeaderDirty === true) {
                    <button mat-icon-button color="primary" class="bg-slate-200 hover:bg-slate-400 ml-1" (click)="onUpdateJournalEntry()"
                      matTooltip="Save" aria-label="hovered over">
                      <span class="e-icons e-save"></span>
                    </button>
                    }

                    <button mat-icon-button color="primary" 
                            class=" hover:bg-slate-400 ml-1" (click)="onAdd()" matTooltip="New" aria-label="hovered over">                        
                        <span class="e-icons e-circle-add"></span>
                    </button>

                    <button mat-icon-button color="primary" 
                            class=" hover:bg-slate-400 ml-1" (click)="onDelete($event)" matTooltip="Delete" aria-label="hovered over">                        
                        <span class="e-icons e-trash"></span>
                    </button>

                    <button mat-icon-button color="primary"
                            class=" hover:bg-slate-400 ml-1"  (click)="onCancel()" matTooltip="Close"
                            aria-label="hovered over">
                            <span class="e-icons e-circle-close"></span>
                    </button>                    
            </div>
        </mat-card>
      </mat-drawer>
      <mat-drawer-container class="flex-col">
        <ng-container>
          <div class="border-1 border-gray-500 mt-3">
            <grid-menubar
              (notifyParentRefresh)="onRefresh()"
              (notifyParentAdd)="onAdd()"
              (notifyParentDelete)="onDeleteSelection()"
              (notifyParentUpdate)="onSelection()"
              [inTitle]="'Account Maintenance'"
            >
            </grid-menubar>
            @if (accountService.isLoading() === false) {

            <gl-grid #gl_grid
              (onUpdateSelection)="selectedRow($event)"
              [data]="this.accountService.accountList()"
              [columns]="columns"
            >
            </gl-grid>

            } @else {
            <div
              class="fixed z-[1050] -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4"
            >
              <mat-spinner></mat-spinner>
            </div>
            }
          </div>
        </ng-container>
      </mat-drawer-container>
    </div>
  `,
  providers: [
    TypeStore,
    ExcelExportService,
    ContextMenuService,
    ReorderService,
    SortService,
    GroupService,
    PageService,
    ResizeService,
    FilterService,
    ToolbarService,
    EditService,
    AggregateService,
    ColumnMenuService,
  ],
  styles: [
    `
      .e-grid {
        font-family: cursive;
        border: 1px solid #f0f0f0;
      }
    `,
  ],
})
export class GlAccountsComponent  extends GLGridComponent {
  
  public drawer = viewChild<MatDrawer>("drawer"); 
  accountsForm!: FormGroup;

  private _fuseConfirmationService = inject(FuseConfirmationService);

  private formBuilder = inject(FormBuilder);
  private auth = inject(AuthService);
  accountService = inject(AccountsService);
  subtypeService = inject(SubTypeService);
  typeStore = inject(TypeStore);
  

  public sTitle = "Settings/Account Maintenance";
  public title = "General Ledger Accounts";
  public selectedItemKeys: any[] = [];
  public bDirty: boolean = false;
  private currentRow: Object;

  onSelection() {    
    this.openDrawer();
  }

  public columns = [
    { field: "account",     headerText: "Group",        width: 80, textAlign: "Left" },
    { field: "child",       headerText: "Account",      width: 80, textAlign: "Left", isPrimaryKey: true,    },
    { field: "type",        headerText: "Type",         width: 80, textAlign: "Left" },
    { field: "description", headerText: "Description",  width: 200,textAlign: "Left" },
    { field: "update_date", headerText: "Date",         width: 80, textAlign: "Left" },
    { field: "update_user", headerText: "User",         width: 80, textAlign: "Left" },
    { field: "comments",    headerText: "Comment",      width: 80, textAlign: "Left" },
  ];

  readonly displayModes = [
    { text: "Display Mode 'full'", value: "full" },
    { text: "Display Mode 'compact'", value: "compact" },
  ];
  
  displayMode = "compact";
  showInfo = true;
  showNavButtons = true;
  bHeaderDirty: any;

  ngOnInit() {
    this.accountService.read();
    this.createEmptyForm();
    this.setRowHeight(60);
  }

  selectedRow($event) {
    this.onDoubleClicked($event);
  }

  // CRUD Functions
  onCreate(e: any) {
    const account = { ...this.accountsForm.value } as IAccounts;
    const rawData = {
      account: account.account,
      child: account.child,
      parent_account: account.parent_account,
      description: account.description,
      type: account.type,
      sub_type: account.sub_type,
      balance: account.balance,
      comments: account.comments,
    };
    this.accountService.create(rawData);
    this.closeDrawer();
  }

  
  onDoubleClicked(args: any) {
    const type = args.type;
    var parent: boolean;
    parent = args.parent_account;
    this.accountsForm.setValue({
      account: [args.account],
      child: [args.child],
      parent_account: parent,
      description: [args.description],
      type: type,
      comments: [args.comments],
    });

    this.openDrawer();  
  }

  onNew($event: any) {
    this.createEmptyForm();
    this.openDrawer();
    
  }
  
  onCancel() {
      this.drawer().toggle();
  }

  onUpdate(e: any) {
    const dDate = new Date();
    const updateDate = dDate.toISOString().split("T")[0];
    const user = this.auth.user().email.split("T")[0];

    const account = this.accountsForm.getRawValue();
    const rawData = {
      account: account.account,
      child: account.child,
      parent_account: account.parent_account,
      description: account.description,
      sub_type: "",
      type: account.type,
      comments: account.comments,
      balance: 0,
      create_date: updateDate,
      create_user: user,
      update_date: updateDate,
      update_user: user,
      status: "open",
    };
    this.accountService.update(rawData);
  }

  changeType(e) {
    console.debug("changeType ", JSON.stringify(e));
  }

  sub_types: IValue[] = [
    { value: "Add", viewValue: "Add" },
    { value: "Update", viewValue: "Update" },
    { value: "Delete", viewValue: "Delete" },
    { value: "Verify", viewValue: "Verify" },
  ];

  onDeleteSelection() {
    this.onDelete(this.currentRow);
  }

  onDelete(e: any) {
    console.debug(`onDelete ${JSON.stringify(e)}`);
    const confirmation = this._fuseConfirmationService.open({
      title: `Delete  Account: ${e.account} Child: ${e.child}`,
      message: "Are you sure you want to delete this account? ",
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
        this.accountService.delete(e.account);
      }
    });
    this.closeDrawer();
  }

  onRefresh() {
    // this.data$ = this.accountService.read();
  }

  onAdd() {
    this.createEmptyForm();
    this.openDrawer();
  }

  createEmptyForm() {
    this.accountsForm = this.formBuilder.group({
      account: ["", Validators.required],
      child: ["", Validators.required],
      parent_account: [false, Validators.required],
      description: ["", Validators.required],
      type: ["", Validators.required],
      comments: ["", Validators.required],
    });
  }

  createForm(e: any) {
    var parent: boolean;
    parent = e.parent_account;
    this.accountsForm = this.formBuilder.group({
      account: [e.account, Validators.required],
      child: [e.child, Validators.required],
      parent_account: parent,
      description: [e.description, Validators.required],
      type: [e.type, Validators.required],
      comments: [e.comments, Validators.required],
    });
  }

  onClose() {
    this.closeDrawer();
  }

  openDrawer() {
    const opened = this.drawer().opened;
    if (opened !== true) {
      this.drawer().toggle();
    } else {
      return;
    }
  }

  closeDrawer() {
    const opened = this.drawer().opened;
    if (opened === true) {
      this.drawer().toggle();
    } else {
      return;
    }
  }
}
