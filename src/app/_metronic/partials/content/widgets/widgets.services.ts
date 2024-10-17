import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WidgetService {
 

  constructor(private http: HttpClient,
    private router: Router
  ) { }


  header: any;
  user: any;
  token: any = "";


  public baseURL = environment.apiUrl;


  ///// API path
  private getAllUserURL = this.baseURL + 'crmAPI/getAllUser';
  private addUserURL = this.baseURL + 'crmAPI/addUser';



  setHeader() {
    this.token = JSON.parse(localStorage.getItem('authenticationToken') || '{}');
    console.log("AuthTolen", this.token)
  }



  //////API Functions
  // getAllUserURL
  getAllCRMEmployee(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getAllUserURL, body, {
      headers: headers
    })
  }

  // addUserURL
  addUserPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.addUserURL, body, {
      headers: headers
    })
  }

}
