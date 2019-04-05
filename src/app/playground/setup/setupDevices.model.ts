import { Device } from 'src/app/device/device.model';

export interface SetupDevicesModel {
  id: string;
  setupName: string;
  devIDs: Device[];
  username: string;
}
