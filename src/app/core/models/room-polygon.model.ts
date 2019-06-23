import { PolygonModel } from './polygon.model';

export interface RoomPolygonsModel {
  id: string;
  roomName: string;
  roomType: string;
  roomHeight: number;
  polID: PolygonModel;
  configDevIDs: string[];
  username: string;
}
