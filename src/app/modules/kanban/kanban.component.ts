import { CardClickEventArgs, KanbanModule } from '@syncfusion/ej2-angular-kanban';
import { CardRenderedEventArgs, CardSettingsModel, ColumnsModel, DialogSettingsModel, KanbanComponent, SwimlaneSettingsModel } from '@syncfusion/ej2-angular-kanban';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IKanban, IKanbanStatus, KanbanService } from 'app/services/kanban.service';

import { CheckBoxAllModule } from '@syncfusion/ej2-angular-buttons';
import { CommonModule } from '@angular/common';
import { DxDataGridModule } from 'devextreme-angular';
import { KanbanTypesComponent } from './types.component';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { RouterOutlet } from '@angular/router';
import { TasksComponent } from './tasks.component';

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
  DxDataGridModule,
  CommonModule,
  RouterOutlet,
  CommonModule,
  KanbanModule,
  CheckBoxAllModule,
  KanbanTypesComponent
]

@Component({
  selector: 'app-tasks',
  standalone: true,
  styleUrls: ['./tasks.component.scss'],
  imports: [imports],
  templateUrl: './kanban.component.html'
})
export class KanbanMainComponent implements OnInit {

  sTitle = ''

  ngOnInit(): void {
  }

}



