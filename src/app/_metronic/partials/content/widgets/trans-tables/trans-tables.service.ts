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
  private getfuelDealerIdByCorporateIdURL = this.baseURL + 'fuelDealerCustMap/getFuelDealerIdfromCorporateId';
  private getFuelCreditRequestCorporateByfuelDealerIdURL = this.baseURL + 'fuelDealerCustMap/getFuelCreditRequestCorporateByfuelDealerId';
  private getFuelCreditRequestByfuelDealerIdURL = this.baseURL + 'fuelDealerCustMap/getFuelCreditRequestByfuelDealerId';
  private getFuelCreditByCorporateIdURL = this.baseURL + 'fuelDealerCustMap/getFuelCreditByCorporateId';
  private getFuelCreditRequestByfuelDealerIdAndFuelCorporateId1URL = this.baseURL + 'fuelDealerCustMap/getFuelCreditRequestByfuelDealerIdAndFuelCorporateId1';
  private getFuelCreditRequestByCorporateIdAndFuelDealerURL = this.baseURL + 'fuelDealerCustMap/getFuelCreditRequestByCorporateIdAndFuelDealer';
  private getAllDealersListURL = this.baseURL + 'dealerDashboard/getAllDealersList';
  private getAllCRPaymentByCustNameCorporateURL = this.baseURL + 'accounttransaclog/getAllCRPaymentByCustNameCorporate';
  private getAllCRPaymentByCorporateURL = this.baseURL + 'accounttransaclog/getAllCRPaymentByCorporate';
  private getCorporateInfoByfuelDealerCustomerMapIdURL = this.baseURL + 'fuelDealerCustMap/getCorporateInfoByfuelDealerCustomerMapId1';
  private getAllCRPaymentByCustNameDealerURL = this.baseURL + 'accounttransaclog/getAllCRPaymentByCustNameDealer';
  private getAllCRPaymentByDealerURL = this.baseURL + 'accounttransaclog/getAllCRPaymentByDealer';
  private getCorporateInfoByCorporateCustomerMapIdURL = this.baseURL + 'fuelDealerCustMap/getCorporateInfoByCorporateCustomerMapId';
  private getFuelCreditDealersByCorporateIdURL = this.baseURL + 'fuelDealerCustMap/getFuelCreditDealersByCorporateId';
  private getTransactionWiseLedgerURL = this.baseURL + 'transporter/getTransactionWiseLedger';
  private getTransactionwiseLedgerByDealerCorporateIdURL = this.baseURL + 'myCRTimeLine/getTransactionwiseLedgerByDealerCorporateId';
  private getFuelCorpIdByMapIdURL = this.baseURL + 'fuelDealerCustMap/getFuelCorpIdByMapId';
  private getPreviousOutstandingByDealerIdURL = this.baseURL + 'myCRTimeLine/getPreviousOutstandingByDealerId';
  private PersonByIdURL = this.baseURL + 'person/getPersonById';
  private updateLogoURL = this.baseURL + 'corporate/updateLogo';
  private addDocDetailsURL = this.baseURL + 'documents/addDocDetails';



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

  // getfuelDealerIdByCorporateIdURL
  getfuelDealerIdByCorporateIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getfuelDealerIdByCorporateIdURL, body, {
      headers: headers
    })
  }

  // getFuelCreditRequestCorporateByfuelDealerIdURL
  getFuelCreditRequestCorporateByfuelDealerIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getFuelCreditRequestCorporateByfuelDealerIdURL, body, {
      headers: headers
    })
  }

  // getFuelCreditRequestByfuelDealerIdURL
  getFuelCreditRequestByfuelDealerIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getFuelCreditRequestByfuelDealerIdURL, body, {
      headers: headers
    })
  }

  // getFuelCreditByCorporateIdURL
  getFuelCreditByCorporateIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getFuelCreditByCorporateIdURL, body, {
      headers: headers
    })
  }

  // getFuelCreditRequestByfuelDealerIdAndFuelCorporateId1URL
  getFuelCreditRequestByfuelDealerIdAndFuelCorporateId1POST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getFuelCreditRequestByfuelDealerIdAndFuelCorporateId1URL, body, {
      headers: headers
    })
  }

  // getFuelCreditRequestByCorporateIdAndFuelDealerURL
  getFuelCreditRequestByCorporateIdAndFuelDealerPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getFuelCreditRequestByCorporateIdAndFuelDealerURL, body, {
      headers: headers
    })
  }

  // getAllDealersListURL
  getAllDealersListPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getAllDealersListURL, body, {
      headers: headers
    })
  }

  // getAllCRPaymentByCustNameCorporateURL
  getAllCRPaymentByCustNameCorporatePOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getAllCRPaymentByCustNameCorporateURL, body, {
      headers: headers
    })
  }

  // getAllCRPaymentByCorporateURL
  getAllCRPaymentByCorporatePOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getAllCRPaymentByCorporateURL, body, {
      headers: headers
    })
  }

  // getCorporateInfoByfuelDealerCustomerMapIdURL
  getCorporateInfoByfuelDealerCustomerMapIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getCorporateInfoByfuelDealerCustomerMapIdURL, body, {
      headers: headers
    })
  }

  // getAllCRPaymentByCustNameDealerURL
  getAllCRPaymentByCustNameDealerPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getAllCRPaymentByCustNameDealerURL, body, {
      headers: headers
    })
  }

  // getAllCRPaymentByDealerURL
  getAllCRPaymentByDealerPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getAllCRPaymentByDealerURL, body, {
      headers: headers
    })
  }

  // getCorporateInfoByCorporateCustomerMapIdURL
  getCorporateInfoByCorporateCustomerMapIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getCorporateInfoByCorporateCustomerMapIdURL, body, {
      headers: headers
    })
  }

  // getFuelCreditDealersByCorporateIdURL
  getFuelCreditDealersByCorporateIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getFuelCreditDealersByCorporateIdURL, body, {
      headers: headers
    })
  }

  // getTransactionWiseLedgerURL
  getTransactionWiseLedgerPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getTransactionWiseLedgerURL, body, {
      headers: headers
    })
  }

  // getTransactionwiseLedgerByDealerCorporateIdURL
  getTransactionwiseLedgerByDealerCorporateIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getTransactionwiseLedgerByDealerCorporateIdURL, body, {
      headers: headers
    })
  }

  // getFuelCorpIdByMapIdURL
  getFuelCorpIdByMapIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getFuelCorpIdByMapIdURL, body, {
      headers: headers
    })
  }

  // getPreviousOutstandingByDealerIdURL
  getPreviousOutstandingByDealerIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getPreviousOutstandingByDealerIdURL, body, {
      headers: headers
    })
  }

  // PersonByIdURL
  PersonByIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.PersonByIdURL, body, {
      headers: headers
    })
  }

  imageUpload(imageForm: FormData) {
    return this.http.post(this.baseURL + 'api/v1/upload', imageForm);
  }

  imageUpload1(imageForm: FormData) {
    return this.http.post(this.baseURL + 'api/v1/upload1', imageForm);
  }

  // updateLogoURL
  updateLogoPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.updateLogoURL, body, {
      headers: headers
    })
  }

  // addDocDetailsURL
  addDocDetailsPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.addDocDetailsURL, body, {
      headers: headers
    })
  }
}
