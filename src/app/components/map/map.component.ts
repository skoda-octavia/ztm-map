import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environments';
import { GoogleMapsModule, MapInfoWindow, MapAdvancedMarker } from "@angular/google-maps";
import { BusService } from '../../services/bus.service';
import { Vehicle } from '../../models/vehicle';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatButtonModule} from '@angular/material/button';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule, ScrollingModule, MatButtonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})


export class MapComponent implements OnInit {
  options: google.maps.MapOptions = {
    mapId: "DEMO_MAP_ID",
    center: environment.initCenter,
    zoom: environment.initZoom,
  };
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;

  vehicles: Vehicle[] = [];
  linesMap: Map<string, Vehicle[]> = new Map();
  lines: string[] = [];
  selectedLine: string | null = null;

  constructor(private busService: BusService) {}

  
  sortBusses(vehicles: Vehicle[]): void {
    this.linesMap.clear();
    vehicles.forEach(element => {
      if (this.linesMap.has(element.Lines)) {
        this.linesMap.get(element.Lines)?.push(element);
      }
      else {
        this.linesMap.set(element.Lines, [element]);
      }
    });
  }

  markLine(line: string): void {
    this.selectedLine = line;
    this.vehicles = this.linesMap.get(line) ?? [];
  }

  setLinesList(): void {
    let keys = Array.from(this.linesMap.keys());
    keys.sort();
    this.lines = keys;
  }

  ngOnInit(): void {
    timer(0, 10000)
      .pipe(switchMap(() => this.busService.getVehicles()))
      .subscribe((vehicles) => {
        this.sortBusses(vehicles);
        this.setLinesList();
  
        if (this.selectedLine && this.linesMap.has(this.selectedLine)) {
          this.vehicles = this.linesMap.get(this.selectedLine)!;
        } else if (this.lines.length > 0) {
          this.selectedLine = this.lines[0];
          this.vehicles = this.linesMap.get(this.selectedLine)!;
        } else {
          this.selectedLine = null;
          this.vehicles = [];
        }
      });
  }

  onMarkerClick(marker: MapAdvancedMarker) {
    this.infoWindow.openAdvancedMarkerElement(marker.advancedMarker, marker.advancedMarker.title);
  }
}
