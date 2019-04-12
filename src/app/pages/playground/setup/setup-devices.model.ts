import { Device } from 'src/app/pages/device/device.model';

export interface SetupDevicesModel {
  id: string;
  setupName: string;
  devIDs: Device[];
  username: string;
}
