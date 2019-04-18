import { PolygonDto } from '../../../core/polygon/polygon.dto';

export interface RoomPolygonsDto {
  _id: string;
  roomName: string;
  roomType: string;
  roomHeight: number;
  polID: PolygonDto;
  configDevIDs: string[];
  username: string;
}
