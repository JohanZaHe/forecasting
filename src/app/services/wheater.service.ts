import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { LocationType } from '../models/location.interface';
import { Observable, map } from 'rxjs';

@Injectable()
export class WheaterService {
  constructor(private http: HttpClient) {}

  getForecasting(
    id: LocationType,
    lat: string | null,
    lng: string | null
  ): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}gridpoints/${id}/${lat},${lng}/forecast`)
      .pipe(map((response: any) => response['properties']['periods']));
  }
}
