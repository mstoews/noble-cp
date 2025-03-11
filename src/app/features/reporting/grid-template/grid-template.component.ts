import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { SortService, GridModule, FilterService, IFilter, Column, GridComponent, Filter } from '@syncfusion/ej2-angular-grids';
import { MultiSelect } from '@syncfusion/ej2-dropdowns';
import { createElement } from '@syncfusion/ej2-base';
import { employeeDetail } from './data';


import { ChipListModule } from '@syncfusion/ej2-angular-buttons';
import { NgIf } from '@angular/common';


@Component({
  selector: 'grid-template',
  imports: [ GridModule,  NgIf, ChipListModule],
  template: `
    <style>
        .control-section{
        margin-top: 100px;
      }
  </style>
  
  <div class="control-section">
    <ejs-grid #grid [dataSource]='data' [allowSorting]='true' [allowFiltering]='true' [filterSettings]='filterSettings'>
        <e-columns>
            <!-- <e-column headerText='Image' width='180' textAlign='Center'>
                <ng-template #template let-data>
                    <div class="image">
                        <img src="https://ej2.syncfusion.com/angular/demos/assets/grid/images/{{data.EmployeeID.replace('Emp100', '')}}.png" alt="{{data.EmployeeID}}"/>
                    </div>
                </ng-template>
            </e-column> -->
            <e-column field='EmployeeID' headerText='ID' width='160'></e-column>
            <e-column field='Name' headerText='Name' width='120'></e-column>
            <e-column field='MailID' headerText='Email ID' width='150'>
                <ng-template #template let-data>
                    <div>
                    <a href="mailto:{{data.MailID}}">{{data.MailID}}</a></div>
                </ng-template>
            </e-column>
            <e-column field='DateOfJoining' headerText='Date Joined' width='170' textAlign='Right' format='yMd' type='date'></e-column>
            <e-column field='Designation' headerText='Designation' width='160'></e-column>
            <e-column field='Team' headerText='Team(s)' width='160'></e-column>
            <e-column field='ReportTo' headerText='Reporter' width='120'></e-column>
            <e-column field='EmployeeAvailability' headerText='Availability' width='100'>
                <ng-template #template let-data>                       
                    <div *ngIf="data.EmployeeAvailability === 'Available';else login" class="statustemp e-availablecolor">                                          
                            <span class="statustxt e-availablecolor rounded-sm">{{data.EmployeeAvailability}}</span>           
                    </div>
                    <ng-template #login>
                        <div class="statustemp e-notavailablecolor">
                            <span class="statustxt e-notavailablecolor">{{data.EmployeeAvailability}}</span>
                        </div>
                        </ng-template>
                </ng-template>               
            </e-column>
            <e-column field='YearOfExperience' headerText='Experience' width='200'></e-column>
            <e-column field='AssetKit' headerText='Asset Kit' width='180' [filter]= 'filter'>
                <ng-template #template let-data>
                    <div class="asset">
                        <ejs-chiplist id="asset" [chips]="data.AssetKit.split(',')"></ejs-chiplist>
                    </div>
                </ng-template>
            </e-column>
            <e-column field='AssetKitDistribution' headerText='Assigned Date' width='170' format='yMd' textAlign='Right' type='date'></e-column>
            <e-column field='Location' headerText='Location' width='150'>
                <ng-template #template let-data>
                    <div>
                        <span class="e-location e-icons"></span>{{data.Location}}
                    </div>
                </ng-template>
            </e-column>
            <e-column field='PhoneNumber' headerText='Contact No' width='150' textAlign='Right'></e-column>
        </e-columns>

    </ejs-grid>

  </div>
  `,
  styles: `
  .image img {
    height: 55px;
    width: 55px;
    border-radius: 50px;
    box-shadow: inset 0 0 1px #e0e0e0, inset 0 0 14px rgba(0,0,0,0.2);
}
td.e-rowcell .statustxt.e-availablecolor {
    color: white;
    position: relative;
    top: 4px;
}

td.e-rowcell .statustxt.e-notavailablecolor {
    color: white;
    position: relative;
    top: 4px;
}
.statustemp.e-notavailablecolor {
    background-color: indianred;
    width: 100px;
    height: 30px;
}
.statustemp.e-availablecolor {
    background-color: #58d378;
    width: 100px;
    height: 30px;
}
.statustxt.e-availablecolor {
    color: white;
    position: relative;
}
.statustxt.e-notavailablecolor {
    color: white;
    position: relative;
}
.statustemp {
    position: relative;
    height: 19px;
    text-align: center
}
.e-icon-location::before {
    content: "\e30c";
}
.e-location {
    margin-right: 5px;
}
.highcontrast .e-grid td.e-rowcell.e-selectionbackground.e-active .e-icons,
.fluent2-highcontrast .e-grid .e-row:hover .e-icons,
.fluent2-highcontrast .e-grid td.e-rowcell.e-selectionbackground.e-active .e-icons {
    color: black;
}
  `
})
export class GridTemplateComponent implements OnInit {

  @ViewChild('grid')
    public grid?: GridComponent;
    public data: Object[];
    public filterSettings: Object;
    public filter?: IFilter;
    public dropInstance?: MultiSelect;
    constructor() {
        
    }
    ngOnInit(): void {
        this.data = employeeDetail;
        this.filterSettings = {
            type: 'CheckBox',
            operators: {
                stringOperator: [
                    { value: 'contains', text: 'Contains' },
                    { value: 'doesnotcontain', text: 'Does Not Contains' },
                ],
            },
        },
        this.filter = {
            type: 'Menu',
            ui: {
                create: (args: { target: Element; column: object }) => {
                    const flValInput: HTMLElement = createElement('input', {
                        className: 'flm-input',
                    });
                    args.target.appendChild(flValInput);
                    let dropdownData: string[] = [
                        'Phone',
                        'Mouse',
                        'Laptop',
                        'Keyboard',
                        'Headset',
                        'Tablet',
                        'Projector',
                        'Printer',
                        'Calculator',
                    ];
                    this.dropInstance = new MultiSelect({
                        dataSource: dropdownData,
                        placeholder: 'Select a value',
                        popupHeight: '200px',
                        allowFiltering: true,
                        mode: 'Box',
                    });
                    this.dropInstance.appendTo(flValInput);
                },
                write: (args: any) => {
                    if (args.filteredValue && args.filteredValue.length > 0) {
                        (this.dropInstance as MultiSelect).value = args.filteredValue.split(', ');
                    }
                },
                read: (args: {
                    column: Column;
                    operator: string;
                    fltrObj: Filter;
                }) => {
                    (this.grid as GridComponent).removeFilteredColsByField(
                        args.column.field
                    );
                    if ((this.dropInstance as MultiSelect).value && (this.dropInstance as MultiSelect).value.length) {
                        args.fltrObj.filterByColumn(
                            args.column.field,
                            args.operator,
                            (this.dropInstance as MultiSelect).value.sort().join(', ')
                        );
                    }
                },
            },
        }
    }

}
