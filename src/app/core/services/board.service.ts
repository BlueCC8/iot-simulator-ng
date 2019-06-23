import { Injectable } from '@angular/core';
import { DeviceIntegratedModel } from '../models/device.integrated-model';
import { Subject } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { BoardModel } from '../models/board.model';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private duplicateSym = '~';
  private componentName = BoardService.name + ' ';
  private boardDevices: BoardModel[] = [];
  private boardDevicesIDs: string[] = [];

  private counterDup = 1;
  private boardDeviceSelectedListener$ = new Subject<BoardModel[]>();

  constructor(private logger: NGXLogger) {}
  getBoardDeviceStatus() {
    return this.boardDeviceSelectedListener$.asObservable();
  }

  setBoardDeviceSelected(device: BoardModel) {
    this.logger.log(this.componentName, 'Set device');
    if (this.boardDevicesIDs.includes(device.id)) {
      this.counterDup += 1;
      device.id = `${device.id}${this.duplicateSym}${this.counterDup}`;
    }
    this.boardDevicesIDs.push(device.id);
    this.boardDevices.push(device);
    this.boardDeviceSelectedListener$.next(this.boardDevices);
  }
  setBoardAllSelected(devices: BoardModel[]) {
    this.boardDevices = devices;
    this.boardDevicesIDs = devices.map(device => device.id);
    this.boardDeviceSelectedListener$.next(this.boardDevices);
  }
  removeBoardDeviceSelected(deviceId: string) {
    this.logger.log(this.componentName, 'Remove device', deviceId);
    this.boardDevices = this.boardDevices.filter(boardDevice => boardDevice.id !== deviceId);
    this.boardDeviceSelectedListener$.next(this.boardDevices);
  }
  removeBoardAllDevices() {
    this.logger.log(this.componentName, 'Removing all the devices from the board');
    this.boardDevices.length = 0;
    this.boardDeviceSelectedListener$.next(this.boardDevices);
  }
  removeDuplicateSym(boardDevicesIDs: string[]) {
    return boardDevicesIDs.map(id => {
      const indexDuplicate = id.indexOf(this.duplicateSym);
      if (indexDuplicate !== -1) {
        return id.substr(0, indexDuplicate);
      }
      return id;
    });
  }
}
