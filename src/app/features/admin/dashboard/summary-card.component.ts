import { CommonModule } from '@angular/common';
import { Component, input, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';

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
            <div class="text-lg font-medium tracking-tight leading-6 truncate dark:text-gray-800">{{caption()}}</div>            
                <div class="ml-2 -mt-2 -mr-3">
                    @switch(chart()){
                        @case ('1') { <span class="e-icons e-chart-donut text-6xl dark:text-gray-800"></span> }            
                        @case ('2') { <span class="e-icons e-chart-legend-right text-6xl dark:text-gray-800"></span> }
                        @case ('3') { <span class="e-icons e-chart-2d-pie-2 text-6xl dark:text-gray-800"></span> }
                        @case ('4') { <span class="e-icons e-chart-lines text-6xl dark:text-gray-800"></span> }
                        @case ('5') { <span class="e-icons e-chart-insert-column text-6xl dark:text-gray-800"></span> }
                        @case ('6') { <span class="e-icons e-chart-legend text-6xl dark:text-gray-800"></span> }
                        @case ('7') { <span class="e-icons e-chart-scatter text-6xl dark:text-gray-800"></span> }
                        @case ('8') { <span class="e-icons e-chart-heatmap text-6xl dark:text-gray-800"></span> }
                        @case ('9') { <span class="e-icons e-chart-candlestick text-6xl dark:text-gray-800"></span> }
                        @case ('10') { <span class="e-icons e-chart-hilo text-6xl dark:text-gray-800"></span> }
                        @case ('11') { <span class="e-icons e-chart-hilo-open-close text-6xl dark:text-gray-800"></span> }
                        @case ('12') { <span class="e-icons e-chart-ohlc text-6xl dark:text-gray-800"></span> }
                        @case ('13') { <span class="e-icons e-chart-box text-6xl dark:text-gray-800"></span> }
                        @case ('14') { <span class="e-icons e-chart-candle text-6xl dark:text-gray-800"></span> }
                        @case ('15' ){ <span class="e-icons e-chart-with-legend-keys text-6xl dark:text-gray-800"></span> }
                        @default { <span class="e-icons e-chart-bar text-6xl dark:text-gray-800"></span> }
                    }
                </div>
            </div>
        <div class="flex flex-col items-center mt-2">
        <div class="text-5xl sm:text-7xl font-bold tracking-tight leading-none text-blue-900 ">
            {{mainValue() | number:'1.0-0'}}            
        </div>
        <div class="text-lg font-medium text-blue-900 dark:text-blue-900"></div>
        <div class="flex items-baseline justify-center w-full mt-5 text-secondary">
            <div class="text-md font-medium truncate dark:text-gray-900"> {{subtitle()}} </div>                        
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

    constructor() {
        console.log('Main ', this.mainValue())
        
    }

}
