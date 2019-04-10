import { AppLayerModel } from '../applicationLayer/applicationLayer.model';
import { NetLayerModel } from '../networkLayer/networkLayer.model';
import { LinkLayerIntegratedModel } from '../linkLayer/linkLayer.integrated-model';

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
