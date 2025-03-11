import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
    ChartComponent,
    ApexAxisChartSeries,
    ApexChart,
    ApexFill,
    ApexTooltip,
    ApexXAxis,
    ApexLegend,
    ApexDataLabels,
    ApexTitleSubtitle,
    ApexYAxis
} from "ng-apexcharts";


export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    markers: any; //ApexMarkers;
    stroke: any; //ApexStroke;
    yaxis: ApexYAxis | ApexYAxis[];
    dataLabels: ApexDataLabels;
    title: ApexTitleSubtitle;
    legend: ApexLegend;
    fill: ApexFill;
    tooltip: ApexTooltip;
  };

@Component({
    selector: 'sales-graph',
    imports: [CommonModule, NgApexchartsModule],
    templateUrl: './sales-graph.component.html',
    styleUrls: ['./sales-graph.component.scss']
})
export class SalesGraphComponent implements OnInit{
    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;
    mainChartColors = {
        borderColor: '#374151',
        labelColor: '#9CA3AF',
        opacityFrom: 0,
        opacityTo: 0.15,
    }

    ngOnInit(): void {
        if (document.documentElement.classList.contains('dark')) {
            this.mainChartColors = {
                borderColor: '#374151',
                labelColor: '#9CA3AF',
                opacityFrom: 0,
                opacityTo: 0.15,
            };
        } else {
            this.mainChartColors = {
                borderColor: '#F3F4F6',
                labelColor: '#6B7280',
                opacityFrom: 0.45,
                opacityTo: 0,
            }
        }

            this.chartOptions = {

                chart: {
                    height: 420,
                    type: 'area',
                    fontFamily: 'Inter, sans-serif',
                    foreColor: this.mainChartColors.labelColor,
                    toolbar: {
                        show: false
                    }
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        opacityFrom: this.mainChartColors.opacityFrom,
                        opacityTo: this.mainChartColors.opacityTo
                    }
                },
                dataLabels: {
                    enabled: false
                },
                tooltip: {
                    style: {
                        fontSize: '14px',
                        fontFamily: 'Inter, sans-serif',
                    },
                },

                title: {
                    text: "Monthly Income and Expenses",
                    align: "center",
                  },

                series: [
                    {
                        name: 'Revenue',
                        data: [6356, 6218, 6156, 6526, 6356, 6256, 6056],
                        color: '#1A56DB'
                    },
                    {
                        name: 'Revenue (previous period)',
                        data: [6556, 6725, 6424, 6356, 6586, 6756, 6616],
                        color: '#FDBA8C'
                    }
                ],
                markers: {
                    size: 5,
                    strokeColors: '#ffffff',
                    hover: {
                        size: undefined,
                        sizeOffset: 3
                    }
                },
                xaxis: {
                    categories: ['01 Feb', '02 Feb', '03 Feb', '04 Feb', '05 Feb', '06 Feb', '07 Feb'],
                    labels: {
                        style: {
                            colors: [this.mainChartColors.labelColor],
                            fontSize: '14px',
                            fontWeight: 500,
                        },
                    },
                    axisBorder: {
                        color: this.mainChartColors.borderColor,
                    },
                    axisTicks: {
                        color: this.mainChartColors.borderColor,
                    },
                    crosshairs: {
                        show: true,
                        position: 'back',
                        stroke: {
                            color: this.mainChartColors.borderColor,
                            width: 1,
                            dashArray: 10,
                        },
                    },
                },
                yaxis: {
                    labels: {
                        style: {
                            colors: [this.mainChartColors.labelColor],
                            fontSize: '14px',
                            fontWeight: 500,
                        },
                        formatter: function (value) {
                            return '$' + value;
                        }
                    },
                },
                legend: {
                    fontSize: '14px',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    labels: {
                        colors: [this.mainChartColors.labelColor]
                    },
                    itemMargin: {
                        horizontal: 10
                    }
                },

            };
    }




}
