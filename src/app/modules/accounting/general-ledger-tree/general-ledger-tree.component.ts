import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import {
  DxDataGridModule,
  DxBulletModule,
  DxTemplateModule,
  DxTreeListModule,
} from 'devextreme-angular';

import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";

import { IAccounts, IType } from 'app/models';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { GLAccountsService } from 'app/services/accounts.service';
import { TypeService } from 'app/services/type.service';
import { MatSelectModule } from '@angular/material/select';
import { AUTH } from 'app/app.config';
import { Subject, filter, takeUntil } from 'rxjs';


const imports = [
  CommonModule,
  DxDataGridModule,
  DxBulletModule,
  DxTemplateModule,
  MatSidenavModule,
  DxTreeListModule,
  MatCardModule,
  ReactiveFormsModule,
  MatIconModule,
  FormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatCheckboxModule,
  MatButtonModule,
  MatSelectModule
];

@Component({
  selector: 'general-ledger-tree',
  standalone: true,
  imports: [imports],
  styles: [`
    ::ng-deep .dx-datagrid .dx-datagrid-rowsview .dx-row-focused.dx-data-row:not(.dx-edit-row) > td:not(.dx-focused) {
        background-color: rgb(195, 199, 199);
        border-color: rgb(195, 199, 199);
      }
    `],
  templateUrl: './general-ledger-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GLAccountsService, TypeService],
})
export class GeneralLedgerTreeComponent implements OnInit, OnDestroy {

  private fb = inject(FormBuilder);
  private accountApiService = inject(GLAccountsService);
  private typesApiService = inject(TypeService);
  private auth = inject(AUTH);
  private updated_type: string = 'Asset';

  _unsubscribeAll: Subject<any> = new Subject<any>();

  changeType(e: string) {
    this.updated_type = e;
  }

  // local variables
  @ViewChild('drawer') drawer!: MatDrawer;
  collapsed = false;
  sTitle = 'General Ledger Accounts';
  selectedItemKeys: any[] = [];

  drawOpen: 'open' | 'close' = 'open';

  customizeTooltip = (pointsInfo: { originalValue: string; }) => ({ text: `${parseInt(pointsInfo.originalValue)}%` });
  accountsForm!: FormGroup;
  accounts$ = this.accountApiService.getAll();
  types$ = this.typesApiService.read();
  keyField: any;

  ngOnInit() {
    this.createEmptyForm();
  }

  onDelete($event: any) {
    throw new Error('Method not implemented.');
  }
  selectionType($event: any) {
    throw new Error('Method not implemented.');
  }

  add() {
    this.createEmptyForm();
    this.openDrawer();
  }

  createEmptyForm() {
    this.accountsForm = this.fb.group({
      account: ['', Validators.required],
      child: [''],
      parent_account: ['', Validators.required],
      description: ['', Validators.required],
      balance: ['', Validators.required],
      type: ['', Validators.required],
      comments: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

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
      sub_type: account.sub_type,
      balance: 0.0,
      type: account.type,
      comments: account.comments,
      create_date: createDate,
      create_user: User.email,
      update_date: createDate,
      update_user: User.email,
    };
    this.accountApiService.create(rawData);
    this.closeDrawer();

  }


  formatNumber(e) {
    const options = {
      style: 'decimal',  // Other options: 'currency', 'percent', etc.
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };
    const formattedWithOptions = e.value.toLocaleString('en-US', options);
    console.log(formattedWithOptions);
    return formattedWithOptions;
  }

  onUpdate() {
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    const account = { ...this.accountsForm.value } as IAccounts;
    const rawData = {
      account: account.account,
      child_account: account.child,
      parent_account: account.parent_account,
      description: account.description,
      balance: account.balance,
      type: account.type,
      comments: account.comments,
      update_date: updateDate,
      update_user: 'mst_tech',
    };
    // this.accountApiService.update(rawData, account.id);
    this.closeDrawer();
  }


  selectionChanged(data: any) {
    this.selectedItemKeys = data.selectedRowKeys;
  }

  onCellDoubleClicked(e: any) {
    this.updated_type = e.data.type;

    this.accountsForm = this.fb.group({
      account: [e.data.account],
      parent_account: [e.data.parent_account],
      child_account: [e.data.child_account],
      balance: [e.data.balance],
      type: [this.updated_type],
      description: [e.data.description],
      comments: [e.data.comments],
    });
    this.openDrawer();
  }

  onFocusedRowChanged(e: any) {
    console.log(`selectionChanged ${JSON.stringify(e.data)}`);
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

  getType(type: string) {
    this.types$.pipe(filter((val) => !!val)).pipe(takeUntil(this._unsubscribeAll))
      .subscribe((val) => console.debug('new inventory item', val));
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();

  }



  private assignType(gltype: IType, types: IType[]) {
    var currentType: string;
    if (types !== undefined) {
      const type = types.find(
        (x) => x.type === gltype.type.toString()
      );
      if (type !== undefined) {
        currentType = type.type;
      } else {
        currentType = 'Asset';
      }
    } else {
      currentType = 'Asset';
    }
    return currentType;
  }
}

export interface IValue {
  value: string;
  viewValue: string;
}


