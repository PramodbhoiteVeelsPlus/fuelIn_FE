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
    private onboardFuelDealerReportByAdminURL = this.baseURL + 'tripReports/onboardFuelDealerReportByAdmin'
    private getSelfOnboardReportByAdminURL = this.baseURL + 'tripReports/getSelfOnboardReportByAdmin'
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










}
