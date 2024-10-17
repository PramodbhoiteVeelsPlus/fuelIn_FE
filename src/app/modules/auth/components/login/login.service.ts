import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'
import { Observable } from 'rxjs';
import { Router } from '@angular/router';




@Injectable()
export class LoginService {
    link: any;




    constructor(private http: HttpClient, private router: Router) {
    }


    header: any;
    user: any;
    public baseURL = environment.apiUrl;

    private loginURL = this.baseURL + 'register/login';
    private getpayURL = this.baseURL + 'customer/getPay';
    private getcustDataURL = this.baseURL + 'register/getcustData';
    private getupdatepayStatusURL = this.baseURL + 'user/updateUserpayStatus';

    private getorderIdURL = this.baseURL + 'customer/getorderId';
    private addPaymentDetailsURL = this.baseURL + 'paymentdetails/addPaymentDetails';
    private updateCorpPayStatusURL = this.baseURL + 'corporate/updateCorpPayStatus';
    private getPayInfoURL = this.baseURL + 'register/getPayInfo';


    // loginURL

    login(body: Object): Observable<any> {
        return this.http.post(this.loginURL, body, {
            headers: this.header
        })
    }

}
