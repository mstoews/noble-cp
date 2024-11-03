import { CommonModule, JsonPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IDistributionComparisonRpt, IDistributionLedger } from 'app/models';


@Component({
  selector: 'statement-comparison-item',
  standalone: true,
  imports: [CommonModule, JsonPipe],
  template: 
  `
        <div class="grid grid-cols-12 gap-2">
            @if (showHeader) {
              <div class="col-start-1  text-gray-100" >{{item.child}}</div>
            }
            <div class="col-start-2  text-gray-700 font-gray-700 col-span-3"> {{lineItem.description}}</div>
            <div class="col-start-5  text-gray-700 font-gray-700 text-right"> {{lineItem.opening_balance | number: '1.2-2'}}</div>
            <div class="col-start-7  text-gray-700 font-gray-700 text-right"> {{lineItem.closing_balance   | number: '1.2-2'}}</div>
            <div class="col-start-9  text-gray-700 font-gray-700 text-right"> {{lineItem.difference  | number: '1.2-2'}}</div>
            <div class="col-start-11 text-gray-700 font-gray-700 text-right"> {{lineItem.percentage | number: '1.2-2'}}</div>            
        </div>
  `,
})
export class StatementComparisonComponent implements OnInit  {
  @Input({required: true}) item!: IDistributionLedger;  
  @Input({required: false}) showHeader: boolean = false;

  lineItem: IDistributionComparisonRpt;

  ngOnInit() {
     this.lineItem = {
      child: this.item.child,
      description: this.item.description,
      opening_balance: this.item.opening_balance,
      closing_balance: this.item.closing_balance, 
      difference: this.item.closing_balance - this.item.opening_balance,
      percentage: this.item.opening_balance === 0 ? 0 : ((this.item.closing_balance - this.item.opening_balance) / this.item.opening_balance) * 100 
    }    
  }
}
