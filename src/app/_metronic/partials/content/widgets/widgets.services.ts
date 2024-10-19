import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WidgetService {
 

  constructor(private http: HttpClient,
    private router: Router
  ) { }


  header: any;
  user: any;
  token: any = "";


  public baseURL = environment.apiUrl;


  ///// API path
  private getAllUserURL = this.baseURL + 'crmAPI/getAllUser';
  private addUserURL = this.baseURL + 'crmAPI/addUser';
  private getDealerListURL = this.baseURL + 'adminDashboard/getDealerList';
  private getYearWiseCreditURL = this.baseURL + 'adminOutstand/getYearWiseCredit';
  private getDealerIDCorpIdURL = this.baseURL + 'adminDashboard/getDealerIDCorpId';
  private getAllEntityIdURL = this.baseURL + 'coinConversion/getAllEntityId';
  private getFastagByYearURL = this.baseURL + 'fastag/getFastagByYear';
  private getcustmerIdByEntityIdURL = this.baseURL + 'coinConversion/getcustmerIdByEntityId';
  private getCrFastagForAllCustomerByMonthURL = this.baseURL + 'fastag/getCrFastagForAllCustomerByMonth';
  private getEntityIdAllLQURL = this.baseURL + 'fastag/getEntityIdAllLQ1';
  private getcustmerIdByEntityIdLQURL = this.baseURL + 'CoinConversion/getCustomerIdByEntityIdLQ'; 
  private getCRForFastagLQURL = this.baseURL + 'Fastag/getCRForFastagLQ'; 
  private getTranslogForFastagLQURL = this.baseURL + 'Fastag/getTranslogForFastagLQ';
  private getpaymentForFastagLQURL = this.baseURL + 'Fastag/getpaymentForFastagLQ'; 
  private getRechargeForFastagLQURL = this.baseURL + 'Fastag/getRechargeForFastagLQ'; 
  private getCrFastagLQForAllCustomerByMonthURL = this.baseURL + 'fastag/getCrFastagLQForAllCustomerByMonth'; 
  private getDayWiseCreditURL = this.baseURL + 'adminOutstand/getDayWiseCredit'; 
  private getCustomersCountDealerWiseURL = this.baseURL + 'adminDashboard/getCustomersCountDealerWise' 
  private getAllFastagTransactionDetailsURL = this.baseURL + 'fastag/getAllFastagTransactionDetails' 


  setHeader() {
    this.token = JSON.parse(localStorage.getItem('authenticationToken') || '{}');
    console.log("AuthTolen", this.token)
  }



  //////API Functions
  // getAllUserURL
  getAllCRMEmployee(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getAllUserURL, body, {
      headers: headers
    })
  }

  // addUserURL
  addUserPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.addUserURL, body, {
      headers: headers
    })
  }

  // getDealerListURL
  getDealerListPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.get(this.getDealerListURL, {
      headers: headers
    })
  }

  // getYearWiseCreditURL
  getYearWiseCreditPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getYearWiseCreditURL, body, {
      headers: headers
    })
  }

  // getDealerIDCorpIdURL
  getDealerIDCorpIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getDealerIDCorpIdURL, body, {
      headers: headers
    })
  }

  // getAllEntityIdURL
  getAllEntityIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getAllEntityIdURL, body, {
      headers: headers
    })
  }

  // getFastagByYearURL
  getFastagByYearPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getFastagByYearURL, body, {
      headers: headers
    })
  }

  // getcustmerIdByEntityIdURL
  getcustmerIdByEntityIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getcustmerIdByEntityIdURL, body, {
      headers: headers
    })
  }

  // getCrFastagForAllCustomerByMonthURL
  getCrFastagForAllCustomerByMonthPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getCrFastagForAllCustomerByMonthURL, body, {
      headers: headers
    })
  }

  // getEntityIdAllLQURL
  getEntityIdAllLQPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getEntityIdAllLQURL, body, {
      headers: headers
    })
  }

  // getcustmerIdByEntityIdLQURL
  getcustmerIdByEntityIdLQPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getcustmerIdByEntityIdLQURL, body, {
      headers: headers
    })
  }

  // getCRForFastagLQURL
  getCRForFastagLQPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getCRForFastagLQURL, body, {
      headers: headers
    })
  }

  // getTranslogForFastagLQURL
  getTranslogForFastagLQPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getTranslogForFastagLQURL, body, {
      headers: headers
    })
  }

  // getpaymentForFastagLQURL
  getpaymentForFastagLQPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getpaymentForFastagLQURL, body, {
      headers: headers
    })
  }

  // getRechargeForFastagLQURL
  getRechargeForFastagLQPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getRechargeForFastagLQURL, body, {
      headers: headers
    })
  }

  // getCrFastagLQForAllCustomerByMonthURL
  getCrFastagLQForAllCustomerByMonthPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getCrFastagLQForAllCustomerByMonthURL, body, {
      headers: headers
    })
  }

  // getDayWiseCreditURL
  getDayWiseCreditPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getDayWiseCreditURL, body, {
      headers: headers
    })
  }

  // getCustomersCountDealerWiseURL
  getCustomersCountDealerWisePOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getCustomersCountDealerWiseURL, body, {
      headers: headers
    })
  }

  // getAllFastagTransactionDetailsURL
  getAllFastagTransactionDetailsPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getAllFastagTransactionDetailsURL, body, {
      headers: headers
    })
  }

}
