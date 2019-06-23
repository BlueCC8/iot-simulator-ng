import { DeviceIntegratedModel } from 'src/app/core/models/device.integrated-model';

export interface SetupIntegratedModel {
  id: string;
  setupName: string;
  devIDs: DeviceIntegratedModel[];
  username: string;
}
