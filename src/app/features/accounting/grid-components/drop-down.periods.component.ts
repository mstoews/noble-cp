import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, forwardRef, inject, input, viewChild } from '@angular/core';
import { ControlContainer, ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { IPeriod } from 'app/models/period';


@Component({
  selector: 'periods-drop-down',
  imports: [ReactiveFormsModule, NgxMatSelectSearchModule, MatSelectModule, CommonModule, MatIconModule],
  template: `
  @if (dropdownFilter | async; as items ) {
    <fieldset [formGroupName]="controlKey">                
        <mat-form-field class="flex flex-col grow ml-2 mr-2 mt-1 "> 
          <mat-label class="text-md ml-2" for="dropdown">{{label}}</mat-label>
              <mat-select [formControl]="dropdownCtrl" placeholder="Periods" #singleDropdownSelect required>
                <mat-option>
                  <ngx-mat-select-search [formControl]="dropdownFilterCtrl" [noEntriesFoundLabel]="'No entries found'" [placeholderLabel]="'Search'">
                  </ngx-mat-select-search>
                </mat-option>
              @for (item of items; track item) {
                <mat-option [value]="item">{{ item.description }}</mat-option>
              }
            </mat-select>
        <mat-icon class="icon-size-5 text-green-700" matSuffix  [svgIcon]="'heroicons_solid:document-chart-bar'"></mat-icon>        
        </mat-form-field>        
      </fieldset>
   }
  `,
  styles: ``,
  viewProviders: [
    {
        provide: ControlContainer,
        useFactory: () => inject(ControlContainer, { skipSelf: true }),

    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PeriodsDropDownComponent),
      multi: true,
    },
  ],
})
export class PeriodsDropDownComponent implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor {

  value: string;

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.value = value;
    this.onChange(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  protected _onDestroyTemplateFilter = new Subject<void>();
  protected _onTemplateDestroy = new Subject<void>();

  @Input({ required: true }) controlKey = '';
  @Input() label = '';


  
  parentContainer = inject(ControlContainer);  
    
  dropdownList = input.required<IPeriod[]>();

  public dropdownCtrl: FormControl<IPeriod> = new FormControl<IPeriod>(null);
  public dropdownFilterCtrl: FormControl<string> = new FormControl<string>(null);
  public dropdownFilter: ReplaySubject<IPeriod[]> = new ReplaySubject<IPeriod[]>(null);
  public singleDropdownSelect = viewChild<MatSelect>("singleDropdownSelect");
  
  
  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  ngOnInit() {
    this.parentFormGroup.addControl(this.controlKey,
      new FormGroup({
        dropdownCtrl: new FormControl(''),
      }))
     
      
  }
  ngOnDestroy() {
    this.parentFormGroup.removeControl(this.controlKey);
  }

  public ngAfterViewInit() {

     this.dropdownFilter.next(this.dropdownList().slice());

     this.dropdownFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroyTemplateFilter)).subscribe(() => {
        this.filteredDropdown();
    });

    if (this.dropdownFilter)
      this.dropdownFilter
          .pipe(take(1), takeUntil(this._onDestroyTemplateFilter))
          .subscribe(() => {
              if (this.singleDropdownSelect() != null || this.singleDropdownSelect() != undefined)
                  this.singleDropdownSelect()!.compareWith = (
                      a: IPeriod,
                      b: IPeriod
                  ) => {
                      return a && b && a.id=== b.id;
                  };
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
      this.dropdownList().filter((item) => item.description.toLowerCase().indexOf(search) > -1)
    );
  }

  setDropdownValue(value: string) {
    const update = this.dropdownList().find((f) => f.description === value)
    if (update !== undefined)
      this.dropdownCtrl.setValue(update);
  }

}
