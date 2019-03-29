export interface AppLayerDto {
  _id: string;
  alName: string;
  alHTTP: boolean;
  alCoAp: boolean;
  alWebSocket: boolean;
  alMQTTE: boolean;
  alDDS: boolean;
  alAMQP: boolean;
}
