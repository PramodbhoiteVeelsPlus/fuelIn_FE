import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class MixedService {
    oldInvoice1: any = 'FALSE';
    routerVar: any;
    custMappingID: any;
    startDate: any;
    endDate: any;
    oldInvoice2: any = 'FALSE';
    oldInvoice3: any = 'FALSE';
    selectCorporateMapIdVehicle: any;
    vehicleNumber: any;
    array: any = [];
    array1: any = [];
    array2: any = [];
    lubeTax1: any;
    oldInvoice5: any;

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
    private getFuelCreditRequestCorporateByfuelDealerIdURL = this.baseURL + 'fuelDealerCustMap/getFuelCreditRequestCorporateByfuelDealerId';
    private getCrStatementURL = this.baseURL + 'crCustomers/getCrStatement';
    private getCorporateInfoByfuelDealerCustomerMapIdURL = this.baseURL + 'fuelDealerCustMap/getCorporateInfoByfuelDealerCustomerMapId1';
    private updateTotalInvCreditAmtURL = this.baseURL + 'fuelCreditInvoice/updateTotalCreditAmt';
    private getdataBycustomerMapIdURL = this.baseURL + "fuelDealerCustMap/getdataBycustomerMapId";
    private getSelectedMobileNumberByDealerIdURL = this.baseURL + 'fuelCreditInvoice/getSelectedMobileNumberByDealerId';
    private getFuelCreditVehicleListByfuelDealerCustMapIdURL = this.baseURL + 'fuelDealerCustMap/getFuelCreditVehicleListByfuelDealerCustMapId';
    private getCRSalesByVehicleNumberURL = this.baseURL + 'fuelCreditInvoice/getCRSalesByVehicleNumber';
    private viewVehicleVishwasaByMobileNumberURL = this.baseURL + 'register/viewVehicleVishwasaByMobileNumber';
    private getLubeTaxStatementURL = this.baseURL + 'crCustomers/getLubeTaxStatement';
    private getCreditByCustMapIdDateURL = this.baseURL + "fuelCreditInvoice/getCreditByCustMapIdDate";
    private getCreditByCustMapIdDateVehicleURL = this.baseURL + "fuelCreditInvoice/getCreditByCustMapIdDateVehicle"; 
    private getPosDetailsURL = this.baseURL + 'posDetails/getPosDetails';
    private getShiftTimeDetailURL = this.baseURL + 'posDetails/getFuelShiftTimeDetails'; 
    private getPosTerminalURL = this.baseURL + 'posDetails/getPosTerminals'; 
    private getFuelStaffIdByfuelDealerIdURL = this.baseURL + 'fuelStaff/getFuelStaffIdByfuelDealerId';
    private addCreditAdvanceReqByDealerForAllURL = this.baseURL + 'fuelLube/addCreditAdvanceReqByDealerForAll';
    private updateLastCRDateByMapIdURL = this.baseURL + 'fuelVendor/updateLastCRDateByMapId'; 
    private updateLastCRDateMapIdWiseURL = this.baseURL + 'fuelVendor/updateLastCRDateMapIdWise';
    private updateTotalInvPaidAmtURL = this.baseURL + 'fuelCreditInvoice/updateTotalInvPaidAmt';
    private getDetailsByMapIdURL = this.baseURL + 'fuelDealerCustMap/getDetailsByMapId'; 
    private addCoinDetailsURL = this.baseURL + 'coinConversion/addCoinDetails';


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

    // getFuelCreditRequestCorporateByfuelDealerIdURL
    getFuelCreditRequestCorporateByfuelDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelCreditRequestCorporateByfuelDealerIdURL, body, {
            headers: headers
        })
    }

    // getCrStatementURL
    getCrStatementPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCrStatementURL, body, {
            headers: headers
        })
    }

    // getCorporateInfoByfuelDealerCustomerMapIdURL
    getCorporateInfoByfuelDealerCustomerMapIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCorporateInfoByfuelDealerCustomerMapIdURL, body, {
            headers: headers
        })
    }

    // updateTotalInvCreditAmtURL
    updateTotalInvCreditAmtPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateTotalInvCreditAmtURL, body, {
            headers: headers
        })
    }

    // getdataBycustomerMapIdURL
    getdataBycustomerMapIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getdataBycustomerMapIdURL, body, {
            headers: headers
        })
    }

    // getSelectedMobileNumberByDealerIdURL
    getSelectedMobileNumberByDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getSelectedMobileNumberByDealerIdURL, body, {
            headers: headers
        })
    }

    // getFuelCreditVehicleListByfuelDealerCustMapIdURL
    getFuelCreditVehicleListByfuelDealerCustMapIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelCreditVehicleListByfuelDealerCustMapIdURL, body, {
            headers: headers
        })
    }

    // getCRSalesByVehicleNumberURL
    getCRSalesByVehicleNumberPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCRSalesByVehicleNumberURL, body, {
            headers: headers
        })
    }

    // viewVehicleVishwasaByMobileNumberURL
    viewVehicleVishwasaByMobileNumberPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.viewVehicleVishwasaByMobileNumberURL, body, {
            headers: headers
        })
    }

    // getLubeTaxStatementURL
    getLubeTaxStatementPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getLubeTaxStatementURL, body, {
            headers: headers
        })
    }

    // getCreditByCustMapIdDateURL
    getCreditByCustMapIdDatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCreditByCustMapIdDateURL, body, {
            headers: headers
        })
    }

    // getCreditByCustMapIdDateVehicleURL
    getCreditByCustMapIdDateVehiclePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCreditByCustMapIdDateVehicleURL, body, {
            headers: headers
        })
    }

    // getPosDetailsURL
    getPosDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getPosDetailsURL, body, {
            headers: headers
        })
    }

    // getShiftTimeDetailURL
    getShiftTimeDetailPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getShiftTimeDetailURL, body, {
            headers: headers
        })
    }

    // getPosTerminalURL
    getPosTerminalPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getPosTerminalURL, body, {
            headers: headers
        })
    }

    lrForInvoice(customerMapID: any, startDate: any, endDate: any, routeVar: any) {
        this.routerVar = routeVar
        this.custMappingID = customerMapID;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    lrOldInvoice1(oldInvoice1: any) {
        this.oldInvoice1 = oldInvoice1
    }

    lrOldInvoice2(oldInvoice2: any) {
        this.oldInvoice2 = oldInvoice2
    }

    lrOldInvoice3(oldInvoice3: any) {
        this.oldInvoice3 = oldInvoice3
    }

    lrForVehicleInvoice(array: any, array1: any, array2: any, vehicleNumber: any, startDate: string, endDate: string, selectCorporateMapIdVehicle: any) {
        this.selectCorporateMapIdVehicle = selectCorporateMapIdVehicle
        this.vehicleNumber = vehicleNumber;
        this.startDate = startDate;
        this.endDate = endDate;
        this.array = array;
        this.array1 = array1;
        this.array2 = array2;
    }

    lrForInvoiceLube(customerMapID: any, startDate: any, endDate: any, routeVar: any) {
        this.routerVar = routeVar
        this.custMappingID = customerMapID;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    lubeTaxStatement(lubeTax1: any) {
        this.lubeTax1 = lubeTax1
    }

    lrForInvoice5(customerMapID: any, startDate: any, endDate: any) {
        this.custMappingID = customerMapID;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    lrOldInvoice5(oldInvoice5: any) {
        this.oldInvoice5 = oldInvoice5
    }

    // getFuelStaffIdByfuelDealerIdURL
    getFuelStaffIdByfuelDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelStaffIdByfuelDealerIdURL, body, {
            headers: headers
        })
    }
    
    // addCreditAdvanceReqByDealerForAllURL
    addCreditAdvanceReqByDealerForAllPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addCreditAdvanceReqByDealerForAllURL, body, {
            headers: headers
        })
    }
    
    // updateLastCRDateByMapIdURL
    updateLastCRDateByMapIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateLastCRDateByMapIdURL, body, {
            headers: headers
        })
    }
    
    // updateLastCRDateMapIdWiseURL
    updateLastCRDateMapIdWisePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateLastCRDateMapIdWiseURL, body, {
            headers: headers
        })
    }

    // updateTotalInvPaidAmtURL
    updateTotalInvPaidAmtPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateTotalInvPaidAmtURL, body, {
            headers: headers
        })
    }

    // getDetailsByMapIdURL
    getDetailsByMapIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getDetailsByMapIdURL, body, {
            headers: headers
        })
    }

    // addCoinDetailsURL
    addCoinDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addCoinDetailsURL, body, {
            headers: headers
        })
    }
}