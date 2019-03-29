import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlaygroundService } from '../playground.service';
import { DevicesService } from 'src/app/device/device.service';
import { AuthService } from 'src/app/navigation/header/auth/auth.service';
import { Subscription } from 'rxjs';
import { Device } from 'src/app/device/device.model';

@Component({
  selector: 'app-filter-list',
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.css']
})
export class FilterListComponent implements OnInit, OnDestroy {
  isLoading = false;
  username: string;
  userIsAuthenticated = false;

  nrSubPanels = 0;
  devices: Device[] = [];
  devicesPerPage = null;
  currentPage = null;
  totalDevices = 0;

  private devicesSub: Subscription;
  private authListenerSubs = new Subscription();

  constructor(
    private playgroundService: PlaygroundService,
    private devicesService: DevicesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.devicesService.getDevices(this.devicesPerPage, this.currentPage);
    this.username = this.authService.getUsername();
    console.log('Loading');

    this.devicesSub = this.devicesService
      .getDeviceUpdateListener()
      .subscribe((devicesData: { devices: Device[]; maxDevices: number }) => {
        this.isLoading = false;
        console.log('not loading');
        this.devices = devicesData.devices;
        this.nrSubPanels = this.countSubPanels(this.devices);
        console.log(this.nrSubPanels);
        this.totalDevices = devicesData.maxDevices;
      });
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.username = this.authService.getUsername();
    });
  }
  onSelect(node) {
    this.playgroundService.setDeviceSelected(node);
  }
  countSubPanels(obj: object) {
    let counter = 0;
    Object.keys(obj).forEach(e => {
      if (typeof obj[e] === 'object') {
        counter++;
      }
    });
    return counter;
  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    this.devicesSub.unsubscribe();
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
