import { AppLayerModel } from './applicationLayer.model';
import { NetLayerModel } from './networkLayer.model';
import { LinkLayerIntegratedModel } from './linkLayer.integrated-model';

export interface DeviceIntegratedModel {
  id: string;
  devName: string;
  appLayerID: AppLayerModel;
  tranLayer: string;
  netLayerID: NetLayerModel;
  linLayerID: LinkLayerIntegratedModel;
  devProducer: string;
  devPrice: string;
  devImgUrl: string | any;
  username: string;
}
