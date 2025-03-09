import { CommonModule  } from '@angular/common';
import { AfterViewInit, Provider, Component, Input, input, viewChild, forwardRef, OnDestroy } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { IJournalTemplate } from 'app/models/journals';
import { template } from 'lodash';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';

const DROPDOWN_TEMPLATE_ASSESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TemplateCustomDropDownComponent),
  multi: true,
}


@Component({
  selector: 'custom-template-drop-down',
  imports: [ReactiveFormsModule, NgxMatSelectSearchModule, MatSelectModule, CommonModule, MatIconModule],
  template: `
  @if (dropdownFilter | async; as items ) {
    <fieldset [formGroupName]="controlKey">                
        <mat-form-field class="flex flex-col grow ml-2 mr-2 mt-1 ">           
              <mat-select (selectionChange)="onSelectionChange($event)" [formControl]="dropdownCtrl" placeholder="Template" #singleDropdownSelect required>              
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
  viewProviders: [DROPDOWN_TEMPLATE_ASSESSOR],
})
export class TemplateCustomDropDownComponent implements AfterViewInit, ControlValueAccessor, OnDestroy {

  template!: IJournalTemplate;

  private onChange!: Function;
  private onTouched!: Function;
  
  protected _onDestroyTemplateFilter = new Subject<void>();
  protected _onTemplateDestroy = new Subject<void>();

  @Input() label = '';
  
  dropdownList = input<IJournalTemplate[]>();

  public dropdownCtrl: FormControl<IJournalTemplate> = new FormControl<IJournalTemplate>(null);
  public dropdownFilterCtrl: FormControl<string> = new FormControl<string>(null);
  public dropdownFilter: ReplaySubject<IJournalTemplate[]> = new ReplaySubject<IJournalTemplate[]>(null);
  public singleDropdownSelect = viewChild<MatSelect>("singleDropdownSelect");


  writeValue(template_name:  | null): void {
    if (template_name &&  template_name !== '') {
      this.setDropdownValue(template_name);
    }    
  }
  registerOnChange(fn: Function): void {
    this.onChange = (template: string) => {
      fn(template);
    };
  }
  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  onSelectionChange(event: any) {
    this.template = event.value
    this.onChange(event.value);
    this.onTouched
  }

  setDisabledState?(isDisabled: boolean): void {
    
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
                  ) => { return a && b && a.template_name === b.template_name;  };
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
      this.template = update;
    }
    else
    {
      this.dropdownCtrl.setValue(this.dropdownList()[0])      
    }
   }
  
  getDropdown(): IJournalTemplate | null {
    return this.template    
  }
  

  getDropdownValue() {
    let value = this.dropdownCtrl.value;
    if (value === null || value === undefined) {
      return '';
    }
    return value.template_name;
  }

  ngOnDestroy(): void {



    if (this._onDestroyTemplateFilter) {
        this._onDestroyTemplateFilter.unsubscribe();
    }

    if (this._onTemplateDestroy) {
        this._onTemplateDestroy.unsubscribe();
    }

    
}


}
