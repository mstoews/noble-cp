import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IAccounts } from 'app/models';
import { MaterialModule } from 'app/shared/material.module';
import { GLTypeStore } from 'app/store/gltype.store';

@Component({
  selector: 'accts-drawer',
  imports: [MaterialModule, ReactiveFormsModule, FormsModule],
  template: `
    <mat-card class="m-2">
            <div class="flex flex-col w-full text-gray-700 max-w-140 filter-article filter-interactive">
              <div class="h-12 m-2 rounded-lg p-2 text-2xl text-justify text-gray-200 bg-slate-600" mat-dialog-title> {{ sTitle }} </div>
              <form [formGroup]="accountsForm" class="form w-[400px]">
                <div class="div flex flex-col">
                  
                  <div class="flex flex-col grow">
                  <mat-form-field class="flex-start ml-1 mr-1" appearance="outline">
                              <mat-label class="text-lg ml-2">Group</mat-label>
                              <input   #myInput matInput placeholder="Account" formControlName="account" />
                              <mat-icon class="icon-size-5 text-green-800" matPrefix [svgIcon]="'heroicons_outline:document'" ></mat-icon>
                          </mat-form-field>
                      </div>
                  
      
                      <div class="flex flex-col grow">
                      <mat-form-field class="flex-start ml-1 mr-1" appearance="outline">
                          <mat-label class="text-lg">Account</mat-label>
                          <input  #myInput  matInput  placeholder="Child Account" formControlName="child" />
                          <mat-icon  class="icon-size-5 text-lime-700" matPrefix [svgIcon]="'heroicons_outline:clipboard-document'"></mat-icon>
                        </mat-form-field>
                      </div>
    
                  <div class="flex flex-col grow">
                    <mat-form-field class="flex-start ml-1 mr-1" appearance="outline">
                      <mat-label class="text-lg ml-2">Description</mat-label>
                      <input #myInput matInput placeholder="Description" formControlName="description" />
                      <mat-icon class="icon-size-5 text-lime-700" matPrefix [svgIcon]="'heroicons_outline:document-text'"></mat-icon>
                    </mat-form-field>
                  </div>
    
                  <div class="flex flex-col grow">
                    <mat-form-field class="flex-start ml-1 mr-1" appearance="outline">
                        <mat-label class="text-lg ml-2">Type</mat-label>
                        <mat-select placeholder="Type" formControlName="acct_type"  (selectionChange)="changeType($event)">
                          @for (item of typeStore.types(); track item) {
                            <mat-option [value]="item.type"> {{ item.type }}  </mat-option>
                          }
                        </mat-select>
                        <mat-icon class="icon-size-5 text-lime-700" matPrefix [svgIcon]="'heroicons_outline:document-check'"></mat-icon>
                      </mat-form-field>
                  </div>

                  <div class="flex flex-col grow">                      
                      <mat-slide-toggle
                           class="ml-2 mb-5" color="primary"                           
                           [checked]="accountsForm.controls.parent_account"
                           formControlName="parent_account" >
                          Group
                      </mat-slide-toggle>
                   </div>
    
                  <div class="flex flex-col grow">
                    <mat-form-field class="flex-start ml-1 mr-1" appearance="outline">
                      <mat-label class="text-lg ml-2">Comments</mat-label>
                      <input #myInput matInput placeholder="Comments" formControlName="comments" />
                      <span class="e-icons e-comment-show text-lime-700 m-2" matPrefix></span>
                    </mat-form-field>
                  </div>
                </div>
              </form>
    
                  <div mat-dialog-actions class="gap-2 mb-3">
                        @if (bAccountsDirty === true) {
                          <button mat-icon-button color="primary" class="bg-slate-200 hover:bg-slate-400 ml-1" (click)="onUpdate()"
                            matTooltip="Save" aria-label="hovered over">
                            <span class="e-icons e-save"></span>
                          </button>
                        }
                        @if (bAccountsDirty === true) {
                          <button mat-icon-button color="primary" 
                                  class=" hover:bg-slate-400 ml-1" (click)="onAdd()" matTooltip="New" aria-label="hovered over">                        
                              <span class="e-icons e-circle-add"></span>
                          </button>
                        }
    
                          <button mat-icon-button color="primary" 
                                  class=" hover:bg-slate-400 ml-1" (click)="onDelete()" matTooltip="Delete" aria-label="hovered over">                        
                              <span class="e-icons e-trash"></span>
                          </button>
      
                          <button mat-icon-button color="primary"
                                  class=" hover:bg-slate-400 ml-1"  (click)="onCancel()" matTooltip="Close"
                                  aria-label="hovered over">
                                <span class="e-icons e-circle-close"></span>
                          </button>                    
                  </div>
              </div>
    </mat-card>
  `,
  styles: ``
})
export class DrawerComponent {

  sTitle = 'Account Maintenance';
  originalParty: IAccounts;
  account = input<IAccounts | null>();

  
  Update = output<IAccounts>();
  Add = output<IAccounts>();
  Delete = output<IAccounts>();
  Cancel = output();
  typeStore = inject(GLTypeStore);

  bAccountsDirty: boolean = false;
  
  accountsForm = new FormGroup({
    account: new FormControl(0, Validators.required),
    child: new FormControl(0, Validators.required),
    parent_account: new FormControl(false, Validators.required),
    description: new FormControl('', Validators.required),
    acct_type: new FormControl('', Validators.required),
    comments: new FormControl('', Validators.required)
  });

  ngOnInit() {
    this.accountsForm.valueChanges.subscribe(() => {
      if (this.accountsForm.dirty === true) {
        this.bAccountsDirty = true;
        this.originalParty = this.account();
      }
    });
    this.accountsForm.valueChanges.subscribe((value) => {
      this.bAccountsDirty = true
    });
  }

  changeType($event: any) {
    console.log('Type change: ', $event.value);
  }

  ngOnChanges() {
    if (this.account) {
      this.accountsForm.patchValue(this.account());
    }
  }

  updateAccount(): IAccounts {
    const updateDate = new Date().toISOString().split('T')[0];
    const account = { ...this.accountsForm.value };

    const rawData = {
      account: account.account,
      child: account.child,
      parent_account: account.parent_account,
      description: account.description,
      sub_type: "",
      acct_type: account.acct_type,
      comments: account.comments,
      balance: 0,
      create_date: updateDate,
      create_user: this.account().create_user,
      update_date: updateDate,
      update_user: this.account().update_user,
      status: "OPEN",
    };
    return rawData;
  }

  onUpdate() {
    this.Update.emit(this.updateAccount());
  }

  onAdd() {
    this.Add.emit(this.updateAccount());
  }

  onDelete() {
    this.Delete.emit(this.updateAccount());
  }

  onCancel() {
    this.Cancel.emit();
  }



}
