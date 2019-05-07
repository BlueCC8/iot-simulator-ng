import { Device } from 'src/app/core/models/device.model';

export interface SetupDevicesModel {
  id: string;
  setupName: string;
  devIDs: Device[];
  username: string;
}
