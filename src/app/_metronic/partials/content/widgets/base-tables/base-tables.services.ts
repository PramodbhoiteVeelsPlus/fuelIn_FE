import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class BaseTablesService {

    constructor(private http: HttpClient,
        private router: Router
    ) { }

    header: any;
    user: any;
    token: any = "";

    public baseURL = environment.apiUrl;

    //API PATH
    private getFuelCreditRequestCorporateByfuelDealerIdURL = this.baseURL + 'fuelDealerCustMap/getFuelCreditRequestCorporateByfuelDealerId';
    private getFuelCreditRequestByfuelDealerIdURL = this.baseURL + 'fuelDealerCustMap/getFuelCreditRequestByfuelDealerId';
    private getFuelCreditRequestByfuelDealerIdAndFuelCorporateId1URL = this.baseURL + 'fuelDealerCustMap/getFuelCreditRequestByfuelDealerIdAndFuelCorporateId1';
    private getFuelCreditRequestByCorporateIdAndFuelDealerURL = this.baseURL + 'fuelDealerCustMap/getFuelCreditRequestByCorporateIdAndFuelDealer';
    private getFuelCreditByCorporateIdURL = this.baseURL + 'fuelDealerCustMap/getFuelCreditByCorporateId';
    private comparePasswordURL = this.baseURL + 'fuelCreditInvoice/comparePassword';
    private cancelFuelCreditReqURL = this.baseURL + 'fuelDealerCustMap/cancelFuelCreditReq';
    private updateLastCRDateMapIdWiseURL = this.baseURL + 'fuelVendor/updateLastCRDateMapIdWise';
    private VehicleByRegistrationNumberURL = this.baseURL + 'vehicle/searchVehicleByRegistrationNumber';
    private updateCreditReqByDealerURL = this.baseURL + 'fuelDealerCustMap/editFuelCreditReqfuelCreditId';
    private getCorporateInfoByfuelDealerCustomerMapIdURL = this.baseURL + 'fuelDealerCustMap/getCorporateInfoByfuelDealerCustomerMapId1';
    private getAllCRPaymentByCustNameDealerURL = this.baseURL + 'accounttransaclog/getAllCRPaymentByCustNameDealer'; 
    private getAllCRPaymentByDealerURL = this.baseURL + 'accounttransaclog/getAllCRPaymentByDealer';
    private getAllCRPaymentByCorporateURL = this.baseURL + 'accounttransaclog/getAllCRPaymentByCorporate';
    private removeTransactionLogURL = this.baseURL + 'accounttransaclog/removeTransactionLog';
    private getAllDealersListURL = this.baseURL + 'dealerDashboard/getAllDealersList'; 
    private updateAmountStatusByTranslogIdURL = this.baseURL + 'coinConversion/updateAmountStatusByTranslogId';



    setHeader() {
        this.token = JSON.parse(localStorage.getItem('authenticationToken') || '{}');
    }

    //API FUNCTION
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

    // getFuelCreditByCorporateIdURL
    getFuelCreditByCorporateIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelCreditByCorporateIdURL, body, {
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

    // updateLastCRDateMapIdWiseURL
    updateLastCRDateMapIdWisePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateLastCRDateMapIdWiseURL, body, {
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

    // updateCreditReqByDealerURL
    updateCreditReqByDealerPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateCreditReqByDealerURL, body, {
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

    // getAllCRPaymentByCorporateURL
    getAllCRPaymentByCorporatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllCRPaymentByCorporateURL, body, {
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

    // getAllDealersListURL
    getAllDealersListPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllDealersListURL, body, {
            headers: headers
        })
    }

    // updateAmountStatusByTranslogIdURL
    updateAmountStatusByTranslogIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateAmountStatusByTranslogIdURL, body, {
            headers: headers
        })
    }
}