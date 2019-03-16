import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Ethernet } from './ethernet.model';
import { EthernetDto as CreateEthernetDto } from './ethernet-create/ethernet-create.dto';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + '/ethernet/';
@Injectable({ providedIn: 'root' })
export class EthernetsService {
  private ethers: Ethernet[] = [];
  private ethersUpdated = new Subject<{ ethers: Ethernet[]; maxEthers: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  // * Get method for getting Ethernets from the server
  getEthernets(pageSize: number, page: number) {
    const queryParams = `?pagesize=${pageSize}&page=${page}`;
    this.http
      .get<{ ethers: CreateEthernetDto[]; maxEthers: number }>(BACKEND_URL + queryParams)
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
        console.log(transformedEthersData.ethers);
        this.ethers = transformedEthersData.ethers;
        this.ethersUpdated.next({
          ethers: [...this.ethers],
          maxEthers: transformedEthersData.maxEthers
        });
      });
  }
  // * Listener to be able to provide subscription to othe components
  getEthernetUpdateListener() {
    return this.ethersUpdated.asObservable();
  }

  getEthernet(id: string) {
    return this.http.get<CreateEthernetDto>(BACKEND_URL + id);
  }
  updateEthernet(ether: Ethernet) {
    const etherData = new FormData();
    etherData.append('etherName', ether.etherName);
    etherData.append('etherStandard', ether.etherStandard);
    etherData.append('etherDataRate', ether.etherDataRate);
    etherData.append('image', ether.imagePath, ether.etherName);

    this.http.put(BACKEND_URL + ether.id, etherData).subscribe(res => {
      this.router.navigate(['/']);
    });
  }
  addEthernet(ether: Ethernet) {
    const etherData = new FormData();
    etherData.append('etherName', ether.etherName);
    etherData.append('etherStandard', ether.etherStandard);
    etherData.append('etherDataRate', ether.etherDataRate);
    etherData.append('image', ether.imagePath, ether.etherName);
    this.http.post<{ ether: Ethernet }>(BACKEND_URL, etherData).subscribe(responseData => {
      this.router.navigate(['/']);
    });
  }

  deleteEthernet(etherID: string) {
    return this.http.delete(BACKEND_URL + etherID);
  }
}
