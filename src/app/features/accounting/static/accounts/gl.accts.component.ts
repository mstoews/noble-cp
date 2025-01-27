import { Component, inject, viewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { SubTypeService } from "app/services/subtype.service";
import { TypeStore } from "app/services/type.service";
import { CommonModule } from "@angular/common";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { GridMenubarStandaloneComponent } from "../../grid-components/grid-menubar.component";

import { MatDrawer } from "@angular/material/sidenav";
import { MaterialModule } from "app/services/material.module";
import {
  AggregateService,
  ColumnMenuService,
  ContextMenuService,
  EditService,
  ExcelExportService,
  FilterService,
  GroupService,
  PageService,
  ReorderService,
  ResizeService,
  SortService,
  ToolbarService,
} from "@syncfusion/ej2-angular-grids";
import { IAccounts } from "app/models";
import { AuthService } from "app/features/auth/auth.service";
import { GLGridComponent } from "../../grid-components/gl-grid.component";
import { Store } from "@ngrx/store";
import { accountsFeature } from "app/state/accts/accts.state";
import { accountPageActions } from "app/state/accts/actions/accts-page.actions";
import { MenuEventArgs, MenuItemModel } from "@syncfusion/ej2-navigations";
import { ContextMenuAllModule } from "@syncfusion/ej2-angular-navigations";
import { ToastrService } from "ngx-toastr";

const imports = [
  CommonModule,
  MaterialModule,
  ReactiveFormsModule,
  FormsModule,
  GridMenubarStandaloneComponent,
  GLGridComponent,
  ContextMenuAllModule
];

const keyExpr = ["account", "child"];

@Component({
  selector: "glaccounts",
  imports: [imports,],
  template: `
    <div class="h-[calc(100vh)-100px] ">
    <mat-drawer
        class="w-[450px]"
        #settings
        [opened]="false"
        mode="over"
        [position]="'end'"
        [disableClose]="false"
      >
        <mat-card class="m-2 p-2 border-1 border-gray-500">
        <div class="flex flex-col w-full text-gray-700 max-w-140 filter-article filter-interactive">
          <div class="h-12 rounded-lg p-2 text-2xl text-justify text-gray-200 bg-slate-600" mat-dialog-title> Settings </div>
          <form [formGroup]="settingsForm" class="form">
          <div class="w-full mt-2">            
            <div class="text-secondary">Accounts Used for Payments and Receivables</div>
        </div>
        <div class="grid sm:grid-cols-4 gap-6 w-full mt-8">
            <!-- Accounts Receivable Contra -->            
            <div class="sm:col-span-4">
                <mat-form-field class="fuse-mat-emphasized-affix w-full"  [subscriptSizing]="'dynamic'">                    
                   <div class="text-secondary"  matPrefix> AR Contra </div>                   
                   <input [formControlName]="'arc'" matInput>
                </mat-form-field>
            </div>
            <!-- Accounts Receivable -->
            <div class="sm:col-span-4">
                <mat-form-field  class="fuse-mat-emphasized-affix w-full"  [subscriptSizing]="'dynamic'">                    
                    <div class="text-secondary"  matPrefix> AR </div>
                    <input [formControlName]="'ar'"  matInput>
                </mat-form-field>
            </div>

            <!-- Accounts Payable Contra -->            
            <div class="sm:col-span-4">
                <mat-form-field class="fuse-mat-emphasized-affix w-full"  [subscriptSizing]="'dynamic'">                    
                   <div class="text-secondary"  matPrefix> AP Contra </div>                   
                   <input [formControlName]="'apc'" matInput>
                </mat-form-field>
            </div>
            <!-- Accounts Payable -->
            <div class="sm:col-span-4">
                <mat-form-field  class="fuse-mat-emphasized-affix w-full"  [subscriptSizing]="'dynamic'">                    
                    <div class="text-secondary"  matPrefix> AP </div>
                    <input [formControlName]="'ap'"  matInput>
                </mat-form-field>
            </div>
                        
          </div>
          </form>

          <div mat-dialog-actions class="gap-2 mb-3 mt-4">
                  @if (bSettingsDirty === true) {
                    <button mat-icon-button color="primary" class="bg-slate-200 hover:bg-slate-400 ml-1" (click)="onUpdateJournalEntry()"
                      matTooltip="Save" aria-label="hovered over">
                      <span class="e-icons e-save"></span>
                    </button>
                    }

                    <!-- <button mat-icon-button color="primary" 
                            class=" hover:bg-slate-400 ml-1" (click)="onAdd()" matTooltip="New" aria-label="hovered over">                        
                        <span class="e-icons e-circle-add"></span>
                    </button>

                    <button mat-icon-button color="primary" 
                            class=" hover:bg-slate-400 ml-1" (click)="onDelete($event)" matTooltip="Delete" aria-label="hovered over">                        
                        <span class="e-icons e-trash"></span>
                    </button> -->

                    <button mat-icon-button color="primary"
                            class=" hover:bg-slate-400 ml-1"  (click)="closeSettings()" matTooltip="Close"
                            aria-label="hovered over">
                            <span class="e-icons e-circle-close"></span>
                    </button>                    
            </div>
            </div>
        </mat-card>
      </mat-drawer>
      <mat-drawer
        class="w-[450px]"
        #drawer
        [opened]="false"
        mode="over"
        [position]="'end'"
        [disableClose]="false"
      >
        <mat-card class="m-2">
        <div class="flex flex-col w-full text-gray-700 max-w-140 filter-article filter-interactive">
          <div class="h-12 m-2 rounded-lg p-2 text-2xl text-justify text-gray-200 bg-slate-600" mat-dialog-title> {{ sTitle }} </div>
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
                  <mat-select placeholder="Type" formControlName="acct_type"  (selectionChange)="changeType($event)">
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
                  @if (bAccountsDirty === true) {
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
            </div>
        </mat-card>
      </mat-drawer>
      <mat-drawer-container id="target" class="flex-col">
        <ng-container>
          <div class="border-1 border-gray-500 mt-3">
          <grid-menubar 
            class="pl-5 pr-5"            
            [showBack]="false"                         
            [inTitle]="'General Ledger Account Maintenance'">
          </grid-menubar>
            
           @if ((isLoading$ | async) === false) {
            @if(accounts$ | async; as accounts) {
              <gl-grid #gl_grid
              (onFocusChanged)="onSelection($event)"
              (onUpdateSelection)="selectedRow($event)"
              [data]="accounts"
              [columns]="cols" >
            </gl-grid> 
            }

            } @else {
            <div class="fixed z-[1050] -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4" >
              <mat-spinner></mat-spinner>
            </div>
            }
          </div>
        </ng-container>
      </mat-drawer-container>
      <ejs-contextmenu              
             target='#target' 
             (select)="itemSelect($event)"
             [animationSettings]='animation'
             [items]= 'menuItems'> 
      </ejs-contextmenu> 
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
export class GlAccountsComponent extends GLGridComponent {

  public editDrawer = viewChild<MatDrawer>("drawer");
  public settingsDrawer = viewChild<MatDrawer>("settings");

  accountsForm!: FormGroup;
  settingsForm!: FormGroup;

  private _fuseConfirmationService = inject(FuseConfirmationService);

  private formBuilder = inject(FormBuilder);
  private auth = inject(AuthService);
  subtypeService = inject(SubTypeService);
  typeStore = inject(TypeStore);

  Store = inject(Store);
  accounts$ = this.Store.select(accountsFeature.selectAccounts);
  selectedAccounts$ = this.Store.select(accountsFeature.selectSelectedAccount);
  isLoading$ = this.Store.select(accountsFeature.selectIsLoading);
  toast = inject(ToastrService);

  public sTitle = "Settings/Account Maintenance";
  public title = "General Ledger Accounts";
  public selectedItemKeys: any[] = [];
  public bDirty: boolean = false;
  private currentRow: Object;
  public bSettingsDirty: boolean = false;

  onSelection(e: any) {
    this.toast.success("Selected", JSON.stringify(e.data));
    this.currentRow = e.data;
  }

  public cols = [
    { field: "account", headerText: "Group", width: 80, textAlign: "Left" },
    { field: "child", headerText: "Account", width: 80, textAlign: "Left", isPrimaryKey: true, },
    { field: "acct_type", headerText: "Type", width: 80, textAlign: "Left" },
    { field: "description", headerText: "Description", width: 200, textAlign: "Left" },
    { field: "update_date", headerText: "Date", width: 80, textAlign: "Left" },
    { field: "update_user", headerText: "User", width: 80, textAlign: "Left" },
    { field: "comments", headerText: "Comment", width: 80, textAlign: "Left" },
  ];

  public bAccountsDirty: boolean = false;
  
  ngOnInit() {
    // this.accountService.read();
    this.Store.dispatch(accountPageActions.load());

    this.createEmptyForm();

    this.settingsForm.valueChanges.subscribe((value) => {
      this.bSettingsDirty = true;
    });
    
    this.accountsForm.valueChanges.subscribe((value) => {
      this.bAccountsDirty = true
    });
  }


  public menuItems: MenuItemModel[] = [
    {
      id: 'Edit',
      text: 'Update Account',
      iconCss: 'e-icons e-edit-2'
    },
    {
      id: 'Create',
      text: 'Create Account',
      iconCss: 'e-icons e-circle-add'
    },
    {
      id: 'Clone',
      text: 'Clone Account',
      iconCss: 'e-icons e-copy'
    },
    {
      id: 'Delete',
      text: 'Deactivate Account',
      iconCss: 'e-icons e-delete-1'
    },
    {
      separator: true
    },
    {
      id: 'Settings',
      text: 'Settings',
      iconCss: 'e-icons e-settings'
    },

  ];

  public itemSelect(args: MenuEventArgs): void {

    switch (args.item.id) {
      case 'Edit':        
        this.selectedRow(this.currentRow);
        break;
      case 'Create':
        this.onAdd();
        break;
      case 'Clone':
        this.onClone("");
        break;
      case 'Delete':
        this.onDelete("");
        break;
      case 'Settings':
        this.onOpenSettings();
        break;
    }
  }

  onOpenSettings() {
    this.settingsDrawer().open();
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
      acct_type: account.acct_type,
      sub_type: account.sub_type,
      balance: account.balance,
      comments: account.comments,
    };
    // this.accountService.create(rawData);
    this.closeDrawer();
  }


  onDoubleClicked(args: any) {
    this.bAccountsDirty = false;
    const type = args.acct_type;
    var parent: boolean;
    parent = args.parent_account;
    this.accountsForm.patchValue({      
      account: [args.account],
      child: [args.child],
      parent_account: args.parent_account,
      description: [args.description],
      acct_type: type,
      comments: [args.comments],
    });

    this.openEditDrawer();
  }

  onNew($event: any) {
    this.createEmptyForm();
    this.openEditDrawer();

  }

  onCancel() {
    this.editDrawer().toggle();
  }


  addAccount(account: IAccounts) {
    this.Store.dispatch(accountPageActions.addAccount({ account }));
  }

  updateAccount(account: IAccounts) {
    this.Store.dispatch(accountPageActions.updateAccount({ account }));
  }

  deleteAccount(child: number) {
    this.Store.dispatch(accountPageActions.deleteAccount({ child }));
  }


  onUpdate(e: any) {
    const dDate = new Date();
    const updateDate = dDate.toISOString().split("T")[0];
    const user = '@' + this.auth.user().email.split("T")[0];

    const account = this.accountsForm.getRawValue();
    const rawData = {
      account: account.account,
      child: account.child,
      parent_account: account.parent_account,
      description: account.description,
      sub_type: "",
      acct_type: account.type,
      comments: account.comments,
      balance: 0,
      create_date: updateDate,
      create_user: user,
      update_date: updateDate,
      update_user: user,
      status: "OPEN",
    };
    this.updateAccount(rawData);
  }

  changeType(e) {
    console.debug("changeType ", JSON.stringify(e));
  }

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
        // this.accountService.delete(e.account);
      }
    });
    this.closeDrawer();
  }

  onRefresh() {
    // this.data$ = this.accountService.read();
  }

  onAdd() {
    this.createEmptyForm();
    this.openEditDrawer();
  }

  createEmptyForm() {
    this.accountsForm = this.formBuilder.group({
      account: ["", Validators.required],
      child: ["", Validators.required],
      parent_account: [false, Validators.required],
      description: ["", Validators.required],
      acct_type: ["", Validators.required],
      comments: ["", Validators.required],
    });
    this.settingsForm = this.formBuilder.group({
      arc: ["", Validators.required],
      ar: ["", Validators.required],
      apc: ["", Validators.required],
      ap: ["", Validators.required],
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
      acct_type: [e.acct_type, Validators.required],
      comments: [e.comments, Validators.required],
    });
  }

  onClose() {
    this.closeDrawer();
  }

  closeSettings() {
    this.settingsDrawer().close();
  }

  openEditDrawer() {
    if (this.settingsDrawer().opened) {
      this.settingsDrawer().close();
    }
    if (this.editDrawer().opened !== true) {
      this.editDrawer().open();
    } else {
      return;
    }
  }

  closeEditDrawer() {
    const opened = this.editDrawer().opened;
    if (opened === true) {
      this.editDrawer().toggle();
    } else {
      return;
    }
  }
}
