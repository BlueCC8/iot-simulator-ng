import { DeviceIntegratedModel } from 'src/app/device/device.integrated-model';

export interface SetupIntegratedModel {
  id: string;
  configName: string;
  devIDs: [DeviceIntegratedModel];
}
