import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransTablesService {

  constructor(private http: HttpClient,
    private router: Router
  ) { }

    header: any;
    user: any;
    token: any = "";
  
  
    public baseURL = environment.apiUrl;
  
  
    ///// API path
  private getBranchByVeelsplusIdURL = this.baseURL + 'corporate/getBranchByVeelsplusId';
  private getCreditDetailsByMonthURL = this.baseURL + 'transporter/getCreditMonthWise';
  private getFastagCorporateByCorpIdURL = this.baseURL + 'fastag/getFastagCorporateByCorpId';
  private getFastagCorporateByEntityAllURL = this.baseURL + 'fastag/getFastagCorporateByEntityAll';
  private getFastagCorporateByEntityAllLQURL = this.baseURL + 'fastag/getFastagCorporateByEntityAllLQ';
  private getMonthwiseBillPayURL = this.baseURL + 'billPayment/getMonthwiseBillPay';
  private getLastMonthCrDetailsForTransporterURL = this.baseURL + 'dealerDashboard/getLastMonthCrDetailsForTransporter';
  private getThisMonthCrDetailsURL = this.baseURL + 'dealerDashboard/getThisMonthCrDetails';
  private getTotalOutstandingByCorpIdURL = this.baseURL + 'transporter/getTotalOutstandingByCorpId';
  private getCorpWalletBalLQURL = this.baseURL + 'fastag/getCorpWalletBalLQ';
  private getCorpWalletBalURL = this.baseURL + 'fastag/getCorpWalletBal';
  private getCreditAccByFuelCorporateIdNewURL = this.baseURL + 'transporter/getCreditAccByFuelCorporateIdNew';
  private getAllCreditAccByDealerIdURL = this.baseURL + 'fuelDealerCustMap/getAllCreditAccByDealerIdNEW';
  private removeTransactionLogURL = this.baseURL + 'accounttransaclog/removeTransactionLog';
  private editTransactionLogURL = this.baseURL + 'accounttransaclog/editTransactionLog';


  
  setHeader() {
    this.token = JSON.parse(localStorage.getItem('authenticationToken') || '{}');
    
  }
  
  
    //////API Functions
    // getBranchByVeelsplusIdURL
    getBranchByVeelsplusIdPOST(body: Object): Observable<any> {
      this.setHeader();
      let headers = new HttpHeaders();
      headers = headers.set('authenticationToken', this.token);
      return this.http.post(this.getBranchByVeelsplusIdURL, body, {
        headers: headers
      })
    }
    
    // getCreditDetailsByMonthURL
    getCreditDetailsByMonthPOST(body: Object): Observable<any> {
      this.setHeader();
      let headers = new HttpHeaders();
      headers = headers.set('authenticationToken', this.token);
      return this.http.post(this.getCreditDetailsByMonthURL, body, {
        headers: headers
      })
    }
    
    // getFastagCorporateByCorpIdURL
    getFastagCorporateByCorpIdPOST(body: Object): Observable<any> {
      this.setHeader();
      let headers = new HttpHeaders();
      headers = headers.set('authenticationToken', this.token);
      return this.http.post(this.getFastagCorporateByCorpIdURL, body, {
        headers: headers
      })
    }
    
    // getFastagCorporateByEntityAllURL
    getFastagCorporateByEntityAllPOST(body: Object): Observable<any> {
      this.setHeader();
      let headers = new HttpHeaders();
      headers = headers.set('authenticationToken', this.token);
      return this.http.post(this.getFastagCorporateByEntityAllURL, body, {
        headers: headers
      })
    }
    
    // getFastagCorporateByEntityAllLQURL
    getFastagCorporateByEntityAllLQPOST(body: Object): Observable<any> {
      this.setHeader();
      let headers = new HttpHeaders();
      headers = headers.set('authenticationToken', this.token);
      return this.http.post(this.getFastagCorporateByEntityAllLQURL, body, {
        headers: headers
      })
    }
    
    // getMonthwiseBillPayURL
    getMonthwiseBillPayPOST(body: Object): Observable<any> {
      this.setHeader();
      let headers = new HttpHeaders();
      headers = headers.set('authenticationToken', this.token);
      return this.http.post(this.getMonthwiseBillPayURL, body, {
        headers: headers
      })
    }
    
    // getLastMonthCrDetailsForTransporterURL
    getLastMonthCrDetailsForTransporterPOST(body: Object): Observable<any> {
      this.setHeader();
      let headers = new HttpHeaders();
      headers = headers.set('authenticationToken', this.token);
      return this.http.post(this.getLastMonthCrDetailsForTransporterURL, body, {
        headers: headers
      })
    }
    
    // getThisMonthCrDetailsURL
    getThisMonthCrDetailsPOST(body: Object): Observable<any> {
      this.setHeader();
      let headers = new HttpHeaders();
      headers = headers.set('authenticationToken', this.token);
      return this.http.post(this.getThisMonthCrDetailsURL, body, {
        headers: headers
      })
    }
    
    // getTotalOutstandingByCorpIdURL
    getTotalOutstandingByCorpIdPOST(body: Object): Observable<any> {
      this.setHeader();
      let headers = new HttpHeaders();
      headers = headers.set('authenticationToken', this.token);
      return this.http.post(this.getTotalOutstandingByCorpIdURL, body, {
        headers: headers
      })
    }
    
    // getCorpWalletBalLQURL
    getCorpWalletBalLQPOST(body: Object): Observable<any> {
      this.setHeader();
      let headers = new HttpHeaders();
      headers = headers.set('authenticationToken', this.token);
      return this.http.post(this.getCorpWalletBalLQURL, body, {
        headers: headers
      })
    }
    
    // getCorpWalletBalURL
    getCorpWalletBal(body: Object): Observable<any> {
      this.setHeader();
      let headers = new HttpHeaders();
      headers = headers.set('authenticationToken', this.token);
      return this.http.post(this.getCorpWalletBalURL, body, {
        headers: headers
      })
    }
    
    // getCreditAccByFuelCorporateIdNewURL
    getCreditAccByFuelCorporateIdNewPOST(body: Object): Observable<any> {
      this.setHeader();
      let headers = new HttpHeaders();
      headers = headers.set('authenticationToken', this.token);
      return this.http.post(this.getCreditAccByFuelCorporateIdNewURL, body, {
        headers: headers
      })
    }
    
    // getAllCreditAccByDealerIdURL
    getAllCreditAccByDealerIdPOST(body: Object): Observable<any> {
      this.setHeader();
      let headers = new HttpHeaders();
      headers = headers.set('authenticationToken', this.token);
      return this.http.post(this.getAllCreditAccByDealerIdURL, body, {
        headers: headers
      })
    }
    
    // removeTransactionLogURL
    removeTransactionLogPOST(body: Object): Observable<any> {
      this.setHeader();
      let headers = new HttpHeaders();
      headers = headers.set('authenticationToken', this.token);
      return this.http.post(this.removeTransactionLogURL, body, {
        headers: headers
      })
    }
    
    // editTransactionLogURL
    editTransactionLogPOST(body: Object): Observable<any> {
      this.setHeader();
      let headers = new HttpHeaders();
      headers = headers.set('authenticationToken', this.token);
      return this.http.post(this.editTransactionLogURL, body, {
        headers: headers
      })
    }
}
