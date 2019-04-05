import { DeviceIntegratedDto } from 'src/app/device/device.integrated-dto';

export interface SetupIntegratedDto {
  _id: string;
  configName: string;
  devIDs: [DeviceIntegratedDto];
  username: string;
}
