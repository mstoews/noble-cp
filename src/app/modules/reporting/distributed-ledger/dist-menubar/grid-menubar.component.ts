import { Component, Output, EventEmitter, OnInit, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MaterialModule } from 'app/services/material.module';
import { PeriodsService } from 'app/services/periods.service';
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
  standalone: true,
  selector: 'dist-menubar',
  templateUrl: './grid-menubar.component.html',
  styleUrls: ['./grid-menubar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports:[modules]
})
export class DistMenuStandaloneComponent implements OnInit {
  @Output() notifyParentAdd: EventEmitter<any> = new EventEmitter();
  @Output() notifyParentRefresh: EventEmitter<any> = new EventEmitter();
  @Output() notifyParentDelete: EventEmitter<any> = new EventEmitter();
  @Output() notifyParentClone: EventEmitter<any> = new EventEmitter();
  @Output() notifyMenuItemChanged: EventEmitter<any> = new EventEmitter();
  @Output() notifyParentPeriod: EventEmitter<any> = new EventEmitter<any>();
  @Output() notifyParentYear: EventEmitter<any> = new EventEmitter<any>();

  @Input() public inTitle: string;
  @Input() public selected: string;
  @Input() currentPeriod: number;
  @Input() currentYear: number;
  public menuItems: IValue[];
  public periodService = inject(PeriodsService);

  constructor() {
    this.inTitle = 'Account Maintenance';
  }

  onPeriod(prd: number){
    this.notifyParentPeriod.emit(prd.toString());
  }

  onYear(year: number) {
    this.notifyParentYear.emit(year.toString());
  }

  ngOnInit(): void {}

  onClickUpdate(): void {
    console.debug('Menu bar nofication emit refresh');
    this.notifyParentRefresh.emit();
  }

  onClickAdd(): void {
    console.debug('Menu bar nofication emit add');
    this.notifyParentAdd.emit();
  }

  onClickDelete(): void {
    console.debug('Menu bar nofication emit delete');
    this.notifyParentDelete.emit();
  }

  onClickClone(): void {
    console.debug('Menu bar nofication emit clone');
    this.notifyParentClone.emit();
  }

  onClickRefresh(): void {
    console.debug('Menu bar nofication emit refresh');
    this.notifyParentRefresh.emit();
  }
}
