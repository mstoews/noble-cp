import { Component, Output, EventEmitter, OnInit, ChangeDetectionStrategy, inject, output, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MaterialModule } from 'app/shared/material.module';
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
  selector: 'dist-menubar',
  templateUrl: './grid-menubar.component.html',
  styleUrls: ['./grid-menubar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [modules]
})
export class DistMenuStandaloneComponent implements OnInit {
  // @Output() notifyParentAdd = new EventEmitter();
  notifyParentAdd = output();
  notifyParentRefresh = output();
  notifyParentDelete = output();
  notifyParentClone = output();
  notifyMenuItemChanged = output();
  notifyParentPeriod = output<string>();
  notifyParentYear = output<string>();

  public readonly inTitle = input<string>(undefined);
  public readonly selected = input<string>(undefined);
  readonly currentPeriod = input<number>(undefined);
  readonly currentYear = input<number>(undefined);
  public menuItems: IValue[];
  public periodService = inject(PeriodsService);

  constructor() {
    // this.inTitle = 'Account Maintenance';
  }

  onPeriod(prd: number) {
    this.notifyParentPeriod.emit(prd.toString());
  }

  onYear(year: number) {
    this.notifyParentYear.emit(year.toString());
  }

  ngOnInit(): void { }

  onClickUpdate(): void {
    console.debug('Menu bar notification emit update');
    this.notifyParentRefresh.emit();
  }

  onClickAdd(): void {
    console.debug('Menu bar notification add');
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
