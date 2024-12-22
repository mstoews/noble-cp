import { Component, OnDestroy, OnInit, ViewEncapsulation, inject, viewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/services/material.module';

import { JournalStore } from 'app/services/journal.store';
import { Router, NavigationStart } from '@angular/router';

import { GridMenubarStandaloneComponent } from '../../grid-menubar/grid-menubar.component';
import { GLGridComponent } from '../../grid-menubar/gl-grid.component';


const imports = [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    GridMenubarStandaloneComponent,
    GLGridComponent
];

@Component({
    selector: 'transactions',
    imports: [imports],
    encapsulation: ViewEncapsulation.None,
    templateUrl: './journal-listing.component.html',
    providers: [JournalStore] 
})
export class JournalEntryComponent implements OnInit, OnDestroy {

    public route = inject(Router);
    public store = inject(JournalStore);

    sTitle = 'Transaction Listings by Journal Type';

    currentRowData: any;
    drawOpen: 'open' | 'close' = 'open';
    collapsed = false;
    public sGridTitle = 'Journal Entry';

    columns = [
        { field: 'journal_id', headerText: 'Journal ID', isPrimaryKey: true, isIdentity: true, visible: true, width: 80 },
        { field: 'type', headerText: 'Type', width: 60 },
        { field: 'booked', headerText: 'Booked', width: 80, type: Boolean,  displayAsCheckbox: true },
        { field: 'transaction_date', headerText: 'Date', width: 100, format: 'M/dd/yyyy' },
        { field: 'description', headerText: 'Description', width: 200 },
        { field: 'period', headerText: 'Prd', width: 50, visible: true },
        { field: 'amount', headerText: 'Amount', width: 80 , format: 'N2', textAlign: 'Right' },        
        { field: 'period_year', headerText: 'Yr', width: 100, visible: false },
        { field: 'create_date', headerText: 'Created', width: 100, format: 'M/dd/yyyy' , visible: false},
        { field: 'create_user', headerText: 'User', width: 100 , visible: false},
        { field: 'party_id', headerText: 'Party', width: 100, visible: false }  
    ];

    /*
    <e-column  field="journal_id"  headerText="ID" width="100" dataType="number" isPrimaryKey='true' textAlign="left"></e-column>
    <e-column  field="type"        headerText="Type" width="100" dataType="text" textAlign="left"></e-column>
    <e-column  field="booked"      [displayAsCheckBox]='true' headerText="Booked" width="100" type="boolean"></e-column>                            
    <e-column  field="amount"      headerText="Amount" format='N2' width="150" textAlign="Right"></e-column>
    <e-column  field="period"      headerText="Prd" width="100" ></e-column>
    <e-column  field="period_year" headerText="Yr" width="100"></e-column>    
    <e-column  field="description" headerText="Description" width="200"></e-column>                                    
    <e-column  field="create_date" width='120' [format]='formatoptions' headerText="Created" type="dateTime"></e-column>                                                        
    <e-column  field="create_user" width='120' headerText="User" type="string"></e-column>             
    <e-column  field="period" width='80' headerText="Prd" type="numeric"></e-column>             
    <e-column  field="period_year" width='80' headerText="Year" type="numeric"></e-column>             
    <e-column  field="party_id" width='120' headerText="Party" type="string"></e-column>             
    */



    ngOnInit() {
        
    }

    selectedRow($event) {
        this.currentRowData = $event;
        this.route.navigate(['journals/gl', $event.journal_id]);
    }


    public dateValidator() {
        return (control: FormControl): null | Object => {
            return control.value && control.value.getFullYear &&
                (1900 <= control.value.getFullYear() && control.value.getFullYear() <= 2099) ? null : { OrderDate: { value: control.value } };
        }
    }

    
    public onAdd() {

    }

    public onRefresh() {
        console.debug('Refresh')
    }

    public onDeleteSelection() {
        console.debug('Delete Selection')
    }

    public onUpdateSelection() {
        console.debug('onUpdateSelection')
    }

    public onDelete(e: any) {
        console.debug('onDelete')
    }

    public onUpdate($event: any) {
        console.debug('onUpdate')
    }

    public onBooked(booked: boolean) {

    }

    updateBooked() { }

    ngOnDestroy() {

    }
}
