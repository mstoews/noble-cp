import { Component, HostListener, inject, OnInit, viewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { MatDrawer } from "@angular/material/sidenav";
import { MaterialModule } from "app/shared/material.module";
import {
  AggregateService,
  ColumnMenuService,
  ContextMenuService,
  EditService,
  EditSettingsModel,
  ExcelExportService,
  FilterService,
  FilterSettingsModel,
  GridLine,
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
import { IAccounts } from "app/models";
import { AuthService } from "app/features/auth/auth.service";

import { MenuItemModel } from "@syncfusion/ej2-navigations";
import { ContextMenuAllModule } from "@syncfusion/ej2-angular-navigations";
import { ToastrService } from "ngx-toastr";

import { DrawerComponent } from "./comp.accts.drawer";
import { AccountsStore } from "app/store/accounts.store";

import { GridMenubarStandaloneComponent } from "../../grid-components/grid-menubar.component";
import { Save } from "@syncfusion/ej2-file-utils";



const imports = [
  CommonModule,
  MaterialModule,
  GridMenubarStandaloneComponent,
  GridModule,
  ContextMenuAllModule,
  // SettingsComponent
];

const keyExpr = ["account", "child"];

@Component({
  selector: "glaccounts",
  imports: [imports, DrawerComponent],
  template: `  
  
  @if ( store.isLoading() === false) {  
    <grid-menubar [showPeriod]="false" [showBack]="false" [inTitle]="'General Ledger Account Maintenance'"/>         
    <mat-drawer-container id="target" class="flex-col h-screen">        
    <!-- <mat-drawer class="w-[400px]" #settings [opened]="false" mode="side" position="start"  [disableClose]="false" >
          <settings-drawer></settings-drawer>      
    </mat-drawer> -->

        <mat-drawer  class="w-[400px]" id="drawer" #drawer  [opened]="false"  mode="side" position="end" [disableClose]="false" class="bg-gray-100" >
            <accts-drawer
              [account] = "selectedAccount"
              (Cancel)="onClose()"
              (Update)="onUpdate($event)"
              (Add)="onAdd($event)"
              (Delete)="onDelete($event)">
            </accts-drawer>
        </mat-drawer>

        
        <ng-container>
          
          <div class="border-1 border-gray-500">
            @if(store.isLoading() === false) {        
              <ejs-grid #gl_grid                                                        
                  [sortSettings]="detailSort"                  
                  [columns]="cols"
                  [dataSource]="store.accounts()"                                    
                  [height]='gridHeight' 
                  [rowHeight]='30'                                  
                  [allowSorting]='true'                                    
                  [showColumnMenu]='false'                
                  [gridLines]="lines"
                  [allowFiltering]='false'                 
                  [toolbar]='toolbarOptions'                                             
                  [editSettings]='editSettings'
                  [enablePersistence]='true'                                    
                  [allowGrouping]="true"
                  [allowResizing]='true' 
                  [allowReordering]='true' 
                  [allowExcelExport]='true'
                  [allowSelection]='true'                                     
                  [allowPdfExport]='true'            
                  [groupSettings]='groupSettings'                   
                  (actionBegin)='actionBegin($event)' 
                  (rowSelected)="rowSelected($event)"              
                  >
              </ejs-grid> 
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
  styles: [`
      @use '@angular/material' as mat;
      .e-grid {
        font-family: cursive;
        border: 1px solid #f0f0f0;
      }
    
     :root {
        @include mat.slide-toggle-overrides((
        track-outline-color: orange,
        disabled-unselected-track-outline-color: red,
        )); 
      }
    `,
  ],
})
export class GlAccountsComponent implements OnInit {

  public editDrawer = viewChild<MatDrawer>("drawer");
  public settingsDrawer = viewChild<MatDrawer>("settings");
  private _fuseConfirmationService = inject(FuseConfirmationService);
  private auth = inject(AuthService);

  public gridHeight: number;
  
  public detailSort: Object;

  selectedAccount: IAccounts | null;

  store = inject(AccountsStore);
  toast = inject(ToastrService);

  public selectedItemKeys: any[] = [];
  public bDirty: boolean = false;
  public bSettingsDirty: boolean = false;
  public bAccountsDirty: boolean = false;
  private currentRow: Object;

  public formatoptions: Object;
  public initialSort: Object;
  public editSettings: EditSettingsModel;
  
  public submitClicked: boolean = false;
  public selectionOptions?: SelectionSettingsModel;
  public toolbarOptions?: ToolbarItems[];
  public searchOptions?: SearchSettingsModel;
  public filterSettings: FilterSettingsModel;
  public lines: GridLine;
  


  public cols = [
    { field: "account", headerText: "Group", width: 80, textAlign: "Left" },
    { field: "child", headerText: "Account", width: 80, textAlign: "Left", isPrimaryKey: true  },
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
  initialDatagrid() {
    this.formatoptions = { type: 'dateTime', format: 'M/dd/yyyy' }
    this.selectionOptions = { mode: 'Row' };
    this.editSettings = { allowEditing: true, allowAdding: false, allowDeleting: false };
    this.searchOptions = { operator: 'contains', ignoreCase: true, ignoreAccent: true };
    this.toolbarOptions = ['Search'];
    this.filterSettings = { type: 'Excel' };
  }

  onSelection(account: any) {
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
      create_user: '@' + this.auth.user().email.split("@")[0],
      update_date: new Date().toISOString().split("T")[0],
      update_user: '@' + this.auth.user().email.split("@")[0],
    };
    this.selectedAccount = rawData;    
  }

  ngOnInit() {
    this.initialDatagrid()  
    if (this.store.isLoaded() === false ) 
      this.store.readAccounts(); 
  }

  onOpenSettings() {
    this.settingsDrawer().open();
  }


   actionBegin(args: SaveEventArgs): void {
          var data = args.rowData;
  
          if (args.requestType === 'beginEdit' || args.requestType === 'add') {
              args.cancel = true;
              const account = args.rowData as IAccounts;
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
                create_user: '@' + this.auth.user().email.split("@")[0],
                update_date: new Date().toISOString().split("T")[0],
                update_user: '@' + this.auth.user().email.split("@")[0],
              };
              this.selectedAccount = rawData;    
              this.onDoubleClicked(rawData);              
          }
  
          if (args.requestType === 'delete') {
              args.cancel = true;
              
          }
          if (args.requestType === 'save') {
              args.cancel = true;
          }
      }
  
  selectedRow(args: any) {      
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      args.cancel = true;
      const account = args.rowData;
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
        create_user: '@' + this.auth.user().email.split("@")[0],
        update_date: new Date().toISOString().split("T")[0],
        update_user: '@' + this.auth.user().email.split("@")[0],
      };
      this.selectedAccount = rawData;    
      this.onDoubleClicked(rawData);
    }    
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
      create_user: '@' + this.auth.user().email.split("@")[0],
      update_date: new Date().toISOString().split("T")[0],
      update_user: '@' + this.auth.user().email.split("@")[0],
    };
    this.selectedAccount = rawData;    
    this.store.addAccounts(rawData);
    this.closeEditDrawer();
  }

  onDoubleClicked(account: any) {
    this.bAccountsDirty = false;
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
      create_user: '@' + this.auth.user().email.split("@")[0],
      update_date: new Date().toISOString().split("T")[0],
      update_user: '@' + this.auth.user().email.split("@")[0],
    };
    const type = account.acct_type;
    var parent: boolean;
    parent = account.parent_account;
    this.selectedAccount = rawData;
    this.openEditDrawer();
  }
  onAdd($event: any) {
    this.openEditDrawer();
  }
  onCancel() {
    this.editDrawer().toggle();
  }
  addAccount(account: IAccounts) {
    const updateDate = new Date().toISOString().split("T")[0];
    var user = this.auth.user().email.split("@")[0];
    user = '@' + user;

    const rawData = {
      account: account.account,
      child: account.child,
      parent_account: account.parent_account,
      description: account.description,
      acct_type: account.acct_type,
      sub_type: account.sub_type,
      balance: account.balance,
      comments: account.comments,
      create_date: account.create_date,
      create_user: account.create_user,
      update_date: updateDate,
      update_user: user,
    };
    this.store.addAccounts(account);    
  }

  
  deleteAccount(child: number) {
    this.store.removeAccounts(child);    
  }

  onUpdate(account: IAccounts) {    
    const updateDate = new Date().toISOString().split("T")[0];
    var user = this.auth.user().email.split("@")[0];
    user = '@' + user;

    const rawData = {
      account: account.account,
      child: account.child,
      parent_account: account.parent_account,
      description: account.description,
      acct_type: account.acct_type,
      sub_type: account.sub_type,
      balance: account.balance,
      comments: account.comments,
      create_date: account.create_date,
      create_user: account.create_user,
      update_date: updateDate,
      update_user: user,
    };
    this.store.updateAccounts(rawData);    
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
        this.store.removeAccounts(child);
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
    // if (this.settingsDrawer().opened) {
    //   this.settingsDrawer().close();
    // }    
      this.editDrawer().open();    
  }

  closeEditDrawer() {
    const opened = this.editDrawer().opened;
    if (opened === true) {
      this.editDrawer().toggle();
    } else {
      return;
    }
  }

  @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.gridHeight = event.target.innerHeight - 480;
    }

    constructor() {
        this.gridHeight = window.innerHeight - 480;
    }

}

