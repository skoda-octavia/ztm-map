import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable, map } from 'rxjs';
import { Vehicle } from '../models/vehicle';
import { HttpClient, HttpParams } from '@angular/common/http';
import { VehicleEnum } from '../models/vehicle.enum';

@Injectable({
  providedIn: 'root'
})
export class BusService {

  constructor(private http: HttpClient) { }

  getVehicles(type: VehicleEnum) : Observable<Vehicle[]> {
    const params = new HttpParams()
      .set('resource_id', environment.resourceId)
      .set('type', type)
      .set('apikey', environment.apiKey);

      return this.http.get<{ result: any[] }>(environment.vehicleApiAddr, {params}).pipe(
        map(response =>
          response.result.map(item =>({
            Lines: item.Lines,
            Lon: item.Lon,
            Lat:item.Lat,
            VehicleNumber:item.VehicleNumber,
            Brigade: item.Brigade,
            Time: new Date(item.Time)
          }) as Vehicle)
        )
      );
  }
}
