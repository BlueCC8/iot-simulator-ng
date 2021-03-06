import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { EthernetModel } from '../models/ethernet.model';
import { EthernetDto } from '../dtos/ethernet.dto';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NGXLogger } from 'ngx-logger';

const BACKEND_URL = environment.apiUrl + '/ethernet/';
@Injectable({ providedIn: 'root' })
export class EthernetsService {
  private componentName = EthernetsService.name + ' ';
  private ethers: EthernetModel[] = [];
  private ethersUpdated$ = new Subject<{ ethers: EthernetModel[]; maxEthers: number }>();

  constructor(private http: HttpClient, private router: Router, private logger: NGXLogger) {}

  // * Get method for getting Ethernets from the server
  getEthernets(pageSize: number, page: number) {
    let queryParams = '';
    if (pageSize && page) {
      queryParams = `?pagesize=${pageSize}&page=${page}`;
    }
    this.http
      .get<{ ethers: EthernetDto[]; maxEthers: number }>(BACKEND_URL + queryParams)
      .pipe(
        map(ethernetData => {
          return {
            ethers: ethernetData.ethers.map(ether => {
              return {
                etherName: ether.etherName,
                etherStandard: ether.etherStandard,
                etherDataRate: ether.etherDataRate,
                imagePath: ether.imagePath,
                id: ether._id,
                username: ether.username
              };
            }),
            maxEthers: ethernetData.maxEthers
          };
        })
      )
      .subscribe(transformedEthersData => {
        this.logger.log(this.componentName, transformedEthersData.ethers);
        this.ethers = transformedEthersData.ethers;
        this.ethersUpdated$.next({
          ethers: [...this.ethers],
          maxEthers: transformedEthersData.maxEthers
        });
      });
  }
  // * Listener to be able to provide subscription to othe components
  getEthernetUpdateListener() {
    return this.ethersUpdated$.asObservable();
  }

  getEthernet(id: string) {
    return this.http.get<EthernetDto>(BACKEND_URL + id);
  }
  // updateEthernet(ether: EthernetModel) {
  //   const etherData = new FormData();
  //   etherData.append('etherName', ether.etherName);
  //   etherData.append('etherStandard', ether.etherStandard);
  //   etherData.append('etherDataRate', ether.etherDataRate);
  //   etherData.append('image', ether.imagePath, ether.etherName);

  //   this.http.put(BACKEND_URL + ether.id, etherData).subscribe(res => {
  //     this.router.navigate(['/']);
  //   });
  // }
  // addEthernet(ether: EthernetModel) {
  //   const etherData = new FormData();
  //   etherData.append('etherName', ether.etherName);
  //   etherData.append('etherStandard', ether.etherStandard);
  //   etherData.append('etherDataRate', ether.etherDataRate);
  //   etherData.append('image', ether.imagePath, ether.etherName);
  //   this.http.post<{ ether: EthernetModel }>(BACKEND_URL, etherData).subscribe(responseData => {
  //     this.router.navigate(['/']);
  //   });
  // }
  updateEthernet(ether: EthernetModel) {
    this.http.put(BACKEND_URL + ether.id, ether).subscribe(
      res => {
        // this.router.navigate(['/']);
      },
      error => {
        this.logger.error(this.componentName, error);
      }
    );
  }
  addEthernet(ether: EthernetModel) {
    return this.http.post<EthernetDto>(BACKEND_URL, ether).pipe(
      map(etherData => {
        return etherData._id;
      })
    );
  }

  deleteEthernet(etherID: string) {
    return this.http.delete(BACKEND_URL + etherID);
  }
}
