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
    template: `

<div class="flex items-start justify-between" >
        <div class="text-lg font-medium tracking-tight leading-6 truncate dark:text-gray-100">{{caption()}}</div>
        
        <div class="ml-2 -mt-2 -mr-3">

        @switch(chart()){
            @case ('donut') {                  <span class="e-icons e-chart-donut text-6xl dark:text-red-100"></span>             }            
            @case ('chart-legend-right')     { <span class="e-icons e-chart-legend-right text-6xl dark:text-gray-100"></span> }
            @case ('2d-pie-2')               { <span class="e-icons e-chart-2d-pie-2 text-6xl dark:text-gray-100"></span> }
            @case ('chart-lines')            { <span class="e-icons e-chart-lines text-6xl dark:text-gray-100"></span> }
            @case ('chart-insert-column')    { <span class="e-icons e-chart-insert-column text-6xl dark:text-gray-100"></span> }
            @case ('chart-legend'      ){      <span class="e-icons e-chart-legend text-6xl dark:text-gray-100"></span> }
            @case ('scatter'     ){            <span class="e-icons e-chart-scatter text-6xl dark:text-gray-100"></span> }
            @case ('heatmap'     ){            <span class="e-icons e-chart-heatmap text-6xl dark:text-gray-100"></span> }
            @case ('candlestick' ){            <span class="e-icons e-chart-candlestick text-6xl dark:text-gray-100"></span> }
            @case ('hilo'        ){            <span class="e-icons e-chart-hilo text-6xl dark:text-gray-100"></span> }
            @case ('hilo-open-close') {        <span class="e-icons e-chart-hilo-open-close text-6xl dark:text-gray-100"></span> }
            @case ('ohlc'        ){            <span class="e-icons e-chart-ohlc text-6xl dark:text-gray-100"></span> }
            @case ('box'         ){            <span class="e-icons e-chart-box text-6xl dark:text-gray-100"></span> }
            @case ('candle'      ){            <span class="e-icons e-chart-candle text-6xl dark:text-gray-100"></span> }
            @case ('chart-with-legend-keys' ){ <span class="e-icons e-chart-with-legend-keys text-6xl dark:text-purple-100"></span> }
            @default { <span class="e-icons e-chart-bar text-6xl dark:text-gray-100"></span> }
        }

        </div>
    </div>
    <div class="flex flex-col items-center mt-2">
        <div class="text-5xl sm:text-7xl font-bold tracking-tight leading-none text-blue-500 ">
            {{mainValue() | number:'1.0-0'}}
            
        </div>
        <div class="text-lg font-medium text-blue-700 dark:text-blue-500"></div>
        <div class="flex items-baseline justify-center w-full mt-5 text-secondary">
            <div class="text-md font-medium truncate dark:text-gray-100">{{subtitle()}}
                
            </div>            
            <!-- <div class="ml-1.5 text-lg font-semibold">{{subtitle_value() | number:'1.0-0' }}</div> -->
        </div>
    </div>

    `,
    styles: ``
})
export class SummaryCardComponent {
  mainValue = input(0);
  caption = input('');
  title = input('');
  subtitle = input('');
  subtitle_value = input(0);
  chart = input('');

}
