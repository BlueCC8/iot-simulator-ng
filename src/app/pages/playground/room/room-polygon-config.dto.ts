import { PolygonDto } from 'src/app/core/polygon/polygon.dto';
import { SetupDto } from '../setup/setup.dto';

export interface RoomPolygonConfigDto {
  _id: string;
  roomName: string;
  roomType: string;
  roomHeight: number;
  polID: PolygonDto;
  configDevIDs: SetupDto[];
  username: string;
}
