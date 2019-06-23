import { Pipe, PipeTransform } from '@angular/core';
import { Device } from 'src/app/core/models/device.model';

@Pipe({
  name: 'deviceProperties'
})
export class FilterListDevicePropertiesPipe implements PipeTransform {
  transform(obj: Device): Device {
    const copyObj = JSON.parse(JSON.stringify(obj));
    Object.keys(copyObj).forEach(key => {
      if (
        typeof obj[key] === 'object' ||
        key === '_id' ||
        key === 'devImgUrl' ||
        key === '__v' ||
        key === 'id' ||
        key === 'updated_date' ||
        key === 'username' ||
        copyObj[key] === undefined ||
        copyObj[key] === ''
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
