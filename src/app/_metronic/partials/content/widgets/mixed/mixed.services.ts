import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class MixedService {

    constructor(private http: HttpClient,
        private router: Router
    ) { }

    header: any;
    user: any;
    token: any = "";

    public baseURL = environment.apiUrl;

    //API PATH
  private getPriceByDealerProductIdByDateURL = this.baseURL + 'fuelPrice/getPriceByDealerProductIdByDate'; 
  private getfuelCreditVehicleByfuelDealerIdURL = this.baseURL + 'fuelVehicleDetails/getfuelCreditVehicleByfuelDealerId';
  private checkVehicleByfuelDealerIdAndNumberURL = this.baseURL + 'fuelVehicleDetails/checkVehicleByfuelDealerIdAndNumber';

  
  setHeader() {
    this.token = JSON.parse(localStorage.getItem('authenticationToken') || '{}');

}

//////API Functions
// getPriceByDealerProductIdByDateURL
getPriceByDealerProductIdByDatePOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getPriceByDealerProductIdByDateURL, body, {
        headers: headers
    })
}

// getfuelCreditVehicleByfuelDealerIdURL
getfuelCreditVehicleByfuelDealerIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getfuelCreditVehicleByfuelDealerIdURL, body, {
        headers: headers
    })
}

// checkVehicleByfuelDealerIdAndNumberURL
checkVehicleByfuelDealerIdAndNumberPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.checkVehicleByfuelDealerIdAndNumberURL, body, {
        headers: headers
    })
}
}