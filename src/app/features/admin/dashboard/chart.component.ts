import { Component, ViewChild } from "@angular/core";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexFill,
  ApexLegend,
  ApexPlotOptions,
  NgApexchartsModule
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  colors: string[];
  fill: ApexFill;
  legend: ApexLegend;
};

@Component({
  selector: "dashboard-chart",
  imports: [ChartComponent, NgApexchartsModule],
  template: `
  <div id="chart">
  <apx-chart
    [series]="chartOptions.series"
    [chart]="chartOptions.chart"
    [stroke]="chartOptions.stroke"
    [dataLabels]="chartOptions.dataLabels"
    [plotOptions]="chartOptions.plotOptions"
    [xaxis]="chartOptions.xaxis"
    [colors]="chartOptions.colors"
    [fill]="chartOptions.fill"
    [yaxis]="chartOptions.yaxis"
    [legend]="chartOptions.legend"
      ></apx-chart>
    </div>
  ` ,
  styles: `
  #chart {
    max-width: 650px;
    margin: 35px auto;
    }
`
})
export class DashboardChartComponent {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  Q1ActualColor = "#008FFB";
  Q1BudgetColor = "#80c7fd";
  Q2ActualColor = "#00E396";
  Q2BudgetColor = "#80f1cb";

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Q1 Budget",
          group: "budget",
          data: [44000, 55000, 41000, 67000, 22000, 43000]
        },
        {
          name: "Q1 Actual",
          group: "actual",
          data: [48000, 50000, 40000, 65000, 25000, 40000]
        },
        {
          name: "Q2 Budget",
          group: "budget",
          data: [13000, 36000, 20000, 8000, 13000, 27000]
        },
        {
          name: "Q2 Actual",
          group: "actual",
          data: [20000, 40000, 25000, 10000, 12000, 28000]
        }
      ],
      chart: {
        type: "bar",
        height: 350,
        stacked: true
      },
      stroke: {
        width: 1,
        colors: ["#fff"]
      },
      dataLabels: {
        formatter: (val) => {
          return Number(val) / 1000 + "K";
        }
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      xaxis: {
        categories: [
          "Online advertising",
          "Sales Training",
          "Print advertising",
          "Catalogs",
          "Meetings"
        ],
        labels: {
          formatter: (val) => {
            return Number(val) / 1000 + "K";
          }
        }
      },
      fill: {
        opacity: 1
      },
      colors: [this.Q1ActualColor, "#008FFB", "#80f1cb", "#00E396"],
      legend: {
        position: "top",
        horizontalAlign: "left"
      }
    };
  }
}
