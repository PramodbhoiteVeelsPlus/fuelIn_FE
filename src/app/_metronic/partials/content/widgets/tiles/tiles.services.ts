import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class TilesService {
    header: any;
    user: any;
    token: any = "";

    constructor(private http: HttpClient,
        private router: Router
    ) { }

    public baseURL = environment.apiUrl;


    ///// API path
    private getStaffIdByPersonIdURL = this.baseURL + 'fuelExpense/getStaffIdByPersonId';
    private getBankDetailsByDealerIdURL = this.baseURL + 'bankDetails/getBankDetailsByDealerId';
    private getFuelTerminal1URL = this.baseURL + 'fuelTerminals/getFuelTerminal1';
    private addAccountingURL = this.baseURL + 'accounting/addAccounting';
    private getAccountingOneDayURL = this.baseURL + 'accounting/getAccountingOneDay';
    private deleteAccountingDataURL = this.baseURL + 'accounting/deleteAccountingData';
    private getFuelTerminalDetailsByIdURL = this.baseURL + 'fuelExpense/getFuelTerminalDetailsById';
    private getAccountingURL = this.baseURL + 'accounting/getAccounting';
    private getNEWAccountingBookURL = this.baseURL + 'accounting/getAccountingBook';
    private getBalanceByExpenseCategoryURL = this.baseURL + 'accounting/getBalanceByExpenseCategory';
    private getOpeningDBCRBalanceBANKURL = this.baseURL + 'accounting/getOpeningDBCRBalanceBANK';
    private addBalanceByExpenseCategoryURL = this.baseURL + 'fuelExpense/addBalanceByExpenseCategory';
    private updateBalanceByExpenseCategoryURL = this.baseURL + 'fuelExpense/updateBalanceByExpenseCategory';
    private getBalanceDetailsByBankURL = this.baseURL + 'fuelExpense/getBalanceDetailsByBank';
    private getOpeningDBCRBalanceCASHURL = this.baseURL + 'fuelExpense/getOpeningDBCRBalanceCASH';
    private getOpeningDBCRBalanceOILCOMURL = this.baseURL + 'fuelExpense/getOpeningDBCRBalanceOILCOM';
    private getOILCOMPANYDataInFuelExpenseURL = this.baseURL + 'fuelExpense/getOILCOMPANYDataInFuelExpense';
    




    setHeader() {
        this.token = JSON.parse(localStorage.getItem('authenticationToken') || '{}');

    }



    //////API Functions
    // getStaffIdByPersonIdURL
    getStaffIdByPersonIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getStaffIdByPersonIdURL, body, {
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

    // getFuelTerminal1URL
    getFuelTerminal1POST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelTerminal1URL, body, {
            headers: headers
        })
    }

    // addAccountingURL
    addAccountingPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addAccountingURL, body, {
            headers: headers
        })
    }

    // getAccountingOneDayURL
    getAccountingOneDayPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAccountingOneDayURL, body, {
            headers: headers
        })
    }

    // deleteAccountingDataURL
    deleteAccountingDataPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.deleteAccountingDataURL, body, {
            headers: headers
        })
    }

    // getFuelTerminalDetailsByIdURL
    getFuelTerminalDetailsByIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelTerminalDetailsByIdURL, body, {
            headers: headers
        })
    }

    // getAccountingURL
    getAccountingPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAccountingURL, body, {
            headers: headers
        })
    }

    // getNEWAccountingBookURL
    getNEWAccountingBookPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getNEWAccountingBookURL, body, {
            headers: headers
        })
    }

    // getBalanceByExpenseCategoryURL
    getBalanceByExpenseCategoryPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getBalanceByExpenseCategoryURL, body, {
            headers: headers
        })
    }

    // getOpeningDBCRBalanceBANKURL
    getOpeningDBCRBalanceBANKPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getOpeningDBCRBalanceBANKURL, body, {
            headers: headers
        })
    }

    // addBalanceByExpenseCategoryURL
    addBalanceByExpenseCategoryPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addBalanceByExpenseCategoryURL, body, {
            headers: headers
        })
    }

    // updateBalanceByExpenseCategoryURL
    updateBalanceByExpenseCategoryPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateBalanceByExpenseCategoryURL, body, {
            headers: headers
        })
    }

    // getBalanceDetailsByBankURL
    getBalanceDetailsByBankPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getBalanceDetailsByBankURL, body, {
            headers: headers
        })
    }

    // getOpeningDBCRBalanceCASHURL
    getOpeningDBCRBalanceCASHPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getOpeningDBCRBalanceCASHURL, body, {
            headers: headers
        })
    }

    // getOpeningDBCRBalanceOILCOMURL
    getOpeningDBCRBalanceOILCOMPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getOpeningDBCRBalanceOILCOMURL, body, {
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




}
