import { DotModel } from '../dot/dot.model';

export interface PolygonModel {
  id: string;
  polName: string;
  polDots: DotModel[];
}
