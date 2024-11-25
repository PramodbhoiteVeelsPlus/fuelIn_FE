import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class ListWidgetService {
    type1: string;
    cashBillId: any;
    date: any;

    addCreditLubeReqByDealerForTaxPost(data: { lubeAllData: any; lubricantsFuelDealerCustomerMapId: any; reqQuantity: any; reqCreditAmount: any; estimatedRefuelDate: string; fuelDealerId: any; lubricantsFuelCorporateId: any; creditSource: string; PANno: any; lubricantsTransDateTime: string; lubricantsTransactionTime: string; creditAmount: any; transactionStatus: string; fuelDealerStaffId: any; actualCreditQuantity: any; createdAt: string; productRate: string | null | undefined; vehicleNumber: any; manualCrNumber: any; personId: any; managerVPPersonId: any; managerPersonId: any; managerName: any; }) {
        throw new Error('Method not implemented.');
    }

    constructor(private http: HttpClient,
        private router: Router
    ) { }


    header: any;
    user: any;
    token: any = "";


    public baseURL = environment.apiUrl;


    ///// API path

    private getTopFiveAccByFuelDealerIdURL = this.baseURL + 'crCustomers/getTopFiveAccByFuelDealerId';
    private updateCompanyGSTURL = this.baseURL + 'fuelDealerCustMap/updateCompanyGST';
    private addCreditLubeReqByDealerForTaxURL = this.baseURL + 'fuelLube/addCreditLubeReqByDealerForTax';
    private updateLastCRDateByMapIdURL = this.baseURL + 'fuelVendor/updateLastCRDateByMapId';
    private getLubeTaxDetailsByDealerIdURL = this.baseURL + 'fuelLube/getLubeTaxDetailsByDealerId';
    private comparePasswordURL = this.baseURL + 'fuelCreditInvoice/comparePassword';
    private cancelFuelCreditReqURL = this.baseURL + 'fuelDealerCustMap/cancelFuelCreditReq';
    private getCashBillURL = this.baseURL + 'cashBillInvoice/getCashBill';
    private getCustomerByCustomerIdURL = this.baseURL + 'customer/getCustomerBycustomerId';
    private getLubeTaxBillURL = this.baseURL + 'fuelLube/getLubeTaxBill';
    private getShiftOngoingDetailsByDealerIdURL = this.baseURL + 'shiftList/getShiftOngoingDetailsByDealerId';
    private getShiftDetailsByShiftIdURL = this.baseURL + 'shiftList/getShiftDetailsByShiftId';
    private checkOperatorShiftURL = this.baseURL + 'shiftList/checkOperatorShift';
    private getOperatorVPIdURL = this.baseURL + 'shiftList/getOperatorVPId';
    private startShiftFromPORATALURL = this.baseURL + 'shiftList/startShiftFromPORATAL';
    private getInfraDetailsByShiftIdURL = this.baseURL + 'shiftList/getInfraDetailsByShiftId';
    private closeShiftFromPORTALURL = this.baseURL + 'shiftList/closeShiftFromPORTAL';
    private getAllAttendantsByDidURL = this.baseURL + 'tripReports/getAllAttendantsByDid';
    private getFuelShiftTimeDetailsURL = this.baseURL + 'fuelShiftTime/getFuelShiftTimeDetails';
    private deleteShiftByShiftIdURL = this.baseURL + 'shiftList/deleteShiftByShiftId';
    private getMETERSALESTotalDSRURL = this.baseURL + 'shiftList/getMETERSALESTotalDSR';
    private getShiftVStallyByDateURL = this.baseURL + 'shiftList/getShiftVStallyByDate';
    private getShiftWiseBookDetailsURL = this.baseURL + 'shiftBook/getShiftWiseBookDetails';
    private getProductWiseDSRURL = this.baseURL + 'shiftList/getProductWiseDSR';
    private getDigitalTotalByDateURL = this.baseURL + 'shiftList/getDigitalTotalByDate';
    private getTotalCreditSalesPaymentByDayURL = this.baseURL + 'shiftList/getTotalCreditSalesPaymentByDay';
    private getFuelCreditByDateURL = this.baseURL + 'shiftList/getFuelCreditByDate';
    private getFuelCreditPaymentByDateURL = this.baseURL + 'shiftList/getFuelCreditPaymentByDate';







    setHeader() {
        this.token = JSON.parse(localStorage.getItem('authenticationToken') || '{}');

    }



    //////API Functions
    // getTopFiveAccByFuelDealerId
    getTopFiveAccByFuelDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTopFiveAccByFuelDealerIdURL, body, {
            headers: headers
        })
    }

    // updateCompanyGSTURL
    updateCompanyGSTPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateCompanyGSTURL, body, {
            headers: headers
        })
    }

    // addCreditLubeReqByDealerForTaxURL
    addCreditLubeReqByDealerForTaxPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addCreditLubeReqByDealerForTaxURL, body, {
            headers: headers
        })
    }

    // updateLastCRDateByMapIdURL
    updateLastCRDateByMapIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateLastCRDateByMapIdURL, body, {
            headers: headers
        })
    }

    // getLubeTaxDetailsByDealerIdURL
    getLubeTaxDetailsByDealerId(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getLubeTaxDetailsByDealerIdURL, body, {
            headers: headers
        })
    }

    // comparePasswordURL
    comparePasswordPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.comparePasswordURL, body, {
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

    setRoutingWithType1(type1: string, cashBillId: any) {
        this.type1 = type1;
        this.cashBillId = cashBillId;
    }

    setRouting(date: any) {
        this.date = date;
        console.log("set", this.date)
    }

    // getCashBillURL
    getCashBillPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCashBillURL, body, {
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

    // getLubeTaxBillURL
    getLubeTaxBillPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getLubeTaxBillURL, body, {
            headers: headers
        })
    }

    // getShiftOngoingDetailsByDealerIdURL
    getShiftOngoingDetailsByDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getShiftOngoingDetailsByDealerIdURL, body, {
            headers: headers
        })
    }

    // getShiftDetailsByShiftIdURL
    getShiftDetailsByShiftIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getShiftDetailsByShiftIdURL, body, {
            headers: headers
        })
    }

    // checkOperatorShiftURL
    checkOperatorShiftPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.checkOperatorShiftURL, body, {
            headers: headers
        })
    }

    // getOperatorVPIdURL
    getOperatorVPIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getOperatorVPIdURL, body, {
            headers: headers
        })
    }

    // startShiftFromPORATALURL
    startShiftFromPORATALPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.startShiftFromPORATALURL, body, {
            headers: headers
        })
    }

    // getInfraDetailsByShiftIdURL
    getInfraDetailsByShiftIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getInfraDetailsByShiftIdURL, body, {
            headers: headers
        })
    }

    // closeShiftFromPORTALURL
    closeShiftFromPORTALPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.closeShiftFromPORTALURL, body, {
            headers: headers
        })
    }

    // getAllAttendantsByDidURL
    getAllAttendantsByDidPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllAttendantsByDidURL, body, {
            headers: headers
        })
    }

    // getFuelShiftTimeDetailsURL
    getFuelShiftTimeDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelShiftTimeDetailsURL, body, {
            headers: headers
        })
    }

    // deleteShiftByShiftIdURL
    deleteShiftByShiftIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.deleteShiftByShiftIdURL, body, {
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
    
    // getShiftVStallyByDateURL
    getShiftVStallyByDatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getShiftVStallyByDateURL, body, {
            headers: headers
        })
    }
    
    // getShiftWiseBookDetailsURL
    getShiftWiseBookDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getShiftWiseBookDetailsURL, body, {
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
    
    // getDigitalTotalByDateURL
    getDigitalTotalByDatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getDigitalTotalByDateURL, body, {
            headers: headers
        })
    }
    
    // getTotalCreditSalesPaymentByDayURL
    getTotalCreditSalesPaymentByDayPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTotalCreditSalesPaymentByDayURL, body, {
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
    
    // getFuelCreditPaymentByDateURL
    getFuelCreditPaymentByDatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelCreditPaymentByDateURL, body, {
            headers: headers
        })
    }





}
