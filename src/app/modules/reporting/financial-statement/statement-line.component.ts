import { CommonModule, JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IDistributionLedger } from 'app/models';


@Component({
  selector: 'statement-line-item',
  standalone: true,
  imports: [CommonModule, JsonPipe],
  template: `
  <div class="flex flex-col md:flex-row gap-2 mt-.5">
      
        <div class="text-gray-800 w-[50px]  place-content-start ">{{item.child}}</div>
        <div class="text-gray-800 w-[400px] place-content-start ">{{item.description}}</div>
        <div class="text-gray-800 w-[110px] text-right">{{item.opening_balance | number: '1.2-2' }}</div>
        <div class="text-gray-800 w-[110px] text-right">{{item.debit_balance | number: '1.2-2' }}</div>      
        <div class="text-gray-800 w-[110px] text-right">{{item.credit_balance | number: '1.2-2' }}</div>
        <div class="text-gray-800 w-[110px] text-right">{{item.closing_balance | number: '1.2-2' }}</div>
      
  </div>
  `,
})
export class StatementLineComponent {
  @Input({required: true}) item!: IDistributionLedger;
  @Input({required: false}) showHeader: boolean = false;
  
}
