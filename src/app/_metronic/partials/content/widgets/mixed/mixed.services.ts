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
  private addCreditVehicleReqByDealerForAllURL = this.baseURL + 'fuelVehicleDetails/addCreditVehicleReqByDealerForAll';
  private updateAssignedAutoManualNumberURL = this.baseURL + 'fuelDealerCustMap/updateAssignedAutoManualNumber';
  private getLubricantByIdURL = this.baseURL + 'lubricants/getLubricantById';
  private getLubricantsURL = this.baseURL + 'lubricants/getLubricants';
  private addCreditLubeReqByDealerForAllURL = this.baseURL + 'fuelLube/addCreditLubeReqByDealerForAll';
  private getAccessByPersonIdURL = this.baseURL + 'userAccess/getAccessByPersonId';
  private getFuelTerminal1URL = this.baseURL + 'fuelTerminals/getFuelTerminal1';
  private getTerminaldetailsByTerminalIdURL = this.baseURL + 'fuelTerminals/getTerminaldetailsByTerminalId';
  private getBankDetailsByDealerIdURL = this.baseURL + 'bankDetails/getBankDetailsByDealerId';
  private addAccTransactionLogPayDetailURL = this.baseURL + 'accounttransaclog/addAccTransactionLogPayDetail';

  
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

// addCreditVehicleReqByDealerForAllURL
addCreditVehicleReqByDealerForAllPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.addCreditVehicleReqByDealerForAllURL, body, {
        headers: headers
    })
}

// updateAssignedAutoManualNumberURL
updateAssignedAutoManualNumberPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.updateAssignedAutoManualNumberURL, body, {
        headers: headers
    })
}

// getLubricantByIdURL
getLubricantByIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getLubricantByIdURL, body, {
        headers: headers
    })
}

// getLubricantsURL
getLubricantsPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getLubricantsURL, body, {
        headers: headers
    })
}

// addCreditLubeReqByDealerForAllURL
addCreditLubeReqByDealerForAllPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.addCreditLubeReqByDealerForAllURL, body, {
        headers: headers
    })
}

// getAccessByPersonIdURL
getAccessByPersonIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getAccessByPersonIdURL, body, {
        headers: headers
    })
}

// getFuelTerminal1URL
getFuelTerminal1POST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getFuelTerminal1URL, body, {
        headers: headers
    })
}

// getTerminaldetailsByTerminalIdURL
getTerminaldetailsByTerminalIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getTerminaldetailsByTerminalIdURL, body, {
        headers: headers
    })
}

// getBankDetailsByDealerIdURL
getBankDetailsByDealerIdPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.getBankDetailsByDealerIdURL, body, {
        headers: headers
    })
}

// addAccTransactionLogPayDetailURL
addAccTransactionLogPayDetailPOST(body: Object): Observable<any> {
    this.setHeader();
    let headers = new HttpHeaders();
    headers = headers.set('authenticationToken', this.token);
    return this.http.post(this.addAccTransactionLogPayDetailURL, body, {
        headers: headers
    })
}
}