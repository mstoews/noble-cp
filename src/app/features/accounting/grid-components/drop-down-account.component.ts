import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, inject, input, viewChild } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { IDropDownAccounts } from 'app/models';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';


@Component({
  selector: 'account-drop-down',
  imports: [ReactiveFormsModule, NgxMatSelectSearchModule, MatSelectModule, CommonModule, MatIconModule],
  template: `
  @if (dropdownFilter | async; as items ) {
    <fieldset [formGroupName]="controlKey">                
        <mat-form-field class="flex flex-col grow ml-2 mr-2 mt-1 "> 
          <mat-label class="text-lg ml-2" for="dropdown">{{label}}</mat-label>
              <mat-select [formControl]="dropdownCtrl" placeholder="Account" #singleDropdownSelect required>
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
        useFactory: () => inject(ControlContainer, { skipSelf: true })
    }
  ],
})
export class DropDownAccountComponent implements OnInit, OnDestroy, AfterViewInit {
  protected _onDestroyTemplateFilter = new Subject<void>();
  protected _onTemplateDestroy = new Subject<void>();

  @Input({ required: true }) controlKey = '';
  @Input() label = '';

  private destroy$ = new Subject<void>();
  
  parentContainer = inject(ControlContainer);  
    
  dropdownList = input.required<IDropDownAccounts[]>();

  public dropdownCtrl: FormControl<IDropDownAccounts> = new FormControl<IDropDownAccounts>(null);
  public dropdownFilterCtrl: FormControl<string> = new FormControl<string>(null);
  public dropdownFilter: ReplaySubject<IDropDownAccounts[]> = new ReplaySubject<IDropDownAccounts[]>(null);
  public singleDropdownSelect = viewChild<MatSelect>("singleDropdownSelection");
  
  bDirty = false;

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  
  ngOnInit() {
    
    this.parentFormGroup.addControl(this.controlKey,
      new FormGroup({
        dropdownCtrl: new FormControl(''),
      }))

      this.dropdownFilterCtrl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.bDirty = true;
      });       
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
                      a: IDropDownAccounts,
                      b: IDropDownAccounts
                  ) => {
                      return a && b && a.child === b.child;
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
    const update = this.dropdownList().find((f) => f.child === value)
    if (update !== undefined)
      this.dropdownCtrl.setValue(update);
    else 
      this.dropdownCtrl.setValue(this.dropdownList()[0])
   }

    getDropdownValue() {
      return this.dropdownCtrl.value;
    }

}
