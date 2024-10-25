import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class Adv_TablesService {

    constructor(private http: HttpClient,
        private router: Router
    ) { }

    header: any;
    user: any;
    token: any = "";

    public baseURL = environment.apiUrl;

    ///// API path
    private getAllCustomerListURL = this.baseURL + 'fastag/getAllCustomerList';
    private getAllCustomerListDateRangeURL = this.baseURL + 'fastag/getAllCustomerListDateRange';
    private getvendorDetailsURL = this.baseURL + 'loanRequest/getvendorDetails';
    private creditStatusURL = this.baseURL + 'loanRequest/creditStatus';
    private updateVyanaByVistUserIdURL = this.baseURL + 'loanRequest/updateVyanaByVistUserId';
    private vendoronboardingURL = this.baseURL + 'loanRequest/vendoronboarding';
    private getFTCustomerListByDateRangeURL = this.baseURL + 'fastag/getFTCustomerListByDateRange';
    private getFTCustomerListURL = this.baseURL + 'fastag/getFTCustomerList';
    private getFTAllVehicleListURL = this.baseURL + 'fastag/getFTAllVehicleList';
    private getFTAllVehicleListDateRangeURL = this.baseURL + 'fastag/getFTAllVehicleListDateRange';
    private getFastagVehicleListByUserIdURL = this.baseURL + 'fastag/getFastagVehicleListByUserId';
    private addVistVehicleByExcelURL = this.baseURL + 'kitbarcodemap/addVistVehicleByExcel'
    private getVehicledataFromSignzyURL = this.baseURL + 'vehicle/getVehicledataFromSignzy';
    private getAllFTVehicleListByVehicleNumberURL = this.baseURL + 'fastag/getAllFTVehicleListByVehicleNumber';
    private getkycDataURL = this.baseURL + 'kyc/getAllkyc';
    private userOnboardingURL = this.baseURL + 'user/userOnboarding';
    private waiveoffPaymentUpdateURL = this.baseURL + 'corporate/waiveoffPaymentUpdate';
    private updateSmsStatusURL = this.baseURL + 'user/updateSmsStatus';
    private updateemailStatusURL = this.baseURL + 'user/updateemailStatus';
    private deleteDsrDetailsURL = this.baseURL + 'dsrDetails/deleteDSRDetail'; 
    private getDsrMeterSalesURL = this.baseURL + 'dsr/getDsrMeterSales';
    private getTankDSRDetailURL = this.baseURL + 'dsr/getTankDSRDetails';







    setHeader() {
        this.token = JSON.parse(localStorage.getItem('authenticationToken') || '{}');
        console.log("AuthTolen", this.token)
    }



    //////API Functions
    // getAllCustomerListURL
    getAllvishUserCustomerList(): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.get(this.getAllCustomerListURL, {
            headers: headers
        })
    }

    // getAllCustomerListDateRangeURL
    getAllCustomerListDateRangePOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllCustomerListDateRangeURL, body, {
            headers: headers
        })
    }

    // getvendorDetailsURL
    getvendorDetailsPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getvendorDetailsURL, body, {
            headers: headers
        })
    }

    // creditStatusURL
    creditStatusPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.creditStatusURL, body, {
            headers: headers
        })
    }

    // updateVyanaByVistUserIdURL
    updateVyanaByVistUserIdPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateVyanaByVistUserIdURL, body, {
            headers: headers
        })
    }

    // vendoronboardingURL
    vendoronboardingPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.vendoronboardingURL, body, {
            headers: headers
        })
    }

    // getFTCustomerListByDateRangeURL
    getFTCustomerListByDateRangePost(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFTCustomerListByDateRangeURL, body, {
            headers: headers
        })
    }

    // getFTCustomerListURL
    getFastagCustomerList(): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.get(this.getFTCustomerListURL, {
            headers: headers
        })
    }

    // getFTAllVehicleListURL
    getFTAllVehicleList(): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.get(this.getFTAllVehicleListURL, {
            headers: headers
        })
    }

    // getFTAllVehicleListDateRangeURL
    getFTAllVehicleListDateRangePost(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFTAllVehicleListDateRangeURL, body, {
            headers: headers
        })
    }

    // getFastagVehicleListByUserIdURL
    getFastagVehicleListByUserIdPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFastagVehicleListByUserIdURL, body, {
            headers: headers
        })
    }

    // addVistVehicleByExcelURL
    addVistVehicleByExcelPost(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addVistVehicleByExcelURL, body, {
            headers: headers
        })
    }

    // getVehicledataFromSignzyURL
    getVehicledataFromSignzyPost(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getVehicledataFromSignzyURL, body, {
            headers: headers
        })
    }

    // getAllFTVehicleListByVehicleNumberURL
    getAllFTVehicleListByVehicleNumberPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllFTVehicleListByVehicleNumberURL, body, {
            headers: headers
        })
    }

    // getkycDataURL
    getkycDetails(): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.get(this.getkycDataURL, {
            headers: headers
        })
    }

    // userOnboardingURL
    userOnBoard(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.userOnboardingURL, body, {
            headers: headers
        })
    }

    // waiveoffPaymentUpdateURL
    waiveoffPaymentUpdateURLPost(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.waiveoffPaymentUpdateURL, body, {
            headers: headers
        })
    }

    // updateSmsStatusURL
    updateSmsStatusPost(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateSmsStatusURL, body, {
            headers: headers
        })
    }

    // updateemailStatusURL
    updateemailStatusPost(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateemailStatusURL, body, {
            headers: headers
        })
    }

    // deleteDsrDetailsURL
    deleteDsrDetailPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.deleteDsrDetailsURL, body, {
            headers: headers
        })
    }

    // getDsrMeterSalesURL
    getDsrMeterSalesPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getDsrMeterSalesURL, body, {
            headers: headers
        })
    }

    // getTankDSRDetailURL
    getTankDSRDetailPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTankDSRDetailURL, body, {
            headers: headers
        })
    }










}
