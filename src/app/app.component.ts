import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    NgOptimizedImage,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'forecasting';
  locations = [
    {
      name: 'District of Columbia Forecast ( LWX )',
      flagPath: '',
      route: 'district_of_columbia.png',
    },
    {
      name: 'Kansas Forecast ( TOP )',
      flagPath: '',
      route: 'kansas.png',
    },
  ];
}
