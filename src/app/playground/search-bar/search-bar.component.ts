import {
  Component,
  OnInit,
  ElementRef,
  EventEmitter,
  ViewChild,
  Output,
  OnDestroy
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { PlaygroundService } from '../playground.service';
import { DeviceIntegratedModel } from 'src/app/device/device.integrated-model';
import { DevicesService } from 'src/app/device/device.service';
import { AuthService } from 'src/app/auth/auth.service';
import { SearchBarService } from './search-bar.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit, OnDestroy {
  isLoading = false;
  form = new FormGroup({});
  myControl = new FormControl();
  autoCompleteList: any[];
  username: string;
  userIsAuthenticated = false;
  devicesPerPage = null;
  currentPage = null;
  devices: DeviceIntegratedModel[];
  totalDevices = 0;
  searchOption;

  filteredOptions: Observable<string[]>;
  searchBarSub = new Subscription();
  private authListenerSubs = new Subscription();
  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;
  @Output() onSelectedOption = new EventEmitter();

  constructor(
    private playgroundService: PlaygroundService,
    // private devicesService: DevicesService,
    private searchbarService: SearchBarService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.searchOption = this.searchbarService.searchOption;

    this.searchbarService.getDevices(this.devicesPerPage, this.currentPage, true);
    this.username = this.authService.getUsername();

    this.searchBarSub = this.searchbarService
      .getDeviceUpdateListener()
      .subscribe((devicesData: { devices: DeviceIntegratedModel[]; maxDevices: number }) => {
        this.isLoading = false;
        this.devices = devicesData.devices;
        this.totalDevices = devicesData.maxDevices;
        this.searchbarService.devicesData = this.devices;
      });
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.username = this.authService.getUsername();
    });
    // when user types something in input, the value changes will come through this
    this.myControl.valueChanges.subscribe(userInput => {
      this.autoCompleteExpenseList(userInput);
    });
  }

  private autoCompleteExpenseList(input) {
    const categoryList = this.filterCategoryList(input);
    this.autoCompleteList = categoryList;
  }

  // this is where filtering the data happens according to you typed value
  filterCategoryList(val) {
    let categoryList = [];
    if (typeof val !== 'string') {
      return [];
    }
    if (val === '' || val === null) {
      return [];
    }
    return val
      ? this.devices.filter(dev => dev.devName.toLowerCase().indexOf(val.toLowerCase()) !== -1)
      : this.devices;
  }

  // after you clicked an autosuggest option, this function will show the field you want to show in input
  displayFn(device: DeviceIntegratedModel) {
    return device ? device.devName : device;
  }

  filterPostList(event) {
    const devices = event.source.value;
    if (!devices) {
      this.searchbarService.searchOption = [];
    } else {
      this.searchbarService.searchOption.push(devices);
      this.onSelectedOption.emit(this.searchbarService.searchOption);
    }
    this.focusOnPlaceInput();
  }

  removeOption(option) {
    const index = this.searchbarService.searchOption.indexOf(option);
    if (index >= 0) {
      this.searchbarService.searchOption.splice(index, 1);
    }
    this.focusOnPlaceInput();

    this.onSelectedOption.emit(this.searchbarService.searchOption);
  }

  // focus the input field and remove any unwanted text.
  focusOnPlaceInput() {
    this.autocompleteInput.nativeElement.focus();
    this.autocompleteInput.nativeElement.value = '';
  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    this.searchBarSub.unsubscribe();
  }
}
