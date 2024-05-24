import {
  Component,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  externalTooltipHandler,
  getGradient,
  gettingColorForTemperature,
} from './utils/line-chart.util';
Chart.register(ChartDataLabels);

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
})
export class LineChartComponent implements OnChanges {
  @Input() data: any[] = [];
  public chart!: Chart;

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes['data'].firstChange && !this.chart) {
      this.setChartDefaults();
    }
    if (changes['data']) {
      const temperatures: number[] = [];
      const labels: string[] = [];
      this.data.forEach((forecast: any) => {
        temperatures.push(forecast.temperature);
        labels.push(forecast.name);
      });
      this.chart.data.labels = [...labels];
      this.chart.data.datasets[0].data = [...temperatures];
      (this.chart.data.datasets[0] as any).additionalData = [
        ...changes['data'].currentValue,
      ];
      this.chart?.update();
    }
  }

  setChartDefaults(): void {
    this.chart = new Chart('MyChart', {
      type: 'line', //this denotes tha type of chart
      data: {
        labels: [],
        datasets: [
          {
            label: 'Temperature',
            data: [],
            additionalData: [],
            fill: false,
            borderColor: (context: any) => {
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              if (!chartArea) {
                // This case happens on initial chart load
                return;
              }
              const {
                dataset: { data: temperatures },
              } = context;
              return getGradient(ctx, chartArea, [...temperatures]);
            },
            pointBorderWidth: 20,
            pointHoverBorderWidth: 25,
            tension: 0.5,
          } as any,
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'nearest',
          intersect: false,
        },
        plugins: {
          title: {
            display: true,
            text: 'Temperature Forecasting',
            color: 'white',
            font: {
              size: 17,
            },
          },
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
            position: 'nearest',
            displayColors: true,
            external: externalTooltipHandler,
            callbacks: {
              labelColor: (context) => {
                const color = gettingColorForTemperature(context.parsed.y);
                return {
                  borderColor: color,
                  backgroundColor: color,
                };
              },
              label: (context) =>
                `${context.dataset.label}: ${context.parsed.y}°F`,
            },
          },
          datalabels: {
            borderRadius: 4,
            color: 'white',
            font: {
              weight: 'bold',
            },
            padding: 10,
          },
        },
        scales: {
          x: {
            title: {
              text: 'Days',
              display: true,
              color: 'white',
              font: {
                weight: 'bold',
                size: 14,
              },
            },
            ticks: {
              padding: 20,
              color: 'white',
              font: {
                size: 12.5,
              },
            },
            grid: {
              display: false,
              color: 'white',
            },
            border: {
              display: false,
            },
          },
          y: {
            title: {
              text: 'Temperature °F',
              display: true,
              padding: 20,
              color: 'white',
              font: {
                weight: 'bold',
                size: 14,
              },
            },
            ticks: {
              padding: 20,
              color: 'white',
              display: false,
            },
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
            stacked: false,
          },
        },
        layout: {
          padding: 20,
        },
      },
    });
  }

  @HostListener('resize')
  resize(): void {
    this.chart?.resize();
  }
}
