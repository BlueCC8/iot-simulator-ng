import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';

import { Subscription } from 'rxjs';
import { SetupService } from '../../../../core/services/setup.service';
import { SetupModel } from '../../../../core/models/setup.model';
import { AuthService } from 'src/app/auth/auth.service';
import { PageEvent, MatBottomSheet, MatAccordion } from '@angular/material';
import { BottomSheetComponent } from '../../bottom-sheet/bottom-sheet.component';
import { SetupDevicesModel } from '../../../../core/models/setup-devices.model';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-setup-list',
  templateUrl: './setup-list.component.html',
  styleUrls: ['./setup-list.component.css']
})
export class SetupListComponent implements OnInit, OnDestroy {
  @ViewChild(MatAccordion) accordion: MatAccordion;

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
  private ids = [];
  private setupSubs$ = new Subscription();
  private authListenerSubs$ = new Subscription();
  @Output() sidenavClose = new EventEmitter();

  constructor(
    private bottomSheet: MatBottomSheet,
    private setupsService: SetupService,
    private authService: AuthService,
    private logger: NGXLogger
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.setupsService.getSetups(this.setupsPerPage, this.currentPage, this.isPopulated, this.ids);
    this.username = this.authService.getUsername();
    this.setupSubs$ = this.setupsService
      .getSetupUpdateStatus()
      .subscribe(
        (setupsData: { setups: SetupDevicesModel[]; maxSetups: number; configIds: string[] }) => {
          this.isLoading = false;
          this.setups = setupsData.setups;
          this.totalSetups = setupsData.maxSetups;
          this.ids = setupsData.configIds;
        }
      );
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authListenerSubs$ = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.username = this.authService.getUsername();
    });
  }
  openBottomSheet(setup: SetupDevicesModel) {
    this.onSidenavClose();
    setup.username = this.username;
    this.logger.log(this.componentName, setup);
    this.bottomSheet.open(BottomSheetComponent, { data: setup });
  }
  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.totalSetups = pageData.length;
    this.setupsPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.setupsService.getSetups(this.setupsPerPage, this.currentPage, this.isPopulated, this.ids);
  }

  onDelete(setupId: string) {
    this.isLoading = true;
    this.setupsService.deleteSetup(setupId).subscribe(() => {
      this.setupsService.getSetups(
        this.setupsPerPage,
        this.currentPage,
        this.isPopulated,
        this.ids
      );
    });
  }
  onSidenavClose() {
    this.accordion.closeAll();
    this.sidenavClose.emit();
  }
  ngOnDestroy() {
    this.setupSubs$.unsubscribe();
    this.authListenerSubs$.unsubscribe();
  }
}
