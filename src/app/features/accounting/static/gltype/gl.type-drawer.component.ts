import { Component, inject, input , OnInit, output  } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IGLType } from 'app/models/types';
import { MaterialModule } from 'app/services/material.module';

@Component({
  selector: 'gltype-drawer',
  imports: [MaterialModule, ReactiveFormsModule, FormsModule],
  template: `
       <mat-card>
            <div class="flex flex-col w-full text-gray-700 max-w-140 filter-article filter-interactive">
            <div class="bg-slate-600 text-justify m-2 p-2 text-white h-10 text-2xl border-l-4 border-gray-400"
            mat-dialog-title>
            {{ sTitle }}
        </div>
            <div mat-dialog-content>
                <form [formGroup]="gltypeForm">
                    <div class="flex flex-col m-1">
                        <section class="flex flex-col md:flex-row">
                            <div class="flex flex-col grow">
                                <mat-label class="ml-2 text-base">FS Mapping </mat-label>
                                <mat-form-field class="m-1 form-element grow" appearance="outline">
                                    <input matInput placeholder="Type" formControlName="type" />
                                </mat-form-field>
                            </div>
                        </section>


                        <div class="flex flex-col grow">
                            <mat-label class="ml-2 text-base">Description</mat-label>
                            <mat-form-field class="m-1 form-element" appearance="outline">
                                <input matInput placeholder="Type Description"
                                    formControlName="description" />
                            </mat-form-field>
                        </div>

                    </div>
                </form>
            </div>
            <div mat-dialog-actions>
                @if (bDirty === true) {
                    <button mat-icon-button color="primary" class="bg-slate-200 hover:bg-slate-400 ml-1" (click)="onUpdate()"
                      matTooltip="Save" aria-label="hovered over">
                      <span class="e-icons e-save"></span>
                    </button>
                }

                <button mat-icon-button color="primary" 
                        class=" hover:bg-slate-400 ml-1" (click)="onAdd()" matTooltip="New" aria-label="hovered over">                        
                        <span class="e-icons e-circle-add"></span>
                </button>

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
export class GLTypeDrawerComponent implements OnInit {

  sTitle = 'Mapping Maintenance';
  originalGLType: IGLType;
  gltype = input<IGLType | null>();
  Update = output<IGLType>();
  Add = output<IGLType>();
  Delete = output<IGLType>();
  Cancel = output();
  
  bDirty: boolean = false;
  private fb = inject(FormBuilder);
  
  gltypeForm = new FormGroup({
    type : new FormControl(''),
    description:  new FormControl('')    
  });


  ngOnInit() {
    this.gltypeForm.valueChanges.subscribe(() => {
      if (this.gltypeForm.dirty === true) {
        this.bDirty = true;
        this.originalGLType = this.gltype();        
      }
    });    
  }
  
  ngOnChanges() {
    if (this.gltype) {      
      this.gltypeForm.patchValue(this.gltype());      
    }
  }

  updateGLType(): IGLType {
    const updateDate = new Date().toISOString().split('T')[0];
    return {
      gltype: this.gltypeForm.value.type,
      description: this.gltypeForm.value.description,      
      update_date: updateDate,
      update_user: '@admin',      
      create_date: updateDate,
      create_user: '@admin'
    } as IGLType;     

  }

  onUpdate() {
    this.Update.emit(this.updateGLType());
  }

  onAdd() {
    this.Add.emit(this.updateGLType());
  }

  onDelete() {
    this.Delete.emit(this.updateGLType());
  }

  onCancel() {
    this.Cancel.emit();
  }

}
