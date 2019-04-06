import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { PageEvent } from '@angular/material';
import { AuthService } from '../../navigation/header/auth/auth.service';
import { DeviceIntegratedModel } from '../device.integrated-model';
import { DevicesService } from '../device.service';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})
export class DeviceListComponent implements OnInit, OnDestroy {
  devices: DeviceIntegratedModel[] = [];
  userIsAuthenticated = false;
  username: string;
  isLoading = false;
  totalDevices = 0;
  devicesPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private devicesSub: Subscription;
  private authListenerSubs = new Subscription();
  constructor(public devicesService: DevicesService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.devicesService.getDevices(this.devicesPerPage, this.currentPage, false);
    this.username = this.authService.getUsername();
    console.log('Loading');
    this.devicesSub = this.devicesService
      .getDeviceUpdateListener()
      .subscribe((devicesData: { devices: DeviceIntegratedModel[]; maxDevices: number }) => {
        this.isLoading = false;
        console.log('not loading');
        console.log(devicesData.devices);
        this.devices = devicesData.devices;
        this.totalDevices = devicesData.maxDevices;
      });
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.username = this.authService.getUsername();
    });
  }
  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.totalDevices = pageData.length;
    this.devicesPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.devicesService.getDevices(this.devicesPerPage, this.currentPage, false);
  }

  onDelete(deviceId: string) {
    this.isLoading = true;
    this.devicesService.deleteDevice(deviceId).subscribe(() => {
      this.devicesService.getDevices(this.devicesPerPage, this.currentPage, false);
    });
  }

  ngOnDestroy() {
    this.devicesSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }
}
