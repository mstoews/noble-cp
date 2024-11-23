import { Component, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GLAccountsService } from 'app/services/accounts.service';
import { GridMenubarStandaloneComponent } from '../../grid-menubar/grid-menubar.component';
import { MaterialModule } from 'app/services/material.module';
import { TemplateStore } from 'app/services/journal-template.store';
import { ExcelExportService, GridModule, PdfExportService } from '@syncfusion/ej2-angular-grids';

const imports = [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    GridModule,
    GridMenubarStandaloneComponent
];

@Component({
    selector: 'journal-template',
    standalone: true,
    imports: [imports],
    templateUrl: './journal-template.component.html',
    providers: [TemplateStore, PdfExportService, ExcelExportService ]
})

export class JournalTemplateComponent {    
    private accountService = inject(GLAccountsService);
    public currentDate: string;
    public journal_details: any[];
    public bOpenDetail: boolean = false;

    templateStore = inject(TemplateStore);
    accounts$ = this.accountService.readChildren(); // retrieves only the child accounts which can be used for booking

    sTitle = 'Journal Template';
    selectedItemKeys: any[] = [];

    readonly allowedPageSizes = [10, 20, 'all'];
    currentRowData: any;

    readonly displayModes = [{ text: "Display Mode 'compact'", value: 'compact' }];
    displayMode = 'compact';
    showPageSizeSelector = true;
    showInfo = true;
    showNavButtons = true;
    public formatoptions: Object;

    drawOpen: 'open' | 'close' = 'open';

    customizeTooltip = (pointsInfo: { originalValue: string; }) => ({ text: `${parseInt(pointsInfo.originalValue)}%` });
    journalForm!: FormGroup;
    keyField: any;

    async ngOnInit() {
        const dDate = new Date();
        this.currentDate = dDate.toISOString().split('T')[0];
        this.formatoptions = { type: 'dateTime', format: 'M/dd/yyyy' }                           
    }

    onCellDoubleClicked(e: any) {
        this.bOpenDetail = true;
        // this.openDrawer();
    }

    changeType(e) {
        console.debug('changeType ', JSON.stringify(e));
    }

    changeSubType(e) {
        console.debug('changeType ', JSON.stringify(e));
    }


    changeFund(e) {
        console.debug('changeType ', JSON.stringify(e));
    }

    changeChildAccount(e) {
        console.debug('changeType ', JSON.stringify(e));
    }


    onAdd() {
        this.bOpenDetail = true;
        // this.openDrawer()
    }

    onRefresh() {
        console.debug('Refresh')
    }

    onDeleteSelection() {
        console.debug('Delete Selection')
    }

    onUpdateSelection() {
        console.debug('onUpdateSelection')
    }

    onDelete(e: any) {
        console.debug('onDelete')
    }

    onUpdate($event: any) {
        console.debug('onUpdate')
    }

    onBooked(booked: boolean) {
        this.journalForm.patchValue({ booked: booked });
    }

    formatNumber(e) {
        const options = {
            style: 'decimal',  // Other options: 'currency', 'percent', etc.
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        };
        const formattedWithOptions = e.value.toLocaleString('en-US', options);
        return formattedWithOptions;
    }

    onCreate() {
        // this.openDrawer();
    }


    selectionChanged(data: any) {
        console.debug(`selectionChanged ${JSON.stringify(data.data)}`);
        this.selectedItemKeys = data.selectedRowKeys;
    }

    onEdit() {
        this.bOpenDetail = true;
        // this.refresh(this.hJournal, this.description, this.transaction_date);
        // this.openDrawer();
    }


    onFocusedDetailRowChanged(e: any) {

        this.currentRowData = e.row.data;
    }

    onFocusedRowChanged(e: any) {
        console.debug('onFocusRowChanged :', JSON.stringify(e.row.data))
    }

    // openDrawer() {
    //     const opened = this.drawer.opened;
    //     if (opened !== true) {
    //         this.drawer.toggle();
    //     } else {
    //         return;
    //     }
    // }

    // closeDrawer() {
    //     this.bOpenDetail = true;
    //     const opened = this.drawer.opened;
    //     if (opened === true) {
    //         this.drawer.toggle();
    //     } else {
    //         return;
    //     }
    // }

}
