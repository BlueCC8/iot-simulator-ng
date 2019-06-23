import { Pipe, PipeTransform } from '@angular/core';
import { WifiModel } from 'src/app/core/models/wifi.model';
import { RoomPolygonsModel } from '../../../core/models/room-polygon.model';

@Pipe({
  name: 'roomSelectListProperties'
})
export class RoomSelectListPipe implements PipeTransform {
  transform(obj: RoomPolygonsModel): RoomPolygonsModel {
    const copyObj = JSON.parse(JSON.stringify(obj));
    Object.keys(copyObj).forEach(key => {
      if (
        copyObj[key] === false ||
        key === 'id' ||
        key === 'configDevIDs' ||
        key === 'username' ||
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
