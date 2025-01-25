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
  FT: string;

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
    private submitTerminalURL = this.baseURL + 'fuelTerminals/addFuelTerminal';
    private getFuelTerminalURL = this.baseURL + 'fuelTerminals/getFuelTerminal';
    private updateFuelTerminalPOSNameURL = this.baseURL + 'fuelTerminals/updateFuelTerminalPOSName';
    private updateFuelTerminalPOSStatusURL = this.baseURL + 'fuelTerminals/updateFuelTerminalPOSStatus';
    private deleteFuelTerminalURL = this.baseURL + 'fuelTerminals/deleteFuelTerminal';
    private getBankAccByBankIdURL = this.baseURL + 'bankDetails/getBankAccByBankId';
    private getPOSByBankIdURL = this.baseURL + 'fuelTerminals/getPOSByBankId';
    private addBankDetailsURL = this.baseURL + 'bankDetails/addBankDetails';
    private deleteBankAccByDealerIdURL = this.baseURL + 'bankDetails/deleteBankAccByDealerId';
    private updateAccountDetailsbyUniqueStatusURL = this.baseURL + 'bankDetails/updateAccountDetailsbyUniqueStatus';
    private updateBankAccountDetailsURL = this.baseURL + 'bankDetails/updateBankAccountDetails';
    private getFuelProductIdByDealerIdURL = this.baseURL + 'fuelPrice/getFuelProductIdByDealerId';
    private getProductWiseMeterSalesURL = this.baseURL + 'dsrDetails/getProductWiseMeterSales';
    private getProductWiseStockNEWURL = this.baseURL + 'dsrDetails/getProductWiseStockNEW';
    private getDsrMeterSalesURL = this.baseURL + 'dsr/getDsrMeterSales';
    private updateDSRDetailsURL = this.baseURL + 'dsrDetails/updateDSRDetails';
    private deleteDSRDetailsURL = this.baseURL + 'dsrDetails/deleteDSRDetails';
    private getAllNzListByProductURL = this.baseURL + 'dsrDetails/getAllNzListByProduct';
    private getRateReadingByDateURL = this.baseURL + 'dsr/getRateReadingByDate';
    private addDSRDetailsURL = this.baseURL + 'dsrDetails/addDSRDetails';
    private getTankDSRDetailURL = this.baseURL + 'dsr/getTankDSRDetails';
    private updateTankDSRDetailsURL = this.baseURL + 'dsrDetails/updateTankDSRDetails';
    private deleteTankDSRDetailsURL = this.baseURL + 'dsrDetails/deleteTankDSRDetails';
    private getRateByDateURL = this.baseURL + 'dsr/getRateByDate';
    private addTankDSRDetailsURL = this.baseURL + 'dsrDetails/addTankDSRDetails';
    private updateDSRDetailsByBookURL = this.baseURL + 'dsrDetails/updateDSRDetailsByBook';
    private getAllTankByDealerIdURL = this.baseURL + 'tankDSR/getAllTankByDealerId';
    private getNZByTankNoURL = this.baseURL + 'tankDSR/getNZByTankNo';
    private getProductPurchaseURL = this.baseURL + 'dsrDetails/getProductPurchase';
    private getPriceByProductIdDateURL = this.baseURL + 'dsrDetails/getPriceByDealerProductIdByDate';
    private getTankDSRURL = this.baseURL + 'tankDSR/getTankDSR';
    private addTankDSRURL = this.baseURL + 'tankDSR/addTankDSR';
    private deleteTankDSRURL = this.baseURL + 'tankDSR/deleteTankDSR';
    private updateTankDSRURL = this.baseURL + 'tankDSR/updateTankDSR';
    private updateStockPurchaseURL = this.baseURL + 'tankDSR/updateStockPurchase';
    private getTankDetailsByIdURL = this.baseURL + 'tankDSR/getTankDetailsById';
    private getTankDSRBookURL = this.baseURL + 'tankDSR/getTankDSRBook';
    private getMETERSALESTotalDSRBYShiftTimeURL = this.baseURL + 'shiftBook/getMETERSALESTotalDSRBYShiftTime';
    private getShiftVStallyBYShiftTimeURL = this.baseURL + 'shiftBook/getShiftVStallyBYShiftTime';
    private getProductWiseDSRShiftTimeURL = this.baseURL + 'shiftBook/getProductWiseDSRShiftTime';
    private getTotalMeterSalesAndTallyEnteryBYShiftTimeURL = this.baseURL + 'shiftBook/getTotalMeterSalesAndTallyEnteryBYShiftTime'; 
    private getDigitalTotalByShiftTimeURL = this.baseURL + 'shiftBook/getDigitalTotalByShiftTime';





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

    // submitTerminalURL
    submitTerminalPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.submitTerminalURL, body, {
            headers: headers
        })
    }

    // getFuelTerminalURL
    getFuelTerminalPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelTerminalURL, body, {
            headers: headers
        })
    }

    // updateFuelTerminalPOSNameURL
    updateFuelTerminalPOSNamePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateFuelTerminalPOSNameURL, body, {
            headers: headers
        })
    }

    // updateFuelTerminalPOSStatusURL
    updateFuelTerminalPOSStatusPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateFuelTerminalPOSStatusURL, body, {
            headers: headers
        })
    }

    // deleteFuelTerminalURL
    deleteFuelTerminalPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.deleteFuelTerminalURL, body, {
            headers: headers
        })
    }

    // getBankAccByBankIdURL
    getBankAccByBankIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getBankAccByBankIdURL, body, {
            headers: headers
        })
    }

    // getPOSByBankIdURL
    getPOSByBankIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getPOSByBankIdURL, body, {
            headers: headers
        })
    }

    // addBankDetailsURL
    addBankDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addBankDetailsURL, body, {
            headers: headers
        })
    }

    // deleteBankAccByDealerIdURL
    deleteBankAccByDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.deleteBankAccByDealerIdURL, body, {
            headers: headers
        })
    }

    // updateAccountDetailsbyUniqueStatusURL
    updateAccountDetailsbyUniqueStatusPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateAccountDetailsbyUniqueStatusURL, body, {
            headers: headers
        })
    }

    // updateBankAccountDetailsURL
    updateBankAccountDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateBankAccountDetailsURL, body, {
            headers: headers
        })
    }

    // getFuelProductIdByDealerIdURL
    getFuelProductIdByDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelProductIdByDealerIdURL, body, {
            headers: headers
        })
    }

    // getProductWiseMeterSalesURL
    getProductWiseMeterSalesPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getProductWiseMeterSalesURL, body, {
            headers: headers
        })
    }

    // getProductWiseStockNEWURL
    getProductWiseStockNEWPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getProductWiseStockNEWURL, body, {
            headers: headers
        })
    }

    // getDsrMeterSalesURL
    getDsrMeterSalesPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getDsrMeterSalesURL, body, {
            headers: headers
        })
    }

    // updateDSRDetailsURL
    updateDSRDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateDSRDetailsURL, body, {
            headers: headers
        })
    }

    // deleteDSRDetailsURL
    deleteDSRDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.deleteDSRDetailsURL, body, {
            headers: headers
        })
    }

    // getAllNzListByProductURL
    getAllNzListByProductPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllNzListByProductURL, body, {
            headers: headers
        })
    }

    // getRateReadingByDateURL
    getRateReadingByDatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getRateReadingByDateURL, body, {
            headers: headers
        })
    }

    // addDSRDetailsURL
    addDSRDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addDSRDetailsURL, body, {
            headers: headers
        })
    }

    // getTankDSRDetailURL
    getTankDSRDetailPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTankDSRDetailURL, body, {
            headers: headers
        })
    }

    // updateTankDSRDetailsURL
    updateTankDSRDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateTankDSRDetailsURL, body, {
            headers: headers
        })
    }

    // deleteTankDSRDetailsURL
    deleteTankDSRDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.deleteTankDSRDetailsURL, body, {
            headers: headers
        })
    }

    // getRateByDateURL
    getRateByDatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getRateByDateURL, body, {
            headers: headers
        })
    }

    // addTankDSRDetailsURL
    addTankDSRDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addTankDSRDetailsURL, body, {
            headers: headers
        })
    }

    // updateDSRDetailsByBookURL
    updateDSRDetailsByBookPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateDSRDetailsByBookURL, body, {
            headers: headers
        })
    }

    // getAllTankByDealerIdURL
    getAllTankByDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllTankByDealerIdURL, body, {
            headers: headers
        })
    }

    // getNZByTankNoURL
    getNZByTankNoPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getNZByTankNoURL, body, {
            headers: headers
        })
    }

    // getProductPurchaseURL
    getProductPurchasePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getProductPurchaseURL, body, {
            headers: headers
        })
    }

    // getPriceByProductIdDateURL
    getPriceByProductIdDatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getPriceByProductIdDateURL, body, {
            headers: headers
        })
    }

    // getTankDSRURL
    getTankDSRPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTankDSRURL, body, {
            headers: headers
        })
    }

    // addTankDSRURL
    addTankDSRPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addTankDSRURL, body, {
            headers: headers
        })
    }

    // deleteTankDSRURL
    deleteTankDSRPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.deleteTankDSRURL, body, {
            headers: headers
        })
    }

    // updateTankDSRURL
    updateTankDSRPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateTankDSRURL, body, {
            headers: headers
        })
    }

    // updateStockPurchaseURL
    updateStockPurchasePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateStockPurchaseURL, body, {
            headers: headers
        })
    }

    // getTankDetailsByIdURL
    getTankDetailsByIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTankDetailsByIdURL, body, {
            headers: headers
        })
    }

    // getTankDSRBookURL
    getTankDSRBookPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTankDSRBookURL, body, {
            headers: headers
        })
    }

    // getMETERSALESTotalDSRBYShiftTimeURL
    getMETERSALESTotalDSRBYShiftTimePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getMETERSALESTotalDSRBYShiftTimeURL, body, {
            headers: headers
        })
    }

    // getShiftVStallyBYShiftTimeURL
    getShiftVStallyBYShiftTimePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getShiftVStallyBYShiftTimeURL, body, {
            headers: headers
        })
    }

    // getProductWiseDSRShiftTimeURL
    getProductWiseDSRShiftTimePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getProductWiseDSRShiftTimeURL, body, {
            headers: headers
        })
    }

    // getTotalMeterSalesAndTallyEnteryBYShiftTimeURL
    getTotalMeterSalesAndTallyEnteryBYShiftTimePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTotalMeterSalesAndTallyEnteryBYShiftTimeURL, body, {
            headers: headers
        })
    }

    // getDigitalTotalByShiftTimeURL
    getDigitalTotalByShiftTimePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getDigitalTotalByShiftTimeURL, body, {
            headers: headers
        })
    }










}
