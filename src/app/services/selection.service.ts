import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { VehicleEnum } from '../models/vehicle.enum';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  private selectedType: VehicleEnum = VehicleEnum.Bus;
  private typeSubject = new Subject<VehicleEnum>;

  private selectedLine: string = "";
  private lineSubject = new Subject<string>;
  constructor() { }

  changeVehicleType(newSelection: VehicleEnum): void {
    this.selectedType = newSelection;
    this.typeSubject.next(this.selectedType);
  }

  onVehicleTypeChange(): Observable<VehicleEnum> {
    return this.typeSubject.asObservable();
  }

  changeLine(newLine: string): void {
    this.selectedLine = newLine;
    this.lineSubject.next(this.selectedLine);
  }

  onLineChange(): Observable<string> {
    return this.lineSubject.asObservable();
  }


}
