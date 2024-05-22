import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { WheaterService } from '../../services/wheater.service';
import { ActivatedRoute } from '@angular/router';
import { LocationType } from '../../models/location.interface';
import { Subscription } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-wheater',
  standalone: true,
  imports: [HttpClientModule],
  providers: [WheaterService],
  templateUrl: './wheater.component.html',
  styleUrl: './wheater.component.scss',
})
export class WheaterComponent implements OnInit, OnDestroy {
  @ViewChild('myChart', { static: true }) myChart!: ElementRef;
  private handlerSubscription = new Subscription();
  public chart: any;
  public data = [];
  private width!: number;
  private height!: number;
  private gradient!: any;
  constructor(private route: ActivatedRoute, private service: WheaterService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getForecasting();
  }

  getForecasting(): void {
    const id = this.route.snapshot.paramMap.get('id') as LocationType;
    const lng = this.route.snapshot.paramMap.get('lng');
    const lat = this.route.snapshot.paramMap.get('lat');
    this.handlerSubscription.add(
      this.service.getForecasting(id, lat, lng).subscribe((response) => {
        console.log(response);
        this.data = response;
        this.creatingChart();
      })
    );
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.handlerSubscription.unsubscribe();
  }

  creatingChart(): void {
    const temperatures: any[] = [];
    const labels: any[] = [];
    const borderColor: string[] = [];
    this.data.forEach((forecast: any) => {
      temperatures.push(forecast.temperature);
      labels.push(forecast.name);
    });
    this.chart = new Chart('MyChart', {
      type: 'line', //this denotes tha type of chart
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Temperature',
            data: temperatures,
            additionalData: this.data,
            fill: false,
            borderColor: (context:any) => {
              const chart = context.chart;
              const { ctx, chartArea } = chart;

              if (!chartArea) {
                // This case happens on initial chart load
                return;
              }
              return this.getGradient(ctx, chartArea, [...temperatures]);
            },
            pointBorderWidth: 6,
            pointBackgroundColor: 'transparent',
            tension: 0.1,
          } as any,
        ],
      },
      options: {
        aspectRatio: 2.5,
        responsive: true,
        interaction: {
          mode: 'nearest',
          intersect: false,
        },
        plugins: {
          title: {
            display: true,
            text: 'Temperature Forecasting',
          },
          tooltip: {
            enabled: false,
            position: 'nearest',
            external: externalTooltipHandler,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }

  gettingColorForTemperature(temperature: number): string {
    if (temperature <= 0) {
      return '#912dee';
    }

    if (temperature > 0 && temperature <= 10) {
      return '#8968cd';
    }

    if (temperature > 10 && temperature <= 20) {
      return '#07eeee';
    }

    if (temperature > 20 && temperature <= 30) {
      return '#00b2ee';
    }

    if (temperature > 30 && temperature <= 40) {
      return '#1d90ff';
    }

    if (temperature > 40 && temperature <= 50) {
      return '#0f4e8b';
    }

    if (temperature > 50 && temperature <= 60) {
      return '#008b00';
    }

    if (temperature > 60 && temperature <= 70) {
      return '#7fff01';
    }

    if (temperature > 70 && temperature <= 80) {
      return '#ffd602';
    }

    if (temperature > 80 && temperature <= 90) {
      return '#ff7f00';
    }

    if (temperature > 90 && temperature <= 100) {
      return '#ef4000';
    }

    if (temperature > 100) {
      return '#cd0000';
    }

    return 'rgb(75, 192, 192)';
  }

  getGradient(ctx: any, chartArea: any, temperatures: number[]) {
    // const chartWidth = chartArea.right - chartArea.left;
    // const chartHeight = chartArea.bottom - chartArea.top;
    // Create the gradient because this is either the first render
    // or the size of the chart has changed
    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;
    if (
      !this.gradient ||
      this.width !== chartWidth ||
      this.height !== chartHeight
    ) {
      // Create the gradient because this is either the first render
      // or the size of the chart has changed
      this.width = chartWidth;
      this.height = chartHeight;
      this.gradient = ctx.createLinearGradient(
        0,
        chartArea.bottom,
        0,
        chartArea.top
      );
      temperatures.sort((a, b) => a - b);
      const colors = [
        ...new Set(
          temperatures.map((temperature) =>
            this.gettingColorForTemperature(temperature)
          )
        ),
      ];
      const size = 1 / colors.length;
      colors.forEach((color, index) =>
        this.gradient.addColorStop(index * size, color)
      );
    }

    return this.gradient;
  }
}


const getOrCreateTooltip = (chart:any) => {
  let tooltipEl = chart.canvas.parentNode.querySelector('div');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
    tooltipEl.style.borderRadius = '3px';
    tooltipEl.style.color = 'white';
    tooltipEl.style.opacity = 1;
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.transform = 'translate(-50%, 0)';
    tooltipEl.style.transition = 'all .1s ease';

    const table = document.createElement('table');
    table.style.margin = '0px';

    tooltipEl.appendChild(table);
    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  return tooltipEl;
};

const externalTooltipHandler = (context:any) => {
  // Tooltip Element
  const {chart, tooltip} = context;
  const tooltipEl = getOrCreateTooltip(chart);

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  // Set Text
  if (tooltip.body) {
    const titleLines = tooltip.title || [];
    const bodyLines = tooltip.body.map((b:any) => b.lines);

    const tableHead = document.createElement('thead');

    titleLines.forEach((title:string) => {
      const tr = document.createElement('tr') as any;
      tr.style.borderWidth = 0;

      const th = document.createElement('th') as any;
      th.style.borderWidth = 0;
      const text = document.createTextNode(title);

      th.appendChild(text);
      tr.appendChild(th);
      tableHead.appendChild(tr);
    });

    const tableBody = document.createElement('tbody');
    bodyLines.forEach((body:any, i:number) => {
      const colors = tooltip.labelColors[i];

      const span = document.createElement('span');
      span.style.background = colors.backgroundColor;
      span.style.borderColor = colors.borderColor;
      span.style.borderWidth = '2px';
      span.style.marginRight = '10px';
      span.style.height = '10px';
      span.style.width = '10px';
      span.style.display = 'inline-block';

      const tr = document.createElement('tr') as any;
      tr.style.backgroundColor = 'inherit';
      tr.style.borderWidth = 0;

      const td = document.createElement('td') as any;
      td.style.borderWidth = 0;

      const text = document.createTextNode(body);

      td.appendChild(span);
      td.appendChild(text);
      tr.appendChild(td);
      tableBody.appendChild(tr);
    });

    const tableRoot = tooltipEl.querySelector('table');

    // Remove old children
    while (tableRoot.firstChild) {
      tableRoot.firstChild.remove();
    }

    // Add new children
    tableRoot.appendChild(tableHead);
    tableRoot.appendChild(tableBody);
  }

  const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = positionX + tooltip.caretX + 'px';
  tooltipEl.style.top = positionY + tooltip.caretY + 'px';
  tooltipEl.style.font = tooltip.options.bodyFont.string;
  tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
};