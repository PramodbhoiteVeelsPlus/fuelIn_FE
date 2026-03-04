import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {


    constructor(private http: HttpClient,
        private router: Router
    ) { }


    header: any;
    user: any;
    token: any = "";


    public baseURL = environment.apiUrl;


    ///// API path
    private getDashboardDetailsURL = this.baseURL + 'dealerDashboard/getDashboardDetails';
  private getDealerDashboardCrDataURL = this.baseURL + 'crCustomers/getDealerDashboardCrData'; 







    setHeader() {
        this.token = JSON.parse(localStorage.getItem('authenticationToken') || '{}');

    }



    //////API Functions
    // getDashboardDetailsURL
    getDashboardDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getDashboardDetailsURL, body, {
            headers: headers
        })
    }

    // getDealerDashboardCrDataURL
    getDealerDashboardCrDataPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getDealerDashboardCrDataURL, body, {
            headers: headers
        })
    }
}