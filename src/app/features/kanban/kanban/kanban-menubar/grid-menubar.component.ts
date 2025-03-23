import { Component, Output, EventEmitter, OnInit, ChangeDetectionStrategy, output, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MaterialModule } from 'app/shared/material.module';
import { Observable } from 'rxjs';

interface IValue {
  value: string;
  viewValue: string;
  menuDesc: string;
}

var modules = [
  MaterialModule
]

@Component({
  selector: 'kb-menubar',
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

  public readonly inTitle = input<string>(undefined);
  public readonly selected = input<string>(undefined);
  public menuItems: IValue[];

  constructor() {
    //this.inTitle = 'Account Maintenance';
  }

  ngOnInit(): void { }

  onClickUpdate(): void {

    this.notifyParentRefresh.emit();
  }

  onClickAdd(): void {

    this.notifyParentAdd.emit();
  }

  onClickDelete(): void {
    this.notifyParentDelete.emit();
  }

  onClickClone(): void {
    this.notifyParentClone.emit();
  }

  onClickRefresh(): void {
    this.notifyParentRefresh.emit();
  }
}
