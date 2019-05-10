import { Pipe, PipeTransform } from '@angular/core';
import { PolygonModel } from 'src/app/core/models/polygon.model';

@Pipe({
  name: 'polygonSelectListProperties'
})
export class PolygonSelectListPipe implements PipeTransform {
  transform(obj: PolygonModel): PolygonModel {
    const copyObj = JSON.parse(JSON.stringify(obj));
    Object.keys(copyObj).forEach(key => {
      if (
        copyObj[key] === false ||
        key === 'id' ||
        key === 'polDots' ||
        key === 'username' ||
        key === 'polName' ||
        key === 'polID'
      ) {
        delete copyObj[key];
      } else {
        return key;
      }
    });
    return copyObj;
    // if (
    //   typeof value === 'object' ||
    //   key === '_id' ||
    //   key === '__v' ||
    //   key === 'id' ||
    //   key === 'updated_date' ||
    //   value === ''
    // ) {
    //   return null;
    // } else {
    //   return value;
    // }
  }
}
// Object.keys(obj).forEach(e => {
//

//   delete obj[e]
//   }else{
//   return e
//   }
// });
