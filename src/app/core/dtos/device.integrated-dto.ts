import { AppLayerDto } from './applicationLayer.dto';
import { NetLayerDto } from './networkLayer.dto';
import { LinkLayerIntegratedDto } from './linkLayer.integrated-dto';

export interface DeviceIntegratedDto {
  _id: string;
  devName: string;
  appLayerID: AppLayerDto;
  tranLayer: string;
  netLayerID: NetLayerDto;
  linLayerID: LinkLayerIntegratedDto;
  devPrice: string;
  devProducer: string;
  devImgUrl: string;
  username: string;
}
