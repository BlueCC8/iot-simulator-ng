import { PolygonDto } from 'src/app/core/dtos/polygon.dto';
import { SetupDto } from './setup.dto';

export interface RoomPolygonConfigDto {
  _id: string;
  roomName: string;
  roomType: string;
  roomHeight: number;
  polID: PolygonDto;
  configDevIDs: SetupDto[];
  username: string;
}
