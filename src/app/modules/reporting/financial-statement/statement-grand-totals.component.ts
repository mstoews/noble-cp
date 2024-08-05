import { CommonModule, JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IDistributionLedger } from 'app/models';


@Component({
  selector: 'statement-grand-totals',
  standalone: true,
  imports: [CommonModule, JsonPipe],
  template: `
  <div class="flex flex-col md:flex-row gap-2 mt-.5">
      <div class="text-gray-900 w-[50px]  text-bold place-content-start "></div>
      <div class="text-gray-900 w-[400px] place-content-start ">{{item.description}}</div>
      <div class="text-gray-900 w-[110px] border-t-2 border-b-2 border-gray-800 text-right">{{item.opening_balance | number: '1.2-2' }}</div>
      <div class="text-gray-900 w-[110px] border-t-2 border-b-2 border-gray-800 text-right">{{item.debit_balance   | number: '1.2-2' }}</div>      
      <div class="text-gray-900 w-[110px] border-t-2 border-b-2 border-gray-800 text-right">{{item.credit_balance  | number: '1.2-2' }}</div>
      <div class="text-gray-900 w-[110px] border-t-2 border-b-2 border-gray-800 text-right">{{item.closing_balance | number: '1.2-2' }}</div>
</div>
  `,
  styles: ``
})
export class StatementGrandTotalsComponent {
  @Input({required: true}) item!: IDistributionLedger;  
}
