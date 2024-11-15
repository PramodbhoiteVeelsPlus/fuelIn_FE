import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class ChartsService {
    
    constructor(private http: HttpClient,
        private router: Router
    ) { }


    header: any;
    user: any;
    token: any = "";


    public baseURL = environment.apiUrl;


    ///// API path
    
  private getLastSixMonthsCrURL = this.baseURL + 'crCustomers/getLastSixMonthsCrDetails';







    setHeader() {
        this.token = JSON.parse(localStorage.getItem('authenticationToken') || '{}');
        
    }



    //////API Functions
    // getLastSixMonthsCrURL
    getLastSixMonthsCrPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getLastSixMonthsCrURL, body, {
            headers: headers
        })
    }

  





}
