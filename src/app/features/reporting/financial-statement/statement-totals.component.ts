import { CommonModule, JsonPipe } from '@angular/common';
import { Component, OnInit, input } from '@angular/core';
import { IDistributionLedger, IDistributionLedgerRpt } from 'app/models';


@Component({
    selector: 'statement-line-totals',
    imports: [CommonModule],
    template: `
  
  
  <div class="grid grid-cols-12 gap-2">  
            <div class="col-start-2  text-bold col-span-3"> {{header()}} </div>
            <div class="col-start-5  text-bold text-right"> {{totals.opening_balance | number: '1.2-2'}}</div>
            <div class="col-start-7  text-bold text-right"> {{totals.debit_balance   | number: '1.2-2'}}</div>
            <div class="col-start-9  text-bold text-right"> {{totals.credit_balance  | number: '1.2-2'}}</div>
            <div class="col-start-11 text-bold text-right"> {{totals.closing_balance | number: '1.2-2'}}</div>            
  </div>

  `
})
export class StatementTotalComponent implements OnInit{
  readonly item = input.required<IDistributionLedger[]>(); 
  readonly header = input<string>('Total');
  
  itemTotals!: IDistributionLedgerRpt;
  totals: IDistributionLedgerRpt;

  ngOnInit(): void {
    var itemTotals = {
      child: 0,
      description: '',
      opening_balance: 0,
      debit_balance: 0,
      credit_balance: 0,
      closing_balance : 0
    }
    
    this.item().forEach(item => {
      itemTotals.opening_balance = itemTotals.opening_balance + item.opening_balance;
      itemTotals.debit_balance   = itemTotals.debit_balance   + item.debit_balance;
      itemTotals.credit_balance  = itemTotals.credit_balance  + item.credit_balance;
      itemTotals.closing_balance = itemTotals.closing_balance + item.closing_balance;
    })
   
    this.totals = itemTotals;
  }
  
}

// <div class="flex flex-col md:flex-row gap-2 mt-.5">
//       <div class="text-gray-800 w-[50px]  text-bold place-content-start "></div>
//       <div class="text-gray-800 w-[400px] place-content-start "></div>
//       <div class="text-gray-800 w-[110px] border-t-2 border-gray-800 text-right">{{totals.opening_balance | number: '1.2-2' }}</div>
//       <div class="text-gray-800 w-[110px] border-t-2 border-gray-800 text-right">{{totals.debit_balance   | number: '1.2-2' }}</div>      
//       <div class="text-gray-800 w-[110px] border-t-2 border-gray-800 text-right">{{totals.credit_balance  | number: '1.2-2' }}</div>
//       <div class="text-gray-800 w-[110px] border-t-2 border-gray-800 text-right">{{totals.closing_balance | number: '1.2-2' }}</div>
// </div>
