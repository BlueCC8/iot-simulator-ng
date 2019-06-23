import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { DevicesService } from 'src/app/core/services/device.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { DeviceIntegratedModel } from 'src/app/core/models/device.integrated-model';
import { SearchBarService } from '../../../core/services/search-bar.service';
import { NGXLogger } from 'ngx-logger';
import { PageEvent, MatExpansionPanel } from '@angular/material';
import { BoardModel } from '../../../core/models/board.model';
import { BoardService } from '../../../core/services/board.service';

@Component({
  selector: 'app-filter-list',
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.css']
  // encapsulation: ViewEncapsulation.None disables encapsulation for every component
})
export class FilterListComponent implements OnInit, OnDestroy {
  @ViewChild('mep') matExpansionPanel: MatExpansionPanel;
  private componentName = FilterListComponent.name + ' ';
  panelOpenState = false;
  isLoading = false;
  username: string;
  userIsAuthenticated = false;
  // * Search
  searchResult: DeviceIntegratedModel[] = [];
  searchMax: number;
  searchId: string = null;

  nrSubPanels = 0;
  isPopulated = true;
  devices: DeviceIntegratedModel[] = [];
  totalDevices = 0;
  devicesPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10, 20];
  private devicesSub$ = new Subscription();
  private authListenerSubs$ = new Subscription();
  private searchbarSubs$ = new Subscription();

  @Output() sidenavClose = new EventEmitter();

  constructor(
    private boardsService: BoardService,
    private searchbarService: SearchBarService,
    private devicesService: DevicesService,
    private authService: AuthService,
    private logger: NGXLogger
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.devicesService.getDevices(this.devicesPerPage, this.currentPage, this.isPopulated);
    this.username = this.authService.getUsername();
    this.logger.log(this.componentName + 'Loading');
    this.devicesSub$ = this.devicesService
      .getDeviceUpdateListener()
      .subscribe((devicesData: { devices: DeviceIntegratedModel[]; maxDevices: number }) => {
        this.isLoading = false;
        this.devices = devicesData.devices;
        this.totalDevices = devicesData.maxDevices;
        this.logger.log(this.componentName + 'Devices', this.devices);
      });
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authListenerSubs$ = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.username = this.authService.getUsername();
    });

    this.searchbarSubs$ = this.searchbarService
      .getSearchUpdateListener()
      .subscribe((searchData: { devices: DeviceIntegratedModel[]; maxDevices: number }) => {
        this.searchResult = searchData.devices;
        this.logger.log(this.componentName, this.searchResult);
        this.searchMax = searchData.maxDevices;
      });
  }
  onAddDevice(device: DeviceIntegratedModel) {
    this.logger.log(this.componentName, device);
    const boardDevice: BoardModel = {
      id: device.id,
      devName: device.devName,
      devImgUrl: device.devImgUrl
    };
    this.boardsService.setBoardDeviceSelected(boardDevice);
  }
  checkExpanded(device: DeviceIntegratedModel) {
    return this.searchResult.filter(dev => dev.id === device.id).length > 0;
  }
  countSubPanels(obj: object) {
    let counter = 0;
    Object.keys(obj).forEach(e => {
      if (typeof obj[e] === 'object') {
        counter++;
      }
    });
  }
  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.totalDevices = pageData.length;
    this.devicesPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.devicesService.getDevices(this.devicesPerPage, this.currentPage, this.isPopulated);
  }
  onSetPanelState() {
    this.panelOpenState = false;
  }
  onClose() {
    this.matExpansionPanel.close();
    this.onSidenavClose();
  }
  onSidenavClose() {
    this.sidenavClose.emit();
  }
  ngOnDestroy() {
    this.authListenerSubs$.unsubscribe();
    this.searchbarSubs$.unsubscribe();
    this.devicesSub$.unsubscribe();
  }
  // flattenDeep(arr1) {
  //   return arr1.reduce(function iter(r, a) {
  //     if (a === null) {
  //       return r;
  //     }
  //     if (Array.isArray(a)) {
  //       return a.reduce(iter, r);
  //     }
  //     if (typeof a === 'object') {
  //       return Object.keys(a)
  //         .map(k => a[k])
  //         .reduce(iter, r);
  //     }
  //     return r.concat(a);
  //   }, []);
  // }

  // onDrop(event: CdkDragDrop<string[]>) {
  //   console.log(this.boardList);
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   }
  // }
}
