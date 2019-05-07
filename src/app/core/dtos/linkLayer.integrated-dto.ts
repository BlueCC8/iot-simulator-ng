import { EthernetDto } from './ethernet.dto';
import { WifiDto } from './wifi.dto';

export interface LinkLayerIntegratedDto {
  _id: string;
  llName: string;
  llPriorityType: string;
  llRole: string;
  llBluetooth: string;
  llLrWpan: string;
  llLrWpanType: string;
  llCelullar: string;
  llNFC: boolean;
  llProducer: string;
  llWifiID: WifiDto;
  llEthernetID: EthernetDto;
}
