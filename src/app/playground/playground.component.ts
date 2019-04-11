import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchBarService } from './search-bar/search-bar.service';
import { DeviceIntegratedModel } from '../device/device.integrated-model';
import { DevicesService } from '../device/device.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
})
export class PlaygroundComponent implements OnInit, OnDestroy {
  private componentName = PlaygroundComponent.name + ' ';
  username: string;
  isLoading: boolean;
  devicesSearch: DeviceIntegratedModel[];
  totalDevices: number;
  userIsAuthenticated: boolean;
  devicesPerPage = null;
  currentPage = null;
  devicesSub = new Subscription();
  authListenerSubs = new Subscription();
  constructor(
    private searchbarService: SearchBarService,
    private devicesService: DevicesService,
    private authService: AuthService,
    private logger: NGXLogger
  ) {}
  ngOnInit() {
    this.devicesService.getDevices(this.devicesPerPage, this.currentPage, true);
    this.username = this.authService.getUsername();

    this.devicesSub = this.devicesService
      .getDeviceUpdateListener()
      .subscribe((devicesData: { devices: DeviceIntegratedModel[]; maxDevices: number }) => {
        this.isLoading = false;
        this.devicesSearch = devicesData.devices;
        this.totalDevices = devicesData.maxDevices;
      });
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.username = this.authService.getUsername();
    });
  }
  onSelectedOption(e) {
    this.getFilteredExpenseList();
  }

  getFilteredExpenseList() {
    this.logger.log(this.componentName, this.searchbarService.searchOption);
    if (this.searchbarService.searchOption.length > 0) {
      this.devicesSearch = this.searchbarService.filteredListOptions();
    } else {
      this.devicesSearch = this.searchbarService.devicesData;
    }
  }
  ngOnDestroy() {
    this.devicesSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }
}
