import { Component, OnDestroy, OnInit, ViewEncapsulation, inject, viewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/services/material.module';

import { JournalStore } from 'app/services/journal.store';
import { Router, NavigationStart } from '@angular/router';

import { GridMenubarStandaloneComponent } from '../../grid-components/grid-menubar.component';
import { GLGridComponent } from '../../grid-components/gl-grid.component';
import { Store } from '@ngrx/store';
import { loadJournalHeader, loadJournalHeaderByPeriod } from 'app/state/journal/Journal.Action';
import { Observable } from 'rxjs';
import { IJournalHeader } from 'app/models/journals';
import { getJournals } from 'app/state/journal/Journal.Selector';
import { IPeriod, IPeriodParam } from 'app/models/period';
import { MatDrawer } from '@angular/material/sidenav';

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
    providers: []
})
export class JournalEntryComponent implements OnInit, OnDestroy {
    drawer = viewChild<MatDrawer>("drawer");
    public param!: IPeriodParam;
    public route = inject(Router);
    private Store = inject(Store);
    public periodForm!: FormGroup;
    private fb = inject(FormBuilder);
    public toolbarTitle: string = "Journal Entry";


    sTitle = 'Transaction Listings by Journal Type';
    public journalHeader$: Observable<IJournalHeader[]>;
    public user$: Observable<string>;

    currentRowData: any;
    drawOpen: 'open' | 'close' = 'open';
    collapsed = false;
    public sGridTitle = 'Journal Entry';

    columns = [
        { field: 'journal_id', headerText: 'Journal ID', isPrimaryKey: true, isIdentity: true, visible: true, width: 80 },
        { field: 'type', headerText: 'Type', width: 60 },
        { field: 'status', headerText: 'Status', width: 80, type: Boolean, displayAsCheckbox: true },
        { field: 'transaction_date', headerText: 'Date', width: 100, format: 'M/dd/yyyy' },
        { field: 'description', headerText: 'Description', width: 200 },
        { field: 'period', headerText: 'Prd', width: 50, visible: true },
        { field: 'amount', headerText: 'Amount', width: 80, format: 'N2', textAlign: 'Right' },
        { field: 'period_year', headerText: 'Yr', width: 100, visible: false },
        { field: 'create_date', headerText: 'Created', width: 100, format: 'M/dd/yyyy', visible: false },
        { field: 'create_user', headerText: 'User', width: 100, visible: false },
        { field: 'party_id', headerText: 'Party', width: 100, visible: false }
    ];

    ngOnInit() {        
        this.param = { period: 1, period_year: 2024 };
        this.Store.dispatch(loadJournalHeaderByPeriod({ period: this.param }));           
        this.journalHeader$ = this.Store.select(getJournals);
        
        
        this.toolbarTitle = "Journal Transactions : " + this.param.period + " - " + this.param.period_year;
        this.periodForm = this.fb.group({
            period: ['', Validators.required],
            period_year: ['',Validators.required],
        });
    }

    selectedRow($event) {
        this.currentRowData = $event;
        this.route.navigate(['journals/gl', $event.journal_id]);
    }

    openDrawer() {
        this.drawer().open();
    }

    closeDrawer() {
        this.drawer().close();
        
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
        var period = this.periodForm.getRawValue()        
        this.param = { period: Number(period.period) , period_year: Number(period.period_year) };
        this.toolbarTitle = "Journal Transactions : " + this.param.period + " - " + this.param.period_year;
        this.Store.dispatch(loadJournalHeaderByPeriod({ period: this.param }));              
    }

    public onBooked(booked: boolean) {

    }

    updateBooked() { }

    ngOnDestroy() {

    }
}
