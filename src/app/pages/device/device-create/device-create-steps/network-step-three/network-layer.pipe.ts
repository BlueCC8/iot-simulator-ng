import { Pipe, PipeTransform } from '@angular/core';
import { NetLayerModel } from 'src/app/core/networkLayer/networkLayer.model';

@Pipe({
  name: 'netLayerProperties'
})
export class NetworkLayerPipe implements PipeTransform {
  transform(obj: NetLayerModel): NetLayerModel {
    const copyObj = JSON.parse(JSON.stringify(obj));
    Object.keys(copyObj).forEach(key => {
      if (copyObj[key] === false || key === 'nlName' || key === 'id') {
        delete copyObj[key];
      } else {
        copyObj[key] = key.replace('nl', '');
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
