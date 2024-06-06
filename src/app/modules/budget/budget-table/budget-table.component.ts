import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { JournalService } from 'app/services/journal.service';
import { MaterialModule } from 'app/services/material.module';

const imports = [
  CommonModule,
  ReactiveFormsModule,
  MaterialModule,
  FormsModule,
];

export interface EditJournalDetails {
  child: string;
  fund: string;
  description: string;
  debit: number;
  credit: number;
}

@Component({
  selector: 'budget-table',
  standalone: true,
  imports: [imports],
  templateUrl: './budget-table.component.html',
  styles: ``
})

export class BudgetTableComponent {
  journalDetails$ = inject(JournalService).getJournalDetail(1);
  displayedColumns: string[] = ['child', 'fund', 'description', 'debit', 'credit'];

  someMethod(value: any, element: any) {
    console.debug("selected value", value);
    console.debug("selected element", element);
    element.symbol = value;
  }

  toppingList: string[] = [
    "Extra cheese",
    "Mushroom",
    "Onion",
    "Pepperoni",
    "Sausage",
    "Tomato"
  ];

  applyFilter(filterValue: string) {
    //  this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
