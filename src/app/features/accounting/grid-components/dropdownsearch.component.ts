import { CommonModule } from '@angular/common';
import { Component, input, viewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MaterialModule } from 'app/services/material.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ObservableInput, ReplaySubject, Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'DropDownSearch',
  imports: [MaterialModule, NgxMatSelectSearchModule, CommonModule],
  template: `
  @if (dropdownFilter | async; as items ) {
   <mat-form-field>
      <mat-label class="text-md ml-2">{{label()}}</mat-label>
      <mat-select [formControl]="dropdownCtrl" [placeholder]="label()" #singleDropdownSelect required>
          <mat-option>
              <ngx-mat-select-search [formControl]="dropdownFilterCtrl"
                  [noEntriesFoundLabel]="'No entries found'" [placeholderLabel]="'Search'">
              </ngx-mat-select-search>
          </mat-option>
          @for (item of items; track item) {
            <mat-option [value]="item">{{item}}</mat-option>
          }
      </mat-select>
      <mat-icon class="icon-size-5" matPrefix [svgIcon]="'heroicons_solid:currency-dollar'"></mat-icon>
   </mat-form-field>
  }
  `,
  styles: ``
})
export class DropDownSearchComponent {

  label = input('Label')
  dropdownList = input<any[]>();

  protected _onDestroyTemplateFilter = new Subject<void>();
  protected _onTemplateDestroy = new Subject<void>();

  public dropdownCtrl: FormControl<any> = new FormControl<any>(null);
  public dropdownFilterCtrl: FormControl<string> = new FormControl<string>(null);
  public dropdownFilter: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public singleDropdownSelect = viewChild<MatSelect>("singleDropdownSelection");

  constructor() {

    if (this.dropdownFilter)
      this.dropdownFilter
        .pipe(take(1), takeUntil(this._onTemplateDestroy))
        .subscribe(() => {
          if (this.singleDropdownSelect() != null || this.singleDropdownSelect != undefined)
            this.singleDropdownSelect().compareWith = (a: any, b: any) => a && b && a.id === b.id;
        });


    this.dropdownFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroyTemplateFilter))
      .subscribe(() => {
        this.filteredDropdown();
      });
    
  }

  protected filteredDropdown() {
    if (!this.dropdownList()) {
      return;
    }
    // get the search keyword
    let search = this.dropdownFilterCtrl.value;
    if (!search) {
      this.dropdownFilter.next(this.dropdownList().slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.dropdownFilter.next(
      this.dropdownList().filter(item => item.id.toLowerCase().indexOf(search) > -1)
    );
  }


}
