import { DeviceIntegratedModel } from 'src/app/pages/device/device.integrated-model';

export interface SetupIntegratedModel {
  id: string;
  setupName: string;
  devIDs: DeviceIntegratedModel[];
  username: string;
}
