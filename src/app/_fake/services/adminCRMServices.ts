// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';
// import { Router } from '@angular/router';
// import { timeout } from 'rxjs/operators';
// import { environment } from 'src/environments/environment';
// import { Observable } from 'rxjs';


// @Injectable()
// export class PersonService {
//     token: any = "";

//   constructor(private http: HttpClient, private router: Router) {
//     this.setHeader();
//   }

//   public baseURL = environment.apiUrl



//   //Used API Functions 
  
//   private getAllUserURL = this.baseURL + 'crmAPI/getAllUser'; 




//   setHeader() {
//     this.token = JSON.parse(localStorage.getItem('authenticationToken'));
//   }

//   //getAllUserURL 
//   getAllUserPOST(body: Object): Observable<any> {
//     this.setHeader();
//     let headers = new HttpHeaders();
//     headers = headers.set('authenticationToken', this.token);
//     return this.http.post(this.getAllUserURL, body, {
//       headers: headers
//     }).map(res => res) // ...and calling .json() on the response to return data
//       .catch((error: any) => Observable.throw(error.json().error || 'Server error')); // ...errors if any
//   }
  

// }
