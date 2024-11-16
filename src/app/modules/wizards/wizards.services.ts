import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class WizardsService {
  findPhone(data: { phone: any; }) {
    throw new Error('Method not implemented.');
  }
    constructor(private http: HttpClient,
      private router: Router
    ) { }

    
  header: any;
  user: any;
  token: any = "";


  public baseURL = environment.apiUrl;

  private searchCarrierByMobileURL = this.baseURL + 'fuelDealerCustMap/getCustomerIdBycorporatePhoneNumber';
  private findPhoneNumberURL = this.baseURL + 'register/findPhoneNumber';
  setHeader() {
    this.token = JSON.parse(localStorage.getItem('authenticationToken') || '{}');
    
  }
  
  // searchCarrierByMobileURL
  searchCarrierByMobilePOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.searchCarrierByMobileURL, body, {
      headers: headers
    })
  }
  
  // findPhoneNumberURL
  findPhoneNumberPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.findPhoneNumberURL, body, {
      headers: headers
    })
  }
}

