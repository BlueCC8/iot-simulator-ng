import { EthernetDto } from '../ethernet/ethernet.dto';
import { WifiDto } from '../wifi/wifi.dto';

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
