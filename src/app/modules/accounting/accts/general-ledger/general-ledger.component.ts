import { ChangeDetectionStrategy, Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import {
  DxDataGridModule,
  DxBulletModule,
  DxTemplateModule,
} from 'devextreme-angular';

import { MatDrawer} from '@angular/material/sidenav';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { IAccounts, IType } from 'app/models';

import { GLAccountsService } from 'app/services/accounts.service';
import { TypeService } from 'app/services/type.service';

import { MaterialModule } from 'app/services/material.module';


const imports = [
  CommonModule,
  DxDataGridModule,
  DxBulletModule,
  DxTemplateModule,
  ReactiveFormsModule,
  MatIconModule,
  FormsModule,
  MaterialModule,

];

@Component({
  selector: 'app-general-ledger',
  standalone: true,
  imports: [imports],
  styles: [`
    ::ng-deep .dx-datagrid .dx-datagrid-rowsview .dx-row-focused.dx-data-row:not(.dx-edit-row) > td:not(.dx-focused) {
        background-color: rgb(195, 199, 199);
        border-color: rgb(195, 199, 199);
      }
    `],
  templateUrl: './general-ledger.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GLAccountsService, TypeService],
})
export class GeneralLedgerComponent implements OnInit {
  private fb = inject(FormBuilder);
  private accountApiService = inject(GLAccountsService);
  private typesApiService = inject(TypeService);

  private updated_type: string = 'Asset';

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
  accounts$ = this.accountApiService.read();
  types$ = this.typesApiService.read();
  keyField: any;

  ngOnInit() {
    this.createEmptyForm();
  }

  add() {
    this.createEmptyForm();
    this.openDrawer();
  }


  createEmptyForm() {
    this.accountsForm = this.fb.group({
      account: ['', Validators.required],
      description: ['', Validators.required],
      balance: ['', Validators.required],
      type: ['', Validators.required],
      comments: ['', Validators.required],
      sub_type: ['', Validators.required],
      special_assessment: ['', Validators.required],
      capital_asset_fund: ['', Validators.required],
      reserve_fund: ['', Validators.required],
    });
  }

  onUpdate() {
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    const account = { ...this.accountsForm.value } as IAccounts;
    const rawData = {
      ...account,
      create_date: updateDate,
      create_user: 'admin',
      update_date: updateDate,
      update_user: 'admin',
    };
    // this.accountApiService.update(rawData);
    this.closeDrawer();
  }

  selectionChanged(data: any) {
    console.log(`selectionChanged ${JSON.stringify(data.data)}`);
    this.selectedItemKeys = data.selectedRowKeys;
  }

  onCellDoubleClicked(e: any) {
    console.log(`ondoubleClicked an item   ${JSON.stringify(e.data)}`);

    this.updated_type = e.data.type;

    this.accountsForm = this.fb.group({
      account: [e.data.account],
      balance: [e.data.balance],
      type: [this.updated_type],
      description: [e.data.description],
      sub_type: [e.data.sub_type],
      special_assessment: [e.data.special_assessment],
      capital_asset_fund: [e.data.capital_asset_fund],
      reserve_fund: [e.data.reserve_fund],
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
    return 'Assets'
    // return this.typesApiService.findProductByUrl(type);
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



/*
id?: string;
account: string;
child_account: string;
type: string;
description: string;
balance: number;
sub_type: boolean;
special_assessment: boolean;
capital_asset_fund: boolean;
reserve_fund: boolean;
comments: string;
createDate: string;
createUsr: string;
updateDate: string;
updateUsr: string;
*/




