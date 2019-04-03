import { Injectable } from '@angular/core';
import { DeviceIntegratedModel } from 'src/app/device/device.integrated-model';
import { Subject } from 'rxjs';
import { DevicesService } from 'src/app/device/device.service';

@Injectable({
  providedIn: 'root'
})
export class SearchBarService {
  searchOption = [];
  public devicesData: DeviceIntegratedModel[];
  totalDevices: number;

  private deviceUpdated = new Subject<{ devices: DeviceIntegratedModel[]; maxDevices: number }>();
  private searchUpdated = new Subject<{ devices: DeviceIntegratedModel[]; maxDevices: number }>();

  constructor(private devicesService: DevicesService) {}
  // * Listener to be able to provide subscription for devices
  getDeviceUpdateListener() {
    return this.deviceUpdated.asObservable();
  }
  // * Listener for providing subscription for searched items
  getSearchUpdateListener() {
    return this.searchUpdated.asObservable();
  }
  /**
   * Uses the service DevicesService to provide data to the search bar
   * @param devicesPerPage how many devices per page
   * @param currentPage specific page
   * @param isPopulated whether the subdocuments are populated or not
   */
  getDevices(devicesPerPage, currentPage, isPopulated) {
    this.devicesService.getDevices(devicesPerPage, currentPage, isPopulated);

    this.devicesService
      .getDeviceUpdateListener()
      .subscribe((devicesData: { devices: DeviceIntegratedModel[]; maxDevices: number }) => {
        this.devicesData = devicesData.devices;
        this.totalDevices = devicesData.maxDevices;
        this.deviceUpdated.next({
          devices: devicesData.devices,
          maxDevices: devicesData.maxDevices
        });
        // this.searchbarService.devicesData = this.devices;
      });
  }
  filteredListOptions() {
    console.log(this.devicesData);
    const filteredPostsList = [];
    for (const device of this.devicesData) {
      for (const options of this.searchOption) {
        if (options.devName === device.devName) {
          filteredPostsList.push(device);
        }
      }
    }
    this.setSearchedData(filteredPostsList, filteredPostsList.length);
    return filteredPostsList;
  }

  setSearchedData(devices: DeviceIntegratedModel[], maxDevices: number) {
    this.searchUpdated.next({ devices, maxDevices });
  }
}
