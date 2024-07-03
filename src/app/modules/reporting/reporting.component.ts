import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { MaterialModule } from 'app/services/material.module';
import { RouterOutlet } from '@angular/router';
import { TrialBalanceComponent } from './trial-balance/trial-balance.component';
import { ReportTestComponent } from './report-test.component';

export interface IValue {
  value: string;
  viewValue: string;
}

const imports = [
  MaterialModule,
  FormsModule,
  ReactiveFormsModule,
  CommonModule,
  RouterOutlet,
  CommonModule,
  TrialBalanceComponent,
  ReportTestComponent
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


