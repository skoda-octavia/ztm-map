import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environments';
import { GoogleMapsModule, MapInfoWindow, MapAdvancedMarker } from "@angular/google-maps";
import { BusService } from '../../services/bus.service';
import { Vehicle } from '../../models/vehicle';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatButtonModule} from '@angular/material/button';
import { timer, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SelectionService } from '../../services/selection.service';
import { VehicleEnum } from '../../models/vehicle.enum';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule, ScrollingModule, MatButtonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})


export class MapComponent implements OnInit, OnDestroy{
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
  subscription?: Subscription;
  selectionSubscription?: Subscription;
  selectedVehicle = VehicleEnum.Bus;
  readonly REFRESH = 10000;

  constructor(private busService: BusService, private selectionService: SelectionService) {}

  
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
    this.selectionService.changeLine(line);
    this.vehicles = this.linesMap.get(line) ?? [];
  }

  setLinesList(): void {
    let keys = Array.from(this.linesMap.keys());
    keys.sort();
    this.lines = keys;
  }

  setUpData(): void {
    this.subscription?.unsubscribe();

    this.subscription = timer(0, this.REFRESH)
      .pipe(switchMap(() => this.busService.getVehicles(this.selectedVehicle)))
      .subscribe((vehicles) => {
        this.sortBusses(vehicles);
        this.setLinesList();
  
        if (this.selectedLine && this.linesMap.has(this.selectedLine)) {
          this.markLine(this.selectedLine);
        } else if (this.lines.length > 0) {
          this.markLine(this.lines[0]);
        } else {
          this.selectedLine = null;
          this.vehicles = [];
        }
      });

  }

  ngOnInit(): void {
    this.setUpData();
    this.selectionSubscription = this.selectionService.onVehicleTypeChange().subscribe(value => {
      this.selectedVehicle = value;
      this.setUpData();
    })
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.selectionSubscription?.unsubscribe();
  }

  onMarkerClick(marker: MapAdvancedMarker) {
    this.infoWindow.openAdvancedMarkerElement(marker.advancedMarker, marker.advancedMarker.title);
  }
}
