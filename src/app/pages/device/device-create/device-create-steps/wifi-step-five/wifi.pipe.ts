import { Pipe, PipeTransform } from '@angular/core';
import { WifiModel } from 'src/app/core/models/wifi.model';

@Pipe({
  name: 'wifiProperties'
})
export class WifiPipe implements PipeTransform {
  transform(obj: WifiModel): WifiModel {
    const copyObj = JSON.parse(JSON.stringify(obj));
    Object.keys(copyObj).forEach(key => {
      if (copyObj[key] === false || key === 'id' || key === 'wifiName') {
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
