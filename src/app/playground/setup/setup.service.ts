import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { SetupModel } from './setup.model';
import { SetupCreateDto } from './setup.create-dto';
import { SetupDevicesDto } from './setupDevices.dto';
import { SetupDevicesModel } from './setupDevices.model';
import { Device } from 'src/app/device/device.model';
import { SetupDataDto } from './setup.data-dto';

const BACKEND_URL = environment.apiUrl + '/conf_device/';
@Injectable({
  providedIn: 'root'
})
export class SetupService {
  private devices: Device[] = [];
  private setups: SetupDevicesModel[] = [];
  private setupsUpdated = new Subject<{ setups: SetupDevicesModel[]; maxSetups: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getSetups(pageSize: number, page: number, isPopulated: boolean) {
    let queryParams = '';
    if (pageSize && page) {
      queryParams = `?pagesize=${pageSize}&page=${page}&populated=${isPopulated}`;
    } else {
      queryParams = `?populated=${isPopulated}`;
    }

    this.http
      .get<{ configs: SetupDevicesDto[]; maxConfigs: number }>(BACKEND_URL + queryParams)
      .pipe(
        map(setupData => {
          return {
            setups: setupData.configs.map(setup => {
              if (setup.devIDs) {
                this.devices = setup.devIDs.map(device => {
                  return {
                    devName: device.devName,
                    appLayerID: device.appLayerID,
                    tranLayer: device.tranLayer,
                    netLayerID: device.netLayerID,
                    linLayerID: device.linLayerID,
                    devPrice: device.devPrice,
                    devImgUrl: device.devImgUrl,
                    devProducer: device.devProducer,
                    id: device._id,
                    username: device.username
                  };
                });
              }
              return {
                id: setup._id,
                setupName: setup.configName,
                devIDs: this.devices,
                username: setup.username
              };
            }),
            maxSetups: setupData.maxConfigs
          };
        })
      )
      .subscribe(transformedSetupData => {
        console.log(transformedSetupData.setups);
        this.setups = transformedSetupData.setups;
        this.setupsUpdated.next({
          setups: [...this.setups],
          maxSetups: transformedSetupData.maxSetups
        });
      });
  }

  getSetupUpdateStatus() {
    return this.setupsUpdated.asObservable();
  }
  addSetup(setup: SetupModel) {
    const setupDto: SetupCreateDto = {
      configName: setup.setupName,
      devIDs: setup.devIDs
    };
    console.log(setup);

    this.http.post<{ setup: SetupModel }>(BACKEND_URL, setupDto).subscribe(responseData => {
      console.log(responseData);
      this.router.navigate(['/playground']);
    });
  }
  updateSetup(setup: SetupDataDto) {
    console.log(setup);
    this.http.put(BACKEND_URL + setup._id, setup).subscribe(res => {
      this.router.navigate(['/playground']);
    });
  }
  deleteSetup(setupID: string) {
    return this.http.delete(BACKEND_URL + setupID);
  }
}
