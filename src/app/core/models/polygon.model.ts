import { DotModel } from './dot.model';

export interface PolygonModel {
  id: string;
  polName: string;
  polDots: DotModel[];
}
