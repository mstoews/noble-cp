import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { CheckBoxAllModule } from '@syncfusion/ej2-angular-buttons';
import { CommonModule } from '@angular/common';

import { KanbanModule } from '@syncfusion/ej2-angular-kanban';
import { KanbanTypesComponent } from '../types/types.component';
import { MaterialModule } from 'app/services/material.module';
import { RouterOutlet } from '@angular/router';
import { TasksComponent } from '../task/tasks.component';
import { IKanban } from '../kanban.service';

export interface IValue {
  value: string;
  viewValue: string;
}

type kanbanType = {
  kanban: IKanban;
}

const imports = [
  MaterialModule,
  FormsModule,
  ReactiveFormsModule,
  CommonModule,
  KanbanModule,
  CheckBoxAllModule,
  KanbanTypesComponent,
  TasksComponent,
]

@Component({
  selector: 'app-tasks',
  standalone: true,
  styleUrls: ['../task/tasks.component.scss'],
  imports: [imports],
  templateUrl: './kanban.component.html'
})
export class KanbanMainComponent implements OnInit {

  sTitle = ''

  ngOnInit(): void {
  }

}



