import { WifiModel } from './wifi.model';
import { EthernetModel } from './ethernet.model';

export interface LinkLayerIntegratedModel {
  id: string;
  llName: string;
  llPriorityType: string;
  llRole: string;
  llBluetooth: string;
  llLrWpan: string;
  llLrWpanType: string;
  llCelullar: string;
  llNFC: boolean;
  llProducer: string;
  llWifiID: WifiModel;
  llEthernetID: EthernetModel;
}
