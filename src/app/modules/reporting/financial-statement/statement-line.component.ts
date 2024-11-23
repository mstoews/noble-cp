import { CommonModule, JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IDistributionLedger } from 'app/models';


@Component({
    selector: 'statement-line-item',
    imports: [CommonModule, JsonPipe],
    template: `
        <div class="grid grid-cols-12 gap-2">
            <div class="col-start-1  text-gray-100" >{{item.child}}</div>
            <div class="col-start-2  text-gray-700 font-gray-700 col-span-3"> {{item.description}}</div>
            <div class="col-start-5  text-gray-700 font-gray-700 text-right"> {{item.opening_balance | number: '1.2-2'}}</div>
            <div class="col-start-7  text-gray-700 font-gray-700 text-right"> {{item.debit_balance   | number: '1.2-2'}}</div>
            <div class="col-start-9  text-gray-700 font-gray-700 text-right"> {{item.credit_balance  | number: '1.2-2'}}</div>
            <div class="col-start-11 text-gray-700 font-gray-700 text-right"> {{item.closing_balance | number: '1.2-2'}}</div>            
        </div>
  `
})
export class StatementLineComponent {
  @Input({required: true}) item!: IDistributionLedger;
  @Input({required: false}) showHeader: boolean = false;
}
