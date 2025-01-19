
import { Component, inject, OnInit } from '@angular/core';
import { ITrialBalance } from 'app/models';
import { ReportStore } from 'app/services/reports.store';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { GridMenubarStandaloneComponent } from 'app/features/accounting/grid-components/grid-menubar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'tb-grid',
  providers: [ReportStore],
  imports: [MatTableModule, GridMenubarStandaloneComponent, MatProgressSpinnerModule, CurrencyPipe],
  template: `

<div class="flex flex-col min-w-0 overflow-y-auto -px-10">
    <div class="flex-auto">
        <div class="h-full border-gray-300">
            <div class="flex-col">
                @defer (on viewport; on timer(5s)) {
                    <ng-container>
                        <grid-menubar> </grid-menubar>                                                  
                        
                        @if (store.isLoading() === false) 
                        {                            
                          <table mat-table [dataSource]="store.tb()" class="mat-elevation-z8 ">
  
                            <ng-container matColumnDef="account">
                              <th mat-header-cell *matHeaderCellDef> Account </th>
                              <td mat-cell *matCellDef="let element"> {{element.account}} </td>
                            </ng-container>


                            <ng-container matColumnDef="child">
                              <th mat-header-cell *matHeaderCellDef> Child </th>
                              <td mat-cell *matCellDef="let element"> {{element.child}} </td>
                            </ng-container>


                            <ng-container matColumnDef="description">
                              <th mat-header-cell *matHeaderCellDef> Description </th>
                              <td mat-cell *matCellDef="let element"> {{element.description}} </td>
                            </ng-container>


                            <ng-container matColumnDef="debit_amount">
                              <th mat-header-cell *matHeaderCellDef> Debit </th>
                              <td mat-cell *matCellDef="let element"> {{element.debit_amount | currency}} </td>
                            </ng-container>

                            <ng-container matColumnDef="credit_amount">
                              <th mat-header-cell *matHeaderCellDef> Credit </th>
                              <td mat-cell *matCellDef="let element"> {{element.credit_amount | currency}} </td>
                            </ng-container>

                            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                          </table>

                        }
                           @else
                        {
                            <div class="fixed z-[1050] -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4">
                                <mat-spinner></mat-spinner>
                            </div>
                        }                
                    </ng-container> 
                }
                @placeholder(minimum 1000ms) {
                    <div class="flex justify-center items-center">
                       <mat-spinner></mat-spinner>
                    </div>
                }
            </div>
        </div>
    </div>
  </div>

  
  `,
  styles: ``
})
export class TbGridComponent implements OnInit {

  store = inject(ReportStore);
  displayedColumns: string[] = ['account', 'child', 'description', 'debit_amount', 'credit_amount'];
  dataSource: ITrialBalance[] = [];

  ngOnInit(): void {

    const periodParams = {
      period: 1,
      year: 2024,
    };

    this.store.loadTB(periodParams);
    this.dataSource = this.store.tb();

  }
}