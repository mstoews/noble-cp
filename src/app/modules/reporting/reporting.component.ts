import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { DistributedLedgerComponent } from './distributed-ledger/distributed-ledger.component';
import { DistributionReportComponent } from './distribution-report/distribution-report.component';
import { DxDataGridModule } from 'devextreme-angular';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { ReportComponent } from './report.component';
import { RouterOutlet } from '@angular/router';
import { TransactionAnalysisComponent } from './transaction-analysis/transaction-analysis.component';

export interface IValue {
  value: string;
  viewValue: string;
}

const imports = [
  MaterialModule,
  FormsModule,
  ReactiveFormsModule,
  DxDataGridModule,
  CommonModule,
  RouterOutlet,
  CommonModule,
  DistributedLedgerComponent,
  ReportComponent,
  DistributionReportComponent,
  TransactionAnalysisComponent
]

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [imports],
  templateUrl: './reporting.component.html'
})
export class ReportingMainComponent implements OnInit {

  sTitle = ''

  ngOnInit(): void {

  }

}


