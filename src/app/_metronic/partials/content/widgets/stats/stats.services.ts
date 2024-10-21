import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class StatsService {


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







    setHeader() {
        this.token = JSON.parse(localStorage.getItem('authenticationToken') || '{}');
        console.log("AuthTolen", this.token)
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











}
