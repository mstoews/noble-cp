import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';  
import { IAccountSettings } from 'app/models';
import { MaterialModule } from 'app/services/material.module';


@Component({
  selector: 'settings-drawer',
  imports: [MaterialModule, ReactiveFormsModule, FormsModule],
  template: `
    <mat-card class="m-2 p-2 border-1 border-gray-500">
                <div class="flex flex-col w-full text-gray-700 max-w-140 filter-article filter-interactive">
                  <div class="h-12 rounded-lg p-2 text-2xl text-justify text-gray-200 bg-slate-600" mat-dialog-title> Settings </div>
                  <form [formGroup]="settingsForm" class="form">
                  <div class="w-full mt-2">            
                    <div class="text-secondary">Accounts Used for Payments and Receivables</div>
                </div>
                <div class="grid sm:grid-cols-4 gap-6 w-full mt-8">
                    
                    <div class="sm:col-span-4">
                        <mat-form-field class="fuse-mat-emphasized-affix w-full"  [subscriptSizing]="'dynamic'">                    
                          <div class="text-secondary"  matPrefix> AR Contra </div>                   
                          <input [formControlName]="'arc'" matInput>
                        </mat-form-field>
                    </div>
                    
                    <div class="sm:col-span-4">
                        <mat-form-field  class="fuse-mat-emphasized-affix w-full"  [subscriptSizing]="'dynamic'">                    
                            <div class="text-secondary"  matPrefix> AR </div>
                            <input [formControlName]="'ar'"  matInput>
                        </mat-form-field>
                    </div>

                    
                    <div class="sm:col-span-4">
                        <mat-form-field class="fuse-mat-emphasized-affix w-full"  [subscriptSizing]="'dynamic'">                    
                          <div class="text-secondary"  matPrefix> AP Contra </div>                   
                          <input [formControlName]="'apc'" matInput>
                        </mat-form-field>
                    </div>
                    
                    <div class="sm:col-span-4">
                        <mat-form-field  class="fuse-mat-emphasized-affix w-full"  [subscriptSizing]="'dynamic'">                    
                            <div class="text-secondary"  matPrefix> AP </div>
                            <input [formControlName]="'ap'"  matInput>
                        </mat-form-field>
                    </div>
                                
                  </div>
                  </form>

                  <div mat-dialog-actions class="gap-2 mb-3 mt-4">
                          @if (bSettingsDirty === true) {
                            <button mat-icon-button color="primary" class="bg-slate-200 hover:bg-slate-400 ml-1" (click)="onUpdate()"
                              matTooltip="Save" aria-label="hovered over">
                              <span class="e-icons e-save"></span>
                            </button>
                            }

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
export class SettingsComponent {  
    sTitle = 'Account Settings ';
    originalParty: IAccountSettings;
    settings = input<IAccountSettings | null>();
    Update = output<IAccountSettings>();
    Add = output<IAccountSettings>();
    Delete = output<IAccountSettings>();
    Cancel = output();
    
    bSettingsDirty: boolean = false;
    
    settingsForm = new FormGroup({
      arc : new FormControl(''),
      ar:  new FormControl(''),
      apc:  new FormControl(''),
      ap:  new FormControl(''),      
    });
  
  
    ngOnInit() {
      this.settingsForm.valueChanges.subscribe(() => {
        if (this.settingsForm.dirty === true) {
          this.bSettingsDirty = true;
          this.originalParty = this.settings();        
        }
      });    
    }
    
    ngOnChanges() {
      if (this.settings) {      
        this.settingsForm.patchValue(this.settings());      
      }
    }
  
    updateParty(): IAccountSettings {
      const updateDate = new Date().toISOString().split('T')[0];
      const settings = {
        ar: this.settingsForm.get('ar').value,
        arc: this.settingsForm.get('arc').value,
        ap: this.settingsForm.get('ap').value,
        apc: this.settingsForm.get('apc').value,
        update_date: updateDate,
        update_user: '@admin',      
        create_date: updateDate,
        create_user: '@admin'
      } as IAccountSettings;     
      return settings;
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
