import { Component, OnDestroy, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { LocationType } from '../../models/location.interface';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { WheaterService } from '../../services/wheater.service';

@Component({
  selector: 'app-wheater',
  standalone: true,
  imports: [
    HttpClientModule,
    MatCardModule,
    CommonModule,
    LineChartComponent,
    MatProgressSpinnerModule,
  ],
  providers: [WheaterService],
  templateUrl: './wheater.component.html',
  styleUrl: './wheater.component.scss',
})
export class WheaterComponent implements OnInit, OnDestroy {
  private handlerSubscription = new Subscription();
  public data: any[] = [];
  public ID!: LocationType;
  public date = new Date();
  public showLoading = true;
  constructor(private route: ActivatedRoute, private service: WheaterService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getForecasting();
  }

  getForecasting(): void {
    const lng = this.route.snapshot.paramMap.get('lng');
    const lat = this.route.snapshot.paramMap.get('lat');
    this.ID = this.route.snapshot.paramMap.get('id') as LocationType;
    this.handlerSubscription.add(
      this.service.getForecasting(this.ID, lat, lng).subscribe((response) => {
        this.data = response;
        this.showLoading = false;
      })
    );
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.handlerSubscription.unsubscribe();
  }
}
