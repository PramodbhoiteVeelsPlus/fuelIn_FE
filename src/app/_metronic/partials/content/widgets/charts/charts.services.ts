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
  private getTankByDealerProductIdURL = this.baseURL + 'fuelExpense/getTankByDealerProductId';
  private addOILCOMPANYDataInFuelExpenseURL = this.baseURL + 'fuelExpense/addOILCOMPANYDataInFuelExpense';
  private getOILCOMPANYDataInFuelExpenseURL = this.baseURL + 'fuelExpense/getOILCOMPANYDataInFuelExpense'; 
  private updateOilCompanyURL = this.baseURL + 'fuelExpense/updateOilCompany'; 
  private deleteExpenseURL = this.baseURL + 'fuelExpense/deleteExpense';
  private getFuelExpenseByMonthYearURL = this.baseURL + 'fuelExpense/getFuelExpenseByMonthYear';
  private addMonthlyVariationURL = this.baseURL + 'fuelExpense/addMonthlyVariation'; 
  private updateMonthlyVariationURL = this.baseURL + 'fuelExpense/updateMonthlyVariation';







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
    
    // getTankByDealerProductIdURL
    getTankByDealerProductIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTankByDealerProductIdURL, body, {
            headers: headers
        })
    }
    
    // addOILCOMPANYDataInFuelExpenseURL
    addOILCOMPANYDataInFuelExpensePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addOILCOMPANYDataInFuelExpenseURL, body, {
            headers: headers
        })
    }
    
    // getOILCOMPANYDataInFuelExpenseURL
    getOILCOMPANYDataInFuelExpensePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getOILCOMPANYDataInFuelExpenseURL, body, {
            headers: headers
        })
    }
    
    // updateOilCompanyURL
    updateOilCompanyPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateOilCompanyURL, body, {
            headers: headers
        })
    }
    
    // deleteExpenseURL
    deleteExpensePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.deleteExpenseURL, body, {
            headers: headers
        })
    }
    
    // getFuelExpenseByMonthYearURL
    getFuelExpenseByMonthYearPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelExpenseByMonthYearURL, body, {
            headers: headers
        })
    }
    
    // addMonthlyVariationURL
    addMonthlyVariationPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addMonthlyVariationURL, body, {
            headers: headers
        })
    }
    
    // updateMonthlyVariationURL
    updateMonthlyVariationPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateMonthlyVariationURL, body, {
            headers: headers
        })
    }

  





}
