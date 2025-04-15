import { Component } from '@angular/core';
import { DropDownButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import { SpreadsheetAllModule, SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';

@Component({
  selector: 'spreadsheet-view',
  imports: [DropDownButtonModule,
    SpreadsheetAllModule],
  template: `
      <ejs-spreadsheet #dockerImage [openUrl]="openUrl" [saveUrl]="saveUrl" allowSave='true' allowOpen="true" height="100%"> </ejs-spreadsheet>
  `,
  styles: ``
})
export class SpreadsheetViewComponent {

  public spreadsheetObj: SpreadsheetComponent;
  beforeOpen($event: any) {
    
  }

  public openUrl: string = 'https://services.syncfusion.com/angular/production/api/spreadsheet/open';
  public saveUrl: string = 'https://services.syncfusion.com/angular/production/api/spreadsheet/save';
  
  public allowedExtensions: string = '.xlsx, .xls, .csv';

}
