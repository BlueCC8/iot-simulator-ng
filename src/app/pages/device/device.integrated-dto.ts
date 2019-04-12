import { AppLayerDto } from '../../core/applicationLayer/applicationLayer.dto';
import { NetLayerDto } from '../../core/networkLayer/networkLayer.dto';
import { LinkLayerIntegratedDto } from '../../core/linkLayer/linkLayer.integrated-dto';

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
