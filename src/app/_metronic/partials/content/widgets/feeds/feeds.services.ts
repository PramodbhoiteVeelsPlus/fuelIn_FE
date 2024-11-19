import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class FeedsService {

    constructor(private http: HttpClient,
        private router: Router
    ) { }


    header: any;
    user: any;
    token: any = "";


    public baseURL = environment.apiUrl;


    ///// API path
    private getBankDetailsByDealerIdURL = this.baseURL + 'bankDetails/getBankDetailsByDealerId';
    private getOpeningBalanceURL = this.baseURL + 'overallReport/getOpeningBalance';
    private getReportDataURL = this.baseURL + 'overallReport/getReportData';
    private getDigitalTotalByDateURL = this.baseURL + 'shiftList/getDigitalTotalByDate';
    private getFuelCreditPaymentByDateURL = this.baseURL + 'shiftList/getFuelCreditPaymentByDate';
    private getExpenseDetailsURL = this.baseURL + 'overallReport/getExpenseDetails';
    private getDSRVariationByDateURL = this.baseURL + 'dsrDetails/getDSRVariationByDate';
    private getMETERSALESTotalDSRURL = this.baseURL + 'shiftList/getMETERSALESTotalDSR';
    private getProductWiseDSRURL = this.baseURL + 'shiftList/getProductWiseDSR';
    private getFuelCreditByDateURL = this.baseURL + 'shiftList/getFuelCreditByDate';
    private getDigitalTotalByMonthURL = this.baseURL + 'overallReport/getDigitalTotalByMonth';
    private getMETERSALESTotalDSRByMonthURL = this.baseURL + 'overallReport/getMETERSALESTotalDSRByMonth';
    private getFuelCreditPaymentDetailsURL = this.baseURL + 'overallReport/getFuelCreditPaymentDetails';
    private getShiftVStallyByMonthURL = this.baseURL + 'overallReport/getShiftVStallyByMonth';
    private getTotalCreditSalesByMonthURL = this.baseURL + 'overallReport/getTotalCreditSalesByMonth';
    private getExpenseAmtDetailsURL = this.baseURL + 'overallReport/getExpenseAmtDetails';
    private getBankACwiseDetailsURL = this.baseURL + 'overallReport/getBankACwiseDetails';
    private getFuelProductIdByDealerIdURL = this.baseURL + 'fuelPrice/getFuelProductIdByDealerId';
    private getAllProductPurchaseURL = this.baseURL + 'dsrDetails/getAllProductPurchase';
    private getFinancialYearWiseVATBookURL = this.baseURL + 'dsrDetails/getFinancialYearWiseVATBook';
    private getAllProfitReportURL = this.baseURL + 'profitReport/getAllProfitReport';
    private getProfitReportDetailsURL = this.baseURL + 'profitReport/getProfitReportDetails';
    private getProfitReportInDetailURL = this.baseURL + 'profitReport/getProfitReportInDetail';
    private getMonthlyVaritionByMonthURL = this.baseURL + 'profitReport/getMonthlyVaritionByMonth';
    private getDailyReportsByDealerIdURL = this.baseURL + 'dailyProfitReport/getDailyReportsByDealerId';
    private getCreditSalesURL = this.baseURL + 'dailyProfitReport/getCreditSales';
    private getFuelCreditRequestCorporateByfuelDealerIdURL = this.baseURL + 'fuelDealerCustMap/getFuelCreditRequestCorporateByfuelDealerId';
    private getFuelCreditRequestByfuelDealerIdURL = this.baseURL + 'fuelDealerCustMap/getFuelCreditRequestByfuelDealerId';
    private getSalesPurchaseReportByDealerURL = this.baseURL + 'tripReports/getSalesPurchaseReportByDealer';
    // private = this.baseURL + '';
    // private = this.baseURL + '';
    // private = this.baseURL + '';
    // private = this.baseURL + '';
    // private = this.baseURL + '';
    // private = this.baseURL + '';
    // private = this.baseURL + '';
    // private = this.baseURL + '';
    // private = this.baseURL + '';
    // private = this.baseURL + '';
    // private = this.baseURL + '';
    // private = this.baseURL + '';







    setHeader() {
        this.token = JSON.parse(localStorage.getItem('authenticationToken') || '{}');

    }



    //////API Functions
    // getBankDetailsByDealerIdURL
    getBankDetailsByDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getBankDetailsByDealerIdURL, body, {
            headers: headers
        })
    }

    // getOpeningBalanceURL
    getOpeningBalancePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getOpeningBalanceURL, body, {
            headers: headers
        })
    }

    // getReportDataURL
    getReportDataPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getReportDataURL, body, {
            headers: headers
        })
    }

    // getDigitalTotalByDateURL
    getDigitalTotalByDatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getDigitalTotalByDateURL, body, {
            headers: headers
        })
    }

    // getFuelCreditPaymentByDateURL
    getFuelCreditPaymentByDatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelCreditPaymentByDateURL, body, {
            headers: headers
        })
    }

    // getExpenseDetailsURL
    getExpenseDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getExpenseDetailsURL, body, {
            headers: headers
        })
    }

    // getDSRVariationByDateURL
    getDSRVariationByDatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getDSRVariationByDateURL, body, {
            headers: headers
        })
    }

    // getMETERSALESTotalDSRURL
    getMETERSALESTotalDSRPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getMETERSALESTotalDSRURL, body, {
            headers: headers
        })
    }

    // getProductWiseDSRURL
    getProductWiseDSRPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getProductWiseDSRURL, body, {
            headers: headers
        })
    }

    // getFuelCreditByDateURL
    getFuelCreditByDatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelCreditByDateURL, body, {
            headers: headers
        })
    }

    // getDigitalTotalByMonthURL
    getDigitalTotalByMonthPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getDigitalTotalByMonthURL, body, {
            headers: headers
        })
    }

    // getMETERSALESTotalDSRByMonthURL
    getMETERSALESTotalDSRByMonthPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getMETERSALESTotalDSRByMonthURL, body, {
            headers: headers
        })
    }

    // getFuelCreditPaymentDetailsURL
    getFuelCreditPaymentDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelCreditPaymentDetailsURL, body, {
            headers: headers
        })
    }

    // getShiftVStallyByMonthURL
    getShiftVStallyByMonthPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getShiftVStallyByMonthURL, body, {
            headers: headers
        })
    }

    // getTotalCreditSalesByMonthURL
    getTotalCreditSalesByMonthPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTotalCreditSalesByMonthURL, body, {
            headers: headers
        })
    }

    // getExpenseAmtDetailsURL
    getExpenseAmtDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getExpenseAmtDetailsURL, body, {
            headers: headers
        })
    }

    // getBankACwiseDetailsURL
    getBankACwiseDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getBankACwiseDetailsURL, body, {
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

    // getAllProductPurchaseURL
    getAllProductPurchasePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllProductPurchaseURL, body, {
            headers: headers
        })
    }

    // getFinancialYearWiseVATBookURL
    getFinancialYearWiseVATBookPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFinancialYearWiseVATBookURL, body, {
            headers: headers
        })
    }

    // getAllProfitReportURL
    getAllProfitReportPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllProfitReportURL, body, {
            headers: headers
        })
    }

    // getProfitReportDetailsURL
    getProfitReportDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getProfitReportDetailsURL, body, {
            headers: headers
        })
    }

    // getProfitReportInDetailURL
    getProfitReportInDetailPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getProfitReportInDetailURL, body, {
            headers: headers
        })
    }

    // getMonthlyVaritionByMonthURL
    getMonthlyVaritionByMonthPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getMonthlyVaritionByMonthURL, body, {
            headers: headers
        })
    }

    // getDailyReportsByDealerIdURL
    getDailyReportsByDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getDailyReportsByDealerIdURL, body, {
            headers: headers
        })
    }

    // getCreditSalesURL
    getCreditSalesPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCreditSalesURL, body, {
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

    // getSalesPurchaseReportByDealerURL
    getSalesPurchaseReportByDealerPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getSalesPurchaseReportByDealerURL, body, {
            headers: headers
        })
    }









}
