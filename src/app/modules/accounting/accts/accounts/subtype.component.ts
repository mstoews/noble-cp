import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { Component, OnInit, ViewChild, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { GridMenubarStandaloneComponent } from '../../grid-menubar/grid-menubar.component';

import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { SubTypeService } from 'app/services/subtype.service';
import { IType } from 'app/services/type.service';

const imports = [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    GridMenubarStandaloneComponent
];

@Component({
    template: 
    `
    <mat-drawer class="lg:w-2/5 md:w-full bg-white-100" #drawer [opened]="false" mode="over" [position]="'end'"
        [disableClose]="false">
        <div class="flex flex-col w-full text-gray-700 max-w-140 filter-article filter-interactive">
            <div class="h-10 pt-2 text-2xl text-justify text-black bg-slate-100" mat-dialog-title>
                {{ sTitle }}
            </div>
            <div mat-dialog-content>
                <form [formGroup]="accountsForm">

                    <div class="flex flex-col m-1">
                        
                        <div class="flex flex-col grow">
                            <mat-label class="ml-2 text-base">Sub Type</mat-label>
                            <mat-form-field class="m-1 form-element grow" appearance="outline">
                                <input matInput placeholder="Type" formControlName="sub_type" />
                            </mat-form-field>
                        </div>
                        
                        <div class="flex flex-col grow">
                            <mat-label class="ml-2 text-base">Description</mat-label>
                            <mat-form-field class="m-1 form-element" appearance="outline">
                                <input matInput placeholder="Type Description" formControlName="description" />
                            </mat-form-field>
                        </div>

                    </div>
                </form>
            </div>
            <div mat-dialog-actions>
                <button mat-raised-button color="primary" class="m-1" (click)="onUpdate($event)" matTooltip="Save"
                    aria-label="Button that displays a tooltip when focused or hovered over">
                    Update
                    <mat-icon>update</mat-icon>
                </button>
                <button mat-raised-button color="primary" class="m-1" (click)="onCreate($event)" matTooltip="Save"
                    aria-label="Button that displays a tooltip when focused or hovered over">
                    Add
                    <mat-icon>add</mat-icon>
                </button>
                <button mat-raised-button color="primary" class="m-1" (click)="onDelete($event)" matTooltip="Save"
                    aria-label="Button that displays a tooltip when focused or hovered over">
                    Delete
                    <mat-icon>delete</mat-icon>
                </button>
                <button mat-raised-button color="primary" class="m-1" (click)="closeDrawer()" matTooltip="Save"
                    aria-label="Button that displays a tooltip when focused or hovered over">
                    Cancel
                    <mat-icon>close</mat-icon>
                </button>
            </div>
        </div>
    </mat-drawer>

<mat-drawer-container class="flex-col h-full">
    
    
        <ng-container>
            <grid-menubar 
            (notifyParentRefresh)="onRefresh()" 
            (notifyParentAdd)="onAdd()"
            (notifyParentDelete)="onDeleteSelection()" 
            (notifyParentUpdate)="onUpdateSelection()">
             </grid-menubar>                         
             
             @if (store.isLoading() === false) 
            {                            
                <gl-grid 
                    (openTradeId)="selectedRow($event)"
                    [data]="store.type()" 
                    [columns]="columns">
                </gl-grid>                        
            }
               @else
            {
                <div class="fixed z-[1050] -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4">
                    <mat-spinner></mat-spinner>
                </div>
            }
    
        </ng-container>
        </mat-drawer-container>
    `,
    selector: 'subtypes',
    imports: [imports],
    providers: [imports]
})
export class GlSubTypeComponent implements OnInit {
onRefresh() {
throw new Error('Method not implemented.');
}
onAdd() {
throw new Error('Method not implemented.');
}
onDeleteSelection() {
throw new Error('Method not implemented.');
}
onUpdateSelection() {
throw new Error('Method not implemented.');
}

    private fuseConfirmationService = inject(FuseConfirmationService);
    private fb = inject(FormBuilder);
    private subtypeService = inject(SubTypeService)
    @ViewChild('drawer') drawer!: MatDrawer;

    public sTitle = 'General Ledger Sub Types';
    public accountsForm!: FormGroup;
    public data$: any
    public typeForm?: FormGroup | any;
store: any;

    ngOnInit() {
        this.createEmptyForm();
        this.data$ = this.subtypeService.read();
        this.createEmptyForm()
    }

    onCreate(e: any) {
        this.createEmptyForm();
        this.openDrawer();
    }

    onDelete(e: any) {
        console.debug(`onDelete ${JSON.stringify(e)}`);
        const confirmation = this.fuseConfirmationService.open({
            title: 'Delete Sub Type?',
            message: 'Are you sure you want to delete this type? ',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                // Delete the list
                // this.typeApiService.delete(this.typeId);
            }
        });
        this.closeDrawer();
    }

    createEmptyForm() {
        this.accountsForm = this.fb.group({
            sub_type: [''],
            description: [''],
        });
    }

    openDrawer() {
        const opened = this.drawer.opened;
        if (opened !== true) {
            this.drawer.toggle();
        } else {
            return;
        }
    }

    closeDrawer() {
        const opened = this.drawer.opened;
        if (opened === true) {
            this.drawer.toggle();
        } else {
            return;
        }
    }

    onUpdate(e: any) {
        const dDate = new Date();
        const updateDate = dDate.toISOString().split('T')[0];
        const account = { ...this.accountsForm.value } as IType;
        const rawData = {
            type: account.type,
            description: account.description,
            update_date: updateDate,
            update_user: 'admin_update',
        };

        this.closeDrawer();
    }

}
