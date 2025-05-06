import { Component } from '@angular/core';
import { environment } from '../../../environments/environments';
import { GoogleMapsModule } from "@angular/google-maps";

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent {
  options: google.maps.MapOptions = {
    mapId: "DEMO_MAP_ID",
    center: environment.initCenter,
    zoom: environment.initZoom,
  };
}
