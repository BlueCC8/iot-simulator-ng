import { Pipe, PipeTransform } from '@angular/core';
import { EthernetModel } from 'src/app/core/ethernet/ethernet.model';

@Pipe({
  name: 'ethernetProperties'
})
export class EthernetPipe implements PipeTransform {
  transform(obj: EthernetModel): EthernetModel {
    const copyObj = JSON.parse(JSON.stringify(obj));
    Object.keys(copyObj).forEach(key => {
      if (
        copyObj[key] === false ||
        key === 'imagePath' ||
        key === 'id' ||
        key === 'username' ||
        key === 'etherName'
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
