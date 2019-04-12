import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { SetupService } from '../setup.service';
import { SetupModel } from '../setup.model';
import { AuthService } from 'src/app/auth/auth.service';
import { PageEvent, MatBottomSheet } from '@angular/material';
import { BottomSheetComponent } from '../../bottom-sheet/bottom-sheet.component';
import { SetupDevicesModel } from '../setup-devices.model';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-setup-list',
  templateUrl: './setup-list.component.html',
  styleUrls: ['./setup-list.component.css']
})
export class SetupListComponent implements OnInit, OnDestroy {
  private componentName = SetupListComponent.name + ' ';
  setups: SetupDevicesModel[] = [];
  userIsAuthenticated = false;
  username: string;
  isLoading = false;
  totalSetups = 0;
  setupsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private isPopulated = true;
  private setupSubs = new Subscription();
  private authListenerSubs = new Subscription();

  constructor(
    private bottomSheet: MatBottomSheet,
    private setupsService: SetupService,
    private authService: AuthService,
    private logger: NGXLogger
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.setupsService.getSetups(this.setupsPerPage, this.currentPage, this.isPopulated);
    this.username = this.authService.getUsername();

    this.setupSubs = this.setupsService
      .getSetupUpdateStatus()
      .subscribe((setupsData: { setups: SetupDevicesModel[]; maxSetups: number }) => {
        this.isLoading = false;
        this.setups = setupsData.setups;
        this.totalSetups = setupsData.maxSetups;
      });

    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.username = this.authService.getUsername();
    });
  }
  openBottomSheet(setup: SetupDevicesModel) {
    setup.username = this.username;
    this.logger.log(this.componentName, setup);
    this.bottomSheet.open(BottomSheetComponent, { data: setup });
  }
  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.totalSetups = pageData.length;
    this.setupsPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.setupsService.getSetups(this.setupsPerPage, this.currentPage, this.isPopulated);
  }

  onDelete(setupId: string) {
    this.isLoading = true;
    this.setupsService.deleteSetup(setupId).subscribe(() => {
      this.setupsService.getSetups(this.setupsPerPage, this.currentPage, this.isPopulated);
    });
  }
  ngOnDestroy() {
    this.setupSubs.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }
}
