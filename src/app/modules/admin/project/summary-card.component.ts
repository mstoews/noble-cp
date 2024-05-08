import { NgFor, NgIf, NgClass, CurrencyPipe, CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslocoModule } from '@ngneat/transloco';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'summary-card',
  standalone: true,
  imports: [
    TranslocoModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    MatMenuModule,
    MatTabsModule,
    MatButtonToggleModule,
    NgApexchartsModule,
    NgFor,
    NgIf,
    MatTableModule,
    NgClass,
    CurrencyPipe,
    CommonModule
    
],
  templateUrl: './summary-card.component.html',
  styles: ``
})
export class SummaryCardComponent {
  @Input() mainValue: number;
  @Input() caption: string;
  @Input() title: string ;
  @Input() subtitle: string;
  @Input() subtitle_value: number


  // mainValue =  18223.23;
  // caption = 'Fund Total';
  // title = 'Reserve Funds';
  // subtitle = 'Funds';
  // subtitle_value = 3

  

}
