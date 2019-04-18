import { Pipe, PipeTransform } from '@angular/core';
import { LinkLayerModel } from 'src/app/core/linkLayer/linkLayer.model';

@Pipe({
  name: 'linkLayerProperties'
})
export class LinkLayerPipe implements PipeTransform {
  transform(obj: LinkLayerModel): LinkLayerModel {
    const copyObj = JSON.parse(JSON.stringify(obj));
    Object.keys(copyObj).forEach(key => {
      if (
        copyObj[key] === false ||
        key === 'llWifiID' ||
        key === 'llEthernetID' ||
        key === 'id' ||
        key === 'llName'
      ) {
        delete copyObj[key];
      } else {
        if (key === 'llNFC') {
          copyObj[key] = key.replace('ll', '');
        }
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
