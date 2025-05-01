import { Component, inject, viewChild } from "@angular/core";
import { TypeStore } from "app/services/type.service";
import { CommonModule } from "@angular/common";
import { FuseConfirmationService } from "@fuse/services/confirmation";
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

import { IAccounts, ISettings } from "app/models";
import { AuthService } from "app/features/auth/auth.service";
import { GLGridComponent } from "../../grid-components/gl-grid.component";
import { ContextMenuAllModule, MenuItemModel } from "@syncfusion/ej2-angular-navigations";
import { ToastrService } from "ngx-toastr";
import { SettingsDrawerComponent } from "./settings.drawer";
import { GridMenubarStandaloneComponent } from "../../grid-components/grid-menubar.component";
import { SettingsStore } from "app/store/settings.store";
import { isVisible } from "@syncfusion/ej2-base";

const imports = [
  CommonModule,
  MaterialModule,
  GridMenubarStandaloneComponent,
  GLGridComponent,
  ContextMenuAllModule,
  SettingsDrawerComponent
];

const keyExpr = ["account", "child"];

@Component({
  selector: "app-settings",
  imports: [imports],
  template: `  
  <mat-drawer  class="w-[450px]" #drawer  [opened]="false"  mode="over" position="end" [disableClose]="false" >
          <setting-drawer
            [account] = "selectedSetting"
            (Cancel)="onClose()"
            (Update)="onUpdate($event)"
            (Add)="onAdd($event)"
            (Delete)="onDelete($event)">
          </setting-drawer>
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
                  [data]="store.settings()"  
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
export class AppSettingsComponent {

  public editDrawer = viewChild<MatDrawer>("drawer");
  public settingsDrawer = viewChild<MatDrawer>("settings");
  private _fuseConfirmationService = inject(FuseConfirmationService);
  private auth = inject(AuthService);

  selectedSetting: ISettings | null;
  
  store = inject(SettingsStore);  
  toast = inject(ToastrService);

  public selectedItemKeys: any[] = [];
  public bDirty: boolean = false;
  public bSettingsDirty: boolean = false;  
  private currentRow: Object;


  public cols = [
  { field: "id", headerText: "ID", width: 80, textAlign: "Left", isPrimaryKey: true, visible: false },    
  { field: "setting", headerText: "Setting", width: 80, textAlign: "Left" },
  { field: "value", headerText: "Value", width: 100, textAlign: "Left" },
  { field: "description", headerText: "Description", width: 200, textAlign: "Left" },
  { field: "create_date", headText: "Create Date", width: 100, textAlign: "Left", visible: false },
  { field: "create_user", headText: "Create User", width: 100, textAlign: "Left", visible: false },
  { field: "update_date", headText: "Update Date", width: 80, textAlign: "Left", visible: false },
  { field: "update_user", headText: "Update User", width: 100, textAlign: "Left", visible: false },    
  ];


  public menuItems: MenuItemModel[] = [
    { id: 'edit', text: 'Edit Line Item', iconCss: 'e-icons e-edit-2' },
    { id: 'evidence', text: 'Add Evidence', iconCss: 'e-icons e-file-document' },
    { id: 'lock', text: 'Lock Transaction', iconCss: 'e-icons e-lock' },
    { id: 'cancel', text: 'Cancel Transaction', iconCss: 'e-icons e-table-overwrite-cells' },
    { separator: true },
    { id: 'back', text: 'Back to Transaction List', iconCss: 'e-icons e-chevron-left' },
  ];

  onSelection(setting: any) {
    this.selectedSetting = setting;    
  }

  ngOnInit() {
    this.store.readSettings();    
  }

  onOpenSettings() {
    this.settingsDrawer().open();
  }
  selectedRow(setting: ISettings) {    
    const rawData = {
      id : setting.id,
      setting: setting.setting,
      value: setting.value,
      description: setting.description,
      create_date: setting.create_date,
      create_user: setting.create_user,
      update_date: setting.update_date,
      update_user: setting.update_user,      
      
    };
    this.selectedSetting = rawData;    
    this.onDoubleClicked(rawData);
  }

  // CRUD Functions
  onCreate(settings: ISettings) {      
    this.store.addSetting(settings);
    this.closeEditDrawer();
  }

  onDoubleClicked(settings: ISettings) {    
    this.selectedSetting = settings;
    this.openEditDrawer();
  }

  onAdd($event: any) {
    this.openEditDrawer();
  }

  onCancel() {
    this.editDrawer().toggle();
  }
  updateAccount(setting: ISettings) {
    this.store.updateSetting(setting);    
  }

  deleteAccount(setting: ISettings) {
    this.store.removeSetting(setting);
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
      title: `Delete  Settings: ${e.account} Child: ${child}`,
      message: "Are you sure you want to delete this account? ",
      actions: {
        confirm: {
          label: "Delete",
        },
      },
    });

    confirmation.afterClosed().subscribe((result) => {

      if (result === "confirmed") {
        this.deleteAccount(child);
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
