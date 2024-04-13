import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IType } from 'app/models';

const imports = [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule
];

@Component({
    selector: 'type-dropdown',
    standalone: true,
    imports: [imports],
    template: `
        <mat-select (selectionChange)="getType($event)"  placeholder="Type" formControlName="type">
            @for (type of typeSignal(); track type) {
                <mat-option  [value]="type.type"> {{ type.type }} </mat-option>
            }
        </mat-select>
  `,
    styles: ``
})
export class TypeDropDownComponent {

    typeSignal = signal<IType[]>([]);

    @Input({ required: true }) set types(value: IType[]) { this.typeSignal.set(value); }

    getType($event: any) {
        throw new Error('Method not implemented.');
    }
}
