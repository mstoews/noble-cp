import { Component, input } from '@angular/core';
import { IJournalHeader } from 'app/models/journals';
import { MaterialModule } from 'app/shared/material.module';

@Component({
  selector: 'journal-card',
  imports: [MaterialModule],
  template: `
    <mat-card class="flex-auto p-6 shadow rounded-2xl overflow-hidden m-2 hover:cursor-pointer bg-slate-100 text-gray-700">    
      <div>{{journalHeader().amount}} - {{journalHeader().journal_id}}</div>
      <div>{{journalHeader().journal_id}}</div>
      <div>{{journalHeader().status}}</div>
      <div>{{journalHeader().description}}</div>
      <div>{{journalHeader().transaction_date}}</div>            
   </mat-card>
  `,
  styles: ``
})
export class JournalCardComponent {
  journalHeader = input<IJournalHeader>();

  constructor() {
    console.debug('JournalCardComponent initialized', this.journalHeader());
  }
}
