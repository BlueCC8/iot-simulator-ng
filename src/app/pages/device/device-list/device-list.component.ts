import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { PageEvent, TooltipPosition } from '@angular/material';
import { AuthService } from '../../../auth/auth.service';
import { DeviceIntegratedModel } from '../device.integrated-model';
import { DevicesService } from '../device.service';
import { FormControl } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})
export class DeviceListComponent implements OnInit, OnDestroy {
  private componentName = DeviceListComponent.name + ' ';
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];

  toolTipEdit: string;
  devices: DeviceIntegratedModel[] = [];
  userIsAuthenticated = false;
  username: string;
  isLoading = false;
  totalDevices = 0;
  devicesPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10, 20];
  private devicesSub: Subscription;
  private authListenerSubs = new Subscription();
  constructor(
    public devicesService: DevicesService,
    private authService: AuthService,
    private logger: NGXLogger
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.devicesService.getDevices(this.devicesPerPage, this.currentPage, false);
    this.username = this.authService.getUsername();
    this.logger.log(this.componentName + 'Loading');
    this.devicesSub = this.devicesService
      .getDeviceUpdateListener()
      .subscribe((devicesData: { devices: DeviceIntegratedModel[]; maxDevices: number }) => {
        this.isLoading = false;
        this.logger.log(this.componentName + 'not loading');
        this.logger.log(this.componentName + 'devices', devicesData.devices);
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
