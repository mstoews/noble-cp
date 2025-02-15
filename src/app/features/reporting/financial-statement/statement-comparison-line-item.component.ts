import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ITrialBalance } from 'app/models';
import { AcademyComponent } from "../../admin/academy/academy.component";

@Component({
  selector: 'statement-comparison-item',
  imports: [CommonModule, MatCardModule],  
  template: `        
            
            <section class="grid grid-cols-1 text-sm">

              
              
                @if (item().trans_type == 'TB Summary') {                    
                  <div class="grid grid-cols-12 gap-2 border-t border-gray-700 mt-2 bg-gray-100">      
                    <div (click)="onChild($event)" class="col-start-1 text-bold text-gray-900">{{item().child}}</div>
                    <div class="col-start-2 col-end-5 text-gray-900 text-bold text-sm">  {{item().account_description}}</div>
                    <div class="col-start-5 text-gray-900 text-right  text-sm">  {{item().opening_balance | number: '1.2-2'}}</div>
                    <div class="col-start-6 text-gray-900 text-right  text-sm">  {{item().close | number: '1.2-2'}}</div>            
                    <div class="col-start-7 text-gray-900 text-right  text-sm">  {{item().close - item().opening_balance| number: '1.2-2'}}</div>  
                  </div>
                                    
                } 
                @else {                     
                  <div class="grid grid-cols-12 gap-2">      
                  <div class="col-start-1 text-gray-600 text-right"></div>                  
                  <div class="col-start-2 col-end-5 text-gray-700 ">  {{item().id}} - {{item().description}}</div>
                  <div class="col-start-5 text-gray-600  text-right"> {{item().debit_amount  | number: '1.2-2'}}</div>
                  <div class="col-start-6 text-gray-600  text-right"> {{item().credit_amount | number: '1.2-2'}}</div>            
                  <div class="col-start-7 text-gray-600  text-right"> {{item().debit_amount - item().credit_amount | number: '1.2-2'}}</div>                
                  </div>
                }                
          </section>
        
  `,
})

export class StatementComparisonComponent {
  item = input<ITrialBalance>()
  showHeader = input<boolean>()  

  onChild(e: any) {
    console.log('child clicked', JSON.stringify(e));
  }

}
