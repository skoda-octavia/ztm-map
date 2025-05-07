import {Component, OnInit} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import { VehicleEnum } from '../../models/vehicle.enum';
import { SelectionService } from '../../services/selection.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  VehicleEnum = VehicleEnum;
  selectedTypeStr: string = "Bus";

  selectedLine: string = "";
  selectedLineSubscription?: Subscription;

  constructor(private selectionService: SelectionService) {}

  handleSelection(selection: VehicleEnum) {
    switch (selection) {
      case VehicleEnum.Tram: this.selectedTypeStr = "Tram"; break;
      default: this.selectedTypeStr = "Bus";
    }
    this.selectionService.changeVehicleType(selection);
  }

  ngOnInit(): void {
    this.selectedLineSubscription = this.selectionService.onLineChange().subscribe(vlaue => {
      this.selectedLine = vlaue;
    })
  }
}
