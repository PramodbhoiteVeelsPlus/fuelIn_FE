import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class ListWidgetService {
    
    constructor(private http: HttpClient,
        private router: Router
    ) { }


    header: any;
    user: any;
    token: any = "";


    public baseURL = environment.apiUrl;


    ///// API path
    
  private getTopFiveAccByFuelDealerIdURL = this.baseURL + 'crCustomers/getTopFiveAccByFuelDealerId';







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

  





}
