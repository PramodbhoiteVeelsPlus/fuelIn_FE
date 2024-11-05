import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class ModalsService {
    constructor(private http: HttpClient,
      private router: Router
    ) { }

    
  header: any;
  user: any;
  token: any = "";


  public baseURL = environment.apiUrl;

  private addFuelPriceByDealerIdURL = this.baseURL + 'fuelPrice/addFuelPriceByDealerId';
  private getFuelProductIdByDealerIdURL = this.baseURL + 'fuelPrice/getFuelProductIdByDealerId'
  private getfuelDealerIdByCorporateIdURL = this.baseURL + 'fuelDealerCustMap/getFuelDealerIdfromCorporateId'
  private getBranchByVeelsplusIdURL = this.baseURL + 'corporate/getBranchByVeelsplusId';

  setHeader() {
    this.token = JSON.parse(localStorage.getItem('authenticationToken') || '{}');
    console.log("AuthTolen", this.token)
  }
  
  // addFuelPriceByDealerIdURL
  addFuelPriceByDealerIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.addFuelPriceByDealerIdURL, body, {
      headers: headers
    })
  }
  
  // getFuelProductIdByDealerIdURL
  getFuelProductIdByDealerIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getFuelProductIdByDealerIdURL, body, {
      headers: headers
    })
  }
  
  // getfuelDealerIdByCorporateIdURL
  getfuelDealerIdByCorporateIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getfuelDealerIdByCorporateIdURL, body, {
      headers: headers
    })
  }
  
  // getBranchByVeelsplusIdURL
  getBranchByVeelsplusIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getBranchByVeelsplusIdURL, body, {
      headers: headers
    })
  }
}

