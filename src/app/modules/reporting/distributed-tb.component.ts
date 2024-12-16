import { Component, inject, OnDestroy, OnInit, viewChild } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GridMenubarStandaloneComponent } from 'app/modules/accounting/grid-menubar/grid-menubar.component';
import { ReportStore } from 'app/services/reports.store';
import { ITrialBalance } from 'app/models';
import { GLGridComponent } from 'app/modules/accounting/grid-menubar/gl-grid.component';
import { MatButtonModule } from '@angular/material/button';


const mods = [MatProgressSpinnerModule, GridMenubarStandaloneComponent, GLGridComponent, MatButtonModule];

@Component({
  
  template: 
  `
  <div class="flex flex-col min-w-0 overflow-y-auto -px-10">
    <div class="flex-auto">
        <div class="h-full border-gray-300">
            <div class="flex-col">
                @defer (on viewport; on timer(5s)) {
                    <ng-container>
                    
                        <grid-menubar [inTitle]="'Distribution Ledger'"> </grid-menubar>  
                        <button mat-button id='restore' (click)='getPersistData()' color="primary" class="bg-gray-300 m-1">Get</button>
                        <button mat-button id='restore' (click)='setPersistData()' color="primary" class="bg-gray-300 m-1">Set</button>
                        @if (store.isLoading() === false) 
                        {                            
                            <gl-grid #grid id="DistTb" 
                                (openTradeId)="selectedRow($event)"
                                [data]="store.tb()" 
                                [columns]="columns">
                            </gl-grid>                        
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
  imports: [mods],
  selector: 'distributed-tb',
  providers: [ReportStore],
  styles : `
    ::ng-deep.e-grid ::ng-deep.e-headercell {
    background-color: lightgrey; 
    color: #333;
    font-weight: bold;
    text-align: center;
    }
    `
})

export class DistributedTbComponent implements OnInit, OnDestroy {
  
  store = inject(ReportStore);

  public grid = viewChild<GLGridComponent>('grid')
  

  columns = [
        { field: 'id',                  headerText: 'ID',         visible: false,  width: 50  },
        { field: 'account',             headerText: 'Grp',        visible: false,  width: 90  },
        { field: 'child',               headerText: 'Acct',       visible: true ,isPrimaryKey: true, isIdentity: true, width: 90 },
        { field: 'account_description', headerText: 'Description',visible: false,  width: 100,  displayAsCheckbox: true},
        { field: 'trans_type',          headerText: 'Tr Type',    visible: true, width: 100,  displayAsCheckbox: true},
        { field: 'trans_date',          headerText: 'Tr Date',    visible: false, width: 80, type:Date,  displayAsCheckbox: true}, 
        { field: 'amount',              headerText: 'Amount',     visible: false, width: 100, format: 'N2', textAlign: 'Right' },
        { field: 'description',         headerText: 'Transaction Description', width: 200 },
        { field: 'reference',           headerText: 'Reference',width: 100, visible: false },
        { field: 'party_id',            headerText: 'Party',    width: 100, visible: false },
        { field: 'amount',              headerText: 'Amount',   width: 80 , format: 'N2', textAlign: 'Right' },
        { field: 'opening_balance',     headerText: 'Open',     width: 80 , format: 'N2', textAlign: 'Right' },
        { field: 'debit_amount',        headerText: 'Debit',    width: 80 , format: 'N2', textAlign: 'Right' },
        { field: 'credit_amount',       headerText: 'Credit',   width: 80 , format: 'N2', textAlign: 'Right' },
        { field: 'close',               headerText: 'Closing',  width: 80 , format: 'N2', textAlign: 'Right' }, 
        { field: 'net',                 headerText: 'Net',      width: 80 , format: 'N2', textAlign: 'Right' }, 
        { field: 'pd',                  headerText: 'Prd',      visible: false,  width: 100 },
        { field: 'prd_year',            headerText: 'Yr',       visible: false,  width: 100  }                       
    ];


  ngOnInit() {
    const periodParams = {
      period: 1,
      year: 2024,
    };

    // this.getPersistData();

    this.store.loadTB(periodParams);
  }

  ngOnDestroy(): void {
    this.setPersistData();
  }

  getPersistData() {
    console.log("resetting grid");
    this.grid().getPersistData("DistTB");
    
  }

  setPersistData() {
    console.log("setting persist data");
    this.grid().setPersistData("DistTB");
  }

  
  selectedRow($event: ITrialBalance) {
    console.log($event);
  }

}

/*
    "account": 6000,
    "child": 6160,
    "account_description": "Amortization of capital asset",
    "transaction_date": "2024-12-16",
    "id": "",
    "trans_type": "TB Summary",
    "trans_date": "2024-12-16",
    "type": "",
    "description": "",
    "reference": "",
    "party_id": "",
    "amount": 0,
    "opening_balance": 0,
    "debit_amount": 0,
    "credit_amount": 0,
    "close": 0,
    "net": 0,
    "pd": 1,
    "prd_year": 2024
*/

