import { Component, inject, viewChild } from "@angular/core";
import { TypeStore } from "app/services/type.service";
import { CommonModule } from "@angular/common";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { GridMenubarStandaloneComponent } from "../../grid-components/grid-menubar.component";

import { MatDrawer } from "@angular/material/sidenav";
import { MaterialModule } from "app/shared/material.module";
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
import { MenuEventArgs, MenuItemModel } from "@syncfusion/ej2-navigations";
import { ContextMenuAllModule } from "@syncfusion/ej2-angular-navigations";
import { ToastrService } from "ngx-toastr";
import { SettingsComponent } from "./comp.accts.settings";
import { DrawerComponent } from "./comp.accts.drawer";
import { AccountsStore } from "app/store/accounts.store";
import { ApplicationStore } from "app/store/application.store";

const imports = [
  CommonModule,
  MaterialModule,
  GridMenubarStandaloneComponent,
  GLGridComponent,
  ContextMenuAllModule,
  SettingsComponent
];

const keyExpr = ["account", "child"];

@Component({
  selector: "glaccounts",
  imports: [imports, DrawerComponent],
  template: `

  
  <mat-drawer class="w-[450px]" #settings [opened]="false" mode="over" position="end"  [disableClose]="false" >
          <settings-drawer></settings-drawer>      
  </mat-drawer>

  <mat-drawer  class="w-[450px]" #drawer  [opened]="false"  mode="over" position="end" [disableClose]="false" >
          <accts-drawer
            [account] = "selectedAccount"
            (Cancel)="onClose()"
            (Update)="onUpdate($event)"
            (Add)="onAdd($event)"
            (Delete)="onDelete($event)">
          </accts-drawer>
  </mat-drawer>
  
  @if ( store.isLoading() === false) {  
    <mat-drawer-container id="target" class="flex-col h-screen">        
        <grid-menubar [showBack]="false" [inTitle]="'General Ledger Account Maintenance'"/>         
        <ng-container>
          <div class="border-1 border-gray-500">
            @if(store.isLoading() === false) {        
              <gl-grid #gl_grid                    
                  (onFocusChanged)="onSelection($event)"  
                  (onUpdateSelection)="selectedRow($event)"  
                  [data]="store.accounts()"  
                  [columns]="cols">
              </gl-grid> 
            }            
          </div>
        </ng-container>                
    </mat-drawer-container>
  } @else {
    <div class="flex justify-center items-center mt-20">
        <mat-spinner></mat-spinner>
    </div>
  }
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
export class GlAccountsComponent {

  public editDrawer = viewChild<MatDrawer>("drawer");
  public settingsDrawer = viewChild<MatDrawer>("settings");
  private _fuseConfirmationService = inject(FuseConfirmationService);
  private auth = inject(AuthService);

  selectedAccount: IAccounts | null;

  store = inject(AccountsStore);

  // store = inject(Store);
  // accounts$ = this.store.select(accountsFeature.selectAccounts);
  // selectedAccount$ = this.store.select(accountsFeature.selectSelectedAccount);
  // isLoading$ = this.store.select(accountsFeature.selectIsLoading);
  toast = inject(ToastrService);

  public selectedItemKeys: any[] = [];
  public bDirty: boolean = false;
  public bSettingsDirty: boolean = false;
  public bAccountsDirty: boolean = false;
  private currentRow: Object;


  public cols = [
    { field: "account", headerText: "Group", width: 80, textAlign: "Left" },
    { field: "child", headerText: "Account", width: 80, textAlign: "Left", isPrimaryKey: true, },
    { field: "acct_type", headerText: "Type", width: 80, textAlign: "Left" },
    { field: "description", headerText: "Description", width: 200, textAlign: "Left" },
    { field: "update_date", headerText: "Date", width: 80, textAlign: "Left" },
    { field: "update_user", headerText: "User", width: 80, textAlign: "Left" },
    { field: "comments", headerText: "Comment", width: 80, textAlign: "Left" },
  ];


  public menuItems: MenuItemModel[] = [
    { id: 'edit', text: 'Edit Line Item', iconCss: 'e-icons e-edit-2' },
    { id: 'evidence', text: 'Add Evidence', iconCss: 'e-icons e-file-document' },
    { id: 'lock', text: 'Lock Transaction', iconCss: 'e-icons e-lock' },
    { id: 'cancel', text: 'Cancel Transaction', iconCss: 'e-icons e-table-overwrite-cells' },
    { separator: true },
    { id: 'back', text: 'Back to Transaction List', iconCss: 'e-icons e-chevron-left' },
  ];

  onSelection(account: any) {
    // this.store.accounts();
    // this.store._accountsStore.select 
    // this.store.dispatch(accountPageActions.select(account.data));
  }

  ngOnInit() {
    this.store.readAccounts;
  }

  onOpenSettings() {
    this.settingsDrawer().open();
  }


  selectedRow($event) {
    this.onDoubleClicked($event);
  }

  // CRUD Functions
  onCreate(account: IAccounts) {
    const rawData = {
      account: account.account,
      child: account.child,
      parent_account: account.parent_account,
      description: account.description,
      acct_type: account.acct_type,
      sub_type: account.sub_type,
      balance: account.balance,
      comments: account.comments,
      create_date: new Date().toISOString().split("T")[0],
      create_user: '@' + this.auth.user().email.split("T")[0],
      update_date: new Date().toISOString().split("T")[0],
      update_user: '@' + this.auth.user().email.split("T")[0],
    };
    //this.store.dispatch(accountPageActions.addAccount({ account: rawData }));
    this.closeEditDrawer();
  }

  onDoubleClicked(args: any) {
    this.bAccountsDirty = false;
    const type = args.acct_type;
    var parent: boolean;
    parent = args.parent_account;
    this.openEditDrawer();
  }

  onAdd($event: any) {
    this.openEditDrawer();
  }

  onCancel() {
    this.editDrawer().toggle();
  }


  addAccount(account: IAccounts) {
    //this.store.dispatch(accountPageActions.addAccount({ account }));
  }

  updateAccount(account: IAccounts) {
    //this.store.dispatch(accountPageActions.updateAccount({ account }));
  }

  deleteAccount(child: number) {
    //this.store.dispatch(accountPageActions.deleteAccount({ child }));
  }


  onUpdate(account: IAccounts) {
    const dDate = new Date();
    const updateDate = dDate.toISOString().split("T")[0];
    const user = '@' + this.auth.user().email.split("T")[0];
  }

  onDeleteSelection() {
    this.onDelete(this.currentRow);
  }

  onDelete(e: any) {
    const child = e.child;
    const confirmation = this._fuseConfirmationService.open({
      title: `Delete  Account: ${e.account} Child: ${child}`,
      message: "Are you sure you want to delete this account? ",
      actions: {
        confirm: {
          label: "Delete",
        },
      },
    });

    confirmation.afterClosed().subscribe((result) => {

      if (result === "confirmed") {
        //this.store.dispatch(accountPageActions.deleteAccount({ child }));
      }
    });
    this.closeEditDrawer();
  }

  onClose() {
    this.closeEditDrawer();
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
