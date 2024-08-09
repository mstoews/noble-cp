import { CommonModule, JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IDistributionLedger } from 'app/models';

// <div class="flex flex-col md:flex-row gap-2 mt-.5">      
//        <div class="text-gray-800 text-lg w-[50px]  place-content-start ">{{item.child}}</div>
//        <div class="text-gray-800 text-lg w-[400px] place-content-start ">{{item.description}}</div>
//        <div class="text-gray-800 text-lg w-[110px] text-right">{{item.opening_balance | number: '1.2-2' }}</div>
//        <div class="text-gray-800 text-lg invisible md:visible w-[110px] text-right">{{item.debit_balance | number: '1.2-2' }}</div>      
//        <div class="text-gray-800 text-lg invisible md:visible w-[110px] text-right">{{item.credit_balance | number: '1.2-2' }}</div>
//        <div class="text-gray-800 text-lg w-[110px] text-right">{{item.closing_balance | number: '1.2-2' }}</div>      
//  </div>

@Component({
  selector: 'statement-line-item',
  standalone: true,
  imports: [CommonModule, JsonPipe],
  template: 
  `
  
        <div class="grid grid-cols-12 gap-2">
            <div class="col-start-1">{{item.child}}</div>
            <div class="col-start-2 col-span-3">  {{item.description}}</div>
            <div class="col-start-5 text-right"> {{item.opening_balance | number: '1.2-2'}}</div>
            <div class="col-start-7 text-right">  {{item.debit_balance   | number: '1.2-2'}}</div>
            <div class="col-start-9 text-right">  {{item.credit_balance  | number: '1.2-2'}}</div>
            <div class="col-start-11 text-right"> {{item.closing_balance | number: '1.2-2'}}</div>            
        </div>
  

  `,
})
export class StatementLineComponent {
  @Input({required: true}) item!: IDistributionLedger;
  @Input({required: false}) showHeader: boolean = false;
}
