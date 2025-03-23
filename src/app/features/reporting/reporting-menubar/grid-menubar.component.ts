import { Component, OnInit, ChangeDetectionStrategy, output, input } from '@angular/core';
import { MaterialModule } from 'app/shared/material.module';

interface IValue {
  value: string;
  viewValue: string;
  menuDesc: string;
}

var modules = [
  MaterialModule
]

@Component({
  selector: 'kanban-menubar',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [modules]
})
export class KanbanMenubarComponent implements OnInit {
  notifyParentAdd = output();
  notifyParentRefresh = output();
  notifyParentDelete = output();
  notifyParentClone = output();
  notifyMenuItemChanged = output();

  inTitle = input('')
  selected = input();
  public menuItems: IValue[];

  constructor() {
  }

  ngOnInit(): void { }

  onClickUpdate(): void {
    console.debug('Menu bar notification emit refresh');
    this.notifyParentRefresh.emit();
  }

  onClickAdd(): void {
    console.debug('Menu bar notification emit add');
    this.notifyParentAdd.emit();
  }

  onClickDelete(): void {
    console.debug('Menu bar notification emit delete');
    this.notifyParentDelete.emit();
  }

  onClickClone(): void {
    console.debug('Menu bar notification emit clone');
    this.notifyParentClone.emit();
  }

  onClickRefresh(): void {
    console.debug('Menu bar notification emit refresh');
    this.notifyParentRefresh.emit();
  }
}
