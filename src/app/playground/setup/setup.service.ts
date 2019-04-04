import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DeviceIntegratedModel } from 'src/app/device/device.integrated-model';

@Injectable({
  providedIn: 'root'
})
export class SetupService {
  private setups: EthernetModel[] = [];
  private setupUpdated = new Subject<DeviceIntegratedModel[]>();

  getSetupUpdateStatus() {
    return this.setupListener.asObservable();
  }
  setSetupSelected();
}
