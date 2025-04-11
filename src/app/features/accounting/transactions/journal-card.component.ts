import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Common } from '@syncfusion/ej2-angular-pivotview';
import { IJournalHeader } from 'app/models/journals';
import { MaterialModule } from 'app/shared/material.module';

@Component({
  selector: 'journal-card',
  imports: [MaterialModule, CommonModule],
  template: `
    <mat-card class="flex-auto m-2  p-2 bg-gray-200 border-gray-500 dark:bg-gray-400 shadow rounded-xl w-full dark:text-gray-200 overflow-hidden hover:cursor-pointer ">
      <div>Journal : {{journal().amount}} -  {{journal().type}} </div>
      <div>Description : {{journal().description}} </div>                                    
      {{journal().transaction_date}}                                    
      {{journal().amount}}
      {{journal().period_year}}
      {{journal().period}}
      {{journal().create_date}}
      {{journal().create_user}}
      {{journal().party_id}}
      {{journal().status}}
      {{journal().booked}}
    </mat-card>
  `,
  styles: ``
})
export class JournalCardComponent {
  journal = input<any | null>();
  
  constructor() {
    if (!this.journal() === undefined)
    {
      console.error('JournalCardComponent: journal input is null');
      return;
    }
    else {
      console.log('JournalCardComponent: journal input is set');
    }    
  }
}
