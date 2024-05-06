import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { EditService, ToolbarService, PageService, DialogEditEventArgs, SaveEventArgs, GridModule, SortService } from '@syncfusion/ej2-angular-grids';
import { DataManager, DataUtil, Query } from '@syncfusion/ej2-data';
import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { CommonModule, NgClass } from '@angular/common';
import { IStatus, KanbanService } from 'app/services/kanban.service';
import { IEditCell } from '@syncfusion/ej2-angular-grids';
import { GridMenubarStandaloneComponent } from 'app/modules/accounting/grid-menubar/grid-menubar.component';


const imports = [
  GridMenubarStandaloneComponent,
  CommonModule, 
  GridModule, 
  ReactiveFormsModule, FormsModule, NgClass, NumericTextBoxModule, DatePickerModule, DropDownListModule
]

/**
 * Template driven Forms sample
 */
@Component({
    selector: 'kanban-status',
    templateUrl: './status.component.html',
    providers: [ToolbarService, EditService, PageService, SortService],
    standalone: true,
    imports: [imports]
})
export class StatusComponent implements OnInit {
    public data: Object[];
    public statusList: Object[];
    public editSettings: Object;
    public toolbar: string[];
    public pageSettings: Object;
    public priorityParams?: IEditCell;
    
    public data$: any;
    public status$: any;
    public statusData: any;
    
    public editparams: Object;
    private kanbanService = inject(KanbanService)
    
    public ngOnInit(): void {        
        
        this.status$ = this.kanbanService.readStatus();        
        this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' };
        this.toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];
        this.pageSettings = { pageCount: 5};
      //   this.kanbanService.readFullStatus().subscribe(data =>  {
      //     this.statusList = data;
      //  })        

       this.priorityParams = {
        params: {
            actionComplete: () => false,
            allowFiltering: true,
            // dataSource: new DataManager(this.statusList),
            // fields: { text: 'fullDescription', value: 'description' },
            // query: new Query()
        }
      };
        
    }

    actionBegin(args: SaveEventArgs): void {
        if (args.requestType === 'beginEdit' || args.requestType === 'add') {
            this.statusData = Object.assign({}, args.rowData);
        }
        // if (args.requestType === 'save') {
        //     if (this.orderForm.valid) {
        //         args.data = this.statusData;
        //     } else {
        //         args.cancel = true;
        //     }
        // }
    } 

    actionComplete(args: DialogEditEventArgs): void {
        if (args.requestType === 'beginEdit' || args.requestType === 'add') {
            // Set initail Focus
            if (args.requestType === 'beginEdit') {
                (args.form.elements.namedItem('CustomerName') as HTMLInputElement).focus();
            } else if (args.requestType === 'add') {
                (args.form.elements.namedItem('OrderID') as HTMLInputElement).focus();
            }

        }
    }

    public focusIn(target: HTMLElement): void {
        target.parentElement.classList.add('e-input-focus');
    }

    public focusOut(target: HTMLElement): void {
        target.parentElement.classList.remove('e-input-focus');
    }

}

