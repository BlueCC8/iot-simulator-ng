import { PolygonModel } from 'src/app/core/models/polygon.model';
import { SetupModel } from './setup.model';

export interface RoomPolygonConfigModel {
  id: string;
  roomName: string;
  roomType: string;
  roomHeight: number;
  polID: PolygonModel;
  configDevIDs: SetupModel[];
  username: string;
}
