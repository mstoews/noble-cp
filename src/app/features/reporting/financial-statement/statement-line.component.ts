import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { IDistributionLedger } from 'app/models';


@Component({
    selector: 'statement-line-item',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="grid grid-cols-12 gap-2">
            <!-- <div class="col-start-1  text-gray-100" >{{item().child}}</div> -->
            <div class="col-start-2  text-gray-700 font-gray-700 col-span-3"> {{item().description}}</div>
            <div class="col-start-5  text-gray-700 font-gray-700 text-right"> {{item().opening_balance | number: '1.2-2'}}</div>
            <div class="col-start-7  text-gray-700 font-gray-700 text-right"> {{item().debit_balance   | number: '1.2-2'}}</div>
            <div class="col-start-9  text-gray-700 font-gray-700 text-right"> {{item().credit_balance  | number: '1.2-2'}}</div>
            <div class="col-start-11 text-gray-700 font-gray-700 text-right"> {{item().closing_balance | number: '1.2-2'}}</div>            
        </div>
  `
})
export class StatementLineComponent {
  readonly item = input.required<IDistributionLedger>();
  readonly showHeader = input<boolean>(false);
}
