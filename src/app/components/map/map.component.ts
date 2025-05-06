import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environments';
import { GoogleMapsModule } from "@angular/google-maps";
import { BusService } from '../../services/bus.service';
import { Vehicle } from '../../models/vehicle';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})


export class MapComponent implements OnInit {
  options: google.maps.MapOptions = {
    mapId: "DEMO_MAP_ID",
    center: environment.initCenter,
    zoom: environment.initZoom,
  };

  vehicles: Vehicle[] = [];

  constructor(private busService: BusService) {}

  
  markBusses(vehicles: Vehicle[]) {
    let filtered = vehicles.filter((veh) => veh.Lines == "126"); //TODO
    this.vehicles = filtered;
  }

  ngOnInit(): void {
    this.busService.getVehicles().subscribe((vehicles) => this.markBusses(vehicles));
  }
}
