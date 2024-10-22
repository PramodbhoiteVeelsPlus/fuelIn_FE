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
    getAllCustomerListDateRangePOST(body:object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllCustomerListDateRangeURL, body,{
            headers: headers
        })
    }

    // getvendorDetailsURL
    getvendorDetailsPOST(body:object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getvendorDetailsURL, body,{
            headers: headers
        })
    }

    // creditStatusURL
    creditStatusPOST(body:object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.creditStatusURL, body,{
            headers: headers
        })
    }

    // updateVyanaByVistUserIdURL
    updateVyanaByVistUserIdPOST(body:object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateVyanaByVistUserIdURL, body,{
            headers: headers
        })
    }

    // vendoronboardingURL
    vendoronboardingPOST(body:object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.vendoronboardingURL, body,{
            headers: headers
        })
    }









}
