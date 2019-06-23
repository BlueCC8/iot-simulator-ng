import { DeviceDto } from 'src/app/core/dtos/device.dto';

export interface SetupDevicesDto {
  _id: string;
  configName: string;
  devIDs: DeviceDto[];
  username: string;
}
