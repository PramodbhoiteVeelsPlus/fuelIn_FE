import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WidgetService {
  FCInvoiceListDetails: any = [];
  activeStartDate: string;
  activeEndDate: string;
  totalOutstanding: number;
  crOutstanding2: number;
  setRouteForActiveArray: any = [];
 

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
  private getAllDealerListURL = this.baseURL + 'dealerOnboarding/getAllDealerList';
  private userOnboardingURL = this.baseURL + 'user/userOnboarding';
  private updateDealerDemoStatusURL = this.baseURL + 'fuelVendor/updateDealerDemoStatus'; 
  private updateDoorStepDeliveryStatusURL = this.baseURL + 'User/updateDoorStepDeliveryStatus'; 
  private removeUserURL = this.baseURL + 'register/removeUser';
  private getPrimeDealerDetailsURL = this.baseURL + 'dealerOnboarding/getPrimeDealerDetails';
  private updateTaxInvoiceStatusURL = this.baseURL + 'User/updateTaxInvoiceStatus';
  private getPayInfoURL = this.baseURL + 'register/getPayInfo';
  private addOffLinePaymentURL = this.baseURL + 'dealerInvoice/addOffLinePayment';
  private waiveoffPaymentUpdateURL = this.baseURL + 'corporate/waiveoffPaymentUpdate';
  private updateSmsStatusURL = this.baseURL + 'user/updateSmsStatus';
  private updateemailStatusURL = this.baseURL + 'user/updateemailStatus';
  private updateDealerCRSMSStatusURL = this.baseURL + 'fuelVendor/updateDealerCRSMSStatus';
  private getLiteDealerDetailsURL = this.baseURL + 'dealerOnboarding/getLiteDealerDetails';
  private updateOsSmsStatusURL = this.baseURL + 'user/updateOsSmsStatus';
  private getPrimeDealerReqListURL = this.baseURL + 'dealerOnboarding/getPrimeDealerReqList'; 
  private updatePrimeUserStatusURL = this.baseURL + 'fuelVendor/updatePrimeUserStatus'; 
  private getDealerRequestDetailsURL = this.baseURL + 'dealerOnboarding/getDealerRequestDetails'; 
  private updateStatusForRequestURL = this.baseURL + 'fuelVendor/updateStatusForRequest';
  private getRequestCallDetailsURL = this.baseURL + 'dealerOnboarding/getRequestCallDetails';
  private updateDemoScheduleRequestURL = this.baseURL + 'fuelStaff/updateDemoScheduleRequest'; 
  private getDemoDealerDetailsURL = this.baseURL + 'dealerOnboarding/getDemoDealerDetails';
  private getRemovedDealerDetailsURL = this.baseURL + 'dealerOnboarding/getRemovedDealerDetails';  
  private getAllBrandsFuelProductURL = this.baseURL + 'fuelproductmaster/getAllBrandsFuelProduct'; 
  private updateFuelProductURL = this.baseURL + 'fuelproductmaster/updateFuelProduct';  
  private addFuelProductURL = this.baseURL + 'fuelproductmaster/addFuelProduct'; 
  private getAllDealersListURL = this.baseURL + 'adminDashboard/getAllDealerList';
  private getReferralListURL = this.baseURL + 'referral/getReferralList';
  private deleteReferralURL = this.baseURL + 'referral/deleteReferral'; 
  private updateReferralStatusURL = this.baseURL + 'referral/updateReferralStatus';
  private addReferralDetailsURL = this.baseURL + 'referral/addReferralDetails'; 
  private getReferralDetailsURL = this.baseURL + 'referral/getReferralDetails'; 
  private deleteReferralDetailsURL = this.baseURL + 'referral/deleteReferralDetails'; 
  private updateReferralDetailsURL = this.baseURL + 'referral/updateReferralDetails'; 
  private getAllReferralDetailsURL = this.baseURL + 'referral/getAllReferralDetails'; 
  private getSTAFFnPOSPumpCountDealerWiseURL = this.baseURL + 'adminDashboard/getSTAFFnPOSPumpCountDealerWise'
  private getCreditByDealerIdURL = this.baseURL + 'deleteModal/getCreditByDealerId'; 
  private getPaymentByDealerIdURL = this.baseURL + 'deleteModal/getPaymentByDealerId';
  private cancelFuelCreditReqURL = this.baseURL + 'fuelDealerCustMap/cancelFuelCreditReq'
  private removeTransactionLogURL = this.baseURL + 'accounttransaclog/removeTransactionLog';
  private getPriceByDealerIdURL = this.baseURL + 'fuelPrice/getPriceByDealerId';
  private deleteFuelPriceURL = this.baseURL + 'fuelPrice/deleteFuelPrice'; 
  private getDayWiseShiftBookURL = this.baseURL + 'shiftList/getDayWiseShiftBook';
  private getDayWiseShiftBookMIDURL = this.baseURL + 'shiftList/getDayWiseShiftBookMID'; 
  private getDayWiseShiftBookLASTURL = this.baseURL + 'shiftList/getDayWiseShiftBookLAST'; 
  private getRequestCallByScheduleDateURL = this.baseURL + 'dealerOnboarding/getRequestCallDetailsByScheduleDate';
  private getBranchByVeelsplusIdURL = this.baseURL + 'corporate/getBranchByVeelsplusId';
  private getfuelDealerIdByCorporateIdURL = this.baseURL + 'fuelDealerCustMap/getFuelDealerIdfromCorporateId'
  private getFuelProductIdByDealerIdURL = this.baseURL + 'fuelPrice/getFuelProductIdByDealerId'
  private getFuelPriceByProductDateDealerIdURL = this.baseURL + 'fuelPrice/getFuelPriceByProductDateDealerId'; 
  private getStaffDetailsURL = this.baseURL + 'fuelStaff/getStaffDetails'
  private updateMapStatusforStaffURL = this.baseURL + 'fuelStaff/updateMapStatusforStaff'; 
  private UpdateDealerStaffDetailsURL = this.baseURL + 'fuelStaff/UpdateDealerStaffDetails'; 
  private switchedToStaffURL = this.baseURL + 'userAccess/switchedToStaff'
  private getStaffCountURL = this.baseURL + 'fuelStaff/getStaffCount'; 
  private getTotalTANKDUProductwiseURL = this.baseURL + 'dealerDashboard/getTotalTANKDUProductwise';
  private getBankDetailsByDealerIdURL = this.baseURL + 'bankDetails/getBankDetailsByDealerId';
  private updateAccountDetailsbyUniqueStatusURL = this.baseURL + 'bankDetails/updateAccountDetailsbyUniqueStatus';
  private getPOSByBankIdURL = this.baseURL + 'fuelTerminals/getPOSByBankId'; 
  private deleteBankAccByDealerIdURL = this.baseURL + 'bankDetails/deleteBankAccByDealerId';
  private updateBankAccountDetailsURL = this.baseURL + 'bankDetails/updateBankAccountDetails';
  private updateCustomizeStatusURL = this.baseURL + 'customize/updateCustomizeStatus'; 
  private getActiveCustomerListURL = this.baseURL + 'adminOutstand/getActiveCustomerList';
  private getActiveVehicleListURL = this.baseURL + 'adminOutstand/getActiveVehicleList';
  private getFuelTerminalURL = this.baseURL + 'fuelTerminals/getFuelTerminal'
  private updateFuelTerminalPOSStatusURL = this.baseURL + 'fuelTerminals/updateFuelTerminalPOSStatus';
  private deleteFuelTerminalURL = this.baseURL + 'fuelTerminals/deleteFuelTerminal';
  private updateFuelTerminalPOSNameURL = this.baseURL + 'fuelTerminals/updateFuelTerminalPOSName';
  private getMappingAccByFuelDealerIdURL = this.baseURL + 'crCustomers/getMappingAccByFuelDealerId'; 
  private getfuelCreditVehicleByfuelDealerCustomerMapIdURL = this.baseURL + 'fuelVehicleDetails/getfuelCreditVehicleByfuelDealerCustomerMapId';
  private checkCustomerPreviousOutstandingIsAddedOrNotURL = this.baseURL + "fuelCreditInvoice/checkCustomerPreviousOutstandingIsAddedOrNot";
  private updateCustDealerReqURL = this.baseURL + 'fuelDealerCustMap/updateCustDealerReq';
  private updateMappingSmsStatusURL = this.baseURL + 'fuelDealerCustMap/updateMappingSmsStatus';
  private getCorporateRequestByDealerURL = this.baseURL + 'fuelDealerCustMap/getCorporateRequestByDealer';
  private updateMappingEmailStatusURL = this.baseURL + 'fuelDealerCustMap/updateMappingEmailStatus';
  private RemovefuelCreditVehicleByIdfuelCreditVehicleURL = this.baseURL + 'fuelVehicleDetails/RemovefuelCreditVehicleByIdfuelCreditVehicle';
  private updateMappingCompanyNamePostURL = this.baseURL + 'fuelDealerCustMap/updateCompanyName';
  private updatePreviousOutstandingURL = this.baseURL + 'fuelDealerCustMap/updatePreviousOutstanding';
  private checkManualNumRangeURL = this.baseURL + 'fuelDealerCustMap/checkManualNumRange';
  private updateManualNumberURL = this.baseURL + 'fuelDealerCustMap/updateManualNumber';
  private addFlagForCorpURL = this.baseURL + 'fuelDealerCustMap/addFlagForCorp';
  private updateFlagForCorpURL = this.baseURL + 'fuelDealerCustMap/updateFlagForCorp';
  private sendSmsToMappedCorpNewURL = this.baseURL + 'fuelDealerCustMap/sendSmsToMappedCorpNew';
  private getCustomerByCustomerIdURL = this.baseURL + 'customer/getCustomerBycustomerId';
  private getCorporateInfoByfuelDealerCustomerMapIdURL = this.baseURL + 'fuelDealerCustMap/getCorporateInfoByfuelDealerCustomerMapId1'
  private getFuelCreditRequestCorporateByfuelDealerIdURL = this.baseURL + 'fuelDealerCustMap/getFuelCreditRequestCorporateByfuelDealerId'
  private getMapAccountsURL = this.baseURL + 'crCustomers/getMapAccounts';
  private allCrAndPaymentForIntervalURL = this.baseURL + 'fuelCreditInvoice/allCrAndPaymentForInterval';
  private getAccountTransactionLogBYfuelDealerCustomMapIdByDateRangeURL = this.baseURL + 'accounttransaclog/getAccountTransactionLogBYfuelDealerCustomMapIdByDateRange';
  private getFuelCorpIdByMapIdURL = this.baseURL + 'fuelDealerCustMap/getFuelCorpIdByMapId';
  private getAccessByPersonIdURL = this.baseURL + 'userAccess/getAccessByPersonId';
  private checkVehicleByfuelDealerIdURL = this.baseURL + 'fuelVehicleDetails/checkVehicleByfuelDealerId';
  private addFuelVehicleDetailsURL = this.baseURL + 'fuelVehicleDetails/addFuelVehicleDetails';


  setHeader() {
    this.token = JSON.parse(localStorage.getItem('authenticationToken') || '{}');
    
  }

  setRouteForActiveCustomer(activeRoute: string, allActiveCreditAccByDealer: any, startDate: string | null | undefined, endDate: string | null | undefined, totalOutstanding: any, crOutstanding2: number) {
    this.FCInvoiceListDetails = [];
    this.activeStartDate = '';
    this.activeEndDate = '';
    this.totalOutstanding = 0;
    this.crOutstanding2 = 0;
    let jsonStatement = {
      activeRoute: activeRoute,
      activeStartDate: startDate,
      activeEndDate: endDate,
      allActiveCreditAccByDealer: allActiveCreditAccByDealer,
      totalOutstanding: totalOutstanding,
      crOutstanding2: crOutstanding2
    }
    this.setRouteForActiveArray.push(jsonStatement)
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
    return this.http.get(this.getCustomersCountDealerWiseURL, {
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

  // getAllDealerListURL
  getAllDealerListPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getAllDealerListURL, body, {
      headers: headers
    })
  }

  // userOnboardingURL
  userOnboardingPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.userOnboardingURL, body, {
      headers: headers
    })
  }

  // updateDealerDemoStatusURL
  updateDealerDemoStatusPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.updateDealerDemoStatusURL, body, {
      headers: headers
    })
  }

  // updateDoorStepDeliveryStatusURL
  updateDoorStepDeliveryStatusPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.updateDoorStepDeliveryStatusURL, body, {
      headers: headers
    })
  }

  // removeUserURL
  removeUserPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.removeUserURL, body, {
      headers: headers
    })
  }

  // getPrimeDealerDetailsURL
  getPrimeDealerDetailsPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getPrimeDealerDetailsURL, body, {
      headers: headers
    })
  }

  // updateTaxInvoiceStatusURL
  updateTaxInvoiceStatusPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.updateTaxInvoiceStatusURL, body, {
      headers: headers
    })
  }

  // getPayInfoURL
  getPayInfoPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.get(this.getPayInfoURL, {
      headers: headers
    })
  }

  // addOffLinePaymentURL
  addOffLinePaymentPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.addOffLinePaymentURL, body, {
      headers: headers
    })
  }

  // waiveoffPaymentUpdateURL
  waiveoffPaymentUpdatePOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.waiveoffPaymentUpdateURL, body, {
      headers: headers
    })
  }

  // updateSmsStatusURL
  updateSmsStatusPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.updateSmsStatusURL, body, {
      headers: headers
    })
  }

  // updateemailStatusURL
  updateemailStatusPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.updateemailStatusURL, body, {
      headers: headers
    })
  }

  // updateDealerCRSMSStatusURL
  updateDealerCRSMSStatusPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.updateDealerCRSMSStatusURL, body, {
      headers: headers
    })
  }

  // getLiteDealerDetailsURL
  getLiteDealerDetailsPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getLiteDealerDetailsURL, body, {
      headers: headers
    })
  }

  // updateOsSmsStatusURL
  updateOsSmsStatusPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.updateOsSmsStatusURL, body, {
      headers: headers
    })
  }

  // getPrimeDealerReqListURL
  getPrimeDealerReqListPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getPrimeDealerReqListURL, body, {
      headers: headers
    })
  }

  // updatePrimeUserStatusURL
  updatePrimeUserStatusPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.updatePrimeUserStatusURL, body, {
      headers: headers
    })
  }

  // getDealerRequestDetailsURL
  getDealerRequestDetailsPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getDealerRequestDetailsURL, body, {
      headers: headers
    })
  }

  // updateStatusForRequestURL
  updateStatusForRequestPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.updateStatusForRequestURL, body, {
      headers: headers
    })
  }

  // getRequestCallDetailsURL
  getRequestCallDetailsPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getRequestCallDetailsURL, body, {
      headers: headers
    })
  }

  // updateDemoScheduleRequestURL
  updateDemoScheduleRequestPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.updateDemoScheduleRequestURL, body, {
      headers: headers
    })
  }

  // getDemoDealerDetailsURL
  getDemoDealerDetailsPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getDemoDealerDetailsURL, body, {
      headers: headers
    })
  }

  // getRemovedDealerDetailsURL
  getRemovedDealerDetailsPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getRemovedDealerDetailsURL, body, {
      headers: headers
    })
  }

  // getAllBrandsFuelProductURL
  getAllBrandsFuelProductPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.get(this.getAllBrandsFuelProductURL, {
      headers: headers
    })
  }

  // updateFuelProductURL
  updateFuelProductPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.updateFuelProductURL, body,{
      headers: headers
    })
  }

  // addFuelProductURL
  addFuelProductPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.addFuelProductURL, body,{
      headers: headers
    })
  }

  // getAllDealersListURL
  getAllDealersListPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.get(this.getAllDealersListURL,{
      headers: headers
    })
  }

  // getReferralListURL
  getReferralListPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getReferralListURL, body,{
      headers: headers
    })
  }

  // deleteReferralURL
  deleteReferralPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.deleteReferralURL, body,{
      headers: headers
    })
  }

  // updateReferralStatusURL
  updateReferralStatusPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.updateReferralStatusURL, body,{
      headers: headers
    })
  }

  // addReferralDetailsURL
  addReferralDetailsPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.addReferralDetailsURL, body,{
      headers: headers
    })
  }

  // getReferralDetailsURL
  getReferralDetailsPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getReferralDetailsURL, body,{
      headers: headers
    })
  }

  // deleteReferralDetailsURL
  deleteReferralDetailsPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.deleteReferralDetailsURL, body,{
      headers: headers
    })
  }

  // updateReferralDetailsURL
  updateReferralDetailsPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.updateReferralDetailsURL,body, {
      headers: headers
    })
  }

  // getAllReferralDetailsURL
  getAllReferralDetailsPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getAllReferralDetailsURL, body, {
      headers: headers
    })
  }

  // getSTAFFnPOSPumpCountDealerWiseURL
  getSTAFFnPOSPumpCountDealerWisePOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.get(this.getSTAFFnPOSPumpCountDealerWiseURL, {
      headers: headers
    })
  }

  // getCreditByDealerIdURL
  getCreditByDealerIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getCreditByDealerIdURL, body, {
      headers: headers
    })
  }

  // getPaymentByDealerIdURL
  getPaymentByDealerIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getPaymentByDealerIdURL, body, {
      headers: headers
    })
  }

  // cancelFuelCreditReqURL
  cancelFuelCreditReqPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.cancelFuelCreditReqURL, body, {
      headers: headers
    })
  }

  // removeTransactionLogURL
  removeTransactionLogPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.removeTransactionLogURL, body,{
      headers: headers
    })
  }

  // getPriceByDealerIdURL
  getPriceByDealerIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getPriceByDealerIdURL, body,{
      headers: headers
    })
  }

  // deleteFuelPriceURL
  deleteFuelPricePOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.deleteFuelPriceURL, body,{
      headers: headers
    })
  }

  // getDayWiseShiftBookURL
  getDayWiseShiftBookPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getDayWiseShiftBookURL, body,{
      headers: headers
    })
  }
  
  // getDayWiseShiftBookMIDURL
  getDayWiseShiftBookMIDPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getDayWiseShiftBookMIDURL, body,{
      headers: headers
    })
  }

  // getDayWiseShiftBookLASTURL
  getDayWiseShiftBookLASTPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getDayWiseShiftBookLASTURL, body,{
      headers: headers
    })
  }

  // getRequestCallByScheduleDateURL
  getRequestCallByScheduleDatePOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getRequestCallByScheduleDateURL, body, {
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

  // getfuelDealerIdByCorporateIdURL
  getfuelDealerIdByCorporateIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getfuelDealerIdByCorporateIdURL, body, {
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

  // getFuelPriceByProductDateDealerIdURL
  getFuelPriceByProductDateDealerIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getFuelPriceByProductDateDealerIdURL, body, {
      headers: headers
    })
  }

  // getStaffDetailsURL
  getStaffDetailsPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getStaffDetailsURL, body, {
      headers: headers
    })
  }

  // updateMapStatusforStaffURL
  updateMapStatusforStaffPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.updateMapStatusforStaffURL, body, {
      headers: headers
    })
  }

  // UpdateDealerStaffDetailsURL
  UpdateDealerStaffDetailsPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.UpdateDealerStaffDetailsURL, body, {
      headers: headers
    })
  }

  // switchedToStaffURL
  switchedToStaffPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.switchedToStaffURL, body, {
      headers: headers
    })
  }

  // getStaffCountURL
  getStaffCountPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getStaffCountURL, body, {
      headers: headers
    })
  }

  // getTotalTANKDUProductwiseURL
  getTotalTANKDUProductwisePOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getTotalTANKDUProductwiseURL, body, {
      headers: headers
    })
  }

  // getBankDetailsByDealerIdURL
  getBankDetailsByDealerIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getBankDetailsByDealerIdURL, body, {
      headers: headers
    })
  }

  // updateAccountDetailsbyUniqueStatusURL
  updateAccountDetailsbyUniqueStatusPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.updateAccountDetailsbyUniqueStatusURL, body, {
      headers: headers
    })
  }

  // getPOSByBankIdURL
  getPOSByBankIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getPOSByBankIdURL, body, {
      headers: headers
    })
  }
  
  // deleteBankAccByDealerIdURL
  deleteBankAccByDealerIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.deleteBankAccByDealerIdURL, body, {
      headers: headers
    })
  }
  
  // updateBankAccountDetailsURL
  updateBankAccountDetailsPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.updateBankAccountDetailsURL, body, {
      headers: headers
    })
  }
  
  // updateCustomizeStatusURL
  updateCustomizeStatusPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.updateCustomizeStatusURL, body, {
      headers: headers
    })
  }
  // getActiveCustomerListURL
  getActiveCustomerListPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getActiveCustomerListURL, body, {
      headers: headers
    })
  }
  
  // getActiveVehicleListURL
  getActiveVehicleListPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getActiveVehicleListURL, body, {
      headers: headers
    })
  }
  
  // getFuelTerminalURL
  getFuelTerminalPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getFuelTerminalURL, body, {
      headers: headers
    })
  }
  
  // updateFuelTerminalPOSStatusURL
  updateFuelTerminalPOSStatusPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.updateFuelTerminalPOSStatusURL, body, {
      headers: headers
    })
  }
  
  // deleteFuelTerminalURL
  deleteFuelTerminalPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.deleteFuelTerminalURL, body, {
      headers: headers
    })
  }
  
  // updateFuelTerminalPOSNameURL
  updateFuelTerminalPOSNamePOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.updateFuelTerminalPOSNameURL, body, {
      headers: headers
    })
  }
  
  // getMappingAccByFuelDealerIdURL
  getMappingAccByFuelDealerIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getMappingAccByFuelDealerIdURL, body, {
      headers: headers
    })
  }
  
  // getfuelCreditVehicleByfuelDealerCustomerMapIdURL
  getfuelCreditVehicleByfuelDealerCustomerMapIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getfuelCreditVehicleByfuelDealerCustomerMapIdURL, body, {
      headers: headers
    })
  }
  
  // checkCustomerPreviousOutstandingIsAddedOrNotURL
  checkCustomerPreviousOutstandingIsAddedOrNotPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.checkCustomerPreviousOutstandingIsAddedOrNotURL, body, {
      headers: headers
    })
  }
  
  // updateCustDealerReqURL
  updateCustDealerReqPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.updateCustDealerReqURL, body, {
      headers: headers
    })
  }
  
  // updateMappingSmsStatusURL
  updateMappingSmsStatusPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.updateMappingSmsStatusURL, body, {
      headers: headers
    })
  }
  
  // getCorporateRequestByDealerURL
  getCorporateRequestByDealerPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getCorporateRequestByDealerURL, body, {
      headers: headers
    })
  }
  
  // updateMappingEmailStatusURL
  updateMappingEmailStatusPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.updateMappingEmailStatusURL, body, {
      headers: headers
    })
  }
  
  // RemovefuelCreditVehicleByIdfuelCreditVehicleURL
  RemovefuelCreditVehicleByIdfuelCreditVehiclePOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.RemovefuelCreditVehicleByIdfuelCreditVehicleURL, body, {
      headers: headers
    })
  }

  // updateMappingCompanyNamePostURL
  updateMappingCompanyNamePost(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.updateMappingCompanyNamePostURL, body, {
      headers: headers
    })
  }

  // updatePreviousOutstandingURL
  updatePreviousOutstandingPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.updatePreviousOutstandingURL, body, {
      headers: headers
    })
  }

  // checkManualNumRangeURL
  checkManualNumRangePOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.checkManualNumRangeURL, body, {
      headers: headers
    })
  }

  // updateManualNumberURL
  updateManualNumberPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.updateManualNumberURL, body, {
      headers: headers
    })
  }

  // addFlagForCorpURL
  addFlagForCorpPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.addFlagForCorpURL, body, {
      headers: headers
    })
  }

  // updateFlagForCorpURL
  updateFlagForCorpPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.updateFlagForCorpURL, body, {
      headers: headers
    })
  }

  // sendSmsToMappedCorpNewURL
  sendSmsToMappedCorpNewPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.sendSmsToMappedCorpNewURL, body, {
      headers: headers
    })
  }

  // getCustomerByCustomerIdURL
  getCustomerByCustomerIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getCustomerByCustomerIdURL, body, {
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

  // getFuelCreditRequestCorporateByfuelDealerIdURL
  getFuelCreditRequestCorporateByfuelDealerIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getFuelCreditRequestCorporateByfuelDealerIdURL, body, {
      headers: headers
    })
  }

  // getMapAccountsURL
  getMapAccountsPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getMapAccountsURL, body, {
      headers: headers
    })
  }

  // allCrAndPaymentForIntervalURL
  allCrAndPaymentForIntervalPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.allCrAndPaymentForIntervalURL, body, {
      headers: headers
    })
  }

  // getAccountTransactionLogBYfuelDealerCustomMapIdByDateRangeURL
  getAccountTransactionLogBYfuelDealerCustomMapIdByDateRangePOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getAccountTransactionLogBYfuelDealerCustomMapIdByDateRangeURL, body, {
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

  // getAccessByPersonIdURL
  getAccessByPersonIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getAccessByPersonIdURL, body, {
      headers: headers
    })
  }

  // checkVehicleByfuelDealerIdURL
  checkVehicleByfuelDealerIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.checkVehicleByfuelDealerIdURL, body, {
      headers: headers
    })
  }

  // addFuelVehicleDetailsURL
  addFuelVehicleDetailsPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.addFuelVehicleDetailsURL, body, {
      headers: headers
    })
  }





}
