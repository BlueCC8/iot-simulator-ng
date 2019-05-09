import { DotDto } from './dot.dto';

export interface PolygonDto {
  _id: string;
  polName: string;
  polDots: DotDto[];
  username: string;
}
