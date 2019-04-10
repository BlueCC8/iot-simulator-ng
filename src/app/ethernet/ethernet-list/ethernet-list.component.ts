import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { EthernetModel } from '../ethernet.model';
import { EthernetsService } from '../ethernet.service';
import { PageEvent } from '@angular/material';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-ethernet-list',
  templateUrl: './ethernet-list.component.html',
  styleUrls: ['./ethernet-list.component.css']
})
export class EthernetListComponent implements OnInit, OnDestroy {
  ethers: EthernetModel[] = [];
  userIsAuthenticated = false;
  username: string;
  isLoading = false;
  totalEthers = 0;
  ethersPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private ethersSub: Subscription;
  private authListenerSubs = new Subscription();
  constructor(public ethersService: EthernetsService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.ethersService.getEthernets(this.ethersPerPage, this.currentPage);
    this.username = this.authService.getUsername();
    console.log('Loading');
    this.ethersSub = this.ethersService
      .getEthernetUpdateListener()
      .subscribe((ethersData: { ethers: EthernetModel[]; maxEthers: number }) => {
        this.isLoading = false;
        console.log('not loading');
        this.ethers = ethersData.ethers;
        this.totalEthers = ethersData.maxEthers;
      });
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.username = this.authService.getUsername();
    });
  }
  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.totalEthers = pageData.length;
    this.ethersPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.ethersService.getEthernets(this.ethersPerPage, this.currentPage);
  }

  onDelete(etherId: string) {
    this.isLoading = true;
    this.ethersService.deleteEthernet(etherId).subscribe(() => {
      this.ethersService.getEthernets(this.ethersPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.ethersSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }
}
