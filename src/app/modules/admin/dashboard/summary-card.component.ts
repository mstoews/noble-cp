import { CurrencyPipe, CommonModule } from '@angular/common';
import { Component, input, Input } from '@angular/core';
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
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    MatMenuModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatTableModule,
    CommonModule    
],
  templateUrl: './summary-card.component.html',
  styles: ``
})
export class SummaryCardComponent {
  mainValue = input(0);

  caption = input('');
  title = input('');
  subtitle = input('');
  subtitle_value = input(0);
  chart = input('chart-legend-right');

}
