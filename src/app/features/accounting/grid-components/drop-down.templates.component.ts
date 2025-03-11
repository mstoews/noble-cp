import { CommonModule } from '@angular/common';
import { AfterViewInit, Provider, Component, Input, OnDestroy, OnInit, inject, input, viewChild, forwardRef } from '@angular/core';
import { ControlContainer, ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { IJournalTemplate, ITBParams } from 'app/models/journals';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';

const DROPDOWN_TEMPLATE_ASSESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TemplateDropDownComponent),
  multi: true,
}


@Component({
  selector: 'template-drop-down',
  imports: [ReactiveFormsModule, NgxMatSelectSearchModule, MatSelectModule, CommonModule, MatIconModule],
  template: `
  @if (dropdownFilter | async; as items ) {
    <fieldset [formGroupName]="controlKey">                
        <mat-form-field class="flex flex-col grow ml-2 mr-2 mt-1 ">           
              <mat-select [formControl]="dropdownCtrl" placeholder="Template" #singleDropdownSelect required>              
                <mat-option>
                  <ngx-mat-select-search [formControl]="dropdownFilterCtrl" [noEntriesFoundLabel]="'No entries found'" [placeholderLabel]="'Search'">
                  </ngx-mat-select-search>
                </mat-option>
                @for (item of items; track item.template_name) {
                  <mat-option [value]="item">{{ item.description }}</mat-option>
                }
            </mat-select>
        <mat-icon class="icon-size-5 text-green-700" matPrefix  [svgIcon]="'heroicons_solid:document-chart-bar'"></mat-icon>        
        </mat-form-field>        
      </fieldset>
   }
  `,
  styles: ``,
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true })
    },
    DROPDOWN_TEMPLATE_ASSESSOR
  ],
})
export class TemplateDropDownComponent implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor {

  private onChange!: Function;

  writeValue(template: string | null): void {
    if (template && template !== '') {
      this.setDropdownValue(template);
    }
  }
  registerOnChange(fn: Function): void {

  }
  registerOnTouched(fn: any): void {

  }

  setDisabledState?(isDisabled: boolean): void {

  }

  protected _onDestroyTemplateFilter = new Subject<void>();
  protected _onTemplateDestroy = new Subject<void>();

  @Input({ required: true }) controlKey = '';
  @Input() label = '';

  parentContainer = inject(ControlContainer);
  dropdownList = input<IJournalTemplate[]>();

  public dropdownCtrl: FormControl<IJournalTemplate> = new FormControl<IJournalTemplate>(null);
  public dropdownFilterCtrl: FormControl<string> = new FormControl<string>(null);
  public dropdownFilter: ReplaySubject<IJournalTemplate[]> = new ReplaySubject<IJournalTemplate[]>(null);
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
              a: IJournalTemplate,
              b: IJournalTemplate
            ) => { return a && b && a.template_name === b.template_name; };
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
    const update = this.dropdownList().find((f) => f.template_name === value)
    if (update !== undefined) {
      this.dropdownCtrl.setValue(update);      
    }
    else {
      this.dropdownCtrl.setValue(this.dropdownList()[0])      
    }
  }

  getDropdown(): IJournalTemplate | null {
    let value = this.dropdownCtrl.value;
    if (value === null || value === undefined) {
      return null;
    }
    return value
  }


  getDropdownValue() {
    let value = this.dropdownCtrl.value;
    if (value === null || value === undefined) {
      return '';
    }
    return value.template_name;
  }

}
