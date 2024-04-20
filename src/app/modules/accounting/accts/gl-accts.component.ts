import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { DxBulletModule, DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ISubType, SubTypeService } from 'app/services/subtype.service';
import { IType, TypeService } from 'app/services/type.service';

import { AUTH } from 'app/app.config';
import { CommonModule } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { GLAccountsService } from 'app/services/accounts.service';
import { GLAcctDetailComponent } from './gl-accts-detail/gl-accts-detail.component';
import { GridMenubarStandaloneComponent } from '../grid-menubar/grid-menubar.component';
import { IAccounts } from 'app/models';
import { IValue } from 'app/modules/kanban/kanban.component';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { Subscription } from 'rxjs';

const imports = [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    DxDataGridModule,
    DxBulletModule,
    DxTemplateModule,
    GridMenubarStandaloneComponent,
    GLAcctDetailComponent
];

const keyExpr = ["account", "child"];

@Component({
    selector: 'gl-accounts',
    standalone: true,
    imports: [imports],
    templateUrl: './gl-accts.component.html',
    providers: []
})
export class GlAccountsComponent implements OnInit, OnDestroy {
    @ViewChild('drawer') drawer!: MatDrawer;
    accountsForm!: FormGroup;
    public data$: any;
    private _fuseConfirmationService = inject(FuseConfirmationService);
    private fb = inject(FormBuilder);

    private auth = inject(AUTH);
    private accountService = inject(GLAccountsService);
    public sTitle = "Settings/Account Maintenance"
    public title = 'General Ledger Accounts';
    public selectedItemKeys: any[] = [];
    private currentRow: Object;

    types: IType[];
    subTypes: ISubType[];
    subscriptionType: Subscription;
    subscriptionSubType: Subscription;

    typeService =  inject(TypeService)
    subtypeService = inject(SubTypeService)


    ngOnInit() {
        this.createEmptyForm();
        this.data$ = this.accountService.read();
        this.subscriptionType = this.typeService.read().subscribe((types) => (this.types = types));
    }

    ngOnDestroy(): void {
        this.subscriptionType.unsubscribe();
    }


    // CRUD Functions
    onCreate(e: any) {
        const dDate = new Date();
        const User = this.auth.currentUser;
        const createDate = dDate.toISOString().split('T')[0];
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
        // const updateDate = dDate.toISOString().split('T')[0];

        const account = { ...this.accountsForm.value } as IAccounts;
        const rawData = {
            account: account.account,
            child: account.child,
            parent_account: account.parent_account,
            description: account.description,
            sub_type: account.sub_type,
            type: account.type,
            comments: account.comments,
        };

        this.accountService.update(rawData);
        this.closeDrawer();
    }

    changeType(e) {
        console.log('changeType ', JSON.stringify(e));
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
        this.data$ = this.accountService.read();
    }

    onAdd() {
        this.createEmptyForm();
        this.openDrawer();
    }



    createEmptyForm() {
        this.accountsForm = this.fb.group({
            account: ['', Validators.required],
            child: ['', Validators.required],
            parent_account: ['', Validators.required],
            description: ['', Validators.required],
            balance: ['', Validators.required],
            type: ['', Validators.required],
            sub_type: ['', Validators.required],
            comments: ['', Validators.required],
            status: ['', Validators.required]
        });
    }

    private assignType(type: string ): string {
        var vType: string;
        if (type !== null && type !== undefined) {
          const typ = this.types.find((x) => x.type === type);
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
        this.accountsForm = this.fb.group({
            account: [e.account, Validators.required],
            child: [e.child, Validators.required],
            parent_account: [e.parent_account, Validators.required],
            description: [e.description, Validators.required],
            balance: [e.balance, Validators.required],
            type: [sType, Validators.required],
            sub_type: [e.sub_type, Validators.required],
            comments: [e.comments, Validators.required],
            status: [e.status, Validators.required],
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
            sub_type: [args.data.sub_type],
            comments: [args.data.comments],
            status: [args.data.status],
        }
        this.createForm(account)

        this.openDrawer();
    }

    onFocusedRowChanged(e: any) {
        this.currentRow = e.row.data;
        console.log(`selectionChanged ${JSON.stringify(e.row.data)}`);
    }
}
