import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Device } from './device.model';
import { DeviceDto } from './device.dto';

const BACKEND_URL = environment.apiUrl + '/device/';
@Injectable({ providedIn: 'root' })
export class DevicesService {
  private devices: Device[] = [];
  private devicesUpdated = new Subject<{ devices: Device[]; maxDevices: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  // * Get method for getting Devices from the server
  getDevices(pageSize: number, page: number) {
    let queryParams = '';
    if (pageSize && page) {
      queryParams = `?pagesize=${pageSize}&page=${page}`;
    }
    this.http
      .get<{ devices: DeviceDto[]; maxDevices: number }>(BACKEND_URL + queryParams)
      .pipe(
        map(devicesData => {
          return {
            devices: devicesData.devices.map(device => {
              return {
                devName: device.devName,
                appLayerID: device.appLayerID,
                tranLayer: device.tranLayer,
                netLayerID: device.netLayerID,
                linLayerID: device.linLayerID,
                devPrice: device.devPrice,
                devImgUrl: device.devImgUrl,
                id: device._id,
                username: device.username
              };
            }),
            maxDevices: devicesData.maxDevices
          };
        })
      )
      .subscribe(transformedDevicesData => {
        console.log(transformedDevicesData.devices);
        this.devices = transformedDevicesData.devices;
        this.devicesUpdated.next({
          devices: [...this.devices],
          maxDevices: transformedDevicesData.maxDevices
        });
      });
  }
  // * Listener to be able to provide subscription to othe components
  getDeviceUpdateListener() {
    return this.devicesUpdated.asObservable();
  }

  getDevice(id: string) {
    return this.http.get<DeviceDto>(BACKEND_URL + id);
  }
  // TODO: Add support for sudocuments
  updateDevice(device: Device) {
    const deviceData = new FormData();
    deviceData.append('devName', device.devName);
    deviceData.append('tranLayer', device.tranLayer);
    deviceData.append('devPrice', device.devPrice);
    deviceData.append('image', device.devImgUrl, device.devName);

    this.http.put(BACKEND_URL + device.id, deviceData).subscribe(res => {
      this.router.navigate(['/']);
    });
  }
  // TODO: Add support for sudocuments
  addDevice(device: Device) {
    const deviceData = new FormData();
    deviceData.append('devName', device.devName);
    deviceData.append('tranLayer', device.tranLayer);
    deviceData.append('devPrice', device.devPrice);
    deviceData.append('image', device.devImgUrl, device.devName);
    this.http.post<{ device: Device }>(BACKEND_URL, deviceData).subscribe(responseData => {
      this.router.navigate(['/']);
    });
  }

  deleteDevice(deviceID: string) {
    return this.http.delete(BACKEND_URL + deviceID);
  }
}
