import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class StatsService {

    fuelDealerId: any;
    year: any;
    headerName1: any;
    product: any;


    setRouteForDSR(fuelDealerId: string, year: any, headerName1: any, product: any) {
        this.fuelDealerId = fuelDealerId;
        this.year = year;
        this.headerName1 = headerName1;
        this.product = product;
    }

    constructor(private http: HttpClient,
        private router: Router
    ) { }


    header: any;
    user: any;
    token: any = "";


    public baseURL = environment.apiUrl;


    ///// API path
    private getBranchByVeelsplusIdURL = this.baseURL + 'corporate/getBranchByVeelsplusId';
    private getAllBranchByVeelsplusIdURL = this.baseURL + 'corporate/getAllBranchByVeelsplusId';
    private getReportCorporateURL = this.baseURL + 'tripReports/getReportCorporate';
    private getAllAdminListURL = this.baseURL + 'tripReports/getAllAdminList';
    private getEntityIdListForFastagURL = this.baseURL + 'fastag/getEntityIdListForFastag';
    private getVehicleListForFastagURL = this.baseURL + 'fastag/getVehicleListForFastag';
    private getAllLQEntityURL = this.baseURL + 'fastag/getAllLQEntity ';
    private getAllLQVehicleURL = this.baseURL + 'fastag/getAllLQVehicle ';
    private dealerAddedCustomerReportURL = this.baseURL + 'adminDashboard/dealerAddedCustomerReport';
    private onboardFuelDealerReportByAdminURL = this.baseURL + 'tripReports/onboardFuelDealerReportByAdmin';
    private getSelfOnboardReportByAdminURL = this.baseURL + 'tripReports/getSelfOnboardReportByAdmin';
    private getReportOfActiveDealerURL = this.baseURL + 'tripReports/getReportOfActiveDealer';
    private getReportOfSelectedDateActiveDealerURL = this.baseURL + 'tripReports/getReportOfSelectedDateActiveDealer';
    private getReportOfPurchaseDealerMonthWiseURL = this.baseURL + 'tripReports/getReportOfPurchaseDealerMonthWise';
    private getCrSalesPaymentTxWiseURL = this.baseURL + 'tripReports/getCrSalesPaymentTxWise';
    private getTotalPurchaseReportURL = this.baseURL + 'tripReports/getTotalPurchaseReport';
    private getReportForCorporateCreditRequestURL = this.baseURL + 'fuelDealerCustMap/getReportForCorporateCreditRequest';
    private getTotalPaymentReportURL = this.baseURL + 'tripReports/getTotalPaymentReport';
    private getFastagVehicleDetailsByDateURL = this.baseURL + 'fastag/getFastagVehicleDetailsByDate';
    private getFTTransactionsURL = this.baseURL + 'fastag/getFTTransactions';
    private getFastagVehicleDetailsByVehicleNumberURL = this.baseURL + 'fastag/getFastagVehicleDetailsByVehicleNumber';
    private getFastagVehicleDetailsByDateLQURL = this.baseURL + 'fastag/getFastagVehicleDetailsByDateLQ';
    private getFTTransactionsLQURL = this.baseURL + 'fastag/getFTTransactionsLQ';
    private getFastagVehicleDetailsByVehicleNumberLQURL = this.baseURL + 'fastag/getFastagVehicleDetailsByVehicleNumberLQ';
    private getFuelVendorsListURL = this.baseURL + 'fuelVendor/getFuelVendorsList';
    private getFuelVendorsDetailsByIdURL = this.baseURL + 'fuelVendor/getFuelVendorsDetailsById';
    private getAllCreditAccByDealerIdURL = this.baseURL + 'fuelDealerCustMap/getAllCreditAccByDealerIdNEW';
    private getAllclapsCalculationByDealerIdURL = this.baseURL + 'fuelDealerCustMap/getAllclapsCalculationByDealerId';
    private getAllclapsCalculationByCorpIdURL = this.baseURL + 'fuelDealerCustMap/getAllclapsCalculationByCorpId';
    private getThisMonthCrDetailsURL = this.baseURL + 'dealerDashboard/getThisMonthCrDetails';
    private getPreviousOutstandingURL = this.baseURL + 'dealerDashboard/getPreviousOutstanding';
    private getFuelCreditRequestByfuelDealerIdURL = this.baseURL + 'fuelDealerCustMap/getFuelCreditRequestByfuelDealerId';
    private getAllCrwithoutDealerIdURL = this.baseURL + 'fuelDealerCustMap/getAllCrwithoutDealerId';
    private getAllCRPaymentByDealerURL = this.baseURL + 'accounttransaclog/getAllCRPaymentByDealer';
    private getFirstSixMonthPetrolPumpNameURL = this.baseURL + 'adminDashboard/getFirstSixMonthPetrolPumpName';
    private getLastSixMonthPetrolPumpNameURL = this.baseURL + 'adminDashboard/getLastSixMonthPetrolPumpName';
    private getFirstSixMonthCustomerNameURL = this.baseURL + 'adminDashboard/getFirstSixMonthCustomerName';
    private getLastSixMonthCustomerNameURL = this.baseURL + 'adminDashboard/getLastSixMonthCustomerName';
    private getDealerAndCustomerURL = this.baseURL + 'adminDashboard/getDealerAndCustomer';
    private getFirstSixMonthActivePumpNameURL = this.baseURL + 'adminDashboard/getFirstSixMonthActivePumpName';
    private getLastSixMonthActivePumpNameURL = this.baseURL + 'adminDashboard/getLastSixMonthActivePumpName';
    private getFirstSixMonthActiveCustomerNameURL = this.baseURL + 'adminDashboard/getFirstSixMonthActiveCustomerName';
    private getLastSixMonthActiveCustomerNameURL = this.baseURL + 'adminDashboard/getLastSixMonthActiveCustomerName';
    private showPumpNameURL = this.baseURL + 'adminDashboard/showPumpName';
    private showCustomerNameURL = this.baseURL + 'adminDashboard/showCustomerName';
    private showActivePumpNameURL = this.baseURL + 'adminDashboard/showActivePumpName';
    private showActiveCustomerURL = this.baseURL + 'adminDashboard/showActiveCustomer';
    private getDetailsByMobileURL = this.baseURL + 'activityCount/getDetailsByMobile';
    private updatePersonMobileURL = this.baseURL + 'activityCount/updatePersonMobile';
    private getDetailsByUpdateMobileLogURL = this.baseURL + 'activityCount/getDetailsByUpdateMobileLog';
    private addGSTDataURL = this.baseURL + 'activityCount/addGSTData';
    private getGSTDataURL = this.baseURL + 'activityCount/getGSTData';
    private updateGSTDataURL = this.baseURL + 'activityCount/updateGSTData';
    private deleteGSTDataURL = this.baseURL + 'activityCount/deleteGSTData';
    private getActivityCountURL = this.baseURL + 'activityCount/getActivityCount';
    private getCompanyNamesURL = this.baseURL + 'activityCount/getCompanyNames';
    private getAllActiveUserDetailsURL = this.baseURL + 'register/getAllActiveUserDetails';
    private getAllKitNoByPersonIdURL = this.baseURL + 'fastag/getAllKitNoByPersonId';
    private getAllEntityIdURL = this.baseURL + 'coinConversion/getAllEntityId';
    private getAllKitNoURL = this.baseURL + 'fastag/getAllKitNo';
    private getActiveUserDetailsByCorpIdURL = this.baseURL + 'register/getActiveUserDetailsByCorpId';
    private getCustomerByCustomerIdURL = this.baseURL + 'customer/getCustomerBycustomerId';
    private getBranchByphoneNumberUrl = this.baseURL + 'corporate/getBranchByphoneNumber';
    private updateCustomerURL = this.baseURL + 'customer/updateCustomer';
    private postUpdateressUrl = this.baseURL + 'person/updatePerson';
    private updateCorporateURL = this.baseURL + 'corporate/updateCorporateNEW';
    private postUpdateAddressUrl = this.baseURL + 'address/updateAddress';
    private addNewTicketURL = this.baseURL + 'serviceRequestTickets/addNewTicket';
    private findPhoneNumberURL = this.baseURL + 'register/findPhoneNumber';
    private getAllOilBrandProductNameCodeURL = this.baseURL + 'fuelVendor/getAllOilBrandProductNameCode'
    private getGeoLocationURL = this.baseURL + 'LoadReceipt/getGeoLocation';
    private getEntityIdAllLQURL = this.baseURL + 'fastag/getEntityIdAllLQ1';
    private getFastagTransactionsByDateURL = this.baseURL + 'fastag/getFastagTransactionsByDate';
    private deleteFastagURL = this.baseURL + 'fastag/deleteFastag';
    private getAllFastagTransactionsByDateURL = this.baseURL + 'fastag/getAllFastagTransactionsByDate';
    private getFastagTransactionsByDateLQURL = this.baseURL + 'fastag/getFastagTransactionsByDateLQ';
    private getAllFastagTransactionsLQByDateURL = this.baseURL + 'fastag/getAllFastagTransactionsLQByDate';
    private deleteFastagLQURL = this.baseURL + 'fastag/deleteFastagLQ';
    private getAllDealersListURL = this.baseURL + 'adminDashboard/getAllDealerList';
    private getDealerIDCorpIdURL = this.baseURL + 'adminDashboard/getDealerIDCorpId';
    private getFuelProductIdByDealerIdURL = this.baseURL + 'fuelPrice/getFuelProductIdByDealerId'
    private getCountUnAssignTagURL = this.baseURL + 'fuelVendor/getCountUnAssignTag'
    private getCountAssignTagByPersonIdURL = this.baseURL + 'fuelVendor/getCountAssignTagByPersonId'
    private getAllVeelsplusUserURL = this.baseURL + 'fuelVendor/getAllVeelsplusUser'
    private assignKitNumberToPersonIdURL = this.baseURL + 'fuelVendor/assignKitNumberToPersonId'
    private getFastagTransactionByDateURL = this.baseURL + 'fastag/getFastagTransactionByDate';
    private getFastagTransactionByDateLQURL = this.baseURL + 'fastag/getFastagTransactionByDateLQ';
    private getCreditDetailsByDealerIdURL = this.baseURL + 'dealerDashboard/getCreditDetailsByDealerId';
    private searchDealerByMobileURL = this.baseURL + 'fuelDealerCustMap/getDealerDetailsByDealerPhoneNumber';
    private getDealerOnboardReportByAdminURL = this.baseURL + 'tripReports/getDealerOnboardReportByAdmin';
    private getCustomizeURL = this.baseURL + 'customize/getCustomize';
    private addCustomizeURL = this.baseURL + 'customize/addCustomize';
    private searchCarrierByMobileURL = this.baseURL + 'fuelDealerCustMap/getCustomerIdBycorporatePhoneNumber';
    private getFlagStatusByCorpIdURL = this.baseURL + 'fuelDealerCustMap/getFlagStatusByCorpId';
    private getPriceByDealerProductIdByDateURL = this.baseURL + 'fuelPrice/getPriceByDealerProductIdByDate'; 
    private getfuelDealerIdByCorporateIdURL = this.baseURL + 'fuelDealerCustMap/getFuelDealerIdfromCorporateId';
    private addFuelPriceByDealerIdURL = this.baseURL + 'fuelPrice/addFuelPriceByDealerId';
    private getCorporatesAllMappedRequestByDealerURL = this.baseURL + 'fuelDealerCustMap/getCorporatesAllMappedRequestByDealer';
    private getCorporateInfoByfuelDealerCustomerMapIdURL = this.baseURL + 'fuelDealerCustMap/getCorporateInfoByfuelDealerCustomerMapId1';
    private getOutstandingByCustMapIdURL = this.baseURL + 'crCustomers/getOutstandingByCustMapId';
    private checkManualNumRangeForNotAssignURL = this.baseURL + 'fuelDealerCustMap/checkManualNumRangeForNotAssign';
    private getManualNumberURL = this.baseURL + 'fuelDealerCustMap/getManualNumber';
    private getfuelCreditVehicleByfuelDealerCustomerMapIdURL = this.baseURL + 'fuelVehicleDetails/getfuelCreditVehicleByfuelDealerCustomerMapId';
    private VehicleByRegistrationNumberURL = this.baseURL + 'vehicle/searchVehicleByRegistrationNumber';
    private getFuelStaffIdByfuelDealerIdURL = this.baseURL + 'fuelStaff/getFuelStaffIdByfuelDealerId'; 
    private addCreditReqByDealerForAllURL = this.baseURL + 'fuelDealerCustMap/addCreditReqByDealerForAll';
    private sendReqForNewCustomerURL = this.baseURL + 'fuelDealerCustMap/sendReqForNewCustomer';
    private checkCustomerPreviousOutstandingIsAddedOrNotURL = this.baseURL + "fuelCreditInvoice/checkCustomerPreviousOutstandingIsAddedOrNot";
    private updatePreviousOutstandingURL = this.baseURL + 'fuelDealerCustMap/updatePreviousOutstanding';
    private checkVehicleByfuelDealerIdURL = this.baseURL + 'fuelVehicleDetails/checkVehicleByfuelDealerId';
    private addFuelVehicleDetailsURL = this.baseURL + 'fuelVehicleDetails/addFuelVehicleDetails';
    private userRegisterURL = this.baseURL + 'register/userRegister';
    private postAddressUrl = this.baseURL + 'address/addAddress';
    private PostCustomer = this.baseURL + 'customer/addCustomer';
    private addkycURL = this.baseURL + 'kyc/addKYC';
    private addCorporateUrl = this.baseURL + 'corporate/addCorporate';
    private getCorporateByIdUrl = this.baseURL + 'corporate/getCorporateById';
    private updateVeelsPlusCorporateIdwithPermURL = this.baseURL + 'register/updateVeelsPlusCorporateIdwithPerm';
    private addNewCustDealerReqURL = this.baseURL + 'fuelDealerCustMap/addNewCustDealerReq';
    private addReferralURL = this.baseURL + 'referral/addReferral'; 
    private getAccessByPersonIdURL = this.baseURL + 'userAccess/getAccessByPersonId';
    private requestForLiteToPrimeURL = this.baseURL + 'fuelVendor/requestForLiteToPrime';
    private getReqInfoByPersonIdURL = this.baseURL + 'fuelVendor/getReqInfoByPersonId';
    private getTransporterDetailsURL = this.baseURL + 'userAccess/getTransporterDetails';
    private getFastagCorporateByCustmerIdURL = this.baseURL + 'fastag/getFastagCorporateByCustmerId';
    private fuelDealerRegisterURL = this.baseURL + 'fuelVendor/fuelDealerRegister'; 
    private getCreditSalesDetailsByDealerIdURL = this.baseURL + 'dealerDashboard/getCreditSalesDetailsByDealerId'; 
    private getCreditPaymentDetailsByDealerIdURL = this.baseURL + 'dealerDashboard/getCreditPaymentDetailsByDealerId';
    private getCreditOsByDealerIdURL = this.baseURL + 'dealerDashboard/getCreditOsByDealerId';
    private getPersonByPhoneURL = this.baseURL + 'person/getPersonByPhone';
    private sendOTPEmailURL = this.baseURL + 'person/sendOTPEmail'; 
    private checkOTPEmailURL = this.baseURL + 'person/checkOTPEmail';







    setHeader() {
        this.token = JSON.parse(localStorage.getItem('authenticationToken') || '{}');

    }



    //////API Functions
    // getBranchByVeelsplusIdURL
    getBranchVeelsplusId(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getBranchByVeelsplusIdURL, body, {
            headers: headers
        })
    }

    // getAllBranchByVeelsplusIdURL
    getAllBranchVeelsplusId(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllBranchByVeelsplusIdURL, body, {
            headers: headers
        })
    }

    // getReportCorporateURL
    getReportCorporate(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getReportCorporateURL, body, {
            headers: headers
        })
    }

    // getAllAdminListURL
    getAllAdminList(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllAdminListURL, body, {
            headers: headers
        })
    }

    // getEntityIdListForFastagURL
    getEntityIdListForFastagPOST(): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.get(this.getEntityIdListForFastagURL, {
            headers: headers
        })
    }

    // getVehicleListForFastagURL
    getVehicleListForFastagPOST(): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.get(this.getVehicleListForFastagURL, {
            headers: headers
        })
    }

    // getAllLQEntityURL
    getAllLQEntityPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllLQEntityURL, body, {
            headers: headers
        })
    }

    // getAllLQVehicleURL
    getAllLQVehiclePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllLQVehicleURL, body, {
            headers: headers
        })
    }

    // dealerAddedCustomerReportURL
    dealerAddedCustomerReportPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.dealerAddedCustomerReportURL, body, {
            headers: headers
        })
    }

    // onboardFuelDealerReportByAdminURL
    onboardFuelDealerReportByAdminPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.onboardFuelDealerReportByAdminURL, body, {
            headers: headers
        })
    }

    // getSelfOnboardReportByAdminURL
    getSelfOnboardReportByAdminPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getSelfOnboardReportByAdminURL, body, {
            headers: headers
        })
    }

    // getReportOfActiveDealerURL
    getReportOfActiveDealerPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getReportOfActiveDealerURL, body, {
            headers: headers
        })
    }

    // getReportOfSelectedDateActiveDealerURL
    getReportOfSelectedDateActiveDealerPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getReportOfSelectedDateActiveDealerURL, body, {
            headers: headers
        })
    }

    // getReportOfPurchaseDealerMonthWiseURL
    getReportOfPurchaseDealerMonthWisePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getReportOfPurchaseDealerMonthWiseURL, body, {
            headers: headers
        })
    }

    // getCrSalesPaymentTxWiseURL
    getCrSalesPaymentTxWisePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCrSalesPaymentTxWiseURL, body, {
            headers: headers
        })
    }

    // getTotalPurchaseReportURL
    getTotalPurchaseReport(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTotalPurchaseReportURL, body, {
            headers: headers
        })
    }

    // getReportForCorporateCreditRequestURL
    getReportForCorporateCreditRequestPost(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getReportForCorporateCreditRequestURL, body, {
            headers: headers
        })
    }

    // getTotalPaymentReportURL
    getTotalPaymentReport(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTotalPaymentReportURL, body, {
            headers: headers
        })
    }

    // getFastagVehicleDetailsByDateURL
    getFastagVehicleDetailsByDatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFastagVehicleDetailsByDateURL, body, {
            headers: headers
        })
    }

    // getFTTransactionsURL
    getFTTransactionsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFTTransactionsURL, body, {
            headers: headers
        })
    }

    // getFastagVehicleDetailsByVehicleNumberURL
    getFastagVehicleDetailsByVehicleNumberPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFastagVehicleDetailsByVehicleNumberURL, body, {
            headers: headers
        })
    }

    // getFastagVehicleDetailsByDateLQURL
    getFastagVehicleDetailsByDateLQPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFastagVehicleDetailsByDateLQURL, body, {
            headers: headers
        })
    }

    // getFTTransactionsLQURL
    getFTTransactionsLQPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFTTransactionsLQURL, body, {
            headers: headers
        })
    }

    // getFastagVehicleDetailsByVehicleNumberLQURL
    getFastagVehicleDetailsByVehicleNumberLQPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFastagVehicleDetailsByVehicleNumberLQURL, body, {
            headers: headers
        })
    }

    // getFuelVendorsListURL
    getFuelVendorsList(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelVendorsListURL, body, {
            headers: headers
        })
    }

    // getFuelVendorsDetailsByIdURL
    getFuelVendorsDetailsById(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelVendorsDetailsByIdURL, body, {
            headers: headers
        })
    }

    // getAllCreditAccByDealerIdURL
    getAllCreditAccByDealerId(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllCreditAccByDealerIdURL, body, {
            headers: headers
        })
    }

    // getAllclapsCalculationByDealerIdURL
    getAllclapsCalculationByDealerIdPost(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllclapsCalculationByDealerIdURL, body, {
            headers: headers
        })
    }

    // getAllclapsCalculationByCorpIdURL
    getAllclapsCalculationByCorpIdPost(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllclapsCalculationByCorpIdURL, body, {
            headers: headers
        })
    }

    // getThisMonthCrDetailsURL
    getThisMonthCrDetails(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getThisMonthCrDetailsURL, body, {
            headers: headers
        })
    }

    // getPreviousOutstandingURL
    getPreviousOutstanding(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getPreviousOutstandingURL, body, {
            headers: headers
        })
    }

    // getFuelCreditRequestByfuelDealerIdURL
    getFuelCreditRequestByfuelDealerId(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelCreditRequestByfuelDealerIdURL, body, {
            headers: headers
        })
    }

    // getAllCrwithoutDealerIdURL
    getAllCrwithoutDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllCrwithoutDealerIdURL, body, {
            headers: headers
        })
    }

    // getAllCRPaymentByDealerURL
    getAllCRPaymentByDealer(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllCRPaymentByDealerURL, body, {
            headers: headers
        })
    }

    // getFirstSixMonthPetrolPumpNameURL
    getFirstSixMonthPetrolPumpNamePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFirstSixMonthPetrolPumpNameURL, body, {
            headers: headers
        })
    }

    // getLastSixMonthPetrolPumpNameURL
    getLastSixMonthPetrolPumpNamePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getLastSixMonthPetrolPumpNameURL, body, {
            headers: headers
        })
    }

    // getFirstSixMonthCustomerNameURL
    getFirstSixMonthCustomerNamePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFirstSixMonthCustomerNameURL, body, {
            headers: headers
        })
    }

    // getLastSixMonthCustomerNameURL
    getLastSixMonthCustomerNamePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getLastSixMonthCustomerNameURL, body, {
            headers: headers
        })
    }

    // getDealerAndCustomerURL
    getDealerAndCustomerPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getDealerAndCustomerURL, body, {
            headers: headers
        })
    }

    // getFirstSixMonthActivePumpNameURL
    getFirstSixMonthActivePumpNamePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFirstSixMonthActivePumpNameURL, body, {
            headers: headers
        })
    }

    // getLastSixMonthActivePumpNameURL
    getLastSixMonthActivePumpNamePost(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getLastSixMonthActivePumpNameURL, body, {
            headers: headers
        })
    }

    // getFirstSixMonthActiveCustomerNameURL
    getFirstSixMonthActiveCustomerNamePost(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFirstSixMonthActiveCustomerNameURL, body, {
            headers: headers
        })
    }

    // getLastSixMonthActiveCustomerNameURL
    getLastSixMonthActiveCustomerNamePost(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getLastSixMonthActiveCustomerNameURL, body, {
            headers: headers
        })
    }

    // showPumpNameURL
    showPumpNameURLPost(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.showPumpNameURL, body, {
            headers: headers
        })
    }

    // showCustomerNameURL
    showCustomerNamePost(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.showCustomerNameURL, body, {
            headers: headers
        })
    }

    // showActivePumpNameURL
    showActivePumpNamePost(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.showActivePumpNameURL, body, {
            headers: headers
        })
    }

    // showActiveCustomerURL
    showActiveCustomerPost(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.showActiveCustomerURL, body, {
            headers: headers
        })
    }

    // getDetailsByMobileURL
    getDetailsByMobilePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getDetailsByMobileURL, body, {
            headers: headers
        })
    }

    // updatePersonMobileURL
    updatePersonMobilePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updatePersonMobileURL, body, {
            headers: headers
        })
    }

    // getDetailsByUpdateMobileLogURL
    getDetailsByUpdateMobileLogPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getDetailsByUpdateMobileLogURL, body, {
            headers: headers
        })
    }

    // addGSTDataURL
    addGSTDataPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addGSTDataURL, body, {
            headers: headers
        })
    }

    // getGSTDataURL
    getGSTDataPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getGSTDataURL, body, {
            headers: headers
        })
    }

    // updateGSTDataURL
    updateGSTDataPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateGSTDataURL, body, {
            headers: headers
        })
    }

    // deleteGSTDataURL
    deleteGSTDataPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.deleteGSTDataURL, body, {
            headers: headers
        })
    }

    // getActivityCountURL
    getActivityCountPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getActivityCountURL, body, {
            headers: headers
        })
    }

    // getCompanyNamesURL
    getCompanyNamesPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCompanyNamesURL, body, {
            headers: headers
        })
    }

    // getAllActiveUserDetailsURL
    getAllActiveUserDetailsPost(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllActiveUserDetailsURL, body, {
            headers: headers
        })
    }

    // getAllKitNoByPersonIdURL
    getAllKitNoByPersonIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllKitNoByPersonIdURL, body, {
            headers: headers
        })
    }

    // getAllEntityIdURL
    getAllEntityIdPost(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllEntityIdURL, body, {
            headers: headers
        })
    }

    // getAllKitNoURL
    getAllKitNoURLPost(): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.get(this.getAllKitNoURL, {
            headers: headers
        })
    }

    // getActiveUserDetailsByCorpIdURL
    getActiveUserDetailsByCorpIdPost(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getActiveUserDetailsByCorpIdURL, body, {
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

    // getBranchByphoneNumberUrl
    getBranchByphoneNumberPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getBranchByphoneNumberUrl, body, {
            headers: headers
        })
    }

    // updateCustomerURL
    updateCustomerPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateCustomerURL, body, {
            headers: headers
        })
    }

    // postUpdateressUrl
    updatePerson(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.postUpdateressUrl, body, {
            headers: headers
        })
    }

    // updateCorporateURL
    updateCorporatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateCorporateURL, body, {
            headers: headers
        })
    }

    // postUpdateAddressUrl
    postUpdateAddressPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.postUpdateAddressUrl, body, {
            headers: headers
        })
    }

    // addNewTicketURL
    addNewTicketPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addNewTicketURL, body, {
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

    // getAllOilBrandProductNameCodeURL
    getAllOilBrandProductNameCodePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.get(this.getAllOilBrandProductNameCodeURL, {
            headers: headers
        })
    }

    // getGeoLocationURL
    getGeoLocationPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getGeoLocationURL, {
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

    //getFastagTransactionsByDateURL
    getFastagTransactionsByDatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFastagTransactionsByDateURL, body, {
            headers: headers
        })
    }

    //deleteFastagURL
    deleteFastagPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.deleteFastagURL, body, {
            headers: headers
        })
    }

    //getAllFastagTransactionsByDateURL
    getAllFastagTransactionsByDatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllFastagTransactionsByDateURL, body, {
            headers: headers
        })
    }

    //getFastagTransactionsByDateLQURL
    getFastagTransactionsByDateLQPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFastagTransactionsByDateLQURL, body, {
            headers: headers
        })
    }

    //getAllFastagTransactionsLQByDateURL
    getAllFastagTransactionsLQByDatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllFastagTransactionsLQByDateURL, body, {
            headers: headers
        })
    }

    //deleteFastagLQURL
    deleteFastagLQPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.deleteFastagLQURL, body, {
            headers: headers
        })
    }

    // getAllDealersListURL
    getAllDealersListPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.get(this.getAllDealersListURL, {
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

    // getFuelProductIdByDealerIdURL
    getFuelProductIdByDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelProductIdByDealerIdURL, body, {
            headers: headers
        })
    }

    // getCountUnAssignTagURL
    getCountUnAssignTagPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCountUnAssignTagURL, body, {
            headers: headers
        })
    }

    // getCountAssignTagByPersonIdURL
    getCountAssignTagByPersonIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCountAssignTagByPersonIdURL, body, {
            headers: headers
        })
    }

    // getAllVeelsplusUserURL
    getAllVeelsplusUserPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllVeelsplusUserURL, body, {
            headers: headers
        })
    }

    // assignKitNumberToPersonIdURL
    assignKitNumberToPersonIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.assignKitNumberToPersonIdURL, body, {
            headers: headers
        })
    }

    // getFastagTransactionByDateURL
    getFastagTransactionByDatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFastagTransactionByDateURL, body, {
            headers: headers
        })
    }

    // getFastagTransactionByDateLQURL
    getFastagTransactionByDateLQPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFastagTransactionByDateLQURL, body, {
            headers: headers
        })
    }

    // getCreditDetailsByDealerIdURL
    getCreditDetailsByDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCreditDetailsByDealerIdURL, body, {
            headers: headers
        })
    }

    // searchDealerByMobileURL
    searchDealerByMobilePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.searchDealerByMobileURL, body, {
            headers: headers
        })
    }

    // getDealerOnboardReportByAdminURL
    getDealerOnboardReportByAdminPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getDealerOnboardReportByAdminURL, body, {
            headers: headers
        })
    }

    // getCustomizeURL
    getCustomizePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCustomizeURL, body, {
            headers: headers
        })
    }

    // addCustomizeURL
    addCustomizePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addCustomizeURL, body, {
            headers: headers
        })
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


    // getFlagStatusByCorpIdURL
    getFlagStatusByCorpIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFlagStatusByCorpIdURL, body, {
            headers: headers
        })
    }

    // getPriceByDealerProductIdByDateURL
    getPriceByDealerProductIdByDatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getPriceByDealerProductIdByDateURL, body, {
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

    // addFuelPriceByDealerIdURL
    addFuelPriceByDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addFuelPriceByDealerIdURL, body, {
            headers: headers
        })
    }

    // getCorporatesAllMappedRequestByDealerURL
    getCorporatesAllMappedRequestByDealerPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCorporatesAllMappedRequestByDealerURL, body, {
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

    // getOutstandingByCustMapIdURL
    getOutstandingByCustMapIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getOutstandingByCustMapIdURL, body, {
            headers: headers
        })
    }

    // checkManualNumRangeForNotAssignURL
    checkManualNumRangeForNotAssignPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.checkManualNumRangeForNotAssignURL, body, {
            headers: headers
        })
    }

    // getManualNumberURL
    getManualNumberPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getManualNumberURL, body, {
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

    // VehicleByRegistrationNumberURL
    VehicleByRegistrationNumberPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.VehicleByRegistrationNumberURL, body, {
            headers: headers
        })
    }

    // getFuelStaffIdByfuelDealerIdURL
    getFuelStaffIdByfuelDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelStaffIdByfuelDealerIdURL, body, {
            headers: headers
        })
    }

    // addCreditReqByDealerForAllURL
    addCreditReqByDealerForAllPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addCreditReqByDealerForAllURL, body, {
            headers: headers
        })
    }

    // sendReqForNewCustomerURL
    sendReqForNewCustomerPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.sendReqForNewCustomerURL, body, {
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

    // updatePreviousOutstandingURL
    updatePreviousOutstandingPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updatePreviousOutstandingURL, body, {
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

    // userRegisterURL
    userRegisterPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.userRegisterURL, body, {
            headers: headers
        })
    }

    // postAddressUrl
    addAddressPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.postAddressUrl, body, {
            headers: headers
        })
    }

    // PostCustomer
    addCustomerPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.PostCustomer, body, {
            headers: headers
        })
    }

    // addkycURL
    addkycPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addkycURL, body, {
            headers: headers
        })
    }

    // addCorporateUrl
    addCorporatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addCorporateUrl, body, {
            headers: headers
        })
    }

    // getCorporateByIdUrl
    getCorporateByIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCorporateByIdUrl, body, {
            headers: headers
        })
    }

    // updateVeelsPlusCorporateIdwithPermURL
    updateVeelsPlusCorporateIdwithPermPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateVeelsPlusCorporateIdwithPermURL, body, {
            headers: headers
        })
    }

    // addNewCustDealerReqURL
    addNewCustDealerReqPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addNewCustDealerReqURL, body, {
            headers: headers
        })
    }

    // addReferralURL
    addReferralPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addReferralURL, body, {
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

    // requestForLiteToPrimeURL
    requestForLiteToPrimePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.requestForLiteToPrimeURL, body, {
            headers: headers
        })
    }

    // getReqInfoByPersonIdURL
    getReqInfoByPersonIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getReqInfoByPersonIdURL, body, {
            headers: headers
        })
    }

    // getTransporterDetailsURL
    getTransporterDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTransporterDetailsURL, body, {
            headers: headers
        })
    }

    // getFastagCorporateByCustmerIdURL
    getFastagCorporateByCustmerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFastagCorporateByCustmerIdURL, body, {
            headers: headers
        })
    }

    // fuelDealerRegisterURL
    fuelDealerRegister(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.fuelDealerRegisterURL, body, {
            headers: headers
        })
    }

    // getCreditSalesDetailsByDealerIdURL
    getCreditSalesDetailsByDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCreditSalesDetailsByDealerIdURL, body, {
            headers: headers
        })
    }

    // getCreditPaymentDetailsByDealerIdURL
    getCreditPaymentDetailsByDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCreditPaymentDetailsByDealerIdURL, body, {
            headers: headers
        })
    }

    // getCreditOsByDealerIdURL
    getCreditOsByDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCreditOsByDealerIdURL, body, {
            headers: headers
        })
    }

    // getPersonByPhoneURL
    getPersonByPhonePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getPersonByPhoneURL, body, {
            headers: headers
        })
    }

    // sendOTPEmailURL
    sendOTPEmailPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.sendOTPEmailURL, body, {
            headers: headers
        })
    }

    // checkOTPEmailURL
    checkOTPEmailPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.checkOTPEmailURL, body, {
            headers: headers
        })
    }

}
