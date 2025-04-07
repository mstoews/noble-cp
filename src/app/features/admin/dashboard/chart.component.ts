import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { AccumulationChart, AccumulationChartComponent,ChartAllModule, IAccLoadedEventArgs, AccumulationTheme, AccumulationChartAllModule } from '@syncfusion/ej2-angular-charts';
import { Browser } from '@syncfusion/ej2-base';

import { loadAccumulationChartTheme } from './theme-color';
@Component({
  selector: "dashboard-chart",
  imports: [ChartAllModule, AccumulationChartAllModule],
  template: `
  <style>
    .control-section{
        margin-top: 23px;
    }
    </style>
    <div class="control-section bg-gray-200 dark:bg-gray-700 rounded-xl p-4">
    <div>
        <ejs-accumulationchart id="container" #pie style='display:block; width: 92%' [legendSettings]="legendSettings"
            [tooltip]="tooltip" [title]="title" [enableSmartLabels]='enableSmartLabels'
            [enableAnimation]='enableAnimation' (load)='load($event)' [enableBorderOnMouseMove]='false'>
            <e-accumulation-series-collection>
                <e-accumulation-series [dataSource]='data' xName='Country' yName='Population' innerRadius="20%" [dataLabel]="dataLabel" [radius]='radius' tooltipMappingName='Radius'>
                </e-accumulation-series>
            </e-accumulation-series-collection>
        </ejs-accumulationchart>
    </div>
    </div>
    <style>
        .control-section {
            min-height: 450px;
        }
      </style>
    `,    
  styles: 
  `
    #chart {
        max-width: 650px;
        margin: 35px auto;
        }
    `
})
export class DashboardChartComponent {

  public data: Object[] = [
    { Country : "Water", Population : 5070, Radius : Browser.isDevice ? '110' : "100", text: 'Water'},
    { Country : "Snow Removal",    Population : 500, Radius : Browser.isDevice ? '120' :"118.7", text: 'Snow Removal' },
    { Country : "Security",  Population : 3685 , Radius : '137.5', text: Browser.isDevice ? 'Dominican <br> Republic' :  'Security' },
    { Country : "Power", Population : 3500 , Radius : '124.6', text: 'Power'},
    { Country : "Interest", Population : 300 , Radius : "150.8", text: 'Interest'},
    
];
@ViewChild('pie')
public pie: AccumulationChartComponent | AccumulationChart;
//Initializing Legend
public legendSettings: Object = {
    visible: true,
    reverse: true
};
//Initializing Datalabel
public dataLabel: Object = {
    visible: true, position: Browser.isDevice ? 'Inside' : 'Outside',
    name: 'text',
    connectorStyle: { length: '20px', type:'Curve' },
    font: {
        fontWeight: '600'
    },
    enableRotation: true,
};
  // custom code start
public load(args: IAccLoadedEventArgs): void {
    loadAccumulationChartTheme(args);
};
  // custom code end
public radius: string = 'Radius';
public enableAnimation: boolean = true;
public enableSmartLabels: boolean = true;
public tooltip: Object = {
    enable: true,
    header: '',
    format: '<b>${point.x}</b><br>Cost per Month: <b>${point.y}</b><br>Cost per month on average: <b>${point.tooltip}</b>',
    name: 'Radius',
    enableHighlight: true
};
public title: string = 'Cost per Month';
constructor() {
    //code
};

}
