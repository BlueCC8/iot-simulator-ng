import { Injectable, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDropList
} from '@angular/cdk/drag-drop';
import { DeviceIntegratedModel } from '../device/device.integrated-model';

@Injectable({
  providedIn: 'root'
})
export class PlaygroundService {
  private filterDevice: any;
  private deviceSelectedListener = new Subject<DeviceIntegratedModel>();
  // private dropStatus = new Subject<CdkDragDrop<string[]>>();

  getDeviceStatus() {
    return this.deviceSelectedListener.asObservable();
  }

  setDeviceSelected(device: DeviceIntegratedModel) {
    console.log('Set device');
    this.filterDevice = device;
    this.deviceSelectedListener.next(device);
  }

  // dropElement(event: CdkDragDrop<string[]>) {
  //   console.log(event);
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //     console.log('Try move');
  //   } else {
  //     console.log('Try transfer');
  //     console.log(event.previousContainer.data);
  //     console.log(event.container.data);
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   }
  // }
}