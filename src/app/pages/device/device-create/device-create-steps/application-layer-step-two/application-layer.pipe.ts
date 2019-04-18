import { Pipe, PipeTransform } from '@angular/core';
import { AppLayerModel } from 'src/app/core/applicationLayer/applicationLayer.model';

@Pipe({
  name: 'appLayerProperties'
})
export class ApplicationLayerPipe implements PipeTransform {
  transform(obj: AppLayerModel): AppLayerModel {
    const copyObj = JSON.parse(JSON.stringify(obj));
    Object.keys(copyObj).forEach(key => {
      if (copyObj[key] === false || key === 'alName' || key === 'id') {
        delete copyObj[key];
      } else {
        copyObj[key] = key.replace('al', '');
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
