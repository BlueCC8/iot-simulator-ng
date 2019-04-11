import { DeviceDto } from 'src/app/device/device.dto';

export interface SetupDevicesDto {
  _id: string;
  configName: string;
  devIDs: DeviceDto[];
  username: string;
}
