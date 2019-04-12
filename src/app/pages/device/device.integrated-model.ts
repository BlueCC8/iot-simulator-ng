import { AppLayerModel } from '../../core/applicationLayer/applicationLayer.model';
import { NetLayerModel } from '../../core/networkLayer/networkLayer.model';
import { LinkLayerIntegratedModel } from '../../core/linkLayer/linkLayer.integrated-model';

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
