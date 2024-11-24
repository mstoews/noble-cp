import { CommonModule, JsonPipe } from '@angular/common';
import { Component, Input, OnInit} from '@angular/core';
import { IDistributionLedger, IDistributionLedgerRpt } from 'app/models';


@Component({
  selector: 'statement-line-totals',
  standalone: true,
  imports: [CommonModule],
  template: `
  
  <div class="grid grid-cols-12 gap-2 mt-1">
            <div class="col-start-1"></div>
            <div class="col-start-2 col-span-3  text-gray-700  text-right mt-2"> Total</div>
            <div class="col-start-5 text-right  text-gray-700  border-t-2 border-gray-700  mt-2">  {{totals.opening_balance | number: '1.2-2'}}</div>
            <div class="col-start-7 text-right  text-gray-700  border-t-2 border-gray-700 mt-2">  {{totals.debit_balance | number: '1.2-2'}}</div>
            <div class="col-start-9 text-right  text-gray-700  border-t-2 border-gray-700 mt-2">  {{totals.credit_balance | number: '1.2-2'}}</div>
            <div class="col-start-11 text-right text-gray-700  border-t-2 border-gray-700 mt-2">  {{totals.closing_balance | number: '1.2-2'}}</div>            
  </div>

  `
})
export class StatementTotalComponent implements OnInit{
  @Input({required: true}) item!: IDistributionLedger[]; 
  
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
    
    this.item.forEach(item => {
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
