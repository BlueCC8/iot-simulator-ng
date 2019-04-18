import { DotDto } from '../dot/dot.dto';

export interface PolygonDto {
  _id: string;
  polName: string;
  polDots: DotDto[];
}
