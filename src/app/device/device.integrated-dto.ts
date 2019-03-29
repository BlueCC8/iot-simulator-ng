import { AppLayerDto } from '../applicationLayer/applicationLayer.dto';
import { NetLayerDto } from '../networkLayer/networkLayer.dto';
import { LinkLayerDto } from '../linkLayer/linkLayer.dto';

export interface DeviceIntegratedDto {
  _id: string;
  devName: string;
  appLayerID: AppLayerDto;
  tranLayer: string;
  netLayerID: NetLayerDto;
  linLayerID: LinkLayerDto;
  devPrice: string;
  devImgUrl: string;
  username: string;
}
