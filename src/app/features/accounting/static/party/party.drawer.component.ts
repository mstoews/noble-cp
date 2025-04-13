import { Component, computed, effect, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IParty } from 'app/models/party';
import { MaterialModule } from 'app/shared/material.module';

@Component({
  selector: 'party-drawer',
  imports: [MaterialModule, ReactiveFormsModule, FormsModule],
  template: `
     <mat-card class="m-2">   
                 <div class="flex flex-col w-full text-gray-700 max-w-140 filter-article filter-interactive">
                    <div class="h-12 m-2 rounded-lg p-2 text-2xl text-justify text-gray-200 bg-slate-600" mat-dialog-title> {{ sTitle }} </div>
                        <div mat-dialog-content>
                            <form [formGroup]="partyForm">
                                <div class="flex flex-col m-1">
                                    
                                    @if (bDirty() === true) {
                                    <div class="flex flex-col grow">
                                        <mat-form-field class="mt-1 ml-1 mr-1 flex-start">
                                            <mat-label class="ml-2 text-base dark:text-gray-200">Party</mat-label>
                                            <input matInput placeholder="Party" readonly formControlName="party_id"/>
                                            <mat-icon class="icon-size-5" matPrefix [svgIcon]="'heroicons_solid:document-check'"></mat-icon>
                                        </mat-form-field>
                                    </div> 
                                    }

                                    @if (bDirty() === false) {
                                    <div class="flex flex-col grow">
                                        <mat-form-field class="mt-1 ml-1 mr-1 flex-start">
                                            <mat-label class="ml-2 text-base dark:text-gray-200">Party</mat-label>
                                            <input matInput placeholder="Party" formControlName="party_id"/>
                                            <mat-icon class="icon-size-5" matPrefix [svgIcon]="'heroicons_solid:document-check'"></mat-icon>
                                        </mat-form-field>
                                    </div> 
                                    }
                                    
                                    <div class="flex flex-col grow">
                                        <mat-form-field class="mt-1 ml-1 mr-1 flex-start">
                                            <mat-label class="ml-2 text-base dark:text-gray-200">Party Name</mat-label>
                                            <input matInput placeholder="Name" formControlName="name"/>
                                            <mat-icon class="icon-size-5" matPrefix [svgIcon]="'heroicons_solid:document'"></mat-icon>
                                        </mat-form-field>
                                    </div>
                                    <section class="flex flex-col md:flex-row">
                                      <mat-form-field class="m-1 grow">
                                        <mat-label class="text-md ml-2">Type</mat-label>
                                        <mat-select placeholder="Type" formControlName="party_type"  (selectionChange)="changeType($event)">
                                          @for (item of partyTypes; track item) {
                                            <mat-option [value]="item.party_type"> {{ item.party_type }}  </mat-option>
                                          }
                                        </mat-select>
                                        <mat-icon class="icon-size-5" matPrefix [svgIcon]="'heroicons_solid:document'"></mat-icon>                                        
                                      </mat-form-field>
                                    </section>
                                                                                          
                                                                        
                                </div>
                            </form>
                            
                            <div mat-dialog-actions class="flew-row gap-2 mb-3">
                                @if (bDirty() === true) {                                
                                    <button mat-icon-button color="primary" class="bg-slate-200 hover:bg-slate-400 ml-1" (click)="onUpdate()"
                                    matTooltip="Save" aria-label="hovered over">
                                    <span class="e-icons e-save"></span>
                                    </button>
                                }
                                @if (bDirty() === false) {                                
                                <button mat-icon-button color="primary" 
                                    class=" hover:bg-slate-400 ml-1" (click)="onAdd()" matTooltip="New Party" aria-label="hovered over">                        
                                    <span class="e-icons e-circle-add"></span>
                                </button>
                                }

                                <button mat-icon-button color="primary" 
                                    class=" hover:bg-slate-400 ml-1" (click)="onDelete()" matTooltip="Delete Party" aria-label="hovered over">                        
                                    <span class="e-icons e-trash"></span>
                                </button>

                                <button mat-icon-button color="primary"
                                    class=" hover:bg-slate-400 ml-1"  (click)="onCancel()" matTooltip="Close"
                                    aria-label="hovered over">
                                    <span class="e-icons e-circle-close"></span>
                                </button>                    

                            </div>
                        </div>
                    </div>      
                
                </mat-card>    
  `,
  styles: ``
})
export class PartyDrawerComponent {
changeType($event: any) {
throw new Error('Method not implemented.');
}

  sTitle = 'Party Maintenance';
  originalParty: IParty;
  party = input<IParty | null>();
  bDirty = input<boolean>(false);  
  Update = output<IParty>();
  Add = output<IParty>();
  Delete = output<IParty>();
  Cancel = output();

  private fb = inject(FormBuilder);

  partyTypes = [
    { party_type: 'Vendor' },
    { party_type: 'Customer' },
    { party_type: 'Employee' },
    { party_type: 'Vendor/Customer' },
  ];

  partyForm = new FormGroup({
    party_id: new FormControl(''),
    name: new FormControl(''),
    party_type: new FormControl('')
  });

  constructor() {
    this.partyForm = this.fb.group({
      party_id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      party_type: new FormControl('', Validators.required)
    });
  }
  ngOnChanges() {
    if (this.party) {
      this.partyForm.patchValue(this.party());
    }
  }

  updateParty(): IParty {
    const updateDate = new Date().toISOString().split('T')[0];
    const party = {
      party_id: this.partyForm.value.party_id,
      name: this.partyForm.value.name,
      party_type: this.partyForm.value.party_type,
      update_date: updateDate,
      address_id: 0,
      update_user: '@admin',
      create_date: updateDate,
      create_user: '@admin'
    } as IParty;
    return party;
  }

  onUpdate() {
    this.Update.emit(this.updateParty());
  }

  onAdd() {
    this.Add.emit(this.updateParty());
  }

  onDelete() {
    this.Delete.emit(this.updateParty());
  }

  onCancel() {
    this.Cancel.emit();
  }

}
