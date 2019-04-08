import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Device } from './device.model';
import { DeviceDto } from './device.dto';
import { DeviceIntegratedDto } from './device.integrated-dto';
import { DeviceIntegratedModel } from './device.integrated-model';
import { AppLayerModel } from '../applicationLayer/applicationLayer.model';
import { NetLayerModel } from '../networkLayer/networkLayer.model';
import { WifiModel } from '../wifi/wifi.model';
import { EthernetModel } from '../ethernet/ethernet.model';
import { LinkLayerIntegratedModel } from '../linkLayer/linkLayer.integrated-model';

const BACKEND_URL = environment.apiUrl + '/device/';
@Injectable({ providedIn: 'root' })
export class DevicesService {
  private devices: DeviceIntegratedModel[] = [];
  private appLayer: AppLayerModel;
  private netLayer: NetLayerModel;
  private wifi: WifiModel;
  private ether: EthernetModel;
  private linLayer: LinkLayerIntegratedModel;
  private devicesUpdated = new Subject<{ devices: DeviceIntegratedModel[]; maxDevices: number }>();

  constructor(private http: HttpClient, private router: Router) {}
  // * Get method for getting Devices from the server
  getDevices(pageSize: number, page: number, isPopulated: boolean) {
    let queryParams = '';
    if (pageSize && page) {
      queryParams = `?pagesize=${pageSize}&page=${page}&populated=${isPopulated}`;
    } else {
      queryParams = `?populated=${isPopulated}`;
    }

    this.http
      .get<{ devices: DeviceIntegratedDto[]; maxDevices: number }>(BACKEND_URL + queryParams)
      .pipe(
        map(devicesData => {
          return {
            devices: devicesData.devices.map(device => {
              return this.mapIntegratedDeviceDto(device);
            }),
            maxDevices: devicesData.maxDevices
          };
        })
      )
      .subscribe(transformedDevicesData => {
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
  getDevice(id: string, isPopulated: boolean) {
    let queryParams = '';
    queryParams = `?populated=${isPopulated}`;
    return this.http.get<DeviceIntegratedDto>(BACKEND_URL + id + queryParams).pipe(
      map(devicesData => {
        return this.mapIntegratedDeviceDto(devicesData);
      })
    );
  }

  updateDevice(device: Device) {
    const deviceData = new FormData();
    deviceData.append('devName', device.devName);
    deviceData.append('tranLayer', device.tranLayer);
    deviceData.append('devPrice', device.devPrice);
    deviceData.append('devProducer', device.devProducer);
    deviceData.append('image', device.devImgUrl, device.devName);
    console.log(device.devImgUrl);
    this.http.put(BACKEND_URL + device.id, deviceData).subscribe(res => {
      this.router.navigate(['/']);
    });
  }
  addDevice(device: Device) {
    const deviceData = new FormData();
    deviceData.append('devName', device.devName);
    deviceData.append('tranLayer', device.tranLayer);
    deviceData.append('devPrice', device.devPrice);
    deviceData.append('devProducer', device.devProducer);
    deviceData.append('image', device.devImgUrl, device.devName);

    this.http.post<{ device: Device }>(BACKEND_URL, deviceData).subscribe(responseData => {
      this.router.navigate(['/']);
    });
  }

  deleteDevice(deviceID: string) {
    return this.http.delete(BACKEND_URL + deviceID);
  }
  removeUndefProp(obj) {
    const returnObj = { ...obj };
    for (const key in returnObj) {
      if (returnObj.hasOwnProperty(key)) {
        if (returnObj[key] === undefined) {
          returnObj[key] = '';
        }
      }
    }
    return returnObj;
  }

  private mapIntegratedDeviceDto(device: DeviceIntegratedDto): DeviceIntegratedModel {
    if (device.appLayerID) {
      this.appLayer = {
        alName: device.appLayerID.alName,
        alHTTP: device.appLayerID.alHTTP,
        alCoAp: device.appLayerID.alCoAp,
        alWebSocket: device.appLayerID.alWebSocket,
        alMQTTE: device.appLayerID.alMQTTE,
        alDDS: device.appLayerID.alDDS,
        alAMQP: device.appLayerID.alAMQP,
        id: device.appLayerID._id
      };
    }
    if (device.netLayerID) {
      this.netLayer = {
        nlName: device.netLayerID.nlName,
        nlIPv4: device.netLayerID.nlIPv4,
        nlIPv6: device.netLayerID.nlIPv6,
        nlZig_LoWpan: device.netLayerID.nlZig_LoWpan,
        id: device.netLayerID._id
      };
    }
    if (device.linLayerID) {
      this.linLayer = {
        llName: device.linLayerID.llName,
        llPriorityType: device.linLayerID.llPriorityType,
        llRole: device.linLayerID.llRole,
        llBluetooth: device.linLayerID.llBluetooth,
        llLrWpan: device.linLayerID.llLrWpan,
        llLrWpanType: device.linLayerID.llLrWpanType,
        llCelullar: device.linLayerID.llCelullar,
        llNFC: device.linLayerID.llNFC,
        llProducer: device.linLayerID.llProducer,
        llWifiID: this.wifi,
        llEthernetID: this.ether,
        id: device.linLayerID._id
      };
      if (device.linLayerID.llWifiID) {
        this.linLayer.llWifiID = {
          wifiName: device.linLayerID.llWifiID.wifiName,
          wifiFrequancy: device.linLayerID.llWifiID.wifiFrequancy,
          wifiRange: device.linLayerID.llWifiID.wifiRange,
          wifiDataRate: device.linLayerID.llWifiID.wifiDataRate,
          id: device.linLayerID.llWifiID._id
        };
      }
      if (device.linLayerID.llEthernetID) {
        this.linLayer.llEthernetID = {
          etherName: device.linLayerID.llEthernetID.etherName,
          etherStandard: device.linLayerID.llEthernetID.etherStandard,
          etherDataRate: device.linLayerID.llEthernetID.etherDataRate,
          imagePath: '',
          id: device.linLayerID.llEthernetID._id,
          username: ''
        };
      }
    }

    return {
      devName: device.devName,
      appLayerID: this.appLayer,
      tranLayer: device.tranLayer,
      netLayerID: this.netLayer,
      linLayerID: this.linLayer,
      devPrice: device.devPrice,
      devProducer: device.devProducer,
      devImgUrl: device.devImgUrl,
      id: device._id,
      username: device.username
    };
  }
}
