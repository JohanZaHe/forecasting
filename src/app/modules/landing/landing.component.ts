import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgOptimizedImage } from '@angular/common';
import { ILocation } from '../../models/location.interface';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, NgOptimizedImage],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  constructor(private router: Router) {}
  public flagsRootPath = 'assets/images/';

  locations: ILocation[] = [
    {
      name: 'District of Columbia Forecast (LWX)',
      flagPath: 'district_of_columbia.png',
      route: 'wheater',
      id: 'LWX',
      lat: 31,
      lng: 80,
    },
    {
      name: 'Kansas Forecast (TOP)',
      id: 'TOP',
      flagPath: 'kansas.png',
      route: 'wheater',
      lat: 31,
      lng: 80,
    },
  ];

  viewForecasting({ route, id, lat, lng }: ILocation): void {
    const path = `${route}/${id}/${lat}/${lng}`;
    this.router.navigateByUrl(path);
  }
}
