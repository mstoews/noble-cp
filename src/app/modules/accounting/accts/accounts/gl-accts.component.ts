import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubTypeService } from 'app/services/subtype.service';
import { TypeService } from 'app/services/type.service';

import { AUTH } from 'app/app.config';
import { CommonModule, JsonPipe } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { GLAccountsService } from 'app/services/accounts.service';
import { GridMenubarStandaloneComponent } from '../../grid-menubar/grid-menubar.component';

import { IValue } from 'app/modules/kanban/kanban/kanban.component';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { AggregateService, ColumnMenuService, DialogEditEventArgs, EditService, FilterService, FilterSettingsModel, GridModule, GroupService, PageService, ResizeService, SaveEventArgs, SearchSettingsModel, SelectionSettingsModel, SortService, ToolbarItems, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { IAccounts } from 'app/models/journals';


const imports = [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    GridMenubarStandaloneComponent,
    JsonPipe,
    GridModule
];

const keyExpr = ["account", "child"];

@Component({
    selector: 'glaccounts',
    standalone: true,
    imports: [imports],
    templateUrl: './gl-accts.component.html',
    providers: [SortService, GroupService ,PageService, ResizeService, FilterService, ToolbarService, EditService, AggregateService, ColumnMenuService,],
})
export class GlAccountsComponent implements OnInit {
    @ViewChild('drawer') drawer!: MatDrawer;
    accountsForm!: FormGroup;

    private _fuseConfirmationService = inject(FuseConfirmationService);

    private fb = inject(FormBuilder);
    private auth = inject(AUTH);
    accountService = inject(GLAccountsService);
    subtypeService = inject(SubTypeService)

    public sTitle = "Settings/Account Maintenance"
    public title = 'General Ledger Accounts';
    public selectedItemKeys: any[] = [];
    private currentRow: Object;
    

    readonly displayModes = [{ text: "Display Mode 'full'", value: 'full' }, { text: "Display Mode 'compact'", value: 'compact' }];
    displayMode = 'compact';
    showPageSizeSelector = true;
    showInfo = true;
    showNavButtons = true;

    typeList = inject(TypeService).read();

    ngOnInit() {
        this.accountService.read();
        this.createEmptyForm();
        this.initialDatagrid();
    }

    // datagrid settings start
    public pageSettings: Object;
    public formatoptions: Object;
    public initialSort: Object;
    public filterOptions: FilterSettingsModel;
    public editSettings: Object;
    public dropDown: DropDownListComponent;
    public submitClicked: boolean = false;
    public selectionOptions?: SelectionSettingsModel;
    public toolbarOptions?: ToolbarItems[];
    public searchOptions?: SearchSettingsModel;
    public filterSettings: FilterSettingsModel;
    
    
    initialDatagrid() {
        // this.pageSettings = { pageCount: 10 };        
        this.formatoptions = { type: 'dateTime', format: 'M/dd/yyyy' }        
        this.pageSettings =  { pageSizes: true, pageCount: 10 };
        this.selectionOptions = { mode: 'Cell' };              
        this.editSettings = { allowEditing: true, allowAdding: false, allowDeleting: false };
        this.searchOptions = { operator: 'contains', ignoreCase: true, ignoreAccent:true };
        this.toolbarOptions = ['Search'];   
        this.filterSettings = { type: 'Excel' };    
    }



    actionBegin(args: SaveEventArgs): void {        
        var data = args.rowData as IAccounts;
        if (args.requestType === 'beginEdit' || args.requestType === 'add') {        
           this.openDrawer();        
                        
        }
        if (args.requestType === 'save') {
            args.cancel = true;
            console.log(JSON.stringify(args.data));
            var data = args.data as IAccounts;                        
        }
    }

    actionComplete(args: DialogEditEventArgs): void {
        if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
            if (args.requestType === 'beginEdit') {
                // (args.form.elements.namedItem('CustomerName') as HTMLInputElement).focus();
            } else if (args.requestType === 'add') {
                // (args.form.elements.namedItem('OrderID') as HTMLInputElement).focus();
            }
        }
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

    onUpdateSelection() {
        this.openDrawer()
    }

    onUpdate(e: any) {
        const dDate = new Date();
        const updateDate = dDate.toISOString().split('T')[0];
        const user = this.auth.currentUser.email;

        const account = this.accountsForm.getRawValue()
        const rawData = {
            account: account.account,
            child: account.child,
            parent_account: account.parent_account,
            description: account.description,
            sub_type: '',
            type: account.type,
            comments: account.comments,
            balance: 0,
            create_date: updateDate,
            create_user: user,
            update_date: updateDate,
            update_user: user,
            status: "open"

        };
        this.accountService.update(rawData);
    }

    changeType(e) {
        console.debug('changeType ', JSON.stringify(e));
    }

    sub_types: IValue[] = [
        { value: 'Add', viewValue: 'Add' },
        { value: 'Update', viewValue: 'Update' },
        { value: 'Delete', viewValue: 'Delete' },
        { value: 'Verify', viewValue: 'Verify' },
    ];


    onDeleteSelection() {
        this.onDelete(this.currentRow);
    }

    onDelete(e: any) {
        console.debug(`onDelete ${JSON.stringify(e)}`);
        const confirmation = this._fuseConfirmationService.open({
            title: `Delete  Account: ${e.account} Child: ${e.child}`,
            message: 'Are you sure you want to delete this account? ',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                // Delete the list
                this.accountService.delete(e.account)
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
        this.accountsForm = this.fb.group({
            account: ['', Validators.required],
            child: ['', Validators.required],
            parent_account: [false, Validators.required],
            description: ['', Validators.required],
            type: ['', Validators.required],
            comments: ['', Validators.required],
        });
    }

    private assignType(type: string): string {
        var vType: string;

        if (type !== null && type !== undefined) {
            const typ = this.typeList().find((x) => x.type === type);
            if (typ === undefined) {
                vType = 'Assets';
            } else {
                vType = type
            }
        } else {
            vType = 'Assets';
        }
        return vType;
    }

    createForm(e) {
        const sType = this.assignType(e.type);
        var parent: boolean;
        parent = e.parent_account;
        this.accountsForm = this.fb.group({
            account: [e.account, Validators.required],
            child: [e.child, Validators.required],
            parent_account: parent,
            description: [e.description, Validators.required],
            type: [sType, Validators.required],
            comments: [e.comments, Validators.required],
        });
    }

    openDrawer() {
        const opened = this.drawer.opened;
        if (opened !== true) {
            this.drawer.toggle();
        } else {
            return;
        }
    }

    closeDrawer() {
        const opened = this.drawer.opened;
        if (opened === true) {
            this.drawer.toggle();
        } else {
            return;
        }
    }

    onDoubleClicked(args: any) {
        const type = args.data.type;
        this.assignType(type)


        const account = {
            account: [args.data.account],
            child: [args.data.child],
            parent_account: [args.data.parent_account],
            description: [args.data.description],
            balance: [args.data.balance],
            type: [type],
            comments: [args.data.comments],
        }
        this.createForm(account)

        this.openDrawer();
    }

    onFocusedRowChanged(e: any) {
        this.currentRow = e.row.data;
        const type = e.row.data.type;
        this.assignType(type)

        const account = {
            account: [e.row.data.account],
            child: [e.row.data.child],
            parent_account: [e.row.data.parent_account],
            description: [e.row.data.description],
            balance: [e.row.data.balance],
            type: [type],
            comments: [e.row.data.comments],
        }
        this.createForm(account)

    }
}