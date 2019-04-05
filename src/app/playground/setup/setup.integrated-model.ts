import { DeviceIntegratedModel } from 'src/app/device/device.integrated-model';

export interface SetupIntegratedModel {
  id: string;
  setupName: string;
  devIDs: DeviceIntegratedModel[];
  username: string;
}
