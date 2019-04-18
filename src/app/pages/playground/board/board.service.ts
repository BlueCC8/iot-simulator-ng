import { Injectable } from '@angular/core';
import { DeviceIntegratedModel } from '../../device/device.integrated-model';
import { Subject } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { BoardModel } from './board.model';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private componentName = BoardService.name + ' ';
  private boardDevices: BoardModel[] = [];
  private boardDeviceSelectedListener = new Subject<BoardModel[]>();

  constructor(private logger: NGXLogger) {}

  getBoardDeviceStatus() {
    return this.boardDeviceSelectedListener.asObservable();
  }

  setBoardDeviceSelected(device: BoardModel) {
    this.logger.log(this.componentName, 'Set device');
    this.boardDevices.push(device);
    this.boardDeviceSelectedListener.next(this.boardDevices);
  }
  removeBoardDeviceSelected(deviceId: string) {
    this.logger.log(this.componentName, 'Remove device');
    this.boardDevices = this.boardDevices.filter(boardDevice => boardDevice.id !== deviceId);
    this.boardDeviceSelectedListener.next(this.boardDevices);
  }
}
