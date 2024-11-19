import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { GridComponent, GridModule } from '@syncfusion/ej2-angular-grids';
import { SelectionSettingsModel } from '@syncfusion/ej2-grids';
const imports  = [
  GridModule,
]

@Component({
  standalone: true,
  selector: 'generic-table',
  imports : [imports],
  template: 
  ` 
  <ejs-grid #grid [dataSource]='data' [height]='800' [columns]='gColumns'> 
  </ejs-grid>  
  `
  , 
})
export class GenericTableComponent  implements OnInit {

  @Input() childProperty: any; 
  @Input() tableColumns: any; 


  constructor() { 
    this.initDefaults(); 
  } 
  private initDefaults(): void { 
    this.tableColumns = []; 
  } 
  
  @ViewChild('grid', { static: true }) public grid: GridComponent; 
  public data: object[]; 
  public selectionOptions: SelectionSettingsModel; 
  public gColumns: object[]; 

   
   
  ngOnInit(): void { 
    debugger; 
    this.gColumns = this.tableColumns; 
  } 
  
}


